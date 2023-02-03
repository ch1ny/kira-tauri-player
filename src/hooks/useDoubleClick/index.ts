import React, { useCallback, useEffect, useMemo, useRef } from 'react';

/**
 * 封装区分单击事件和双击事件
 * @param onClick 单击事件
 * @param onDoubleClick 双击事件
 * @param timeout 区分时间间隔
 * @returns 封装后的点击函数
 */
export const useDoubleClick = (
	onClick: React.MouseEventHandler,
	onDoubleClick: React.MouseEventHandler,
	timeout: number = 300
) => {
	const validTimeout = useMemo(() => Math.max(0, timeout), [timeout]);

	const doubleClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const onMyClick = useCallback(
		(ev: React.MouseEvent) => {
			const doubleClickTimeout = doubleClickTimeoutRef.current;
			if (!doubleClickTimeout)
				return (doubleClickTimeoutRef.current = setTimeout(() => {
					onClick(ev);
					doubleClickTimeoutRef.current = null;
				}, validTimeout));

			clearTimeout(doubleClickTimeout);
			doubleClickTimeoutRef.current = null;
			onDoubleClick(ev);
		},
		[onClick, onDoubleClick, validTimeout]
	);

	useEffect(
		() => () => {
			if (!doubleClickTimeoutRef.current) return;

			clearTimeout(doubleClickTimeoutRef.current);
			doubleClickTimeoutRef.current = null;
		},
		[]
	);

	return onMyClick;
};

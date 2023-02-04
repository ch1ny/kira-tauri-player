import React, { useRef, useState } from 'react';
import styles from './index.module.less';

interface IMarqueeProps {
	marqueeSpeed?: number;
	children?: React.ReactNode;
}

export const Marquee: React.FC<IMarqueeProps> = (props) => {
	const { marqueeSpeed = 150, children } = props;

	const contentRef = useRef<HTMLDivElement>(null);
	const [animationDuration, setAnimationDuration] = useState(0);

	return (
		<div
			onMouseEnter={() => {
				const contentDom = contentRef.current;
				if (!contentDom) return setAnimationDuration(0);
				if (contentDom.scrollWidth === contentDom.clientWidth) return setAnimationDuration(0);

				setAnimationDuration(contentDom.scrollWidth / marqueeSpeed);
			}}
			className={styles.marquee}
			ref={contentRef}>
			<div
				className={styles.marqueeContent}
				style={{
					animationDuration: !!animationDuration ? `${animationDuration}s` : undefined,
				}}>
				{children}
			</div>
		</div>
	);
};

import { useStores } from '@/hooks';
import { EMediaPlayStatus, EPlayEndCallback } from '@/types';
import { preZero } from '@/utils';
import {
	CaretRightOutlined,
	PauseOutlined,
	RetweetOutlined,
	SoundOutlined,
	StepBackwardOutlined,
	StepForwardOutlined,
	SwapRightOutlined,
	SyncOutlined,
} from '@ant-design/icons';
import { Button, Slider } from 'antd';
import { useMemo } from 'react';
import styles from './index.module.less';

const sliderBlur = () =>
	new Promise<void>((resolve) => resolve()).then(() => {
		const target = document.activeElement;
		if (!target) return;

		(target as any).blur();
	});

interface IControlProps {
	volume: number;
	onVolumeChange: (volume: number) => void;
	progress: number;
	onProgressChange: (progress: number) => void;
	mediaDuration: number;
	mediaPlayStatus: EMediaPlayStatus;
	onPlayStatusChange: () => void;
}

const transSecondsToMinutes = (time: number) => {
	const seconds = time % 60;
	const minutes = (time - seconds) / 60;
	return `${preZero(minutes.toString(), 2)}:${preZero(seconds.toFixed(0), 2)}`;
};

export const Control: React.FC<IControlProps> = (props) => {
	const {
		volume,
		onVolumeChange,
		progress,
		onProgressChange,
		mediaDuration,
		mediaPlayStatus,
		onPlayStatusChange,
	} = props;

	const {
		playlist: { playEndCallback, exchangePlayEndCallback },
	} = useStores();

	const playEndCallBackIcon = useMemo(() => {
		switch (playEndCallback) {
			case EPlayEndCallback.ListPlay:
				return <SwapRightOutlined />;
			case EPlayEndCallback.ListLoop:
				return <RetweetOutlined />;
			case EPlayEndCallback.SelfLoop:
				return <SyncOutlined />;
		}
	}, [playEndCallback]);

	return (
		<div className={styles.control}>
			{/* 控制器 */}
			<div className={styles.playControls}>
				<div className={styles.playController}>
					<Button shape='circle' icon={<StepBackwardOutlined />} />
				</div>
				<div className={styles.playController}>
					<Button
						shape='circle'
						icon={
							mediaPlayStatus === EMediaPlayStatus.PAUSED ? (
								<CaretRightOutlined />
							) : (
								<PauseOutlined />
							)
						}
						onClick={onPlayStatusChange}
					/>
				</div>
				<div className={styles.playController}>
					<Button shape='circle' icon={<StepForwardOutlined />} />
				</div>
			</div>
			{/* 播放进度 */}
			<div className={styles.playProgress}>
				<div className={styles.playProgressTime}>{transSecondsToMinutes(progress)}</div>
				<div className={styles.playProgressBar}>
					<Slider
						value={progress}
						min={0}
						max={mediaDuration}
						step={0.1}
						tooltip={{ formatter: null }}
						onChange={onProgressChange}
						onAfterChange={sliderBlur}
					/>
				</div>
				<div className={styles.playProgressTime}>{transSecondsToMinutes(mediaDuration)}</div>
			</div>
			{/* 其他功能 */}
			<div className={styles.others}>
				<div className={styles.mediaVolume}>
					<div>
						<SoundOutlined />
					</div>
					<Slider
						min={0}
						max={100}
						step={1}
						value={volume}
						tooltip={{ formatter: (value) => `${value}%` }}
						style={{ width: '5em' }}
						onChange={onVolumeChange}
						onAfterChange={sliderBlur}
					/>
				</div>
				<div className={styles.playEndCallback} title={playEndCallback}>
					<div className={styles.playEndCallbackButton} onClick={exchangePlayEndCallback}>
						{playEndCallBackIcon}
					</div>
				</div>
			</div>
		</div>
	);
};

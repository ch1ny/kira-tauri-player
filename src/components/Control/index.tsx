import { EMediaPlayStatus } from '@/types';
import { preZero } from '@/utils';
import {
	CaretRightOutlined,
	PauseOutlined,
	SoundOutlined,
	StepBackwardOutlined,
	StepForwardOutlined,
} from '@ant-design/icons';
import { Button, Slider } from 'antd';
import styles from './index.module.less';

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

	return (
		<div className={styles.control}>
			{/* 媒体信息 */}
			<div className={styles.mediaInfo}>
				<div className={styles.mediaName}></div>
			</div>
			{/* 播放进度 */}
			<div className={styles.playProgress}>
				<div className={styles.playProgressTime}>{transSecondsToMinutes(progress)}</div>
				<div className={styles.playProgressBar}>
					<Slider
						value={progress}
						min={0}
						max={mediaDuration}
						tooltip={{ formatter: null }}
						onChange={onProgressChange}
					/>
				</div>
				<div className={styles.playProgressTime}>{transSecondsToMinutes(mediaDuration)}</div>
			</div>
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
				<div className={styles.playController} style={{ width: '5em' }}>
					<Slider
						min={0}
						max={100}
						step={1}
						value={volume}
						tooltip={{ formatter: (value) => `${value}%` }}
						onChange={onVolumeChange}
					/>
				</div>
				<div className={styles.playController}>
					<Button size='small' icon={<SoundOutlined />} />
				</div>
			</div>
		</div>
	);
};

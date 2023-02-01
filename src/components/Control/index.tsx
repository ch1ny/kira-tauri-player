import { preZero } from '@/utils';
import {
	CaretRightOutlined,
	SoundOutlined,
	StepBackwardOutlined,
	StepForwardOutlined,
} from '@ant-design/icons';
import { Button, Slider } from 'antd';
import styles from './index.module.less';

interface IControlProps {
	voice: number;
	onVoiceChange: (voice: number) => void;
	progress: number;
	mediaDuration: number;
}

const transSecondsToMinutes = (time: number) => {
	const seconds = time % 60;
	const minutes = (time - seconds) / 60;
	return `${preZero(minutes.toString(), 2)}:${preZero(seconds.toFixed(0), 2)}`;
};

export const Control: React.FC<IControlProps> = (props) => {
	const { voice, onVoiceChange, progress, mediaDuration } = props;

	return (
		<div className={styles.control}>
			{/* 媒体信息 */}
			<div className={styles.mediaInfo}>
				<div className={styles.mediaName}>正在播放</div>
			</div>
			{/* 播放进度 */}
			<div className={styles.playProgress}>
				<div className={styles.playProgressTime}>{transSecondsToMinutes(progress)}</div>
				<div className={styles.playProgressBar}>
					<Slider value={progress} min={0} max={mediaDuration} />
				</div>
				<div className={styles.playProgressTime}>{transSecondsToMinutes(mediaDuration)}</div>
			</div>
			{/* 控制器 */}
			<div className={styles.playControls}>
				<div className={styles.playController}>
					<Button shape='circle' icon={<StepBackwardOutlined />} />
				</div>
				<div className={styles.playController}>
					<Button shape='circle' icon={<CaretRightOutlined />} />
				</div>
				<div className={styles.playController}>
					<Button shape='circle' icon={<StepForwardOutlined />} />
				</div>
				<div className={styles.playController} style={{ width: '5em' }}>
					<Slider min={0} max={100} step={1} value={voice} onChange={onVoiceChange} />
				</div>
				<div className={styles.playController}>
					<Button size='small' icon={<SoundOutlined />} />
				</div>
			</div>
		</div>
	);
};

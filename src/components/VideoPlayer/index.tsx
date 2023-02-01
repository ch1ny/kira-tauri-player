import path from '@/core/path';
import { TMediaPlayerRef } from '@/utils';
import { getCurrent } from '@tauri-apps/api/window';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import styles from './index.module.less';

interface IVideoPlayerProps {
	mediaPath: string;
	mediaVoice: number;
	onVideoDurationChange: (duration: number) => void;
	onProgressChange: (progress: number) => void;
}

export const VideoPlayer = React.forwardRef<TMediaPlayerRef, IVideoPlayerProps>((props, ref) => {
	const { mediaPath, mediaVoice, onProgressChange, onVideoDurationChange } = props;

	const videoRef = useRef<HTMLVideoElement>(null);
	useEffect(() => {
		const dom = videoRef.current;
		if (!dom) return;

		dom.volume = mediaVoice;
	}, [mediaVoice]);

	useImperativeHandle(ref, () => ({
		getDuration: () => {
			const dom = videoRef.current;
			if (!dom) return 0;

			return dom.duration;
		},
		jumpTo: (destTime) => {
			const dom = videoRef.current;
			if (!dom) return;

			dom.currentTime = destTime;
		},
	}));

	return (
		<div className={styles.videoContent}>
			<video
				src={mediaPath}
				ref={videoRef}
				autoPlay
				onContextMenu={(ev) => {
					ev.preventDefault();
				}}
				onDurationChange={async (ev) => {
					const { duration } = ev.target as HTMLVideoElement;
					onVideoDurationChange(duration);

					if (!duration) {
						getCurrent().setTitle('Kira Player');
					} else {
						getCurrent().setTitle(
							`Kira Player - ${decodeURIComponent(await path.basename(mediaPath))}`
						);
					}
				}}
				onTimeUpdate={(ev) => {
					onProgressChange((ev.target as HTMLVideoElement).currentTime);
				}}
			/>
		</div>
	);
});

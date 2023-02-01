import path from '@/core/path';
import { EMediaPlayStatus } from '@/types';
import { TMediaPlayerRef } from '@/utils';
import { getCurrent } from '@tauri-apps/api/window';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import styles from './index.module.less';

interface IVideoPlayerProps {
	mediaPath: string;
	mediaVoice: number;
	mediaPlayStatus: EMediaPlayStatus;
	onVideoDurationChange: (duration: number) => void;
	onProgressChange: (progress: number) => void;
	onPlayEnded: () => void;
}

export const VideoPlayer = React.forwardRef<TMediaPlayerRef, IVideoPlayerProps>((props, ref) => {
	const {
		mediaPath,
		mediaVoice,
		mediaPlayStatus,
		onProgressChange,
		onVideoDurationChange,
		onPlayEnded,
	} = props;

	const videoRef = useRef<HTMLVideoElement>(null);
	useEffect(() => {
		const dom = videoRef.current;
		if (!dom) return;

		dom.volume = mediaVoice;
	}, [mediaVoice]);
	useEffect(() => {
		const dom = videoRef.current;
		if (!dom) return;

		mediaPlayStatus === EMediaPlayStatus.PAUSED ? dom.pause() : dom.play();
	}, [mediaPlayStatus]);

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
		play: () => {
			const dom = videoRef.current;
			if (!dom) return;

			dom.play();
		},

		pause: () => {
			const dom = videoRef.current;
			if (!dom) return;

			dom.pause();
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
				onEnded={onPlayEnded}
			/>
		</div>
	);
});

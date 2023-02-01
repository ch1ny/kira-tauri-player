import path from '@/core/path';
import { EMediaPlayStatus } from '@/types';
import { TMediaPlayerRef } from '@/utils';
import { getCurrent } from '@tauri-apps/api/window';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import styles from './index.module.less';

interface IVideoPlayerProps {
	mediaPath: string;
	mediaVolume: number;
	mediaPlayStatus: EMediaPlayStatus;
	onVolumeChange: (volume: number) => void;
	onVideoDurationChange: (duration: number) => void;
	onProgressChange: (progress: number) => void;
	onPlayEnded: () => void;
	onPlayStatusChange: () => void;
}

export const VideoPlayer = React.forwardRef<TMediaPlayerRef, IVideoPlayerProps>((props, ref) => {
	const {
		mediaPath,
		mediaVolume,
		mediaPlayStatus,
		onVolumeChange,
		onProgressChange,
		onVideoDurationChange,
		onPlayEnded,
		onPlayStatusChange,
	} = props;

	const videoRef = useRef<HTMLVideoElement>(null);
	useEffect(() => {
		const dom = videoRef.current;
		if (!dom) return;

		dom.volume = mediaVolume;
	}, [mediaVolume]);
	useEffect(() => {
		const dom = videoRef.current;
		if (!dom) return;

		mediaPlayStatus === EMediaPlayStatus.PAUSED ? dom.pause() : dom.play();
	}, [mediaPlayStatus]);

	useImperativeHandle(ref, () => ({
		getCurrentTime: () => {
			const dom = videoRef.current;
			if (!dom) return 0;

			return dom.currentTime;
		},
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

	const contentRef = useRef<HTMLDivElement>(null);
	const [enterFullscreen, exitFullscreen] = useMemo(
		() => [
			() => {
				const content = contentRef.current;
				if (!content) return;

				return content.requestFullscreen();
			},
			() => {
				return document.exitFullscreen();
			},
		],
		[]
	);
	const changeFullscreenStatus = useCallback(() => {
		const isFullScreen = document.fullscreenElement !== null;
		if (isFullScreen) {
			exitFullscreen();
		} else {
			enterFullscreen();
		}
	}, []);

	// 绑定全屏控制手势
	useEffect(() => {
		const bindFullscreenController = (ev: KeyboardEvent) => {
			switch (ev.code) {
				case 'KeyF':
					return changeFullscreenStatus();
			}
		};
		document.addEventListener('keydown', bindFullscreenController);

		return () => {
			document.removeEventListener('keydown', bindFullscreenController);
		};
	}, []);

	useEffect(() => {
		// 由于 WebView 在接到 Escape 命令时会拦截键盘事件并自动退出全屏，因此只能使用 fullscreenchange 作为同步
		const onFullscreenChange = () => {
			const currentWindow = getCurrent();
			const isFullscreen = document.fullscreenElement !== null;
			currentWindow.setFullscreen(isFullscreen);
		};
		document.addEventListener('fullscreenchange', onFullscreenChange);

		return () => {
			document.removeEventListener('fullscreenchange', onFullscreenChange);
		};
	}, []);

	return (
		<div className={styles.videoContent} ref={contentRef}>
			<video
				src={mediaPath}
				ref={videoRef}
				autoPlay
				onClick={onPlayStatusChange}
				onDoubleClick={changeFullscreenStatus}
				onWheel={(ev) => {
					const step = Number((ev.deltaY / 62.5).toFixed(0));
					onVolumeChange(mediaVolume * 100 - step);
				}}
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

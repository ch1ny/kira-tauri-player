import path from '@/core/path';
import { useDoubleClick } from '@/hooks';
import { EMediaPlayStatus } from '@/types';
import { TMediaPlayerRef } from '@/utils';
import { getCurrent } from '@tauri-apps/api/window';
import React, {
	Suspense,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import type TReactPlayer from 'react-player';
// import ReactPlayer from 'react-player';
import styles from './index.module.less';

const ReactPlayer: React.LazyExoticComponent<typeof TReactPlayer> = React.lazy(
	() => import('react-player')
);

const LoadingVideo = () => (
	<div
		className={styles.loadingVideo}
		onClick={(ev) => {
			ev.stopPropagation();
		}}>
		<div className={styles.loadingAnime}>
			<i />
			<i />
			<i />
			<i />
			<i />
		</div>
		<div className={styles.loadingText}>正在加载视频</div>
	</div>
);

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

	const [loadingMedia, setLoadingMedia] = useState(true);
	useEffect(() => {
		setLoadingMedia(true);
		path.basename(mediaPath).then((baseName) => {
			getCurrent().setTitle(`Kira Player - ${decodeURIComponent(baseName)}`);
		});
	}, [mediaPath]);

	const videoRef = useRef<TReactPlayer>(null);
	useImperativeHandle(ref, () => ({
		getCurrentTime: () => {
			const video = videoRef.current;
			if (!video) return 0;

			return video.getCurrentTime();
		},
		getDuration: () => {
			const video = videoRef.current;
			if (!video) return 0;

			return video.getDuration();
		},
		jumpTo: (destTime) => {
			const video = videoRef.current;
			if (!video) return;

			video.seekTo(destTime, 'seconds');
		},
	}));

	const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
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
			setIsFullscreen(isFullscreen);
		};
		document.addEventListener('fullscreenchange', onFullscreenChange);

		return () => {
			document.removeEventListener('fullscreenchange', onFullscreenChange);
		};
	}, []);

	const [fullscreenProgress, setFullscreenProgress] = useState(0);

	const onVideoClick = useDoubleClick(onPlayStatusChange, changeFullscreenStatus);
	return (
		<div
			className={styles.videoContent}
			ref={contentRef}
			onClick={onVideoClick}
			onWheel={(ev) => {
				const step = Number((ev.deltaY / 62.5).toFixed(0));
				onVolumeChange(mediaVolume * 100 - step);
			}}
			onContextMenu={(ev) => {
				ev.preventDefault();
			}}>
			<Suspense fallback={<div style={{ width: '100%', height: '100%' }} />}>
				<ReactPlayer
					url={mediaPath}
					controls={false}
					playing={mediaPlayStatus === EMediaPlayStatus.PLAYING}
					volume={mediaVolume}
					width={'100%'}
					height={'100%'}
					onDuration={(duration: Parameters<Required<TReactPlayer['props']>['onDuration']>[0]) => {
						onVideoDurationChange(duration);

						if (!duration) {
							getCurrent().setTitle('Kira Player');
						} else {
							setLoadingMedia(false);
						}
					}}
					onProgress={(state: Parameters<Required<TReactPlayer['props']>['onProgress']>[0]) => {
						const progress = state.playedSeconds;
						onProgressChange(progress);

						if (!videoRef.current) return;
						const duration = videoRef.current.getDuration();
						if (!duration) return setFullscreenProgress(1);

						setFullscreenProgress(progress / duration);
					}}
					progressInterval={100}
					onEnded={onPlayEnded}
					ref={videoRef}
				/>
			</Suspense>
			{/* 全屏进度条 */}
			{isFullscreen && (
				<div className={styles.fullscreenProgress}>
					<div className={styles.fullscreenProgressTrack} />
					<div
						className={styles.fullscreenProgressBar}
						style={{
							transform: `scaleX(${fullscreenProgress})`,
						}}
					/>
				</div>
			)}
			{loadingMedia && <LoadingVideo />}
		</div>
	);
});

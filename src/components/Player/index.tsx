import { usePlayEnded, useStores } from '@/hooks';
import { EMediaPlayStatus, EMediaType, TPlaylistMediaItem } from '@/types';
import { defaultMediaPlayerRef, getMediaType, TMediaPlayerRef } from '@/utils';
import { getMatches } from '@tauri-apps/api/cli';
import { open } from '@tauri-apps/api/dialog';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { getCurrent } from '@tauri-apps/api/window';
import { useSetState } from 'ahooks';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Control } from '../Control';
import { MediaList } from '../MediaList';
import { VideoPlayer } from '../VideoPlayer';
import styles from './index.module.less';

interface IPlayerPlacementProps {
	onSelect: (mediaPath: TPlaylistMediaItem) => void;
}

const PlayerPlacement: React.FC<IPlayerPlacementProps> = (props) => {
	const { onSelect } = props;

	useEffect(() => {
		getCurrent().setTitle('Kira Player');
	}, []);

	const selectMediaFile = useCallback(async () => {
		const selected = await open({
			multiple: false,
			filters: [
				{
					name: 'Video',
					extensions: ['mp4', 'webm', 'mkv', 'mov', 'flv', 'm3u'],
				},
			],
		});
		if (!selected) return;

		onSelect({
			mediaPath: `${selected}`,
			mediaSrc: convertFileSrc(`${selected}`),
		});
	}, [onSelect]);

	return (
		<div className={styles.playerPlacement}>
			<div className={styles.playerPlacementSlogan}>请选择需要播放的媒体文件</div>
			<div>
				<button onClick={selectMediaFile}>选择文件</button>
			</div>
		</div>
	);
};

interface IPlayingMediaInfo {
	mediaPath: string;
	mediaVolume: number;
	mediaDuration: number;
	mediaProgress: number;
}

const DefaultVoice = Number(localStorage.getItem('voice') || '30');

// 绑定播放器控制手势
const useBindGesture = (callbacks: {
	adjustVolume(active: boolean): void;
	adjustProgress(active: boolean): void;
	changeMediaPlayStatus(): void;
}) => {
	const { adjustVolume, adjustProgress, changeMediaPlayStatus } = callbacks;

	useEffect(() => {
		const bindGesture = (ev: KeyboardEvent) => {
			switch (ev.code) {
				// 调节音量
				case 'ArrowUp':
					return adjustVolume(true);
				case 'ArrowDown':
					return adjustVolume(false);
				// 调整播放进度
				case 'ArrowRight':
					return adjustProgress(true);
				case 'ArrowLeft':
					return adjustProgress(false);
				// 切换播放状态
				case 'Space':
					return changeMediaPlayStatus();
			}
		};
		document.addEventListener('keydown', bindGesture);

		return () => {
			document.removeEventListener('keydown', bindGesture);
		};
	}, []);
};

export const Player = observer(() => {
	const {
		playlist: { addMediaToPlaylist, playingMedia, mediaPlayStatus, changeMediaPlayStatus },
	} = useStores();

	const { mediaPath, mediaSrc } = useMemo(
		() => playingMedia?.value || { mediaPath: '', mediaSrc: '' },
		[playingMedia]
	);

	// 初始化查看应用是否通过 args 传入播放的多媒体文件
	useEffect(() => {
		getMatches().then((matches) => {
			const {
				args: {
					mediaPath: { value: mediaPath },
				},
			} = matches;
			if (typeof mediaPath !== 'string') return;

			addMediaToPlaylist({
				mediaPath,
				mediaSrc: convertFileSrc(mediaPath),
			});
		});
	}, []);

	const mediaType = useMemo(() => getMediaType(mediaPath), [mediaPath]);
	const playerRef = useRef<TMediaPlayerRef>(defaultMediaPlayerRef);

	const [playingMediaInfo, setPlayingMediaInfo] = useSetState<IPlayingMediaInfo>({
		mediaPath,
		mediaVolume: DefaultVoice,
		mediaDuration: 0,
		mediaProgress: 0,
	});
	useEffect(() => {
		localStorage.setItem('voice', `${playingMediaInfo.mediaVolume}`);
	}, [playingMediaInfo.mediaVolume]);

	useBindGesture({
		adjustVolume: useCallback((active: boolean) => {
			setPlayingMediaInfo(({ mediaVolume }) => ({
				mediaVolume: active ? Math.min(100, mediaVolume + 10) : Math.max(0, mediaVolume - 10),
			}));
		}, []),
		adjustProgress: useCallback((active: boolean) => {
			const currentTime = playerRef.current.getCurrentTime(),
				duration = playerRef.current.getDuration();

			const destTime = active ? Math.min(duration, currentTime + 3) : Math.max(0, currentTime - 3);

			playerRef.current.jumpTo(destTime);
			setPlayingMediaInfo({
				mediaProgress: destTime,
			});
		}, []),
		changeMediaPlayStatus,
	});

	const onPlayEnded = usePlayEnded();

	const [showMediaList, setShowMediaList] = useState(false);

	return (
		<div className={styles.playerContent}>
			<div className={styles.player}>
				{(function () {
					switch (mediaType) {
						case EMediaType.VIDEO:
							return (
								<VideoPlayer
									mediaPath={mediaSrc}
									mediaVolume={playingMediaInfo.mediaVolume / 100}
									mediaPlayStatus={mediaPlayStatus}
									ref={playerRef}
									onVolumeChange={(volume) => {
										setPlayingMediaInfo({
											mediaVolume: Math.min(100, Math.max(0, volume)),
										});
									}}
									onProgressChange={(progress) => {
										setPlayingMediaInfo({
											mediaProgress: progress,
										});
									}}
									onVideoDurationChange={(duration) => {
										setPlayingMediaInfo({
											mediaDuration: duration,
										});
									}}
									onPlayEnded={() => {
										changeMediaPlayStatus(EMediaPlayStatus.PAUSED);
										onPlayEnded();
									}}
									onPlayStatusChange={changeMediaPlayStatus}
								/>
							);
						default:
							return <PlayerPlacement onSelect={addMediaToPlaylist} />;
					}
				})()}
				<MediaList
					open={showMediaList}
					onOpenButtonClick={() => {
						setShowMediaList((showMediaList) => !showMediaList);
					}}
				/>
			</div>
			<div className={styles.controller}>
				<Control
					volume={playingMediaInfo.mediaVolume}
					onVolumeChange={(volume) => {
						setPlayingMediaInfo({
							mediaVolume: volume,
						});
					}}
					progress={playingMediaInfo.mediaProgress}
					onProgressChange={(progress) => {
						playerRef.current.jumpTo(progress);
						setPlayingMediaInfo({
							mediaProgress: progress,
						});
						changeMediaPlayStatus(EMediaPlayStatus.PLAYING);
					}}
					mediaDuration={playingMediaInfo.mediaDuration}
					mediaPlayStatus={mediaPlayStatus}
					onPlayStatusChange={changeMediaPlayStatus}
				/>
			</div>
		</div>
	);
});

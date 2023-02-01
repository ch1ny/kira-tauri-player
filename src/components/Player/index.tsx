import { EMediaType } from '@/types';
import { defaultMediaPlayerRef, getMediaType, TMediaPlayerRef } from '@/utils';
import { getMatches } from '@tauri-apps/api/cli';
import { open } from '@tauri-apps/api/dialog';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { useSetState } from 'ahooks';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Control } from '../Control';
import { VideoPlayer } from '../VideoPlayer';
import styles from './index.module.less';

interface IPlayerPlacementProps {
	onSelect: (mediaPath: string) => void;
}

const PlayerPlacement: React.FC<IPlayerPlacementProps> = (props) => {
	const { onSelect } = props;

	const selectMediaFile = useCallback(async () => {
		const selected = await open({
			multiple: false,
			filters: [
				{
					name: 'Video',
					extensions: ['mp4', 'webm'],
				},
			],
		});
		if (!selected) return;

		onSelect(convertFileSrc(selected as string));
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
	mediaVoice: number;
	mediaDuration: number;
	mediaProgress: number;
}

const DefaultVoice = Number(localStorage.getItem('voice') || '100');

export const Player = () => {
	const [mediaPath, setMediaPath] = useState('');
	// 初始化查看应用是否通过 args 传入播放的多媒体文件
	useEffect(() => {
		getMatches().then((matches) => {
			const {
				args: {
					mediaPath: { value: mediaPath },
				},
			} = matches;
			if (typeof mediaPath !== 'string') return;

			setMediaPath(convertFileSrc(mediaPath));
		});
	}, []);

	const mediaType = useMemo(() => getMediaType(mediaPath), [mediaPath]);
	const playerRef = useRef<TMediaPlayerRef>(defaultMediaPlayerRef);

	const [playingMediaInfo, setPlayingMediaInfo] = useSetState<IPlayingMediaInfo>({
		mediaPath,
		mediaVoice: DefaultVoice,
		mediaDuration: 0,
		mediaProgress: 0,
	});
	useEffect(() => {
		localStorage.setItem('voice', `${playingMediaInfo.mediaVoice}`);
	}, [playingMediaInfo.mediaVoice]);

	return (
		<div className={styles.playerContent}>
			<div className={styles.player}>
				{(function () {
					switch (mediaType) {
						case EMediaType.VIDEO:
							return (
								<VideoPlayer
									mediaPath={mediaPath}
									mediaVoice={playingMediaInfo.mediaVoice / 100}
									ref={playerRef}
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
								/>
							);
						default:
							return <PlayerPlacement onSelect={setMediaPath} />;
					}
				})()}
			</div>
			<div className={styles.controller}>
				<Control
					voice={playingMediaInfo.mediaVoice}
					onVoiceChange={(voice) => {
						setPlayingMediaInfo({
							mediaVoice: voice,
						});
					}}
					progress={playingMediaInfo.mediaProgress}
					mediaDuration={playingMediaInfo.mediaDuration}
				/>
			</div>
		</div>
	);
};

import { EPlayEndCallback } from '@/types';
import { getNextMediaNode } from '@/utils';
import { useCallback } from 'react';
import { useStores } from '../useStores';

export const usePlayEnded = () => {
	const {
		playlist: { playlist, setPlayingMedia, playEndCallback, playingMedia, changeMediaPlayStatus },
	} = useStores();

	const onPlayEnded = useCallback(() => {
		const nextMedia = getNextMediaNode(playingMedia);

		switch (playEndCallback) {
			case EPlayEndCallback.SelfLoop:
				setPlayingMedia(playingMedia!);
				return true;
			case EPlayEndCallback.ListPlay:
				return !!nextMedia && setPlayingMedia(nextMedia);
			case EPlayEndCallback.ListLoop:
				setPlayingMedia(nextMedia ? nextMedia : playlist.head!);
				return true;
		}
	}, [playlist, playEndCallback, playingMedia]);

	return onPlayEnded;
};

import { EMediaType } from '@/types';

const transPathSep = (path: string) => {
	return path.replace(/\\\\/g, '/');
};

export const getMediaType = (mediaPath: string) => {
	const mediaExt = transPathSep(mediaPath).split('/').slice(-1)[0]?.split('.').slice(-1)[0];
	if (!mediaExt) return EMediaType.UNKNOWN;

	switch (mediaExt.toLowerCase()) {
		case 'mp4':
		case 'webm':
		case 'mkv':
		case 'mov':
		case 'flv':
		case 'm3u8':
		case 'm3u':
		case 'mpd':
			return EMediaType.VIDEO;
		case 'mp3':
		case 'wav':
		case 'ogg':
		case 'acc':
			return EMediaType.AUDIO;
		default:
			return EMediaType.UNKNOWN;
	}
};

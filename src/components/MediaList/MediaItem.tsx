import path from '@/core/path';
import { useStores } from '@/hooks';
import { TPlaylistMediaItem } from '@/types';
import { BiDirectionListNode } from '@/utils';
import { DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { useMemo } from 'react';
import { Marquee } from '../Marquee';
import styles from './index.module.less';

const PlayingIcon = () => (
	<div className={styles.mediaItemPlayingIcon}>
		<i />
		<i />
		<i />
	</div>
);

interface IMediaItemProps {
	mediaNode: BiDirectionListNode<TPlaylistMediaItem>;
}

export const MediaItem: React.FC<IMediaItemProps> = (props) => {
	const { mediaNode } = props;

	const {
		playlist: { playingMedia, setPlayingMedia },
	} = useStores();
	const isPlaying = useMemo(() => {
		return mediaNode.value.mediaSrc === playingMedia?.value.mediaSrc;
	}, [mediaNode, playingMedia]);

	const mediaName = useMemo(() => {
		const baseName = mediaNode.value.mediaPath.split(path.sep).at(-1) || '.';
		const extDotIndex = baseName.lastIndexOf('.');
		return baseName.slice(0, extDotIndex);
	}, [mediaNode]);

	return (
		<div
			className={classNames({
				[styles.mediaItem]: true,
				[styles.mediaItemPlaying]: isPlaying,
			})}
			onClick={() => {
				setPlayingMedia(mediaNode);
			}}>
			<div className={styles.mediaItemStatus}>
				{isPlaying ? <PlayingIcon /> : <PlayCircleOutlined />}
			</div>
			<div className={styles.mediaItemName}>
				<Marquee>{mediaName}</Marquee>
			</div>
			<div className={styles.removeMediaItem}>
				<DeleteOutlined />
			</div>
		</div>
	);
};

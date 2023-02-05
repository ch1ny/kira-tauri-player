import { useStores } from '@/hooks';
import { CaretUpOutlined, FileAddOutlined } from '@ant-design/icons';
import { open as tauriDialogOpen } from '@tauri-apps/api/dialog';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { useCallback } from 'react';
import styles from './index.module.less';
import { MediaItem } from './MediaItem';

interface IMediaListProps {
	open: boolean;
	onOpenButtonClick?: React.MouseEventHandler;
}

export const MediaList: React.FC<IMediaListProps> = observer((props) => {
	const { open, onOpenButtonClick } = props;

	const {
		playlist: { playlist, addMediaToPlaylist },
	} = useStores();

	const addFile = useCallback(async () => {
		const selected = await tauriDialogOpen({
			multiple: false,
			filters: [
				{
					name: 'Video',
					extensions: ['mp4', 'webm', 'mkv', 'mov', 'flv', 'm3u'],
				},
			],
		});
		if (!selected) return;

		addMediaToPlaylist({
			mediaPath: `${selected}`,
			mediaSrc: convertFileSrc(`${selected}`),
		});
	}, []);

	return (
		<div
			className={classNames({
				[styles.mediaList]: true,
				[styles.mediaListClosed]: !open,
			})}>
			<div className={styles.openButton} onClick={onOpenButtonClick}>
				<CaretUpOutlined />
			</div>
			<div className={styles.mediaListContent}>
				<div className={styles.mediaListTitle}>
					<div>播放列表</div>
					<div className={styles.addFile} onClick={addFile}>
						<FileAddOutlined />
					</div>
				</div>
				<div className={styles.mediaListItems}>
					{playlist.map(({ mediaSrc }, _index, mediaNode) => (
						<MediaItem mediaNode={mediaNode} key={mediaSrc} />
					))}
				</div>
			</div>
		</div>
	);
});

import { useStores } from '@/hooks';
import { CaretUpOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import styles from './index.module.less';
import { MediaItem } from './MediaItem';

interface IMediaListProps {
	open: boolean;
	onOpenButtonClick?: React.MouseEventHandler;
}

export const MediaList: React.FC<IMediaListProps> = observer((props) => {
	const { open, onOpenButtonClick } = props;

	const {
		playlist: { playlist },
	} = useStores();

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
				{playlist.map(({ mediaSrc }, _index, mediaNode) => (
					<MediaItem mediaNode={mediaNode} key={mediaSrc} />
				))}
			</div>
		</div>
	);
});

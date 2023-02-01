import { Player } from '../Player';
import styles from './index.module.less';

export const MainBody = () => {
	return (
		<div className={styles.mainBody}>
			<div
				style={{
					width: '100%',
					height: '100%',
					position: 'relative',
					display: 'flex',
				}}>
				<Player />
			</div>
		</div>
	);
};

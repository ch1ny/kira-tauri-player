import { invoke } from '@tauri-apps/api/tauri';
import { useEffect } from 'react';
import styles from './App.module.less';
import { MainBody } from './components';

function App() {
	useEffect(() => {
		invoke('show_main_window');
	}, []);

	return (
		<div className={styles.app}>
			<MainBody />
		</div>
	);
}

export default App;

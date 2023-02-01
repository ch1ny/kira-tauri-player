import path from '@/core/path';
import { TMediaProps } from '@/types';
import { fs } from '@tauri-apps/api';

// const playlistPath = (async function () {
// 	const resourceDirPath = await path.resourceDir();
// 	return path.joinSync(resourceDirPath, 'data/playlist');
// })();

export const readPlaylist = async () => {
	const content = await fs.readTextFile(`data${path.sep}playlist`, {
		dir: path.BaseDirectory.Resource,
	});
	return content;
};

export const writePlaylist = async (playlist: TMediaProps[]) => {
	await fs.writeTextFile(`data${path.sep}playlist`, JSON.stringify(playlist), {
		dir: path.BaseDirectory.Resource,
	});
};

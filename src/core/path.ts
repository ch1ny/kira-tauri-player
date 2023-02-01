import * as path from '@tauri-apps/api/path';

const PathSeparatorRegex = new RegExp(/(\\|\/)/, 'g');
const replacePathSeparator = (str: string) => str.replace(PathSeparatorRegex, path.sep);

export default {
	...path,
	join: (...paths: string[]) => path.join(...paths.map(replacePathSeparator)),
	joinSync: (...paths: string[]) => {
		return paths.map(replacePathSeparator).join(path.sep);
	},
};

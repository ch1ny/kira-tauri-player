export enum EMediaType {
	AUDIO,
	VIDEO,
	UNKNOWN,
}

export type TMediaProps = {
	mediaName: string;
	mediaType: EMediaType.AUDIO | EMediaType.VIDEO;
	mediaSrc: string;
};

export interface IAntdSliderRef {
	focus: () => void;
	blur: () => void;
}

export enum EMediaPlayStatus {
	PAUSED,
	PLAYING,
}

export enum EPlayEndCallback {
	ListPlay = '列表播放', // 列表播放 <SwapRightOutlined />
	ListLoop = '列表循环', // 列表循环 <RetweetOutlined />
	SelfLoop = '单曲循环', // 单曲循环 <SyncOutlined />
	// RandomList, // 随机播放
}

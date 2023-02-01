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

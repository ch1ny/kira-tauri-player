export type TMediaPlayerRef = {
	getCurrentTime(): number;
	getDuration(): number;
	jumpTo(destTime: number): void;
};

export const defaultMediaPlayerRef: TMediaPlayerRef = {
	getCurrentTime: () => 0,
	getDuration: () => 0,
	jumpTo: () => {},
};

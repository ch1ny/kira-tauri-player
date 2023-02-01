export type TMediaPlayerRef = {
	getDuration(): number;
	jumpTo(destTime: number): void;
};

export const defaultMediaPlayerRef: TMediaPlayerRef = {
	getDuration: () => 0,
	jumpTo: () => {},
};

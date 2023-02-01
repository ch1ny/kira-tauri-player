export type TMediaPlayerRef = {
	getDuration(): number;
	jumpTo(destTime: number): void;
	play(): void;
	pause(): void;
};

export const defaultMediaPlayerRef: TMediaPlayerRef = {
	getDuration: () => 0,
	jumpTo: () => {},
	play: () => {},
	pause: () => {},
};

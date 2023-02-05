import { EMediaPlayStatus, EPlayEndCallback, TPlaylistMediaItem } from '@/types';
import { BiDirectionList, BiDirectionListNode } from '@/utils';
import { action, makeObservable, observable } from 'mobx';

function getInitPlayEndCallback() {
	const playEndCallback = localStorage.getItem('PLAY_END_CALLBACK');
	switch (playEndCallback) {
		case EPlayEndCallback.ListPlay:
		case EPlayEndCallback.ListLoop:
		case EPlayEndCallback.SelfLoop:
			return playEndCallback;
		default:
			return EPlayEndCallback.ListPlay;
	}
}

export default class PlaylistStore {
	constructor() {
		this.addMediaToPlaylist = this.addMediaToPlaylist.bind(this);
		this.removeMediaFromPlaylistByIndex = this.removeMediaFromPlaylistByIndex.bind(this);
		this.setPlayingMedia = this.setPlayingMedia.bind(this);
		this.exchangePlayEndCallback = this.exchangePlayEndCallback.bind(this);
		this.changeMediaPlayStatus = this.changeMediaPlayStatus.bind(this);

		makeObservable(this, {
			playlist: observable,
			addMediaToPlaylist: action,
			removeMediaFromPlaylistByIndex: action,

			playingMedia: observable,
			setPlayingMedia: action,

			playEndCallback: observable,
			exchangePlayEndCallback: action,

			mediaPlayStatus: observable,
			changeMediaPlayStatus: action,
		});
	}

	playlist: BiDirectionList<TPlaylistMediaItem> = new BiDirectionList();
	addMediaToPlaylist(mediaItem: TPlaylistMediaItem) {
		const isFirstMedia = this.playlist.isEmpty();
		const newList = new BiDirectionList(this.playlist);
		const mediaNode = BiDirectionList.createNode(mediaItem);
		newList.push(mediaNode);
		this.playlist = newList;
		if (isFirstMedia) {
			this.setPlayingMedia(mediaNode);
		}
	}
	// TODO:
	removeMediaFromPlaylistByIndex(index: number) {
		// this.playlist = this.playlist.slice(0, index).concat(this.playlist.slice(index + 1));
	}

	playingMedia: BiDirectionListNode<TPlaylistMediaItem> | null = null;
	setPlayingMedia(mediaNode: BiDirectionListNode<TPlaylistMediaItem>) {
		this.playingMedia = mediaNode;
		this.mediaPlayStatus = EMediaPlayStatus.PLAYING;
	}

	playEndCallback: EPlayEndCallback = getInitPlayEndCallback();
	exchangePlayEndCallback() {
		switch (this.playEndCallback) {
			case EPlayEndCallback.ListPlay:
				this.playEndCallback = EPlayEndCallback.ListLoop;
				break;
			case EPlayEndCallback.ListLoop:
				this.playEndCallback = EPlayEndCallback.SelfLoop;
				break;
			case EPlayEndCallback.SelfLoop:
				this.playEndCallback = EPlayEndCallback.ListPlay;
				break;
			default:
				return;
		}
		localStorage.setItem('PLAY_END_CALLBACK', this.playEndCallback);
	}

	mediaPlayStatus: EMediaPlayStatus = EMediaPlayStatus.PAUSED;
	changeMediaPlayStatus(status?: EMediaPlayStatus) {
		if (typeof status !== 'number') this.mediaPlayStatus = 1 - this.mediaPlayStatus;
		else this.mediaPlayStatus = status;
	}
}

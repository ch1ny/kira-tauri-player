import { TPlaylistMediaItem } from '@/types';
import { BiDirectionList, BiDirectionListNode } from '@/utils';
import { action, makeObservable, observable } from 'mobx';

export default class PlaylistStore {
	constructor() {
		this.addMediaToPlaylist = this.addMediaToPlaylist.bind(this);
		this.removeMediaFromPlaylistByIndex = this.removeMediaFromPlaylistByIndex.bind(this);

		makeObservable(this, {
			playlist: observable,
			addMediaToPlaylist: action,
			removeMediaFromPlaylistByIndex: action,

			playingMedia: observable,
			setPlayingMedia: action,
		});
	}

	playlist: BiDirectionList<TPlaylistMediaItem> = new BiDirectionList();

	addMediaToPlaylist(mediaItem: TPlaylistMediaItem) {
		const isFirstMedia = this.playlist.isEmpty();
		const newList = new BiDirectionList(this.playlist);
		const mediaNode = BiDirectionList.createNode(mediaItem);
		newList.push(mediaNode);
		this.playlist = newList;
		if (isFirstMedia) this.playingMedia = mediaNode;
	}

	removeMediaFromPlaylistByIndex(index: number) {
		// this.playlist = this.playlist.slice(0, index).concat(this.playlist.slice(index + 1));
	}

	playingMedia: BiDirectionListNode<TPlaylistMediaItem> | null = null;
	setPlayingMedia(mediaNode: BiDirectionListNode<TPlaylistMediaItem>) {
		this.playingMedia = mediaNode;
	}
}

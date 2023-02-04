import PlaylistStore from './playlistStore';

export interface IStore {
	playlist: PlaylistStore;
}

const stores: IStore = {
	playlist: new PlaylistStore(),
};

export default stores;

import { TPlaylistMediaItem } from '@/types';
import { BiDirectionListNode } from './core';

export const getNextMediaNode = (mediaNode: BiDirectionListNode<TPlaylistMediaItem> | null) =>
	mediaNode ? mediaNode.next : null;

export const getPrevMediaNode = (mediaNode: BiDirectionListNode<TPlaylistMediaItem> | null) =>
	mediaNode ? mediaNode.prev : null;

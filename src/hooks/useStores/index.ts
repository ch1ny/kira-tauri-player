import { IStore } from '@/stores';
import { MobXProviderContext } from 'mobx-react';
import { useContext } from 'react';

export const useStores = () => {
	return useContext(MobXProviderContext) as IStore;
};


import { AuthTokens, User } from '@/types/user.type';
import { create } from 'zustand';



export interface RootState {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useRootStore = create<RootState>((set) => ({
  isLoading: false,
  setIsLoading(loading) {
    set({ isLoading: loading });
  },
}));

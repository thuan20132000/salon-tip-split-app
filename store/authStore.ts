import { authAPI } from '@/api/authAPI';
import { AuthTokens, User } from '@/types/user.type';
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { useSalonStore } from './useSalonStore';
import { intializeOneSignal, registerUserDeviceSubscription, unRegisterUserDeviceSubscription } from '@/services/onesignal.service';



export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  tokens: null,
  initialize: async () => {
    set({ isLoading: true });
    try {
      const tokens = await SecureStore.getItemAsync('tokens');
      const user = await SecureStore.getItemAsync('user');
      const userDevice =  intializeOneSignal();
      useSalonStore.getState().initSelectedSalon();
      if (tokens && user) {
        set({
          tokens: JSON.parse(tokens),
          user: JSON.parse(user),
          isAuthenticated: true,
        });
        router.replace('/(app)/(tabs)/(staff)');
      }
    } catch (error) {
      console.error('Initialization error:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      
      const res = await authAPI.login(username, password);
      const staffSalon = res.data.user?.staff_detail?.salon

      // Store tokens and user data securely
      await SecureStore.setItemAsync('tokens', JSON.stringify({
        access: res.data.access,
        refresh: res.data.refresh,
      }));
      await SecureStore.setItemAsync('user', JSON.stringify(res.data.user));
      await useSalonStore.getState().onSelectedSalon(staffSalon)
      registerUserDeviceSubscription()
      set({
        user: res.data.user,
        tokens: {
          access: res.data.access,
          refresh: res.data.refresh,
        },
        isAuthenticated: true,
        isLoading: false,
      });

    } catch (error) {
      console.log('====================================');
      console.log('error: ',error);
      console.log('====================================');
      set({ error: '', isLoading: false });
    }
  },

  logout: async () => {
    try {
      console.log('====================================');
      console.log('logout process');
      console.log('====================================');
      // Clear secure storage
      await unRegisterUserDeviceSubscription()
      await SecureStore.deleteItemAsync('tokens');
      await SecureStore.deleteItemAsync('user');
      await SecureStore.deleteItemAsync('selectedSalon');
      set({
        user: null,
        tokens: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
}));

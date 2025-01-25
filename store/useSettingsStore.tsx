
import { AuthTokens, User } from '@/types/user.type';
import { create } from 'zustand';



export interface SettingState {
  isAllowAccessManagement: boolean | null;
  setAllowAccessManagement: (isAllowAccessManagement: boolean) => void;
  verifyPasscode: (passcode: string) => boolean;
  
}

export const useSettingsStore = create<SettingState>((set) => ({
  isAllowAccessManagement: true,
  setAllowAccessManagement: (isAllowAccessManagement: boolean) => set({ isAllowAccessManagement }),
  verifyPasscode: (passcode: string) => {
    // Your logic here
    if (passcode === '860012') {
      return true;
    }
    return false;
  }
}));

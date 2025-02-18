
import { salonAPI } from '@/api/salonAPI';
import { SalonSettingsType } from '@/types/salon.types';
import { AuthTokens, User } from '@/types/user.type';
import { create } from 'zustand';
import { useSalonStore } from './useSalonStore';



export interface SettingState {
  isAllowAccessManagement: boolean | null;
  setAllowAccessManagement: (isAllowAccessManagement: boolean) => void;
  verifyPasscode: (passcode: string) => boolean;
  salonSettings: SalonSettingsType | null;
  setSalonSettings: (salonSettings: SalonSettingsType) => void;
  getSalonSettings: () => Promise<void>;
  updateSalonSettings: (salonSettings: Partial<SalonSettingsType>) => Promise<void>;
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
  },
  salonSettings: null,
  setSalonSettings: (salonSettings: SalonSettingsType) => set({ salonSettings }),
  getSalonSettings: async () => {
    try {
      const { selectedSalon } = useSalonStore.getState()
      const salonSettings = await salonAPI.getSalonSettings(Number(selectedSalon?.id || 0))
      set({ salonSettings: salonSettings.data.data })
    } catch (error) {
      console.error(error)
    }
  },
  updateSalonSettings: async (salonSettings: Partial<SalonSettingsType>) => {
    try {
      const { selectedSalon } = useSalonStore.getState()
      const salonSettingsResponse = await salonAPI.updateSalonSettings(Number(selectedSalon?.id || 0), salonSettings)
      set({ salonSettings: salonSettingsResponse.data.data })
    } catch (error) {
      console.error(error)
      throw error;
    }
  }
}));

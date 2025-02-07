import { create } from 'zustand';
import { StaffServiceFilterType, StaffServiceType, UpdateStaffServiceType } from '@/types/salon.types';
import { salonAPI } from '@/api/salonAPI';
import { useSalonStore } from './useSalonStore';
import { useRootStore } from './useRootStore';
import { Alert } from 'react-native';

export interface StaffServicesState {
  staffServices: StaffServiceType[];
  loading: boolean;
  error: string | null;
  // Actions
  setStaffServices: (staffServices: StaffServiceType[]) => void;
  addStaffService: (staffService: StaffServiceType) => Promise<void>;
  updateStaffService: (staffService: UpdateStaffServiceType) => Promise<void>;
  deleteStaffService: (id: number) => Promise<void>;
  getStaffServices: (filter: StaffServiceFilterType) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const useStaffServicesStore = create<StaffServicesState>((set, get) => ({
  staffServices: [],
  loading: false,
  error: null,
  setStaffServices: (staffServices) => set({ staffServices }),
  addStaffService: async (staffService) => {
    const { selectedSalon } = useSalonStore.getState();
  },
  updateStaffService: async (staffService) => {
    const { selectedSalon } = useSalonStore.getState();
    if (!selectedSalon) {
      throw new Error('No salon selected');
    }
    try {
      const res = await salonAPI.updateStaffService(selectedSalon?.id, staffService);

      get().getStaffServices({ staff_id: staffService.staff_id });

    } catch (error) {
      console.log("Error updating staff service:: ", error);
      Alert.alert("Error", "Failed to update staff service");
    }
  },
  deleteStaffService: async (id) => {
    const { selectedSalon } = useSalonStore.getState();
  },
  getStaffServices: async (filter: StaffServiceFilterType) => {
    const { selectedSalon } = useSalonStore.getState();
    if (!selectedSalon) {
      throw new Error('No salon selected');
    }
    try {
      const res = await salonAPI.getStaffServices(selectedSalon?.id, filter);
      set({ staffServices: res.data.data });
    } catch (error) {
      console.log("Error getting staff services:: ", error);
      Alert.alert("Error", "Failed to get staff services");
    }

  },
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

}));

export default useStaffServicesStore;

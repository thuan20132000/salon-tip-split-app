import { create } from 'zustand';
import { SalonServiceType } from '@/types/salon.types';
import { salonAPI } from '@/api/salonAPI';
import { useSalonStore } from './useSalonStore';
import { useRootStore } from './useRootStore';
import { Alert } from 'react-native';

export interface SalonServicesState {
  salonServices: SalonServiceType[];
  loading: boolean;
  error: string | null;
  // Actions
  setSalonServices: (salonServices: SalonServiceType[]) => void;
  addSalonService: (salonService: SalonServiceType) => Promise<void>;
  updateSalonService: (updatedSalonService: Partial<SalonServiceType>) => Promise<void>;
  getSalonServices: () => void;
  deleteSalonService: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const useSalonServicesStore = create<SalonServicesState>((set, get) => ({
  salonServices: [],
  loading: false,
  error: null,

  setSalonServices: (salonServices) => set({ salonServices }),
  getSalonServices: async () => {
    const { selectedSalon } = useSalonStore.getState();
    if (!selectedSalon) {
      throw new Error('No salon selected');
    }
    const res = await salonAPI.getSalonServices(selectedSalon?.id);
    set((state) => ({
      salonServices: res.data.data,
    }))
  },
  addSalonService: async (salonService) => {
    const { selectedSalon } = useSalonStore.getState();
    const { setIsLoading } = useRootStore.getState();
    try {

      setIsLoading(true);
      if (!selectedSalon) {
        throw new Error('No salon selected');
      }
      const res = await salonAPI.addSalonService(selectedSalon?.id, salonService);

      set((state) => ({
        salonServices: [res.data.data, ...state.salonServices],
      }))
    } catch (error) {
      console.log("Error adding salon service:: ", error);
    } finally {
      setIsLoading(false);
    }
  },

  updateSalonService: async (updatedSalonService) => {
    const { selectedSalon } = useSalonStore.getState();
    const { setIsLoading } = useRootStore.getState();
    try {
      setIsLoading(true);
      if (!selectedSalon) {
        throw new Error('No salon selected');
      }
      const res = await salonAPI.updateSalonService(selectedSalon?.id, updatedSalonService);
      set((state) => ({
        salonServices: state.salonServices.map((salonService) => (
          salonService.id === Number(updatedSalonService.id) ? res.data.data : salonService
        ))
      }))
      Alert.alert("Success", "Salon service updated successfully");
    } catch (error) {
      console.log("Error updating salon service:: ", error);
      Alert.alert("Error", "Failed to update salon service");
    } finally {
      setIsLoading(false);
    }
  },


  deleteSalonService: (id) =>
    set((state) => ({
      salonServices: state.salonServices.filter((salonService) => salonService.id !== Number(id)),
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));

export default useSalonServicesStore;

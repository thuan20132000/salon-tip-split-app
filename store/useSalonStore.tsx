import { authAPI } from '@/api/authAPI';
import { AuthTokens, Salon, User } from '@/types/user.type';
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { salonAPI } from '@/api/salonAPI';
import { SalonStaffType } from '@/types/staff.types';
import { SalonReceipt, SalonReceiptFilterInput, StaffBillType, StaffReceiptFilterInput } from '@/types/receipt.type';
import { SalonReceiptFilterInputType } from './useSalonUpdatePaymentStore';
import dayjs from 'dayjs';



export interface SalonState {
  salons: Salon[] | null;
  selectedSalon: Salon | null;
  salonReceipts: SalonReceipt[] | null;
  salonStaffBills: StaffBillType[] | null;
  getSalonStaffBills: (filter_input: SalonReceiptFilterInput) => Promise<StaffBillType[]>;
  getMySalons: () => Promise<void>;
  onSelectedSalon: (salon: Salon) => Promise<void>;
  salonStaffs: SalonStaffType[] | null;
  getSalonStaffs: () => Promise<SalonStaffType[]>;
  initSelectedSalon: () => Promise<void>;
  getSalonReceipts: (filter?: SalonReceiptFilterInput) => Promise<void>;
}

export const useSalonStore = create<SalonState>((set) => ({
  salons: null,
  selectedSalon: null,
  salonStaffs: [],
  salonReceipts: [],
  salonStaffBills: [],
  setSalons: (salons: Salon[]) => set({ salons }),
  selectSalon: (salon: Salon) => set({ selectedSalon: salon }),
  getMySalons: async () => {
    try {
      const res = await salonAPI.getMySalons();
      const selectedSalon = await SecureStore.getItemAsync('selectedSalon');

      set({ salons: res.data.data });
    } catch (error) {
      console.error('get my-salons error:', error);
    }
  },
  onSelectedSalon: async (salon: Salon) => {
    set({ selectedSalon: salon });

    await SecureStore.setItemAsync('selectedSalon', JSON.stringify(salon));
  },

  initSelectedSalon: async () => {
    const selectedSalon = await SecureStore.getItemAsync('selectedSalon');
    if (selectedSalon) {
      const salon = JSON.parse(selectedSalon);
      set({ selectedSalon: salon });
    }
  },

  getSalonStaffs: async () => {
    try {
      const { selectedSalon } = get();

      console.log('selectedSalon: ', selectedSalon);

      const res = await salonAPI.getSalonStaffs(Number(selectedSalon?.id));

      console.log('====================================');
      console.log('salonStaffs: ', res.data.data);
      console.log('====================================');
      set({ salonStaffs: res.data.data });
      return res.data.data;

    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getSalonReceipts: async (filter) => {
    try {
      const { selectedSalon } = get();
      const filterInput :SalonReceiptFilterInput= {
        ...filter,
        created_at: filter?.created_at || dayjs(new Date()).format('YYYY-MM-DD'),
      }

      const res = await salonAPI.getSalonReceipts(Number(selectedSalon?.id), filterInput);

      set({ salonReceipts: res.data.data });
    } catch (error) {
      console.error(error);
    }
  },

  getSalonStaffBills: async (filter_input) => {
    try {
      const { selectedSalon } = get();

      const res = await salonAPI.getSalonStaffReceipts(Number(selectedSalon?.id), filter_input);
      console.log('salon staff bills: ', res.data.data);

      set({ salonStaffBills: res.data.data });
      return res.data.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  },

}));

function get() {
  return useSalonStore.getState();
}


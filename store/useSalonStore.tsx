import { authAPI } from '@/api/authAPI';
import { AuthTokens, Salon, User } from '@/types/user.type';
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { salonAPI } from '@/api/salonAPI';
import { SalonStaffType } from '@/types/staff.types';
import { SalonReceipt, SalonReceiptFilterInput, StaffBillType, StaffReceiptFilterInput, StaffReceiptSummary } from '@/types/receipt.type';
import dayjs from 'dayjs';
import { PaymentReceiptStatusEnums } from '@/enums/PaymentEnums';



export interface SalonState {
  salons: Salon[] | null;
  selectedSalon: Salon | null;
  salonReceipts: SalonReceipt[] | null;
  salonStaffBills: StaffBillType[] | null;
  staffBillsSummary?: StaffReceiptSummary;
  getSalonStaffBills: (filter_input: SalonReceiptFilterInput) => Promise<StaffBillType[]>;
  getMySalons: () => Promise<void>;
  onSelectedSalon: (salon?: Salon) => Promise<void>;
  salonStaffs: SalonStaffType[] | null;
  getSalonStaffs: () => Promise<SalonStaffType[]>;
  initSelectedSalon: () => Promise<void>;
  getSalonReceipts: (filter?: SalonReceiptFilterInput) => Promise<void>;
  pendingPaymentReceipts: SalonReceipt[] | null;
  getSalonPendingPaymentReceipts: (filter?: SalonReceiptFilterInput) => Promise<void>;
}

export const useSalonStore = create<SalonState>((set) => ({
  salons: null,
  selectedSalon: null,
  salonStaffs: [],
  salonReceipts: [],
  salonStaffBills: [],
  pendingPaymentReceipts: [],
  setSalons: (salons: Salon[]) => set({ salons }),
  selectSalon: (salon: Salon) => set({ selectedSalon: salon }),
  getMySalons: async () => {
    try {
      const res = await salonAPI.getMySalons();
      set({ salons: res.data.data });
    } catch (error) {
      console.error('get my-salons error:', error);
    }
  },
  onSelectedSalon: async (salon?: Salon) => {
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

      const res = await salonAPI.getSalonStaffs(Number(selectedSalon?.id));
      set({ salonStaffs: res.data.data });
      return res.data.data;

    } catch (error) {
      console.error(error);
      set({ salonStaffs: [] });
      return [];
    }
  },

  getSalonReceipts: async (filter) => {
    try {
      const { selectedSalon } = get();
      const filterInput: SalonReceiptFilterInput = {
        ...filter,
      }

      const res = await salonAPI.getSalonReceipts(Number(selectedSalon?.id), filterInput);
      console.log('res.data.data:', res.data.data);
      

      set({
        salonReceipts: res.data.data,
      });
    } catch (error) {
      console.error(error);
    }
  },

  getSalonPendingPaymentReceipts: async (filter) => {
    try {
      const { selectedSalon } = get();
      const filterInput: SalonReceiptFilterInput = {
        ...filter,
        payment_status: PaymentReceiptStatusEnums.PENDING
      }

      const res = await salonAPI.getSalonReceipts(Number(selectedSalon?.id), filterInput);
      set({
        pendingPaymentReceipts: res.data.data,
      });

    } catch (error) {
      console.error(error);
    }
  },

  getSalonStaffBills: async (filter) => {
    try {
      const { selectedSalon } = get();

      const filterInput: SalonReceiptFilterInput = {
        ...filter,
      }

      const res = await salonAPI.getSalonStaffReceipts(Number(selectedSalon?.id), filterInput);

      set({
        salonStaffBills: res.data.data,
        staffBillsSummary: {
          total_amount: res.data.total_amount,
          total_tip: res.data.total_tip,
          total_turn: res.data.total_turn
        }
      });
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


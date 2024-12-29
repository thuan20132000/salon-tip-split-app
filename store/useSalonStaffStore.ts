
// stores/useStaffStore.ts
import { create } from 'zustand';
import { StaffPriceType } from './usePaymentStore';
import { SalonStaffType } from '@/types/staff.types';
import { api } from '@/api/axios';
import { staffAPIs } from '@/api/staffAPIs';





export interface SalonStaffState {
  salonStaffs: SalonStaffType[];
  staffPriceList: StaffPriceType[];
  total: number;
  debit: number;
  cash: number;
  receive: number;
  return: number;
  discounts: {
    loyalty: number;   // 25%
    happyHour: number; // 15%
    discount: number;  // 5%
  };
  selectedPaymentStaffs: SalonStaffType[];
  // Actions
  // addStaff: (name: string) => void;
  // removeStaff: (id: string) => void;
  // updateStaffPrice: (id: string, price: number) => void;
  // updateStaffTip: (id: string, tip: number) => void;
  // setReceive: (amount: number) => void;
  // calculateTotal: () => void;
  // resetStore: () => void;
  // addPaymentStaffs: (staff: StaffType) => void;
  // removePaymentStaffs: (staff: StaffType) => void;
  // resetSelectedPaymentStaffs: () => void;
  getSalonStaffs: () => Promise<SalonStaffType[]>;
  selectPaymentStaff: (staff: SalonStaffType) => void;
}

export const useSalonStaffStore = create<SalonStaffState>((set, get) => ({
  salonStaffs: [],
  staffPriceList: [],
  total: 0,
  debit: 0,
  cash: 0,
  receive: 0,
  return: 0,
  discounts: {
    loyalty: 0,
    happyHour: 0,
    discount: 0,
  },
  selectedPaymentStaffs: [],

  async getSalonStaffs() {
    try {
      const res = await staffAPIs.getStaffs();
      set({ salonStaffs: res.data });
      return res.data;

    } catch (error) {
      console.error(error);
      return [];
    }
  },

  selectPaymentStaff(staff: SalonStaffType) {
    set((state) => {
      const selectedPaymentStaffs = state.selectedPaymentStaffs.includes(staff)
        ? state.selectedPaymentStaffs.filter((s) => s.id !== staff.id)
        : [...state.selectedPaymentStaffs, staff];
      return { selectedPaymentStaffs };
    });
  }


}));
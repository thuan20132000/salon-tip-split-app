// stores/useStaffStore.ts
import { create } from 'zustand';
import { StaffPriceType } from './usePaymentStore';

export type StaffType = {
  id: number | string;
  name: string;
  avatar?: string;
}



export interface StaffState {
  staffList: StaffType[];
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
  selectedPaymentStaffs: StaffType[];
  // Actions
  addStaff: (name: string) => void;
  removeStaff: (id: string) => void;
  updateStaffPrice: (id: string, price: number) => void;
  updateStaffTip: (id: string, tip: number) => void;
  setReceive: (amount: number) => void;
  calculateTotal: () => void;
  resetStore: () => void;
  addPaymentStaffs: (staff: StaffType) => void;
  removePaymentStaffs: (staff: StaffType) => void;
  resetSelectedPaymentStaffs: () => void;
}

const initialStaff: StaffType[] = [
  { id: '1', name: 'JONA', avatar: 'https://randomuser.me/api/portraits' },
  { id: '2', name: 'TRACY', avatar: 'https://randomuser.me/api/portraits' },
  { id: '3', name: 'LINDA', avatar: 'https://randomuser.me/api/portraits' },
  { id: '4', name: 'BRYAIN', avatar: 'https://randomuser.me/api/portraits' },
  { id: '5', name: 'LYN', avatar: 'https://randomuser.me/api/portraits' },
  { id: '6', name: 'EMMA', avatar: 'https://randomuser.me/api/portraits' },
  { id: '7', name: 'LINA *', avatar: 'https://randomuser.me/api/portraits' },
  { id: '8', name: 'MYNY', avatar: 'https://randomuser.me/api/portraits' },
  { id: '9', name: 'KY', avatar: 'https://randomuser.me/api/portraits' },
];

export const useStaffStore = create<StaffState>((set, get) => ({
  staffList: initialStaff,
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

  addStaff: (name: string) => {
    const newStaff: StaffType = {
      id: Date.now().toString(),
      name,
    };
    set((state) => ({
      staffList: [...state.staffList, newStaff],
    }));
  },

  removeStaff: (id: string) => {
    set((state) => ({
      staffList: state.staffList.filter((staff) => staff.id !== id),
    }));
  },

  updateStaffPrice: (id: string, price: number) => {
    set((state) => ({
      staffList: state.staffList.map((staff) =>
        staff.id === id ? { ...staff, price } : staff
      ),
    }));
    get().calculateTotal();
  },

  updateStaffTip: (id: string, tip: number) => {
    set((state) => ({
      staffList: state.staffList.map((staff) =>
        staff.id === id ? { ...staff, tip } : staff
      ),
    }));
  },

  setReceive: (amount: number) => {
    set({ receive: amount });
    const total = get().total;
    set({ return: amount - total });
  },

  calculateTotal: () => {
    const state = get();
    const subtotal = state.staffPriceList.reduce((sum, staff) => sum + staff.price, 0);

    // Calculate discounts
    const loyaltyDiscount = subtotal * 0.25; // 25%
    const happyHourDiscount = subtotal * 0.15; // 15%
    const generalDiscount = subtotal * 0.05; // 5%

    const total = subtotal - loyaltyDiscount - happyHourDiscount - generalDiscount;

    set({
      total,
      discounts: {
        loyalty: loyaltyDiscount,
        happyHour: happyHourDiscount,
        discount: generalDiscount,
      },
    });
  },

  addPaymentStaffs: (staff: StaffType) => {
    set((state) => ({
      selectedPaymentStaffs: [...state.selectedPaymentStaffs, staff],
    }));
  },
  removePaymentStaffs: (staff: StaffType) => {
    set((state) => ({
      selectedPaymentStaffs: state.selectedPaymentStaffs.filter((selected) => selected !== staff),
    }));
  },
  resetSelectedPaymentStaffs: () => {
    set({ selectedPaymentStaffs: [] });
  },


  resetStore: () => {
    set({
      staffList: initialStaff,
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
    });
  },
}));
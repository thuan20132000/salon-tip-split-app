// stores/usePaymentStore.ts
import { create } from 'zustand';
import { PaymentMethodsEnums, PaymentRatesEnums } from '@/enums/PaymentEnums';
import { StaffType } from './useStaffStore';
import { SalonStaffType } from '@/types/staff.types';
import { receiptAPIs } from '@/api/receiptAPI';
import { CreateSalonReceiptInput, CreateSalonReceiptType, SalonReceipt } from '@/types/receipt.type';
import { formatCurrency } from '@/utils/receiptUtils';

export type SalonPaymentMethodType = {
  method: string;
  price: number;
}

export type SalonStaffPriceType = {
  price: number;
  tip: number;
  staff: SalonStaffType;
}

export type SalonPaymentReceiptType = {
  id?: number;
  subtotal?: number;
  tip?: number;
  selectedPayment?: SalonPaymentMethodType;
  returnAmount?: number;
  staffs?: SalonStaffPriceType[];
  status?: string;
  note?: string;
  giftcardAmount?: number;
}

export type SalonReceiptFilterInputType = {
  date?: Date;
  staff?: SalonStaffType;
}

export interface SalonPaymentState {
  // Payment amounts
  selectedStaffs: SalonStaffPriceType[];
  paymentReceipt?: SalonPaymentReceiptType;
  subtotal: number;
  receive: number;
  tipPrice: number;
  cashPaymentPrice: number;
  selectedPayment?: {
    method: string;
    price: number;
  };
  isLoading: boolean;
  salonReceipts: SalonReceipt[];
  

  // Actions
  setSelectedStaffs: (staffs: SalonStaffPriceType[]) => void;
  updateStaffPrice: (index: number, price: number) => void;
  updateStaffTip: (index: number, tip: number) => void;
  setReceive: (amount: number) => void;
  setTipPrice: (amount: number) => void;
  setCashPaymentPrice: (amount: number) => void;
  selectPaymentMethod: (method: string, price: number) => void;
  calculatePayments: () => SalonPaymentCalculations;
  resetPayment: () => void;
  setSelectedPayment: (payment: SalonPaymentState['selectedPayment']) => void;
  setPaymentReceipt: (receipt: SalonPaymentReceiptType) => void;
  setIsLoading: (loading: boolean) => void;
  getSalonPaymentReceipts: () => Promise<SalonReceipt[]>;
  createSalonReceipt: (receipt: CreateSalonReceiptType) => Promise<SalonReceipt | null>;
}

interface SalonPaymentCalculations {
  subtotal: number;
  debitPayment: number;
  cashPayment: number;
  loyaltyDiscount: number;
  happyHourDiscount: number;
  cashGeneralDiscount: number;
  debitGeneralDiscount: number;
  debitPaymentPrice: number;
  returnAmount: string;
  isPayable: boolean;
  giftcardPaymentWithCash: number;
  giftcardPaymentWithDebit: number;
  isGiftcardPayment: boolean;
}


export const useSalonPaymentStore = create<SalonPaymentState>((set, get) => ({
  selectedStaffs: [],
  subtotal: 0,
  receive: 0,
  tipPrice: 0,
  cashPaymentPrice: 0,
  selectedPayment: undefined,
  paymentReceipt: undefined,
  isLoading: false,
  salonReceipts: [],

  getSalonPaymentReceipts: async () => {
    try {
      const res = await receiptAPIs.getSalonReceipts();
      set({ salonReceipts: res.data });
      return res.data;

    } catch (error) {
      console.error(error);
      return [];
    }
  },

  setIsLoading(loading) {
    set({ isLoading: loading });
  },
  
  setSelectedStaffs: (staffs) => {
    set({ selectedStaffs: staffs });
  },

  updateStaffPrice: (index, price) => {
    set((state) => {
      const newStaffs = [...state.selectedStaffs];
      newStaffs[index] = { ...newStaffs[index], price };
      return {
        selectedStaffs: newStaffs,
        selectedPayment: undefined,
        receive: 0
      };
    });
  },

  updateStaffTip: (index, tip) => {
    set((state) => {
      const newStaffs = [...state.selectedStaffs];
      newStaffs[index] = { ...newStaffs[index], tip };
      return { selectedStaffs: newStaffs };
    });
  },

  setReceive: (amount) => {
    set({ receive: amount });
  },

  setTipPrice: (amount) => {
    set((state) => {
      // Update staff tips based on new tip amount and prices
      const subtotal = state.paymentReceipt?.staffs?.reduce((sum, staff) => sum + staff.price, 0) || 0;
      const newStaffs = state.paymentReceipt?.staffs?.map(staff => ({
        ...staff,
        tip: Number((staff.price * (amount / subtotal)).toFixed(2)) || 0
      }));

      return {
        tipPrice: amount,
        paymentReceipt: {
          ...state.paymentReceipt,
          staffs: newStaffs
        }
      };
    });
  },

  setCashPaymentPrice: (amount) => {
    set({ cashPaymentPrice: amount });
  },

  setSelectedPayment(payment) {
    set({ selectedPayment: payment });
  },

  selectPaymentMethod: (method, price) => {
    const receiveFormatted = new Intl.NumberFormat('en-CA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

    set({
      selectedPayment: { method, price },
      receive: Number(receiveFormatted),
      cashPaymentPrice: 0
    });
  },
  setPaymentReceipt(receipt) {
    set({ paymentReceipt: receipt });
  },
  calculatePayments: () => {
    const state = get();
    const subtotal = state.paymentReceipt?.staffs?.reduce((sum, staff) => sum + staff.price, 0) || 0;
    const tax = subtotal * PaymentRatesEnums.TAX_RATE;

    // Calculate by payment method
    const debitPayment = subtotal + tax;
    const cashPayment = debitPayment - (debitPayment * PaymentRatesEnums.CASH_OFF);

    // Calculate discounts
    const loyaltyDiscount = debitPayment - (debitPayment * PaymentRatesEnums.LOYALTY);
    const happyHourDiscount = debitPayment - (debitPayment * PaymentRatesEnums.HAPPY_HOUR);
    const cashGeneralDiscount = cashPayment - (cashPayment * PaymentRatesEnums.DISCOUNT);
    const debitGeneralDiscount = debitPayment - (debitPayment * PaymentRatesEnums.DISCOUNT);

    // Calculate combination payment
    const debitPaymentPrice = state.paymentReceipt?.selectedPayment?.method === PaymentMethodsEnums.COMBINATION_CASH_DEBIT
      ? cashPayment - state.cashPaymentPrice + ((cashPayment - state.cashPaymentPrice) * PaymentRatesEnums.CASH_OFF)
      : 0;

    const returnAmount = formatCurrency((Number(state.receive) - Number(state.paymentReceipt?.selectedPayment?.price)));
    const isPayable = !!state.paymentReceipt?.selectedPayment?.method;

    let giftcardAmount = state.paymentReceipt?.giftcardAmount || 0;
    const giftcardPaymentWithCash = ((subtotal + (subtotal * PaymentRatesEnums.TAX_RATE)) - giftcardAmount) - ((subtotal + (subtotal * PaymentRatesEnums.TAX_RATE) - giftcardAmount) * PaymentRatesEnums.CASH_OFF)


    const giftcardPaymentWithDebit = debitPayment - giftcardAmount

    console.log('giftcardPaymentWithCash:: ', giftcardPaymentWithCash);
    console.log('giftcardPaymentWithDebit:: ', giftcardPaymentWithDebit);
    
    const isGiftcardPayment = state.paymentReceipt?.selectedPayment?.method === PaymentMethodsEnums.GIFT_CARD_CASH || state.paymentReceipt?.selectedPayment?.method === PaymentMethodsEnums.GIFT_CARD_DEBIT || state.paymentReceipt?.selectedPayment?.method === PaymentMethodsEnums.GIFT_CARD;

    return {
      subtotal,
      debitPayment,
      cashPayment,
      loyaltyDiscount,
      happyHourDiscount,
      cashGeneralDiscount,
      debitGeneralDiscount,
      debitPaymentPrice,
      returnAmount,
      isPayable,
      giftcardPaymentWithCash,
      giftcardPaymentWithDebit,
      isGiftcardPayment
    };
  },

  resetPayment: () => {
    set({
      selectedStaffs: [],
      subtotal: 0,
      receive: 0,
      tipPrice: 0,
      cashPaymentPrice: 0,
      selectedPayment: undefined
    });
    set({ paymentReceipt: undefined });
  },
  
  createSalonReceipt: async (receipt) => {
    try {
      const res = await receiptAPIs.createSalonReceipt(receipt);
      console.log('====================================');
      console.log('Create Salon Receipt: ', res.data);
      console.log('====================================');
      return res.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
  
}));
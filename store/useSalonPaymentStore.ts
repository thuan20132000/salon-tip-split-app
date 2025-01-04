// stores/usePaymentStore.ts
import { create } from 'zustand';
import { PaymentDiscountRateEnums, PaymentMethodsEnums, PaymentRatesEnums } from '@/enums/PaymentEnums';
import { StaffType } from './useStaffStore';
import { SalonStaffType } from '@/types/staff.types';
import { receiptAPIs } from '@/api/receiptAPI';
import { CreateSalonReceiptInput, CreateSalonReceiptType, PaymentInvoiceDetailType, SalonReceipt, SalonReceiptFilterInput, SalonStaffPriceType, StaffBillType } from '@/types/receipt.type';
import { formatCurrency, getCashPayment, getDebitPayment, getSubtotalDiscountPrice, getSubtotalWithoutDiscountPrice, getTotalServicePrice, handleDiscountPrice } from '@/utils/receiptUtils';
import dayjs from 'dayjs';

export type SalonPaymentMethodType = {
  method: string;
  price: number;
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

// export type SalonReceiptFilterInputType = {
//   date?: Date;
//   staff?: SalonStaffType;
// }

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
  selectedPaymentStaffs: SalonStaffType[];



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
  getSalonPaymentReceipts: (filter?: SalonReceiptFilterInput) => Promise<SalonReceipt[]>;
  createSalonReceipt: (receipt: CreateSalonReceiptType) => Promise<SalonReceipt | null>;
  addStaffBillDiscount: (staff: SalonStaffPriceType, discount: PaymentDiscountRateEnums) => void;
  selectPaymentStaff: (staff: SalonStaffType) => void;
  resetSelectedPaymentStaffs: () => void;
  setSelectedPaymentStaffs: (staff?: SalonStaffType[]) => void;
  getSalonPaymentReceipt: (id: number) => Promise<SalonReceipt | null>;

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
  paymentInvoice: PaymentInvoiceDetailType;
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
  selectedPaymentStaffs: [],
  getSalonPaymentReceipts: async (filter) => {
    try {

      let filter_params: SalonReceiptFilterInput = {
        ...filter,
        created_at: filter?.created_at || dayjs(new Date()).format('YYYY-MM-DD'),
      }

      const res = await receiptAPIs.getSalonReceipts(filter_params);
      set({ salonReceipts: res.data });
      return res.data;

    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getSalonPaymentReceipt: async (id) => {
    try {
      const res = await receiptAPIs.getSalonReceipt(id);
      set({
        paymentReceipt: {
          id: res.data.id,
          subtotal: Number(res.data.sub_total_amount),
          tip: Number(res.data.tip_total_amount),
          selectedPayment: {
            method: String(res.data.payment_method),
            price: Number(res.data.payment_method_price)
          },
          returnAmount: 0,
          // staffs: res.data.staff_receipts,
          // status: res.data.status,
          // note: res.data.note,
          // giftcardAmount: res.data.giftcardAmount
        }
      });
      return res.data;
    } catch (error) {
      console.error(error);
      return null;
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
        tip: Number((staff.price * (amount / subtotal)).toFixed(2)) || 0,
      })) || [];

      return {
        tipPrice: amount,
        paymentReceipt: {
          ...state.paymentReceipt,
          staffs: newStaffs
        }
      };
    });
  },

  addStaffBillDiscount: (staff, discount) => {
    set((state) => {
      const newStaffs = state.paymentReceipt?.staffs?.map(s => {
        if (s.staff.id === staff.staff.id) {
          if (discount <= PaymentDiscountRateEnums.DISC_0_PERCENT) {
            return { ...s, discount_price: 0 };
          }

          let discountPrice = handleDiscountPrice(s.price, discount);
          return { ...s, discount_price: discountPrice, discount_percent: discount };
        }
        return s;
      });
      return {
        paymentReceipt: {
          ...state.paymentReceipt,
          staffs: newStaffs
        }
      }
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
    // const subtotal = state.paymentReceipt?.staffs?.reduce((sum, staff) => sum + staff.price, 0) || 0;
    // const tax = subtotal * PaymentRatesEnums.TAX_RATE;
    let subtotal = getSubtotalWithoutDiscountPrice(state.paymentReceipt?.staffs);
    let total_service_price = getTotalServicePrice(state.paymentReceipt?.staffs);

    // Calculate by payment method
    const debitPayment = getDebitPayment(subtotal) + getSubtotalDiscountPrice(state.paymentReceipt?.staffs);
    const cashPayment = getCashPayment(subtotal) + getSubtotalDiscountPrice(state.paymentReceipt?.staffs);

    // Calculate discounts
    const loyaltyDiscount = debitPayment - (debitPayment * PaymentRatesEnums.LOYALTY);
    const happyHourDiscount = debitPayment - (debitPayment * PaymentRatesEnums.HAPPY_HOUR);
    const cashGeneralDiscount = cashPayment - (cashPayment * PaymentRatesEnums.DISCOUNT);
    const debitGeneralDiscount = debitPayment - (debitPayment * PaymentRatesEnums.DISCOUNT);

    // Calculate combination payment
    const debitPaymentPrice = state.paymentReceipt?.selectedPayment?.method === PaymentMethodsEnums.COMBINATION_CASH_DEBIT
      ? cashPayment - state.cashPaymentPrice + ((cashPayment - state.cashPaymentPrice) * PaymentRatesEnums.CASH_OFF)
      : 0;

    const returnAmount = (Number(state.receive) - Number(state.paymentReceipt?.selectedPayment?.price)).toFixed(2) || '0';
    const isPayable = !!state.paymentReceipt?.selectedPayment?.method;

    let giftcardAmount = state.paymentReceipt?.giftcardAmount || 0;


    const giftcardPaymentWithCash = ((subtotal + (subtotal * PaymentRatesEnums.TAX_RATE)) - giftcardAmount) - ((subtotal + (subtotal * PaymentRatesEnums.TAX_RATE) - giftcardAmount) * PaymentRatesEnums.CASH_OFF)


    const giftcardPaymentWithDebit = debitPayment - giftcardAmount

    const isGiftcardPayment = state.paymentReceipt?.selectedPayment?.method === PaymentMethodsEnums.GIFT_CARD_CASH || state.paymentReceipt?.selectedPayment?.method === PaymentMethodsEnums.GIFT_CARD_DEBIT || state.paymentReceipt?.selectedPayment?.method === PaymentMethodsEnums.GIFT_CARD;


    const paymentInvoice: PaymentInvoiceDetailType = {
      payment_method: state.paymentReceipt?.selectedPayment?.method,
      staff_services: state.paymentReceipt?.staffs,
      total_service_amount: total_service_price,
      total_tip_amount: state.paymentReceipt?.staffs?.reduce((sum, staff) => sum + staff.tip, 0) || 0
    }

    // console.log('====================================');
    // console.log('paymentInvoice:: ', paymentInvoice);
    // console.log('====================================');

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
      isGiftcardPayment,
      paymentInvoice

    };
  },

  selectPaymentStaff: (staff) => {
    set((state) => {
      let selectedStaffs = [...state.selectedPaymentStaffs];
      if (selectedStaffs.includes(staff)) {
        selectedStaffs = selectedStaffs.filter((s) => s.id !== staff.id);
      }
      else {
        selectedStaffs.push(staff);
      }

      console.log('====================================');
      console.log('selecedStaffs:: ', selectedStaffs);
      console.log('====================================');
      return { selectedPaymentStaffs: selectedStaffs };
    });
  },

  setSelectedPaymentStaffs: (staffs?: SalonStaffType[]) => {
    set({ selectedPaymentStaffs: staffs });
  },

  resetPayment: () => {
    set({
      selectedStaffs: [],
      subtotal: 0,
      receive: 0,
      tipPrice: 0,
      cashPaymentPrice: 0,
      selectedPayment: undefined,
      paymentReceipt: undefined,
    });
  },

  resetSelectedPaymentStaffs: () => {
    set({ selectedPaymentStaffs: [] });
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
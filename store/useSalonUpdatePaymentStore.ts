// stores/usePaymentStore.ts
import { create } from 'zustand';
import { PaymentDiscountRateEnums, PaymentMethodsEnums, PaymentRatesEnums } from '@/enums/PaymentEnums';
import { StaffType } from './useStaffStore';
import { SalonStaffType } from '@/types/staff.types';
import { receiptAPIs } from '@/api/receiptAPI';
import { CreateSalonReceiptInput, CreateSalonReceiptType, PaymentInvoiceDetailType, SalonReceipt, SalonStaffPriceType, StaffBillType } from '@/types/receipt.type';
import { formatCurrency, getCashPayment, getDebitPayment, handleDiscountPrice } from '@/utils/receiptUtils';
import { getSubtotalDiscountPrice, getSubtotalWithoutDiscountPrice, getTotalServicePrice } from '@/utils/receiptUpdateUtils';



interface Staff {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string;
  address: string;
  gender: 'M' | 'F';
  date_of_birth: string | null;
  hire_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}


// Example type guard to check if a payment method is valid
// function isValidPaymentMethod(method: string): method is SalonReceipt['payment_method'] {
//   return ['CASH', 'CARD', 'DIGITAL'].includes(method);
// }

// // Example type guard to check if a payment status is valid
// function isValidPaymentStatus(status: string): status is SalonReceipt['payment_status'] {
//   return ['PAID', 'PENDING', 'CANCELLED'].includes(status);
// }

// Optional: Helper type for monetary values
type MonetaryAmount = string;

// Optional: Helper function to parse monetary amounts
function parseMonetaryAmount(amount: MonetaryAmount): number {
  return parseFloat(amount);
}


export {
  // isValidPaymentMethod,
  // isValidPaymentStatus,
  parseMonetaryAmount
};

export type SalonPaymentReceiptType = {
  id?: number;
  subtotal?: number;
  tip?: number;
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

export interface SalonPaymentUpdateState {
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
  selectedSalonReceipt?: SalonReceipt;



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
  setSelectedPayment: (payment: SalonPaymentUpdateState['selectedPayment']) => void;
  setPaymentReceipt: (receipt: SalonPaymentReceiptType) => void;
  setIsLoading: (loading: boolean) => void;
  createSalonReceipt: (receipt: CreateSalonReceiptType) => Promise<SalonReceipt | null>;
  addStaffBillDiscount: (staff: StaffBillType, discount: PaymentDiscountRateEnums) => void;
  selectPaymentStaff: (staff: SalonStaffType) => void;
  resetSelectedPaymentStaffs: () => void;
  setSelectedPaymentStaffs: (staff?: SalonStaffType[]) => void;
  getSalonPaymentReceipt: (id: number) => Promise<SalonReceipt | null>;
  setSelectedSalonReceipt: (receipt: SalonReceipt) => void;
  onUpdateTipRate: (amount: number) => void;

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
  returnAmount: string | number;
  isPayable: boolean;
  giftcardPaymentWithCash: number;
  giftcardPaymentWithDebit: number;
  isGiftcardPayment: boolean;
  // paymentInvoice: PaymentInvoiceDetailType;
}


export const useSalonPaymentUpdateStore = create<SalonPaymentUpdateState>((set, get) => ({
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
  getSalonPaymentReceipts: async () => {
    try {
      const res = await receiptAPIs.getSalonReceipts();
      // set({ salonReceipts: res.data });
      return res.data;

    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getSalonPaymentReceipt: async (id) => {
    try {
      const res = await receiptAPIs.getSalonReceipt(id);
      set({ selectedSalonReceipt: res.data });
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

  onUpdateTipRate: (amount) => {
    set((state) => {

      const subtotal = getTotalServicePrice(state.selectedSalonReceipt?.staff_receipts);

      const newStaffsReceipts = state.selectedSalonReceipt?.staff_receipts?.map(staff => ({
        ...staff,
        tip_amount: Number((Number(staff.service_amount) * (amount / subtotal)).toFixed(2)) || 0,
      })) || [];

      return {
        tipPrice: amount,
        selectedSalonReceipt: {
          ...state.selectedSalonReceipt,
          staff_receipts: newStaffsReceipts,
          tip_total_amount: amount
        }
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
        if (s.staff.id === staff.id) {
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
    let subtotal = getSubtotalWithoutDiscountPrice(state.selectedSalonReceipt?.staff_receipts);
    // let total_service_price = getTotalServicePrice(state.paymentReceipt?.staffs);

    // Calculate by payment method
    const debitPayment = getDebitPayment(subtotal) + getSubtotalDiscountPrice(state.selectedSalonReceipt?.staff_receipts);
    const cashPayment = getCashPayment(subtotal) + getSubtotalDiscountPrice(state.selectedSalonReceipt?.staff_receipts);

    // Calculate discounts
    const loyaltyDiscount = debitPayment - (debitPayment * PaymentRatesEnums.LOYALTY);
    const happyHourDiscount = debitPayment - (debitPayment * PaymentRatesEnums.HAPPY_HOUR);
    const cashGeneralDiscount = cashPayment - (cashPayment * PaymentRatesEnums.DISCOUNT);
    const debitGeneralDiscount = debitPayment - (debitPayment * PaymentRatesEnums.DISCOUNT);

    // Calculate combination payment
    const debitPaymentPrice = state.selectedSalonReceipt?.payment_method === PaymentMethodsEnums.COMBINATION_CASH_DEBIT
      ? cashPayment - state.cashPaymentPrice + ((cashPayment - state.cashPaymentPrice) * PaymentRatesEnums.CASH_OFF)
      : 0;

    const returnAmount = (Number(state.receive) - Number(state.selectedSalonReceipt?.payment_method_price));
    const isPayable = !!state.selectedSalonReceipt?.payment_method;

    // Calculate giftcard payment
    let gift_value = state.selectedSalonReceipt?.gift_value || 0;
    const giftcardPaymentWithCash = ((subtotal + (subtotal * PaymentRatesEnums.TAX_RATE)) - gift_value) - ((subtotal + (subtotal * PaymentRatesEnums.TAX_RATE) - gift_value) * PaymentRatesEnums.CASH_OFF)


    const giftcardPaymentWithDebit = debitPayment - gift_value


    const isGiftcardPayment = state.selectedSalonReceipt?.payment_method === PaymentMethodsEnums.GIFT_CARD_CASH || state.selectedSalonReceipt?.payment_method === PaymentMethodsEnums.GIFT_CARD_DEBIT || state.selectedSalonReceipt?.payment_method === PaymentMethodsEnums.GIFT_CARD;


    // const paymentInvoice: PaymentInvoiceDetailType = {
    //   payment_method: state.selectedSalonReceipt?.payment_method,
    //   staff_services: state.selectedSalonReceipt?.staff_receipts,
    //   total_service_amount: total_service_price,
    //   total_tip_amount: state.selectedSalonReceipt?.staffs?.reduce((sum, staff) => sum + staff.tip, 0) || 0
    // }

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

    };
  },

  selectPaymentStaff: (staff) => {
    set((state) => {
      const selectedStaffs = [...state.selectedPaymentStaffs];
      const index = selectedStaffs.findIndex(s => s.id === staff.id);
      if (index > -1) {
        selectedStaffs.splice(index, 1);
      } else {
        selectedStaffs.push(staff);
      }
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
      selectedPayment: undefined
    });
    set({ paymentReceipt: undefined });
  },

  resetSelectedPaymentStaffs: () => {
    set({ selectedPaymentStaffs: [], selectedSalonReceipt: undefined });
  },

  createSalonReceipt: async (receipt) => {
    try {
      const res = await receiptAPIs.createSalonReceipt(receipt);
      return res.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  setSelectedSalonReceipt: (receipt) => {
    set({ selectedSalonReceipt: receipt });
  },



}));
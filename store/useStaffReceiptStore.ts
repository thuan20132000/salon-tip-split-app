import { create } from 'zustand';
import { SalonStaffPriceType } from './useSalonPaymentStore';
import { StaffBillType, StaffReceiptFilterInput, StaffReceiptSummary } from '@/types/receipt.type';
import { receiptAPIs } from '@/api/receiptAPI';



export interface StaffReceiptStore {
  staffBills: StaffBillType[];
  staffBillsSummary?: StaffReceiptSummary;
  // addReceipt: (receipt: StaffBillType) => void;
  // removeReceipt: (id: string) => void;
  getStaffReceipts: (filter_input?: StaffReceiptFilterInput) => Promise<StaffBillType[]>;
}

const useStaffReceiptStore = create<StaffReceiptStore>((set) => ({
  staffBills: [],
  staffBillsSummary: undefined,
  getStaffReceipts: async (filter_input?: StaffReceiptFilterInput) => {
    try {
      const staffBills = await receiptAPIs.getStaffReceipts(filter_input);


      set({
        staffBills: staffBills.data.data,
        staffBillsSummary: {
          total_amount: staffBills.data.total_amount,
          total_tip: staffBills.data.total_tip,
          total_turn: staffBills.data.total_turn
        }
      });

      return staffBills.data.data;

    } catch (error) {
      console.error(error);
      return [];
    }
  },


}));

export default useStaffReceiptStore;
import { PaymentReceiptType } from "@/store/usePaymentStore";

// types/receipt.ts
export interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface Staff {
  staff: {
    id: string;
    name: string;
    // Add other staff properties as needed
  };
  price: number;
  tip: number;
}



export interface Receipt extends PaymentReceiptType {
  id: string;
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
  // returnAmount: number;
  // selectedPayment: PaymentMethod;
  // staffs: Staff[];
  status: 'paid' | 'pending' | 'cancelled';
  // subtotal: number;
  // tip: number;
}

export interface GroupedReceipts {
  title: string;
  data: Receipt[];
}

// types/salon-receipt.types.ts

import { PaymentMethodsEnums, PaymentReceiptStatusEnums } from "@/enums/PaymentEnums";
import { SalonStaffType } from "./staff.types";

// Payment status enum
export type PaymentStatus = 'PENDING' | 'PAID';

// Payment status options interface
export interface PaymentStatusOption {
  value: PaymentStatus;
  label: string;
}

// Payment status choices
export const PAYMENT_STATUS_CHOICES: PaymentStatusOption[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' }
];

// Main receipt interface
// export interface SalonReceipt {
//   id?: number;
//   sub_total_amount?: number | null;
//   return_amount?: number | null;
//   tip_total_amount?: number | null;
//   payment_method?: string | null;
//   payment_method_price?: number;
//   payment_status?: PaymentStatus;
//   created_at?: string; // ISO datetime string
//   updated_at?: string; // ISO datetime string
//   staff_receipts?: StaffBillType[];
// }
export interface SalonReceipt {
  id?: number;
  staff_receipts?: StaffBillType[];
  sub_total_amount?: string | null;
  return_amount?: string | null;
  tip_total_amount?: string | number | null;
  payment_method?: PaymentMethodsEnums;
  payment_method_price?: string;
  gift_value?: number | null;
  payment_status?: 'PAID' | 'PENDING' | 'CANCELLED';
  created_at?: string | null;
  updated_at?: string | null;
  custom_discount?: number | null;
  bonus_amount?: number | null;
  total_amount?: number | null;

}

export interface SalonReceiptUpdateType {
  id?: number;
  staff_receipts?: StaffBillUpdateType[];
  sub_total_amount?: string | null;
  return_amount?: string | null;
  tip_total_amount?: string | number | null;
  payment_method?: PaymentMethodsEnums;
  payment_method_price?: string;
  gift_value?: number | null;
  payment_status?: 'PAID' | 'PENDING' | 'CANCELLED';
  created_at?: string | null;
  updated_at?: string | null;
  salon?: number;
  custom_discount?: number | null;
  bonus_amount?: number | null;
  total_amount?: string | null;
}

export interface StaffBillType {
  id?: number;
  staff?: SalonStaffType | null;
  service_amount: number | null;
  service_name: string | null;
  receipt?: any;
  tip_amount: number | null;
  discount_price?: number | null;
  discount_percent?: number | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface StaffBillUpdateType {
  id?: number;
  staff?: number;
  service_amount: number | null;
  service_name: string | null;
  receipt?: any;
  tip_amount: number | null;
  discount_price?: number | null;
  discount_percent?: number | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CreateStaffBillInputType {
  staff: number;
  service_amount?: number | null;
  tip_amount?: number | null;
  service_name?: string;
  discount_price?: string | number;
  discount_percent?: string | number;
  status?: boolean;
  created_at?: string | null;
  updated_at?: string | null;

}

export interface UpdateStaffBillInputType {
  id: number;
  staff: number;
  service_amount: number;
  tip_amount: number;
  service_name?: string;
  discount_price?: number;
  discount_percent?: number;
  status?: boolean;
}

export interface UpdateSalonReceiptInputType {
  id?: number;
  staff_receipts?: UpdateStaffBillInputType[];
  sub_total_amount?: string | null;
  return_amount?: string | null;
  tip_total_amount?: string | null;
  payment_method?: PaymentMethodsEnums;
  payment_method_price?: string;
  payment_status?: 'PAID' | 'PENDING' | 'CANCELLED';
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CreateSalonReceiptType {
  sub_total_amount?: string | null;
  return_amount?: string | null;
  tip_total_amount?: string | null;
  payment_method?: string | null;
  payment_method_price?: number | string;
  staff_receipts?: CreateStaffBillInputType[];
  payment_status?: PaymentReceiptStatusEnums;
  salon?: number;
  created_at?: string | Date | null;
  updated_at?: string | Date | null;
  custom_discount?: number | null;
  bonus_amount?: number | string | null;
  total_amount?: number | string | null;
}

// Type for creating a new receipt (partial type without auto-generated fields)
export type CreateSalonReceiptInput = Omit<SalonReceipt, 'id' | 'created_at' | 'updated_at'>;

// Type for updating a receipt (all fields optional except id)
export type UpdateSalonReceiptInput = Partial<Omit<SalonReceipt, 'id'>> & { id: number };

// Helper type for handling decimal values in forms
export interface SalonReceiptForm extends Omit<SalonReceipt, 'sub_total_amount' | 'return_amount' | 'tip_total_amount' | 'payment_method_price'> {
  sub_total_amount: string | null;
  return_amount: string | null;
  tip_total_amount: string | null;
  payment_method_price: string;
}

export interface StaffReceiptFilterInput {
  staff?: SalonStaffType | number;
  salon?: number;
  created_at_after?: Date | string;
  created_at_before?: Date | string;
}

export interface SalonReceiptFilterInput {
  created_at_range_after?: Date | string;
  created_at_range_before?: Date | string;
  created_at?: Date | string;
  staff?: number;
  salon?: number;
}

export interface StaffReceiptSummary {
  total_amount: number;
  total_tip: number;
  total_turn: number;
}

// Example usage:
// const newReceipt: CreateSalonReceiptInput = {
//   sub_total_amount: '100.50',
//   return_amount: 0,
//   tip_total_amount: 20.00,
//   payment_method: 'CREDIT_CARD',
//   payment_method_price: 120.50,
//   payment_status: 'PENDING'
// };

// const updateReceipt: UpdateSalonReceiptInput = {
//   id: 1,
//   payment_status: 'PAID',
//   tip_total_amount: 25.00
// };

export type SalonStaffPriceType = {
  service_name?: string;
  service_price?: number;
  discount_price: number;
  discount_percent?: number;
  price: number;
  tip: number;
  staff: SalonStaffType;
}

export interface PaymentInvoiceDetailType {
  id?: number;
  staff_services?: SalonStaffPriceType[];
  total_service_amount: number;
  total_tip_amount: number;
  payment_method?: string;

}


export interface PaymentInvoiceDetailUpdateType {
  id?: number;
  staff_services?: StaffBillType[];
  total_service_amount: number;
  total_tip_amount: number;
  payment_method?: string;

}

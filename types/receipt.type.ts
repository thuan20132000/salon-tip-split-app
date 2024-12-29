
// types/salon-receipt.types.ts

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
export interface SalonReceipt {
  id?: number;
  sub_total_amount: number | null;
  return_amount: number | null;
  tip_total_amount: number | null;
  payment_method: string | null;
  payment_method_price: number;
  payment_status: PaymentStatus;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
  staff_receipts?: SalonStaffType[];
}

export interface StaffBillType {
  staff?: number | null;
  service_amount: number | null;
  service_name: string | null;
  receipt: number | null;
  tip_amount: number | null;
  status?: string | null;
}

export interface CreateSalonReceiptType {
  sub_total_amount?: number | null;
  return_amount?: number | null;
  tip_total_amount?: number | null;
  payment_method?: string | null;
  payment_method_price?: number;
  staff_bills?: StaffBillType[] | null;
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

// Example usage:
const newReceipt: CreateSalonReceiptInput = {
  sub_total_amount: 100.50,
  return_amount: 0,
  tip_total_amount: 20.00,
  payment_method: 'CREDIT_CARD',
  payment_method_price: 120.50,
  payment_status: 'PENDING'
};

const updateReceipt: UpdateSalonReceiptInput = {
  id: 1,
  payment_status: 'PAID',
  tip_total_amount: 25.00
};
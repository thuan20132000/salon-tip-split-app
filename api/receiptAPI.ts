import { api } from "./axios";
import { CreateSalonReceiptType, SalonReceipt } from "@/types/receipt.type";

export const receiptAPIs = {
  getSalonReceipts: () => api.get<SalonReceipt[]>('/receipt/'),
  createSalonReceipt: (data: CreateSalonReceiptType) => api.post<SalonReceipt>('/receipt/create-receipt/', data),
};
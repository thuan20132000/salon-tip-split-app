import { ApiResponse, StaffReceiptApiResponseType } from "@/types/api.types";
import { api } from "./axios";
import { CreateSalonReceiptType, SalonReceipt, StaffBillType, StaffReceiptFilterInput, UpdateSalonReceiptInputType } from "@/types/receipt.type";

export const receiptAPIs = {
  getSalonReceipts: () => api.get<SalonReceipt[]>('/receipt/'),
  createSalonReceipt: (data: CreateSalonReceiptType) => api.post<SalonReceipt>('/receipt/create-receipt/', data),
  getStaffReceipts: (query_data?: StaffReceiptFilterInput) => api.get<StaffReceiptApiResponseType<StaffBillType[]>>(`/staff-receipt/`,{
    params: query_data,
  }),
  getSalonReceipt: (id: number) => api.get<SalonReceipt>(`/receipt/${id}/`),
  updateSalonReceipt: (id: number, data?: SalonReceipt) => api.put<SalonReceipt>(`/receipt/${id}/update-receipt/`, data),
};
import { ApiResponse, StaffReceiptApiResponseType } from "@/types/api.types";
import { api } from "./axios";
import { CreateSalonReceiptType, SalonReceipt, SalonReceiptFilterInput, SalonReceiptUpdateType, StaffBillType, StaffReceiptFilterInput, UpdateSalonReceiptInputType } from "@/types/receipt.type";

export const receiptAPIs = {
  getSalonReceipts: (query_data?: SalonReceiptFilterInput) => api.get<SalonReceipt[]>('/receipt/', {
    params: query_data,
  }),
  createSalonReceipt: (data: CreateSalonReceiptType) => api.post<SalonReceipt>('/receipt/create-receipt/', data),
  getStaffReceipts: (query_data?: StaffReceiptFilterInput) => api.get<StaffReceiptApiResponseType<StaffBillType[]>>(`/staff-receipt/`, {
    params: query_data,
  }),
  getSalonReceipt: (id: number) => api.get<SalonReceipt>(`/receipt/${id}/`),
  updateSalonReceipt: (id: number, data?: SalonReceiptUpdateType) => api.put<SalonReceipt>(`/receipt/${id}/update-receipt/`, data),
  deleteSalonReceipt: (id: number) => api.delete(`/receipt/${id}/`),
  deleteStaffReceipt: (id: number) => api.delete(`/staff-receipt/${id}/delete/`),
};
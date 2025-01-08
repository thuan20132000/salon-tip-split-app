import { api } from "./axios";
import { Salon } from "@/types/user.type";
import { ApiResponse, StaffReceiptApiResponseType } from '../types/api.types';
import { SalonStaffType } from "@/types/staff.types";
import { SalonReceipt, SalonReceiptFilterInput, StaffBillType } from "@/types/receipt.type";

export const salonAPI = {
  getMySalons: () => api.get<ApiResponse<Salon[]>>('/salons/my-salons/'),
  getSalonStaffs: (salon_id: number | string) => api.get<ApiResponse<SalonStaffType[]>>(`/salons/${salon_id}/staffs/`),
  getSalonReceipts: (salon_id: number | string, filter: SalonReceiptFilterInput) => api.get<ApiResponse<SalonReceipt[]>>(`/salons/${salon_id}/receipts/`, {
    params: filter
  }),
  getSalonStaffReceipts: (salon_id: number | string, filter: SalonReceiptFilterInput) => api.get<StaffReceiptApiResponseType<StaffBillType[]>>(`/salons/${salon_id}/staff-receipts/`, {
    params: filter
  }),
  createSalonReceipt: (salon_id: number | string, data: Partial<SalonReceipt>) => api.post<ApiResponse<SalonReceipt>>(`/salons/${salon_id}/create-receipt/`, data),
};
import { api } from "./axios";
import { Salon } from "@/types/user.type";
import { ApiResponse, StaffReceiptApiResponseType } from '../types/api.types';
import { CreateStaffAccountInput, SalonStaffType, UpdateSalonStaffInput } from "@/types/staff.types";
import { SalonReceipt, SalonReceiptFilterInput, StaffBillType } from "@/types/receipt.type";
import { SalonReportApiResponse, SalonSalaryReportFilterType, SalonSalaryReportResponseType, SalonSalaryReportType, StaffSalaryReportFilterType, StaffSalaryReportResponseType } from "@/types/report.types";
import { SalonServiceType } from "@/types/salon.types";

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
  getStaffStatistics: (salon_id: number | string, filter: SalonSalaryReportFilterType) => api.get<SalonReportApiResponse<SalonSalaryReportType[]>>(`/salons/${salon_id}/staff-receipts-statistics/`, {
    params: filter
  }),
  getStaffSalaryReport: (salon_id: number | string, filter: StaffSalaryReportFilterType) => api.get<StaffSalaryReportResponseType>(`/salons/${salon_id}/staff-service-revenue/`, {
    params: filter
  }),
  addSalonStaff: (data: Partial<CreateStaffAccountInput>) => api.post<ApiResponse<SalonStaffType>>(`/salons/${data.salon_id}/add-staff/`, data),
  updateSalonStaff: (data: Partial<UpdateSalonStaffInput>) => api.put<ApiResponse<SalonStaffType>>(`/salons/${data.salon_id}/update-staff/`, data),

  // Salon Services
  getSalonServices: (salon_id: number | string) => api.get<ApiResponse<SalonServiceType[]>>(`/salons/${salon_id}/services/`),
  addSalonService: (salon_id: number | string, data: Partial<SalonServiceType>) => api.post<ApiResponse<SalonServiceType>>(`/salons/${salon_id}/create-service/`, data),
  updateSalonService: (salon_id: number | string, data: Partial<SalonServiceType>) => api.put<ApiResponse<SalonServiceType>>(`/salons/${salon_id}/update-service/`, data),
};
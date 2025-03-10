import { api } from "./axios";
import { Salon } from "@/types/user.type";
import { ApiResponse, StaffReceiptApiResponseType } from '../types/api.types';
import { CreateStaffAccountInput, SalonStaffType, UpdateSalonStaffInput } from "@/types/staff.types";
import { SalonReceipt, SalonReceiptFilterInput, StaffBillType } from "@/types/receipt.type";
import { SalonReportApiResponse, SalonSalaryReportFilterType, SalonSalaryReportResponseType, SalonSalaryReportType, StaffSalaryReportFilterType, StaffSalaryReportResponseType, SalonRevenueReportType, SalonRevenueReportFilterType, SalonStaffSalaryReportType, SalonStaffSalaryReportFilterType, SalonStaffSalaryReportSummaryType, SalonStaffSalaryReportResponseType  } from "@/types/report.types";
import { SalonServiceType, StaffServiceType, StaffServiceFilterType, UpdateStaffServiceType, StaffTurnServiceFilterType, SalonSettingsType } from "@/types/salon.types";
import { StaffTurn } from "@/types/turn.types";

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
  
  getSalonStaffSalaryReport: (salon_id: number | string, filter: SalonStaffSalaryReportFilterType) => api.get<  SalonStaffSalaryReportResponseType>(`/salons/${salon_id}/salon-revenue-statistics/`, {
    params: filter
  }),

  // Salon Services
  getSalonServices: (salon_id: number | string) => api.get<ApiResponse<SalonServiceType[]>>(`/salons/${salon_id}/services/`),
  addSalonService: (salon_id: number | string, data: Partial<SalonServiceType>) => api.post<ApiResponse<SalonServiceType>>(`/salons/${salon_id}/create-service/`, data),
  updateSalonService: (salon_id: number | string, data: Partial<SalonServiceType>) => api.put<ApiResponse<SalonServiceType>>(`/salons/${salon_id}/update-service/`, data),

  // Staff Services
  getStaffServices: (salon_id: number | string, filter: StaffServiceFilterType) => api.get<ApiResponse<StaffServiceType[]>>(`/salons/${salon_id}/staff-skills/`, {
    params: filter
  }),
  addStaffService: (salon_id: number | string, data: Partial<StaffServiceType>) => api.post<ApiResponse<StaffServiceType>>(`/salons/${salon_id}/staff-skills/`, data),
  updateStaffService: (salon_id: number | string, data: Partial<UpdateStaffServiceType>) => api.put<ApiResponse<StaffServiceType>>(`/salons/${salon_id}/update-staff-skill/`, data),
  deleteStaffService: (salon_id: number | string, service_id: number | string) => api.delete<ApiResponse<StaffServiceType>>(`/salons/${salon_id}/staff-skills/${service_id}/`),

  // Staff Turn Services
  getStaffTurnServices: (salon_id: number | string, filter: StaffTurnServiceFilterType) => api.get<ApiResponse<StaffTurn[]>>(`/salons/${salon_id}/staff-turn-services/`, {
    params: filter
  }),

  // Salon Settings
  getSalonSettings: (salon_id: number | string) => api.get<ApiResponse<SalonSettingsType>>(`/salons/${salon_id}/settings/`),
  updateSalonSettings: (salon_id: number | string, data: Partial<SalonSettingsType>) => api.put<ApiResponse<SalonSettingsType>>(`/salons/${salon_id}/update-settings/`, data),

  // Send Salon Staff Bills to Email
  sendReceiptEmail: (salon_id: number | string, staff_id: number | string, receipt_date: string) => api.get<ApiResponse<void>>(`/salons/${salon_id}/send-receipt-email/`, {
    params: {
      staff: staff_id,
      created_at: receipt_date
    }
  }),
};
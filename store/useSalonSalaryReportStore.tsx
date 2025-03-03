
import { salonAPI } from '@/api/salonAPI';
import { SalonReportSummaryType, SalonSalaryReportFilterType, SalonSalaryReportType, StaffSalaryReportFilterType, StaffSalaryReportType, SalonRevenueReportFilterType, SalonRevenueReportType, SalonStaffSalaryReportType, SalonStaffSalaryReportFilterType, SalonStaffSalaryReportSummaryType } from '@/types/report.types';
import { create } from 'zustand';
import { useSalonStore } from './useSalonStore';
import { SalonStaffType } from '@/types/staff.types';



export interface SalonSalaryReportState {
  salaryReport: SalonSalaryReportType[];
  summary: SalonReportSummaryType;
  staffSalaryReport: StaffSalaryReportType[];
  getSalaryReport: (filter: SalonSalaryReportFilterType) => Promise<void>;
  getStaffSalaryReport: (filter: StaffSalaryReportFilterType) => Promise<void>;
  resetSalaryReport: () => void;
  resetStaffSalaryReport: () => void;
  // getSalonRevenueReport: (filter: SalonRevenueReportFilterType) => Promise<void>;
  salonRevenueReport: SalonRevenueReportType[];
  salonStaffSalaryReport: SalonStaffSalaryReportType[];
  salonStaffSalaryReportSummary: SalonStaffSalaryReportSummaryType;
  getSalonStaffSalaryReport: (filter: SalonStaffSalaryReportFilterType) => Promise<void>;
}

const useSalonSalaryReportStore = create<SalonSalaryReportState>((set) => ({
  salaryReport: [],
  salonStaffSalaryReportSummary: {
    total_service_amount: 0,
    total_tip_amount: 0,
    total_turn: 0,
    total_commission_amount: 0,
  },
  staffSalaryReport: [],
  summary: {
    total_service_amount: 0,
    total_tip_amount: 0,
    total_turn: 0,
    total_commission_amount: 0,
  },
  salonRevenueReport: [],
  reportStaffs: [],
  salonStaffSalaryReport: [],
  getSalaryReport: async (filter) => {
    try {
      let selectedSalon = useSalonStore.getState().selectedSalon;
      const res = await salonAPI.getStaffStatistics(Number(selectedSalon?.id), filter);

      set({ salaryReport: res.data.data, summary: res.data.summary });
    } catch (error) {
      console.error('get staff-receipts-statistics error:', error);
    }
  },
  getStaffSalaryReport: async (filter) => {
    try {
      let selectedSalon = useSalonStore.getState().selectedSalon;
      const res = await salonAPI.getStaffSalaryReport(Number(selectedSalon?.id), filter);

      set({ staffSalaryReport: res.data.data, summary: res.data.summary });
    } catch (error) {
      set({ staffSalaryReport: [], summary: { total_service_amount: 0, total_tip_amount: 0, total_turn: 0, total_commission_amount: 0 } });
      console.error('get staff-salary-statistics error:', error);
    }
  },
  resetSalaryReport: () => {
    set({ salaryReport: [], summary: { total_service_amount: 0, total_tip_amount: 0, total_turn: 0, total_commission_amount: 0 } });
  },
  resetStaffSalaryReport: () => {
    set({ staffSalaryReport: [], summary: { total_service_amount: 0, total_tip_amount: 0, total_turn: 0, total_commission_amount: 0 } });
  },
  getSalonStaffSalaryReport: async (filter) => {
    try {
      let selectedSalon = useSalonStore.getState().selectedSalon;
      const res = await salonAPI.getSalonStaffSalaryReport(Number(selectedSalon?.id), filter);
      set({
        salonStaffSalaryReport: res.data.data,
        salonStaffSalaryReportSummary: res.data.summary
      });
    } catch (error) {
      console.error('get salon-staff-salary-report error:', error);
    }
  }

}));

export default useSalonSalaryReportStore;
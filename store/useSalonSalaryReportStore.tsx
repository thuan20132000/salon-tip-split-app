
import { salonAPI } from '@/api/salonAPI';
import { SalonReportSummaryType, SalonSalaryReportFilterType, SalonSalaryReportType } from '@/types/report.types';
import { create } from 'zustand';
import { useSalonStore } from './useSalonStore';
import { SalonStaffType } from '@/types/staff.types';



export interface SalonSalaryReportState {
  salaryReport: SalonSalaryReportType[];
  summary: SalonReportSummaryType;
  getSalaryReport: (filter: SalonSalaryReportFilterType) => Promise<void>;
}

const useSalonSalaryReportStore = create<SalonSalaryReportState>((set) => ({
  salaryReport: [],
  summary: {
    total_service_amount: 0,
    total_tip_amount: 0,
    total_turn: 0,
  },
  reportStaffs: [],
  getSalaryReport: async (filter) => {
    try {
      let selectedSalon = useSalonStore.getState().selectedSalon;
      const res = await salonAPI.getStaffStatistics(Number(selectedSalon?.id), filter);
      console.log('====================================');
      console.log('filter:: ', filter);
      
      console.log('get staff-receipts-statistics: ', res.data);

      set({ salaryReport: res.data.data, summary: res.data.summary });
    } catch (error) {
      console.error('get staff-receipts-statistics error:', error);
    }
  },
}));

export default useSalonSalaryReportStore;
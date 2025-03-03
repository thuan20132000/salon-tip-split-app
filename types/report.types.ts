export type SalonSalaryReportType = {
  date: string;
  total_service_amount: number;
  total_tip_amount: number;
  total_discount_amount?: number;
  total_turn?: number;
  staff_name?: string;
  staff_id?: number;
};

export type SalonSalaryReportResponseType = {
  data: SalonSalaryReportType[];
  status: number;
  message: string;
};

export interface SalonSalaryReportFilterType {
  created_at_range_after?: Date | string;
  created_at_range_before?: Date | string;
  created_at?: Date | string;
  staff?: number;
  salon?: number;
}

export type SalonRevenueReportType = {
  date: string;
  total_service_amount: number;
  total_tip_amount: number;
  total_turn?: number;
}

export interface SalonRevenueReportFilterType {
  created_at_range_after?: Date | string;
  created_at_range_before?: Date | string;
  created_at?: Date | string;
  staff_id?: number;
}

export type StaffSalaryReportType = {
  date: string;
  total_service_amount: number;
  total_tip_amount: number;
  total_turn?: number;
  staff_id?: string;
  staff__first_name?: string;
  staff__commission_rate?: string;
  service_revenue?: string;
  commission_amount?: string;

};

export interface SalonStaffSalaryReportFilterType {
  created_at_range_after?: Date | string;
  created_at_range_before?: Date | string;
  created_at?: Date | string;
  staff_id?: number;
}

export type SalonStaffSalaryReportType = {
  date: string;
  total_service_amount: number;
  total_tip_amount: number;
  total_turn?: number;
  staff_id?: string;
  staff__first_name?: string;
  staff__commission_rate?: string;
  commission_amount?: string;
}

export type SalonStaffSalaryReportResponseType = {
  data: SalonStaffSalaryReportType[];
  status: number;
  message: string;
  summary: SalonStaffSalaryReportSummaryType;
}

export type SalonStaffSalaryReportSummaryType = {
  total_service_amount: number;
  total_tip_amount: number;
  total_turn: number;
  total_commission_amount: number;
}


export type StaffSalaryReportResponseType = {
  data: StaffSalaryReportType[];
  status: number;
  message: string;
  summary: SalonReportSummaryType;
};

export interface StaffSalaryReportFilterType {
  created_at_range_after?: Date | string;
  created_at_range_before?: Date | string;
  created_at?: Date | string;
  staff?: number;
  salon?: number;
}

export type SalonReportSummaryType = {
  total_service_amount: number;
  total_tip_amount: number;
  total_turn: number;
  total_commission_amount: number;
};


export interface SalonReportApiResponse<T> {
  data: T;
  status: number | string | null;
  message: string;
  summary: SalonReportSummaryType;
}
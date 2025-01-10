export type SalonSalaryReportType = {
  date: string;
  total_service_amount: number;
  total_tip_amount: number;
  total_discount_amount?: number;
  total_turn?: number;
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

export type SalonReportSummaryType = {
  total_service_amount: number;
  total_tip_amount: number;
  total_turn: number;
};


export interface SalonReportApiResponse<T> {
  data: T;
  status: number | string | null;
  message: string;
  summary: SalonReportSummaryType;
}
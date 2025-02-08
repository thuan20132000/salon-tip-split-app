import { SalonStaffType } from "./staff.types";
import { SalonServiceType } from "./salon.types";
export interface StaffTurn {
  id: number;
  staff?: SalonStaffType;
  turns: Turn[];
  last_turn?: Turn | null;
}

export interface Turn {
  id?: number;
  services?: SalonServiceType[];
  created_at: string;
  updated_at: string;
  status?: string;
  sub_total?: number;
  custom_price?: number;
  discount_percentage?: number;
  discount_amount?: number;
  total?: number;
}

export interface TurnService {
  id: number;
  name?: string;
  price?: number;
  duration?: number;
  created_at?: string;
  updated_at?: string;
}

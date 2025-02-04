import { SalonStaffType } from "./staff.types";

export interface StaffTurn {
  id: number;
  staff?: SalonStaffType;
  turns: Turn[];
  last_turn?: Turn | null;
}

export interface Turn {
  id?: number;
  services?: TurnService[];
  created_at: string;
  updated_at: string;
  status?: string;
}

export interface TurnService {
  id: number;
  name?: string;
  price?: number;
  duration?: number;
  created_at?: string;
  updated_at?: string;
}

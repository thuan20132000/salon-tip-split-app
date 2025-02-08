import { User } from "./user.type";

interface Salon {
  id: number;
  name: string;
  address: string;
  phone: string | null;
  email: string;
  created_at: string;
  updated_at: string;
  owner: User;
}

// Optional: Type for creating a new salon
interface CreateSalonDto {
  name: string;
  address?: string;
  phone?: string;
  email: string;
}

// Optional: Type for updating a salon
interface UpdateSalonDto {
  name?: string;
  address?: string;
  phone?: string | null;
  email?: string;
}

type SalonServiceType = {
  id: number;
  name: string;
  price: string;
  duration?: string;
  category?: string;
  description?: string;
  is_active?: boolean;
  online_booking?: boolean;
  checking_in?: boolean;
  salon_id?: number;
}
type StaffServiceType = {
  id: number;
  skill: SalonServiceType;
  staff: number;
  custom_price?: number;
  custom_duration?: number;
  custom_description?: string;
  is_active?: boolean;
  updated_at?: string;
  created_at?: string;
}

type UpdateStaffServiceType = {
  id?: number;
  staff_id?: number;
  skill_id?: number;
  is_active?: boolean;
  custom_price?: number;
  custom_duration?: number;
  custom_description?: string;
}

type StaffServiceFilterType = {
  staff_id?: number;
  salon_id?: number;
}

type StaffTurnServiceFilterType = {
  salon_id?: number;
}

// Type guard
function isSalon(obj: any): obj is Salon {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.created_at === 'string' &&
    typeof obj.updated_at === 'string'
  );
}

export type {
  Salon,
  CreateSalonDto,
  UpdateSalonDto,
  SalonServiceType,
  StaffServiceType,
  StaffServiceFilterType,
  UpdateStaffServiceType,
  StaffTurnServiceFilterType
};

export {
  isSalon
};
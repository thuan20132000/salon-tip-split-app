import { Salon } from "./salon.types";
import { TurnService } from "./turn.types";

export type Gender = 'M' | 'F' | 'O';

export interface GenderOption {
  value: Gender;
  label: string;
}

export const GENDER_CHOICES: GenderOption[] = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'O', label: 'Other' }
];

export interface SalonStaffType {
  id?: number;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string;
  address?: string | null;
  gender?: Gender;
  date_of_birth?: string | null; // ISO date string 'YYYY-MM-DD'
  hire_date?: string; // ISO date string 'YYYY-MM-DD'
  is_active?: boolean;
  created_at?: string; // ISO datetime string
  updated_at?: string; // ISO datetime string
  salon?: Salon; // Salon ID or name
  role?: string;
  commission_rate?: string;
  avatar?: string;
  skills?: TurnService[];
}

// For creating new staff member (partial type without auto-generated fields)
export type CreateStaffInput = Omit<SalonStaffType, 'id' | 'created_at' | 'updated_at'>;

// For updating staff member (all fields optional except id)
export type UpdateStaffInput = Partial<Omit<SalonStaffType, 'id'>> & { id: number };

// For create a staff account
export type CreateStaffAccountInput = {
  phone: string;
  first_name: string;
  email: string;
  salon_id?: number;
  commission_rate: number;
};

// For updating a staff account
export type UpdateSalonStaffInput = Partial<CreateStaffAccountInput> & { id: number };

// Example usage:
const newStaff: CreateStaffInput = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  address: '123 Main St',
  gender: 'M',
  date_of_birth: '1990-01-01',
  hire_date: '2024-01-01',
  is_active: true
};

const updateStaff: UpdateStaffInput = {
  id: 1,
  first_name: 'Johnny',
  email: 'johnny@example.com'
};



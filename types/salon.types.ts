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
  UpdateSalonDto
};

export {
  isSalon
};
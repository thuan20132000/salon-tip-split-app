import { SalonStaffType } from "./staff.types";

interface User {
  id: number;
  password: string;
  last_login: string | null;
  is_superuser: boolean;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  groups: any[];
  user_permissions: any[];
  staff_detail?: SalonStaffType
}

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

// Optional: Type guard to check if an object is a Salon
function isSalon(obj: any): obj is Salon {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'owner' in obj
  );
}

// JWT token response
interface AuthTokens {
  access: string;
  refresh: string;
}

// Complete authentication response
interface LoginResponse {
  user: User;
  refresh: string;
  access: string;
}

// Login request payload
interface LoginCredentials {
  username: string;
  password: string;
}

// Register request payload
interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

// Token refresh request payload
interface RefreshTokenRequest {
  refresh: string;
}


interface UserDeviceType {
  id?: number;
  device_id: string;
  device_type?: string;
  user?: number;
  active?: boolean;
  last_used?: string;
  created_at?: string;
  updated_at?: string;
}

interface UserDeviceRegisterRequest {
  device_id: string;
}

export type {
  User,
  Salon,
  AuthTokens,
  LoginResponse,
  LoginCredentials,
  RegisterCredentials,
  RefreshTokenRequest,
  UserDeviceType,
  UserDeviceRegisterRequest
};
export { isSalon };
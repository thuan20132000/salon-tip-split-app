// types/api.types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface APIError {
  message: string;
  code: string;
  status: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number | string | null;
  message: string;
}

export interface StaffReceiptApiResponseType<T> {
  data: T;
  status: number;
  message: string;
  total_amount: number;
  total_tip: number;
  total_turn: number;
}

export interface APIErrorType {
  message: string;
  code: string;
  status: number;
}
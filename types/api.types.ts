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
  count: number;
  next: string | null;
  previous: string | null;
  result: T;  // Changed from 'data' to 'result'
}
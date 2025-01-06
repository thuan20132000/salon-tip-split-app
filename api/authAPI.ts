import { api } from "./axios";
import { LoginResponse } from "@/types/user.type";

export const authAPI = {
  login: (username: string, password: string) => api.post<LoginResponse>('/login/',
    {
      username,
      password
    }
  ),
};
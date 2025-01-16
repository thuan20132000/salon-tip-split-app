import { ApiResponse } from "@/types/api.types";
import { api } from "./axios";
import { LoginResponse, UserDeviceRegisterRequest, UserDeviceType } from "@/types/user.type";

export const authAPI = {
  login: (username: string, password: string) => api.post<LoginResponse>('/login/',
    {
      username,
      password
    }
  ),
  registerUserDevice: (userDevice: UserDeviceRegisterRequest) => api.post<ApiResponse<UserDeviceType>>('/user-devices/register-device/', userDevice),
  unregisterUserDevice: (userDevice: UserDeviceRegisterRequest) => api.
  post('/user-devices/unregister-device/', userDevice),
};
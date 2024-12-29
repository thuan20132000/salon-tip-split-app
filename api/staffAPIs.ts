import { User } from "@/types/api.types";
import { api } from "./axios";
import { SalonStaffType } from "@/types/staff.types";
import { ApiResponse } from '../types/api.types';

export const staffAPIs = {
  getProfile: () => api.get<User>('/user/profile'),

  updateProfile: (data: Partial<Omit<User, 'id'>>) =>
    api.put<User>('/user/profile', data),

  updateAvatar: (formData: FormData) =>
    api.put<User>('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getStaffs: () => api.get<SalonStaffType[]>('/staff/'),

};
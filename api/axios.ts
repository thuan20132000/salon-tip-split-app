// api/axios.ts
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { AuthResponse, APIError } from '../types/api.types';
import * as SecureStore from 'expo-secure-store';

const API_URL = "http://192.168.2.226:8000/api/";
// const API_URL = "https://salon-tipsplit-dev.thuandev.site/api/";
// const API_URL = "https://salon-tipsplit-dev-v2.thuandev.site/api/";

class APIClient {
  private static instance: APIClient;
  private api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config) => {
        const tokens = await SecureStore.getItemAsync('tokens');
        const token = tokens ? JSON.parse(tokens).access : null;
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // Handle 401 (Unauthorized) - Token expired
        // if (
        //   error.response?.status === 401 &&
        //   originalRequest &&
        //   !(originalRequest as any)._retry
        // ) {
        //   (originalRequest as any)._retry = true;

        //   try {
        //     const refreshToken = await SecureStore.getItemAsync('refreshToken');
        //     const response = await this.api.post<AuthResponse>('/auth/refresh', {
        //       refreshToken,
        //     });

        //     // Save new tokens
        //     await SecureStore.setItemAsync('userToken', response.data.accessToken);
        //     await SecureStore.setItemAsync(
        //       'refreshToken',
        //       response.data.refreshToken
        //     );

        //     // Retry original request
        //     if (originalRequest.headers) {
        //       originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        //     }
        //     return this.api(originalRequest);
        //   } catch (refreshError) {
        //     await this.clearTokens();
        //     return Promise.reject(this.handleError(refreshError as AxiosError));
        //   }
        // }

        console.log('====================================');
        console.log('ErrorAxios:', error);
        console.log('ErrorMessage: ', error.message);
        console.log('====================================');
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): APIError {
    const errorData = error.response?.data as { message?: string; code?: string } || {};
    return {
      message: errorData.message || 'An unexpected error occurred',
      code: errorData.code || 'UNKNOWN_ERROR',
      status: error.response?.status || 500,
    };
  }

  private async clearTokens(): Promise<void> {
    // await SecureStore.deleteItemAsync('userToken');
    // await SecureStore.deleteItemAsync('refreshToken');
  }

  public getAxiosInstance(): AxiosInstance {
    return this.api;
  }
}

export const api = APIClient.getInstance().getAxiosInstance();


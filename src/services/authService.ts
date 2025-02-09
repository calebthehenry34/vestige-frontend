import axios, { AxiosInstance } from 'axios';
import { API_URL } from '../config';
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
  ProfileUpdateData,
  OnboardingData,
  TokenUpdatable,
} from '../types/auth';

class AuthService extends TokenUpdatable {
  private api: AxiosInstance;

  constructor() {
    super();
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      async (config) => {
        const token = await this.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = await this.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await axios.post<AuthResponse>(
              `${API_URL}/auth/refresh`,
              { refreshToken }
            );

            await this.updateTokens(
              response.data.accessToken,
              response.data.refreshToken
            );

            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            await this.logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginCredentials): Promise<User> {
    const response = await this.api.post<AuthResponse>('/auth/login', credentials);
    await this.updateTokens(response.data.accessToken, response.data.refreshToken);
    return response.data.user;
  }

  async register(credentials: RegisterCredentials): Promise<User> {
    const response = await this.api.post<AuthResponse>('/auth/register', credentials);
    await this.updateTokens(response.data.accessToken, response.data.refreshToken);
    return response.data.user;
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (refreshToken) {
        await this.api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      await this.updateTokens('', '');
      localStorage.removeItem('user');
    }
  }

  async updateProfile(data: ProfileUpdateData): Promise<User> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await this.api.put<{ user: User }>('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const updatedUser = response.data.user;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }

  async completeOnboarding(data: OnboardingData): Promise<User> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await this.api.post<{ user: User }>('/users/onboarding', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const updatedUser = response.data.user;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.api.get<{ user: User }>('/auth/me');
      const user = response.data.user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      return null;
    }
  }

  async updateTokens(accessToken: string, refreshToken: string): Promise<void> {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  async getAccessToken(): Promise<string | null> {
    if (this.accessToken) {
      return this.accessToken;
    }
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.accessToken = token;
    }
    return token;
  }

  async getRefreshToken(): Promise<string | null> {
    if (this.refreshToken) {
      return this.refreshToken;
    }
    const token = localStorage.getItem('refreshToken');
    if (token) {
      this.refreshToken = token;
    }
    return token;
  }

  isUserRestricted(user: User | null): boolean {
    return user?.accountStatus === 'restricted';
  }
}

export const authService = new AuthService();

export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  bio?: string;
  profilePicture?: string;
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
  profileVisibility: 'public' | 'private';
  emailNotifications: boolean;
  accountStatus: 'active' | 'pending' | 'suspended' | 'restricted';
}

export abstract class TokenUpdatable {
  public accessToken: string = '';
  public refreshToken: string = '';

  abstract updateTokens(accessToken: string, refreshToken: string): Promise<void>;
  abstract getAccessToken(): Promise<string | null>;
  abstract getRefreshToken(): Promise<string | null>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
}

export interface OnboardingData {
  displayName: string;
  bio?: string;
  profilePicture?: File;
}

export interface ProfileUpdateData {
  displayName?: string;
  bio?: string;
  profilePicture?: File;
  profileVisibility?: 'public' | 'private';
  emailNotifications?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuthError {
  message: string;
  errors?: {
    [key: string]: string[];
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
}

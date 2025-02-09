import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { User, AuthContextType, ProfileUpdateData, OnboardingData } from '../types/auth';
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const user = await authService.login({ email, password });
      setUser(user);

      if (!user.onboardingComplete) {
        navigate('/onboarding');
      } else {
        navigate('/profile');
      }

      console.log('Successfully logged in');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to login';
      console.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      setIsLoading(true);
      const user = await authService.register({ email, password, username });
      setUser(user);
      navigate('/onboarding');
      console.log('Registration successful! Please complete your profile.');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to register';
      console.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      navigate('/login');
      console.log('Successfully logged out');
    } catch (error: any) {
      console.error('Failed to logout');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: ProfileUpdateData) => {
    try {
      setIsLoading(true);
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      console.log('Profile updated successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      console.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async (data: OnboardingData) => {
    try {
      setIsLoading(true);
      const updatedUser = await authService.completeOnboarding(data);
      setUser(updatedUser);
      navigate('/profile');
      console.log('Onboarding completed successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to complete onboarding';
      console.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

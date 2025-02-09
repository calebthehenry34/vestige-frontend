import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_URL } from '../config';

interface RetryConfig {
  maxRetries?: number;
  initialDelay?: number;
  shouldRetry?: (error: AxiosError) => boolean;
}

const defaultRetryConfig: Required<RetryConfig> = {
  maxRetries: 3,
  initialDelay: 1000,
  shouldRetry: (error: AxiosError): boolean => {
    const status = error.response?.status;
    return status === 429 || (status !== undefined && status >= 500 && status <= 599);
  },
};

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

async function retryRequest<T>(
  config: AxiosRequestConfig,
  retryConfig: Required<RetryConfig>,
  attempt = 1
): Promise<AxiosResponse<T>> {
  try {
    return await axiosInstance.request<T>(config);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (retryConfig.shouldRetry(error) && attempt < retryConfig.maxRetries) {
        const delay = retryConfig.initialDelay * Math.pow(2, attempt - 1);
        console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`, {
          error: error.message,
        });
        await new Promise((resolve) => setTimeout(resolve, delay));
        return retryRequest<T>(config, retryConfig, attempt + 1);
      }
    }
    throw error;
  }
}

export const useApi = () => {
  const request = async <T>(
    config: AxiosRequestConfig,
    retryConfig?: RetryConfig
  ): Promise<AxiosResponse<T>> => {
    const finalRetryConfig = {
      ...defaultRetryConfig,
      ...retryConfig,
    };

    try {
      return await retryRequest<T>(config, finalRetryConfig);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'An unexpected error occurred';
        console.error(message);
      } else {
        console.error('An unexpected error occurred');
      }
      throw error;
    }
  };

  return { request };
};

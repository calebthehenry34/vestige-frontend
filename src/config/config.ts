interface Config {
  API_URL: string;
  WS_URL: string;
  ENV: string;
  VERSION: string;
  FEATURES: {
    PWA: boolean;
    ANALYTICS: boolean;
  };
  CDN_URL: string;
  AUTH: {
    JWT_EXPIRY: string;
    REFRESH_TOKEN_EXPIRY: string;
  };
  TIMEOUTS: {
    API: number;
    AUTH: number;
    UPLOAD: number;
  };
}

const config: Config = {
  API_URL: process.env.REACT_APP_API_URL || 'https://www.getvestige.com/api',
  WS_URL: process.env.REACT_APP_WEBSOCKET_URL || 'wss://www.getvestige.com',
  ENV: process.env.REACT_APP_ENV || 'development',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  FEATURES: {
    PWA: process.env.REACT_APP_ENABLE_PWA === 'true',
    ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  },
  CDN_URL: process.env.REACT_APP_CDN_URL || 'https://cdn.vestige.social',
  AUTH: {
    JWT_EXPIRY: process.env.REACT_APP_JWT_EXPIRY || '7d',
    REFRESH_TOKEN_EXPIRY: process.env.REACT_APP_REFRESH_TOKEN_EXPIRY || '30d',
  },
  TIMEOUTS: {
    API: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000', 10),
    AUTH: parseInt(process.env.REACT_APP_AUTH_TIMEOUT || '30000', 10),
    UPLOAD: parseInt(process.env.REACT_APP_UPLOAD_TIMEOUT || '300000', 10),
  },
};

// Helper functions
export const getImageUrl = (key: string): string => {
  if (!key) return `${config.CDN_URL}/default-avatar.png`;
  if (key.startsWith('http')) return key;
  return `${config.CDN_URL}/${key}`;
};

export const isProduction = (): boolean => config.ENV === 'production';
export const isDevelopment = (): boolean => config.ENV === 'development';

export default config;

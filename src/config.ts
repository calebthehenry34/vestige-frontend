export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
export const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001';

export const CLOUDFRONT_URL = process.env.REACT_APP_CLOUDFRONT_URL || '';
export const S3_BUCKET = process.env.REACT_APP_S3_BUCKET || '';
export const AWS_REGION = process.env.REACT_APP_AWS_REGION || 'us-east-2';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime'];

export const MAX_CAPTION_LENGTH = 2200;
export const MAX_COMMENT_LENGTH = 1000;
export const MAX_USERNAME_LENGTH = 30;
export const MAX_DISPLAY_NAME_LENGTH = 50;
export const MAX_BIO_LENGTH = 150;

export const PASSWORD_MIN_LENGTH = 8;
export const USERNAME_REGEX = /^[a-zA-Z0-9._]+$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const DEFAULT_AVATAR = '/images/default-avatar.png';
export const DEFAULT_COVER = '/images/default-cover.jpg';

export const ITEMS_PER_PAGE = 10;
export const SEARCH_DEBOUNCE_MS = 300;

export const NOTIFICATION_TIMEOUT = 5000;
export const MAX_NOTIFICATIONS = 100;

export const SOCKET_RECONNECT_ATTEMPTS = 5;
export const SOCKET_RECONNECT_DELAY = 1000;

export const API_TIMEOUT = 30000;
export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000;

export const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
export const MAX_CACHE_SIZE = 100;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ONBOARDING: '/onboarding',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  EXPLORE: '/explore',
  POST: '/p',
  ADMIN: '/admin',
};

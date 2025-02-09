import { EMAIL_REGEX, USERNAME_REGEX, PASSWORD_MIN_LENGTH, MAX_USERNAME_LENGTH, MAX_DISPLAY_NAME_LENGTH, MAX_BIO_LENGTH } from '../config';

interface ValidationErrors {
  [key: string]: string;
}

export const validateForm = (fields: { [key: string]: string }): ValidationErrors => {
  const errors: ValidationErrors = {};

  Object.entries(fields).forEach(([key, value]) => {
    switch (key) {
      case 'email':
        if (!value) {
          errors[key] = 'Email is required';
        } else if (!EMAIL_REGEX.test(value)) {
          errors[key] = 'Invalid email format';
        }
        break;

      case 'password':
        if (!value) {
          errors[key] = 'Password is required';
        } else if (value.length < PASSWORD_MIN_LENGTH) {
          errors[key] = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
        }
        break;

      case 'confirmPassword':
        if (!value) {
          errors[key] = 'Please confirm your password';
        } else if (value !== fields.password) {
          errors[key] = 'Passwords do not match';
        }
        break;

      case 'username':
        if (!value) {
          errors[key] = 'Username is required';
        } else if (!USERNAME_REGEX.test(value)) {
          errors[key] = 'Username can only contain letters, numbers, dots, and underscores';
        } else if (value.length > MAX_USERNAME_LENGTH) {
          errors[key] = `Username cannot exceed ${MAX_USERNAME_LENGTH} characters`;
        }
        break;

      case 'displayName':
        if (!value) {
          errors[key] = 'Display name is required';
        } else if (value.length > MAX_DISPLAY_NAME_LENGTH) {
          errors[key] = `Display name cannot exceed ${MAX_DISPLAY_NAME_LENGTH} characters`;
        }
        break;

      case 'bio':
        if (value && value.length > MAX_BIO_LENGTH) {
          errors[key] = `Bio cannot exceed ${MAX_BIO_LENGTH} characters`;
        }
        break;

      default:
        if (!value && value !== '') {
          errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        }
    }
  });

  return errors;
};

export const formatServerValidationErrors = (error: any): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (error.response?.data?.errors) {
    Object.entries(error.response.data.errors).forEach(([key, value]) => {
      errors[key] = Array.isArray(value) ? value[0] : value as string;
    });
  }

  return errors;
};

export const isFormModified = <T extends { [key: string]: any }>(
  initialData: T,
  currentData: T
): boolean => {
  return Object.keys(initialData).some(key => initialData[key] !== currentData[key]);
};

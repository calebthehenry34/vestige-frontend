import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  helperText?: string;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  helperText?: string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerClassName = '',
  helperText,
  className = '',
  id,
  ...props
}) => (
  <div className={`form-group ${containerClassName}`}>
    {label && (
      <label htmlFor={id} className="form-label">
        {label}
      </label>
    )}
    <input
      id={id}
      className={`form-input ${error ? 'error' : ''} ${className}`}
      {...props}
    />
    {error && <div className="form-error">{error}</div>}
    {helperText && <div className="form-helper-text">{helperText}</div>}
  </div>
);

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  containerClassName = '',
  helperText,
  className = '',
  id,
  ...props
}) => (
  <div className={`form-group ${containerClassName}`}>
    {label && (
      <label htmlFor={id} className="form-label">
        {label}
      </label>
    )}
    <textarea
      id={id}
      className={`form-textarea ${error ? 'error' : ''} ${className}`}
      {...props}
    />
    {error && <div className="form-error">{error}</div>}
    {helperText && <div className="form-helper-text">{helperText}</div>}
  </div>
);

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  loadingText,
  variant = 'primary',
  fullWidth,
  className = '',
  disabled,
  ...props
}) => (
  <button
    className={`btn btn-${variant} ${fullWidth ? 'w-full' : ''} ${className}`}
    disabled={isLoading || disabled}
    {...props}
  >
    {isLoading ? loadingText || 'Loading...' : children}
  </button>
);

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`card ${className}`}>{children}</div>
);

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle }) => (
  <div className="card-header">
    <h2 className="card-title">{title}</h2>
    {subtitle && <p className="card-subtitle">{subtitle}</p>}
  </div>
);

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>{children}</div>
);

export const FormError: React.FC<{ error?: string }> = ({ error }) => {
  if (!error) return null;
  return <div className="form-error">{error}</div>;
};

export const FormSuccess: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  return <div className="form-success">{message}</div>;
};

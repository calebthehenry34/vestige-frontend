import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateForm } from '../../utils/validationUtils';
import { Input, Button, Card, CardHeader, CardBody, FormError } from '../Common/FormElements';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { login, isLoading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm({
      email: formData.email,
      password: formData.password,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await login(formData.email, formData.password);
    } catch (error) {
      // Error notifications are handled by the auth context
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader
          title="Welcome Back"
          subtitle="Sign in to your account"
        />
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormError error={errors.general} />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-500 hover:text-blue-400"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              loadingText="Signing in..."
              fullWidth
            >
              Sign In
            </Button>

            <div className="text-center mt-4">
              <span className="text-gray-400">Don't have an account? </span>
              <Link
                to="/register"
                className="font-medium text-blue-500 hover:text-blue-400"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;

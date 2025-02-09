import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateForm } from '../../utils/validationUtils';
import { Input, Button, Card, CardHeader, CardBody, FormError } from '../Common/FormElements';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { register, isLoading } = useAuth();

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
      username: formData.username,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await register(formData.email, formData.password, formData.username);
    } catch (error) {
      // Error notifications are handled by the auth context
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader
          title="Create Account"
          subtitle="Join our community"
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
              id="username"
              name="username"
              type="text"
              label="Username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              required
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />

            <Button
              type="submit"
              isLoading={isLoading}
              loadingText="Creating account..."
              fullWidth
            >
              Create Account
            </Button>

            <div className="text-center mt-4">
              <span className="text-gray-400">Already have an account? </span>
              <Link
                to="/login"
                className="font-medium text-blue-500 hover:text-blue-400"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Register;

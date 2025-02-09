import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { validateForm } from '../../utils/validationUtils';
import { Input, TextArea, Button, Card, CardHeader, CardBody, FormError } from '../Common/FormElements';

const OnboardingFlow: React.FC = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { completeOnboarding, isLoading } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
      if (errors.profilePicture) {
        setErrors(prev => ({ ...prev, profilePicture: '' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm({
      displayName: formData.displayName,
      bio: formData.bio,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await completeOnboarding({
        ...formData,
        profilePicture: profilePicture || undefined,
      });
    } catch (error) {
      // Error notifications are handled by the auth context
      console.error('Onboarding error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader
          title="Complete Your Profile"
          subtitle="Tell us a bit about yourself"
        />
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormError error={errors.general} />

            <div className="flex flex-col items-center mb-6">
              <div
                className="w-32 h-32 rounded-full bg-gray-700 mb-4 overflow-hidden"
                style={{
                  backgroundImage: previewUrl ? `url(${previewUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!previewUrl && (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <Input
                id="profilePicture"
                name="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                error={errors.profilePicture}
                containerClassName="w-full"
                label="Profile Picture"
              />
            </div>

            <Input
              id="displayName"
              name="displayName"
              type="text"
              label="Display Name"
              value={formData.displayName}
              onChange={handleChange}
              error={errors.displayName}
              required
            />

            <TextArea
              id="bio"
              name="bio"
              label="Bio"
              value={formData.bio}
              onChange={handleChange}
              error={errors.bio}
              placeholder="Tell others about yourself..."
              rows={4}
            />

            <Button
              type="submit"
              isLoading={isLoading}
              loadingText="Saving..."
              fullWidth
            >
              Complete Profile
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default OnboardingFlow;

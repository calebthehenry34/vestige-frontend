import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateForm } from '../../utils/validationUtils';
import { Input, TextArea, Button, Card, CardHeader, CardBody, FormError } from '../Common/FormElements';
import { ProfileUpdateData } from '../../types/auth';

const ProfileSettings: React.FC = () => {
  const { user, updateProfile, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProfileUpdateData>({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    profileVisibility: user?.profileVisibility || 'public',
    emailNotifications: user?.emailNotifications || true,
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profilePicture || null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        bio: user.bio || '',
        profileVisibility: user.profileVisibility,
        emailNotifications: user.emailNotifications,
      });
      setPreviewUrl(user.profilePicture || null);
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
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
      displayName: formData.displayName || '',
      bio: formData.bio || '',
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSaving(true);
      await updateProfile({
        ...formData,
        profilePicture: profilePicture || undefined,
      });
    } catch (error) {
      // Error notifications are handled by the auth context
      console.error('Profile update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader
            title="Profile Settings"
            subtitle="Manage your account preferences"
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

              <div className="flex items-center space-x-4">
                <Input
                  id="profileVisibility"
                  name="profileVisibility"
                  type="checkbox"
                  label="Make profile public"
                  checked={formData.profileVisibility === 'public'}
                  onChange={(e) => handleChange({
                    ...e,
                    target: {
                      ...e.target,
                      name: 'profileVisibility',
                      value: e.target.checked ? 'public' : 'private',
                    },
                  })}
                />

                <Input
                  id="emailNotifications"
                  name="emailNotifications"
                  type="checkbox"
                  label="Email notifications"
                  checked={formData.emailNotifications}
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="submit"
                  isLoading={isSaving}
                  loadingText="Saving..."
                >
                  Save Changes
                </Button>

                <Button
                  type="button"
                  variant="danger"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSettings;

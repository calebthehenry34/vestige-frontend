import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import UserSuggestions from './UserSuggestions';

const UsersPage = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen ${theme === 'dark-theme' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className={`text-lg font-headlines mb-6 ${theme === 'dark-theme' ? 'text-white' : 'text-black'}`}>
        </h1>
        <UserSuggestions />
      </div>
    </div>
  );
};

export default UsersPage;

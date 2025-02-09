import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { LocationRegular } from '@fluentui/react-icons';
import { getProfileImageUrl } from '../../utils/imageUtils';
import { debounce } from 'lodash';

const PostReviewScreen = ({ images, onBack, onPublish, user }) => {
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState(null);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const captionRef = useRef(null);

  // Function to fetch user suggestions
  const fetchUserSuggestions = async (query) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/search?q=${query}`);
      const data = await response.json();
      return data.users || [];
    } catch (error) {
      console.error('Error fetching user suggestions:', error);
      return [];
    }
  };

  // Debounced version of the fetch function
  const debouncedFetch = useRef(
    debounce(async (query) => {
      const users = await fetchUserSuggestions(query);
      setUserSuggestions(users);
    }, 300)
  ).current;

  // Handle caption changes and @ mentions
  const handleCaptionChange = (e) => {
    const text = e.target.value;
    setCaption(text);
    setCursorPosition(e.target.selectionStart);

    // Check for @ mentions
    const lastAtSymbol = text.lastIndexOf('@', cursorPosition);
    if (lastAtSymbol !== -1) {
      const nextSpace = text.indexOf(' ', lastAtSymbol);
      const endIndex = nextSpace === -1 ? text.length : nextSpace;
      const query = text.slice(lastAtSymbol + 1, endIndex);
      
      if (query.length > 0) {
        setShowSuggestions(true);
        debouncedFetch(query);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle user suggestion selection
  const handleSuggestionClick = (username) => {
    const text = caption;
    const lastAtSymbol = text.lastIndexOf('@', cursorPosition);
    const nextSpace = text.indexOf(' ', lastAtSymbol);
    const endIndex = nextSpace === -1 ? text.length : nextSpace;
    
    const newText = 
      text.slice(0, lastAtSymbol) + 
      `@${username}` + 
      text.slice(endIndex);
    
    setCaption(newText);
    setShowSuggestions(false);
    
    // Focus back on textarea
    if (captionRef.current) {
      captionRef.current.focus();
    }
  };

  // Format caption with links
  const formatCaption = (text) => {
    // Replace @ mentions with links
    text = text.replace(/@(\w+)/g, '<a href="/user/$1" class="text-pink-500">@$1</a>');
    // Replace hashtags with links
    text = text.replace(/#(\w+)/g, '<a href="/tag/$1" class="text-pink-500">#$1</a>');
    return text;
  };

  const handlePublish = async () => {
    if (isPublishing) return;
    setIsPublishing(true);
    setError(null);

    try {
      await onPublish({
        caption: formatCaption(caption),
        location
      });
    } catch (error) {
      console.error('Error publishing post:', error);
      setError('Failed to publish post. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Back Navigation */}
      <div className="flex items-center gap-2 mb-4 p-4">
        <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Image Preview */}
        <div className="relative rounded-lg overflow-hidden bg-black flex items-center justify-center mb-4">
          <img
            src={images[0].preview}
            alt="Post preview"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Caption Input */}
        <div className="relative mb-4">
          <textarea
            ref={captionRef}
            placeholder="Write a caption... Use @ to mention users and # for hashtags"
            value={caption}
            onChange={handleCaptionChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/50 resize-none"
            rows={3}
          />
          
          {/* User Suggestions Dropdown */}
          {showSuggestions && userSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-gray-900 border border-white/10 rounded-lg max-h-40 overflow-y-auto">
              {userSuggestions.map((user) => (
                <button
                  key={user.username}
                  onClick={() => handleSuggestionClick(user.username)}
                  className="w-full px-3 py-2 text-left hover:bg-white/5 flex items-center gap-2"
                >
                  <img
                    src={getProfileImageUrl(user)}
                    alt={user.username}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-white">{user.username}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Location Input */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-3">
          <LocationRegular className="w-5 h-5 text-white/70" />
          <input
            type="text"
            placeholder="Add location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-transparent text-white placeholder-white/50 flex-1"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 mb-2 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10"
          >
            Back
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex-1 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:hover:bg-pink-500"
          >
            {isPublishing ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Sharing...</span>
              </div>
            ) : (
              "Share"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

PostReviewScreen.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    preview: PropTypes.string.isRequired
  })).isRequired,
  onBack: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string
  })
};

export default PostReviewScreen;

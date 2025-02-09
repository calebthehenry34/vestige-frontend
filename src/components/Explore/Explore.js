import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ChatRegular, HeartRegular } from '@fluentui/react-icons';
import { Box } from '@mui/material';
import { ThemeContext } from '../../context/ThemeContext';
import { API_URL } from '../../config';
import usersBg from '../../assets/backgrounds/users-bg.svg';
import hashtagsBg from '../../assets/backgrounds/hashtags-bg.svg';
import { createImageProps, checkWebPSupport } from '../../utils/imageUtils';

const Explore = () => {
  const { theme } = useContext(ThemeContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supportsWebP, setSupportsWebP] = useState(false);

  useEffect(() => {
    const checkWebP = async () => {
      const isSupported = await checkWebPSupport();
      setSupportsWebP(isSupported);
    };
    checkWebP();
  }, []);

  const fetchExplorePosts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/posts/explore`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch explore posts');
      }
  
      const postsArray = data.posts || data;
      setPosts(Array.isArray(postsArray) ? postsArray : []);
      setError(null);
  
    } catch (error) {
      console.error('Error fetching explore posts:', error);
      setError(error.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExplorePosts();
  }, [fetchExplorePosts]);

  const getImageUrls = (post) => {
    if (!post?.media) return null;

    // Handle new optimized media structure
    if (post.media.variants) {
      const format = supportsWebP ? 'webp' : 'jpeg';
      return {
        thumbnail: post.media.variants.thumbnail?.urls[format],
        small: post.media.variants.small?.urls[format],
        medium: post.media.variants.medium?.urls[format],
        large: post.media.variants.large?.urls[format]
      };
    }
    
    // Handle legacy media structure
    if (post.media.legacy?.url || typeof post.media === 'string') {
      const mediaUrl = post.media.legacy?.url || post.media;
      if (!mediaUrl || typeof mediaUrl !== 'string') return null;
      
      const baseUrl = mediaUrl.startsWith('http') ? mediaUrl : `${API_URL}/uploads/${mediaUrl}`;
      const ext = supportsWebP ? 'webp' : 'jpg';
      
      // If the URL already includes size suffixes, use them
      if (baseUrl.includes('_medium') || baseUrl.includes('_small') || baseUrl.includes('_thumbnail')) {
        return {
          thumbnail: baseUrl.replace(`.${ext}`, `_thumbnail.${ext}`),
          small: baseUrl.replace(`.${ext}`, `_small.${ext}`),
          medium: baseUrl.replace(`.${ext}`, `_medium.${ext}`),
          large: baseUrl,
        };
      }
      
      // Otherwise, use the same URL for all sizes
      return {
        thumbnail: baseUrl,
        small: baseUrl,
        medium: baseUrl,
        large: baseUrl,
      };
    }

    return null;
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark-theme' ? 'bg-black' : 'bg-gray-50'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen px-4 flex items-center justify-center ${
        theme === 'dark-theme' ? 'bg-black' : 'bg-gray-50'
      }`}>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={` mt-50 min-h-screen ${theme === 'dark-theme' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Two Column Links */}
        <div className="grid grid-cols-2 gap-4">
          <Box
            component={Link}
            to="/explore/users"
            sx={{
              background: `url(${usersBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              borderRadius: '10px',
              padding: '24px',
              textAlign: 'left',
              alignContent: 'bottom',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid',
              borderColor: theme === 'dark-theme' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.1)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: theme === 'dark-theme' 
                  ? 'rgba(0, 0, 0, 0.5)'
                  : 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(2px)',
                borderRadius: '10px',
              },
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15)',
                '&::before': {
                  background: theme === 'dark-theme' 
                    ? 'rgba(0, 0, 0, 0.4)'
                    : 'rgba(255, 255, 255, 0.4)',
                }
              }
            }}
          >
            <h2 className={`text-md font-headlines relative z-10 ${theme === 'dark-theme' ? 'text-white' : 'text-black'}`}>
              Find Users
            </h2>
          </Box>

          <Box
            component={Link}
            to="/explore/hashtags"
            sx={{
              background: `url(${hashtagsBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              borderRadius: '10px',
              padding: '24px',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid',
              borderColor: theme === 'dark-theme' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.1)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: theme === 'dark-theme' 
                  ? 'rgba(0, 0, 0, 0.5)'
                  : 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(2px)',
                borderRadius: '10px',
              },
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15)',
                '&::before': {
                  background: theme === 'dark-theme' 
                    ? 'rgba(0, 0, 0, 0.4)'
                    : 'rgba(255, 255, 255, 0.4)',
                }
              }
            }}
          >
            <h2 className={`text-md font-headlines relative z-10 ${theme === 'dark-theme' ? 'text-white' : 'text-black'}`}>
              Search Hashtags
            </h2>
          </Box>
        </div>

        {/* Explore Posts Grid */}
        <h2 className={`text-lg font-headlines mb-25 mt-25 ${theme === 'dark-theme' ? 'text-white' : 'text-black'}`}>
        </h2>
        <div className="grid grid-cols-3 gap-1 md:grid-cols-2 lg:grid-cols-3 md:gap-4">
          {posts.map((post) => (
            <Link 
              key={post._id} 
              to={`/post/${post._id}`}
              className={`relative aspect-square group overflow-hidden rounded-lg ${
                theme === 'dark-theme' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              {post.mediaType === 'video' ? (
                <div className="w-full h-full bg-black rounded-lg overflow-hidden">
                  <video
                    src={typeof post.media === 'string' && post.media
                      ? (post.media.startsWith('http') ? post.media : `${API_URL}/uploads/${post.media}`)
                      : ''}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="relative w-full h-full">
                  {/* Blur Placeholder */}
                  {post.blurPlaceholder && (
                    <div
                      className="absolute inset-0 bg-cover bg-center blur-lg"
                      style={{
                        backgroundImage: `url(${post.blurPlaceholder})`,
                        opacity: 1,
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                    />
                  )}
                  
                  {/* Main Image */}
                  <img
                    alt={`Post by ${post.author?.username || 'unknown'}`}
                    className="w-full h-full object-cover rounded-lg relative z-10"
                    onLoad={(e) => {
                      // Fade out blur placeholder when main image loads
                      if (e.target.previousSibling) {
                        e.target.previousSibling.style.opacity = '0';
                      }
                    }}
                    {...createImageProps(
                      getImageUrls(post) ?? {
                        thumbnail: `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.username || 'Post')}&size=100`,
                        small: `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.username || 'Post')}&size=400`,
                        medium: `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.username || 'Post')}&size=800`,
                        large: `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.username || 'Post')}&size=1200`
                      },
                      `Post by ${post.author?.username || 'unknown'}`,
                      'medium'
                    )}
                  />
                </div>
              )}
              
              {/* Hover Overlay */}
              <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black/50 hidden md:flex items-center justify-center space-x-6 transition-opacity rounded-lg">
                <div className="flex items-center text-white">
                  <HeartRegular className="w-6 h-6 mr-2" />
                  <span className="font-semibold">{post.likes?.length ?? 0}</span>
                </div>
                <div className="flex items-center text-white">
                  <ChatRegular className="w-6 h-6 mr-2" />
                  <span className="font-semibold">{post.comments?.length ?? 0}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;

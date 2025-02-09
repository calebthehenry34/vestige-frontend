import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ChevronLeftRegular,
  HeartRegular,
  HeartFilled,
  CommentRegular,
  ShareRegular,
  BookmarkRegular
} from '@fluentui/react-icons';
import { getMediaUrl, getProfileImageUrl, createImageProps } from '../../utils/imageUtils';
import PostComments from './PostComments';
import { API_URL } from '../../config';

const SinglePostView = ({ post, className }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [localPost, setLocalPost] = useState(post);
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [previousLikes, setPreviousLikes] = useState(post?.likes || []);

  useEffect(() => {
    setLocalPost(post);
    setPreviousLikes(post?.likes || []);
  }, [post]);

  const isLiked = localPost?.liked || false;

  const handleLike = async () => {
    if (isLiking || !localPost?._id) return;
    
    try {
      setIsLiking(true);
      
      // Optimistically update UI
      setLocalPost(prev => ({
        ...prev,
        liked: !isLiked,
        likesCount: isLiked ? prev.likesCount - 1 : prev.likesCount + 1
      }));

      const response = await fetch(`${API_URL}/api/posts/${localPost._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to like post');
      }

      const updatedPost = await response.json();
      // Update with server response
      setLocalPost(prev => ({
        ...prev,
        ...updatedPost,
        user: prev.user // Always preserve the user object
      }));
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert to previous state on error
      setLocalPost(post);
    } finally {
      setIsLiking(false);
    }
  };

  useEffect(() => {
    // Add class to hide navbars
    document.body.classList.add('hide-navigation');
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('hide-navigation');
    };
  }, []);

  if (!localPost || !localPost.user) {
    return (
      <div className={`flex flex-col bg-black ${className || ''}`}>
        <div className="p-4">
          <button 
            onClick={() => navigate(-1)} 
            className="text-white hover:opacity-80"
          >
            <ChevronLeftRegular className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-center">
            <p>Unable to load post</p>
          </div>
        </div>
      </div>
    );
  }

  const formatTimestamp = (timestamp) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp)) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
      <div className={`flex flex-col bg-black ${className || ''}`}>
      {/* Main content */}
      <div className="flex flex-col bg-black overflow-y-auto">
        {/* User info with back button */}
        <div className="p-4">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => navigate(-1)} 
              className="text-white hover:opacity-80 mr-4"
            >
              <ChevronLeftRegular className="w-6 h-6" />
            </button>
            <img
              src={getProfileImageUrl(post.user)}
              alt={post.user.username}
              className="w-12 h-12 rounded-lg object-cover border border-white/20"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${post.user.username}&background=random`;
              }}
            />
            <div className="ml-3">
              <h2 className="text-white font-medium">{post.user.username}</h2>
              <div className="flex items-center text-white/80 text-sm">
                {post.location && (
                  <>
                    <span>{post.location}</span>
                    <span className="mx-2">•</span>
                  </>
                )}
                <span>{formatTimestamp(post.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Post media */}
        <div className="flex-1 bg-white rounded-2xl mx-4 mb-4 overflow-hidden" style={{ maxHeight: '60vh' }}>
          {post.mediaType === 'video' ? (
            <video 
              src={getMediaUrl(post.media)} 
              controls 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Video load error:', post.media);
                setImageError(true);
              }}
            />
          ) : (
            <>
              <img
                {...createImageProps(
                  post.mediaItems?.[0]?.variants || {},
                  `Post by ${post.user?.username || 'unknown'}`,
                  'large'
                )}
                className={`w-full h-full object-cover ${imageError ? 'opacity-50' : ''}`}
                onError={(e) => {
                  console.error('Image load error:', post.media);
                  setImageError(true);
                  // Attempt to reload the image once
                  if (!e.target.dataset.retried) {
                    e.target.dataset.retried = 'true';
                    e.target.src = getMediaUrl(post.media);
                  }
                }}
              />
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center text-red-500 bg-black bg-opacity-50">
                  Error loading image
                </div>
              )}
            </>
          )}
        </div>

        {/* Interaction buttons */}
        <div className="p-4 bg-black">
          <div className="flex items-center gap-4 text-white mb-4">
            <button onClick={handleLike} className="transform hover:scale-110 transition-transform">
              {isLiked ? (
                <HeartFilled className="w-6 h-6 text-red-600" style={{ fill: '#dc2626' }} />
              ) : (
                <HeartRegular className="w-6 h-6" />
              )}
            </button>
            <button 
              onClick={() => setShowComments(!showComments)} 
              className="transform hover:scale-110 transition-transform"
            >
              <CommentRegular className="w-6 h-6" />
            </button>
            <button className="transform hover:scale-110 transition-transform">
              <ShareRegular className="w-6 h-6" />
            </button>
            <div className="flex-grow"></div>
            <button className="transform hover:scale-110 transition-transform">
              <BookmarkRegular className="w-6 h-6" />
            </button>
          </div>

          {/* Post text content */}
          <div className="text-white">
            {localPost.caption && (
              <p className="mb-4 whitespace-pre-wrap">{localPost.caption}</p>
            )}
            {localPost.text && (
              <p className="whitespace-pre-wrap">{localPost.text}</p>
            )}
          </div>
        </div>

        {/* Comments section */}
        <PostComments 
          post={localPost} 
          isOpen={showComments}
          onComment={(updatedPost) => {
            // Preserve user data when updating post
            setLocalPost(prev => ({
              ...prev,
              ...updatedPost,
              user: prev.user // Always preserve the user object
            }));
          }}
          onReply={(updatedPost) => {
            // Preserve user data when updating post
            setLocalPost(prev => ({
              ...prev,
              ...updatedPost,
              user: prev.user // Always preserve the user object
            }));
          }}
        />
      </div>
    </div>
  );
};

export default SinglePostView;

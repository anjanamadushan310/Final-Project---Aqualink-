import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { UserCircleIcon, HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Footer from '../components/home/Footer';
import CommentSection from '../components/blog/CommentSection';
import BlogService from '../services/BlogService';
import { API_BASE_URL } from '../config';

const BlogPostPage = () => {
  const { postId } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userReaction, setUserReaction] = useState(null);
  
  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  // Handle image loading errors
  const handleImageError = (e, imagePath) => {
    console.error('Failed to load image:', imagePath);
    e.target.style.display = 'none';
  };
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
  }, []);
  
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await BlogService.getBlogPostById(postId);
        console.log('Blog post data received:', data);
        console.log('Featured image path:', data.featuredImagePath);
        console.log('Blog content:', data.content);
        console.log('Blog content length:', data.content ? data.content.length : 'No content');
        setBlogPost(data);
        
        // Check if user has already reacted to this post
        if (currentUser) {
          try {
            const reactions = await BlogService.getReactionsForBlog(postId);
            const userReaction = reactions.find(reaction => reaction.user?.id === currentUser.id);
            if (userReaction) {
              setUserReaction(userReaction.type);
            }
          } catch (err) {
            console.error('Error fetching user reactions:', err);
          }
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Blog post not found.');
        } else {
          setError('Failed to load blog post. Please try again later.');
        }
        console.error('Error fetching blog post:', err);
        console.error('Error response:', err.response?.data);
        console.error('Error status:', err.response?.status);
      } finally {
        setLoading(false);
      }
    };
    
    if (postId) {
      fetchBlogPost();
    }
  }, [postId, currentUser]);
  
  const handleReaction = async () => {
    if (!currentUser) {
      // Trigger login modal
      window.dispatchEvent(new CustomEvent("show-login"));
      return;
    }
    
    try {
      if (userReaction === 'LIKE') {
        // Remove like if user clicks again
        await BlogService.removeReaction(postId);
        setUserReaction(null);
        setBlogPost(prev => ({
          ...prev,
          likesCount: Math.max(0, prev.likesCount - 1)
        }));
      } else if (userReaction) {
        // User already has a reaction - don't allow new reactions
        console.log('User can only have one reaction per post');
        return;
      } else {
        // New like reaction
        await BlogService.reactToBlogPost(postId, 'LIKE');
        
        // Update UI
        setBlogPost(prev => ({
          ...prev,
          likesCount: (prev.likesCount || 0) + 1
        }));
        
        setUserReaction('LIKE');
      }
    } catch (err) {
      console.error('Error handling reaction:', err);
    }
  };

  const handleCommentUpdate = useCallback((newCount) => {
    setBlogPost(prev => ({
      ...prev,
      commentsCount: newCount
    }));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !blogPost) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
              <p className="mb-6">{error || 'Blog post not found.'}</p>
              <Link to="/blog" className="text-blue-600 hover:underline">
                ← Back to Blog Listing
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/blog" className="text-blue-600 hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Blog Listing
            </Link>
          </div>
          
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Featured image */}
            {blogPost.featuredImagePath && (
              <div className="h-64 md:h-96 overflow-hidden">
                <img 
                  src={getImageUrl(blogPost.featuredImagePath)} 
                  alt={blogPost.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, blogPost.featuredImagePath)}
                />
              </div>
            )}
            
            {/* Content */}
            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {blogPost.title}
              </h1>
              
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {blogPost.author?.profileImageUrl ? (
                    <img 
                      src={getImageUrl(blogPost.author.profileImageUrl)} 
                      alt={blogPost.author.name} 
                      className="w-10 h-10 rounded-full object-cover mr-3"
                      onError={(e) => handleImageError(e, blogPost.author.profileImageUrl)}
                    />
                  ) : (
                    <UserCircleIcon className="w-10 h-10 text-gray-400 mr-3" />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {blogPost.author?.name || 'Anonymous'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(blogPost.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Blog content */}
              <div className="prose max-w-none mb-8">
                {blogPost.content ? (
                  <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
                ) : (
                  <div className="text-gray-500 italic p-8 text-center border border-gray-200 rounded-lg">
                    <p>No content available for this blog post.</p>
                    <p className="text-sm mt-2">Debug info: Content field is {typeof blogPost.content}</p>
                  </div>
                )}
              </div>
              

              
              {/* Reactions section */}
              <div className="flex items-center space-x-4 border-t border-gray-100 pt-6 mt-6">
                <button
                  onClick={handleReaction}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                    userReaction === 'LIKE'
                      ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                      : userReaction
                      ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  disabled={userReaction && userReaction !== 'LIKE'}
                  title={
                    userReaction === 'LIKE' 
                      ? 'Click to remove your like' 
                      : userReaction 
                      ? 'You can only react once per post' 
                      : 'Like this post'
                  }
                >
                  {userReaction === 'LIKE' ? (
                    <HeartIconSolid className="h-5 w-5 text-blue-600" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                  <span>{blogPost.likesCount || 0}</span>
                </button>
                
                <button
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200"
                  onClick={() => {
                    // Scroll to comments section
                    document.getElementById('comments-section')?.scrollIntoView({
                      behavior: 'smooth'
                    });
                  }}
                  title="View comments"
                >
                  <ChatBubbleLeftIcon className="h-5 w-5" />
                  <span>{blogPost.commentsCount || 0}</span>
                </button>
                

              </div>
            </div>
          </article>
          
          {/* Comments section */}
          <div id="comments-section" className="bg-white rounded-lg shadow-md p-6 mt-6">
            <CommentSection 
              blogPostId={postId}
              isExporter={currentUser?.role === 'EXPORTER'}
              onCommentUpdate={handleCommentUpdate}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
import axios from 'axios';
import { API_BASE_URL } from '../config';

// Utility function to get authentication headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const BlogService = {
  // Blog Posts
  getAllBlogPosts: async (page = 0, size = 10, published = null) => {
    const params = { page, size };
    if (published !== null) params.published = published;
    const response = await axios.get(`${API_BASE_URL}/api/blogs`, { 
      params,
      headers: getAuthHeaders()
    });
    return response.data;
  },
  
  getBlogPostById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/api/blogs/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },
  
  getBlogPostsByUser: async (userId, page = 0, size = 10) => {
    const response = await axios.get(`${API_BASE_URL}/api/blogs/byUser/${userId}`, {
      params: { page, size },
      headers: getAuthHeaders()
    });
    return response.data;
  },
  
  createBlogPost: async (blogPostData, images) => {
    const formData = new FormData();
    formData.append('blogPost', new Blob([JSON.stringify(blogPostData)], {
      type: 'application/json'
    }));
    
    if (images && images.length > 0) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }
    
    const authHeaders = getAuthHeaders();
    console.log('Creating blog post with headers:', authHeaders);
    console.log('Blog post data:', blogPostData);
    
    const response = await axios.post(`${API_BASE_URL}/api/blogs`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        ...authHeaders
      }
    });
    return response.data;
  },
  
  updateBlogPost: async (id, blogPostData, newImages) => {
    const formData = new FormData();
    formData.append('blogPost', new Blob([JSON.stringify(blogPostData)], {
      type: 'application/json'
    }));
    
    if (newImages && newImages.length > 0) {
      newImages.forEach(image => {
        formData.append('newImages', image);
      });
    }
    
    const response = await axios.put(`${API_BASE_URL}/api/blogs/${id}`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        ...getAuthHeaders()
      }
    });
    return response.data;
  },
  
  deleteBlogPost: async (id) => {
    await axios.delete(`${API_BASE_URL}/api/blogs/${id}`, {
      headers: getAuthHeaders()
    });
  },
  
  publishBlogPost: async (id) => {
    const response = await axios.put(`${API_BASE_URL}/api/blogs/${id}/publish`, {}, {
      headers: getAuthHeaders()
    });
    return response.data;
  },
  
  unpublishBlogPost: async (id) => {
    const response = await axios.put(`${API_BASE_URL}/api/blogs/${id}/unpublish`, {}, {
      headers: getAuthHeaders()
    });
    return response.data;
  },
  
  // Comments
  getCommentsForBlog: async (blogId, page = 0, size = 10) => {
    const response = await axios.get(`${API_BASE_URL}/api/blogs/${blogId}/comments`, {
      params: { page, size },
      headers: getAuthHeaders()
    });
    return response.data;
  },
  
  addComment: async (blogId, commentData) => {
    const response = await axios.post(`${API_BASE_URL}/api/blogs/${blogId}/comments`, commentData, {
      headers: getAuthHeaders()
    });
    return response.data;
  },
  
  updateComment: async (commentId, commentData) => {
    const response = await axios.put(`${API_BASE_URL}/api/blogs/comments/${commentId}`, commentData, {
      headers: getAuthHeaders()
    });
    return response.data;
  },
  
  deleteComment: async (commentId) => {
    await axios.delete(`${API_BASE_URL}/api/blogs/comments/${commentId}`, {
      headers: getAuthHeaders()
    });
  },
  
  approveComment: async (commentId) => {
    const response = await axios.put(`${API_BASE_URL}/api/blogs/comments/${commentId}/approve`, {}, {
      headers: getAuthHeaders()
    });
    return response.data;
  },
  
  // Reactions
  reactToBlogPost: async (blogId, reactionType) => {
    const response = await axios.post(`${API_BASE_URL}/api/blogs/${blogId}/react`, null, {
      params: { reactionType },
      headers: getAuthHeaders()
    });
    return response.data;
  },
  
  removeReaction: async (blogId) => {
    await axios.delete(`${API_BASE_URL}/api/blogs/${blogId}/reactions`, {
      headers: getAuthHeaders()
    });
  },
  
  getReactionsForBlog: async (blogId, type = null, page = 0, size = 10) => {
    const params = { page, size };
    if (type) params.type = type;
    const response = await axios.get(`${API_BASE_URL}/api/blogs/${blogId}/reactions`, { 
      params,
      headers: getAuthHeaders()
    });
    return response.data;
  }
};

export default BlogService;
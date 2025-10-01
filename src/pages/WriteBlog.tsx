import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import TinyMCEEditor from '../components/TinyMCEEditor';
import { useAuth } from '../contexts/AuthContext';
import { blogService } from '../services/blogService';

interface WriteBlogProps {
  setCurrentPage?: (page: string) => void;
}

const WriteBlog: React.FC<WriteBlogProps> = ({ setCurrentPage }) => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'filming',
    tags: '',
    featured: false, // Featured post option
    status: 'PUBLISHED' // Track current status
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load post data if in edit mode
  useEffect(() => {
    const loadPost = async () => {
      if (editId) {
        setIsLoading(true);
        try {
          const post = await blogService.getPostById(parseInt(editId));
          if (post) {
            setFormData({
              title: post.title,
              content: post.content || '',
              category: post.category,
              tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
              featured: post.featured || false,
              status: post.status || 'PUBLISHED'
            });
          } else {
            alert('Post not found.');
            navigate('/blog');
          }
        } catch (error) {
          console.error('Error loading post:', error);
          alert('An error occurred while loading the post.');
          navigate('/blog');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadPost();
  }, [editId, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'radio' ? (e.target as HTMLInputElement).value : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Submitting data:', formData);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const url = editId 
        ? `http://localhost:8080/blog/posts/${editId}` 
        : 'http://localhost:8080/blog/posts';
      
      const method = editId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers,
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);

      if (result.success) {
        alert(editId ? 'Blog post updated successfully!' : 'Blog post created successfully!');
        
        // Navigate to blog list
        navigate('/blog');
      } else {
        alert(`An error occurred: ${result.message}`);
      }
    } catch (error) {
      console.error('Error while saving blog:', error);
      alert('An error occurred while saving the blog post. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/blog');
  };

  const handleUnpublish = async () => {
    if (!editId) return;
    
    const confirmUnpublish = window.confirm('Are you sure you want to unpublish this post? It will no longer be visible to readers.');
    if (!confirmUnpublish) return;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Send current form data with status set to DRAFT
      const unpublishData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        featured: formData.featured,
        status: 'DRAFT' // Directly set status to DRAFT
      };
      
      console.log('=== Unpublish Request ===');
      console.log('Edit ID:', editId);
      console.log('Unpublish Data:', unpublishData);
      console.log('Current formData.status:', formData.status);
      
      const response = await fetch(`http://localhost:8080/blog/posts/${editId}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(unpublishData)
      });
      
      console.log('Response status:', response.status);

      const result = await response.json();
      console.log('Response result:', result);

      if (result.success) {
        console.log('Success! Updating local state to DRAFT');
        // Update local state first
        setFormData(prev => ({ ...prev, status: 'DRAFT' }));
        console.log('New formData status should be DRAFT');
        alert('Blog post unpublished successfully! Status changed to DRAFT.');
      } else {
        console.error('Failed:', result.message);
        alert(`An error occurred: ${result.message}`);
      }
    } catch (error) {
      console.error('Error while unpublishing blog:', error);
      alert('An error occurred while unpublishing the blog post.');
    }
  };

  const handlePublish = async () => {
    if (!editId) return;
    
    const confirmPublish = window.confirm('Are you sure you want to publish this post? It will be visible to all readers.');
    if (!confirmPublish) return;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Send current form data with status set to PUBLISHED
      const publishData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        featured: formData.featured,
        status: 'PUBLISHED' // Directly set status to PUBLISHED
      };
      
      const response = await fetch(`http://localhost:8080/blog/posts/${editId}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(publishData)
      });

      const result = await response.json();

      if (result.success) {
        // Update local state first
        setFormData(prev => ({ ...prev, status: 'PUBLISHED' }));
        alert('Blog post published successfully! Status changed to PUBLISHED.');
      } else {
        alert(`An error occurred: ${result.message}`);
      }
    } catch (error) {
      console.error('Error while publishing blog:', error);
      alert('An error occurred while publishing the blog post.');
    }
  };

  if (isLoading) {
    return (
      <div className="write-blog-layout">
        <div className="write-blog-main">
          <div className="write-blog-container">
            <div className="blog-detail-loading">
              <div className="loading-spinner"></div>
              <p>Loading post...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="write-blog-layout">
      <div className="write-blog-main">
        <div className="write-blog-container">
          {/* Header */}
          <div className="write-blog-header">
            <h1 className="write-blog-title">{editId ? 'Edit Blog' : 'Write Blog'}</h1>
          </div>

          {/* Form */}
          <motion.form 
            className="write-blog-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Title */}
            <div className="form-group">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Blog Title"
                required
              />
            </div>

            {/* Category, Tags and Featured Row */}
            <div className="form-row">
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="filming">Filming</option>
                <option value="production">Production</option>
                <option value="running">Running</option>
                <option value="travel">Travel</option>
              </select>
              
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Tags (comma separated)"
              />

              <div className="form-checkbox-container">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="form-checkbox-small"
                  id="featured-checkbox"
                />
                <label htmlFor="featured-checkbox" className="form-checkbox-label-small">
                  ⭐
                </label>
              </div>
            </div>

            {/* Content */}
            <div className="form-group">
              <TinyMCEEditor
                value={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Write your blog content here..."
                height={600}
              />
            </div>

            {/* Current Status Display */}
            {editId && user?.userRole === 'ROOT' && (
              <div style={{ 
                marginBottom: '20px', 
                padding: '12px', 
                backgroundColor: formData.status === 'PUBLISHED' ? '#d1fae5' : '#fef3c7',
                borderRadius: '8px',
                border: `1px solid ${formData.status === 'PUBLISHED' ? '#10b981' : '#f59e0b'}`
              }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  Current Status: 
                  <span style={{ 
                    marginLeft: '8px',
                    color: formData.status === 'PUBLISHED' ? '#059669' : '#d97706'
                  }}>
                    {formData.status === 'PUBLISHED' ? '✅ Published' : '📝 Unpublished'}
                  </span>
                </span>
              </div>
            )}

            {/* Buttons */}
            <div className="form-buttons">
              {editId && user?.userRole === 'ROOT' && formData.status === 'PUBLISHED' && (
                <button
                  type="button"
                  onClick={handleUnpublish}
                  className="btn-unpublish btn-small"
                  disabled={isSubmitting}
                  title="Unpublish"
                >
                  Unpublish
                </button>
              )}
              {editId && user?.userRole === 'ROOT' && formData.status !== 'PUBLISHED' && (
                <button
                  type="button"
                  onClick={handlePublish}
                  className="btn-publish btn-small"
                  disabled={isSubmitting}
                  title="Publish"
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white'
                  }}
                >
                  Publish
                </button>
              )}
              <button
                type="button"
                onClick={handleCancel}
                className="btn-cancel btn-small"
                disabled={isSubmitting}
                title="Cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit btn-small"
                disabled={isSubmitting || !formData.title?.trim() || !formData.content?.trim()}
                title={isSubmitting ? (editId ? 'Updating...' : 'Publishing...') : (editId ? 'Update' : 'Publish')}
              >
                {isSubmitting ? (editId ? 'Updating...' : 'Publishing...') : (editId ? 'Update' : 'Publish')}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default WriteBlog;

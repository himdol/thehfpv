import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BlogPost } from '../types/blog';
import { blogService } from '../services/blogService';
import { useAuth } from '../contexts/AuthContext';
import { getRelativeTime } from '../utils/timeUtils';
import './BlogDetail.css';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Load post data (only when id changes)
  useEffect(() => {
    const loadPost = async () => {
      if (!id) {
        setError('Post ID is missing.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const postData = await blogService.getPostById(parseInt(id));
        
        // Load like status if user is already loaded
        if (postData && user && user.email) {
          try {
            const likeStatus = await blogService.getLikeStatus(postData.id);
            postData.isLiked = likeStatus.isLiked;
            postData.likes = likeStatus.likeCount;
          } catch (error) {
            console.error('Error loading like status:', error);
          }
        }
        
        setPost(postData);
        
        // Load related posts
        if (postData) {
          const related = await blogService.getRelatedPosts(postData.id, 3);
          setRelatedPosts(related);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post.');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBackClick = () => {
    navigate('/blog');
  };

  const formatDate = (dateString: string) => {
    return getRelativeTime(dateString);
  };

  // Handle like toggle
  const handleLikeToggle = async () => {
    if (!post) return;
    
    // Check if user is logged in
    if (!user || !user.email) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      // Call API to toggle like
      const result = await blogService.toggleLike(post.id);
      
      // Update local state with API response
      setPost({
        ...post,
        isLiked: result.isLiked,
        likes: result.likeCount
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      // If it's an authentication error, show login prompt
      if (error instanceof Error && error.message.includes('401')) {
        setShowLoginPrompt(true);
      }
    }
  };

  // Handle login prompt
  const handleLoginPrompt = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  // Close login prompt
  const closeLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  if (loading) {
    return (
      <div className="blog-detail-container">
        <div className="blog-detail-loading">
          <div className="loading-spinner"></div>
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-detail-container">
        <div className="blog-detail-error">
          <h2>An error occurred</h2>
          <p>{error || 'Post not found.'}</p>
          <button onClick={handleBackClick} className="back-button">
            Back to Blog List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-container">
      <div className="blog-detail-header">
        <button onClick={handleBackClick} className="youtube-btn" title="Back to blog">
          ← Back to blog
        </button>
      </div>

      <article className="blog-detail-content">
        <header className="blog-detail-post-header">
          <div className="blog-detail-meta">
            <span className="blog-detail-category">{post.category}</span>
            {post.featured && <span className="blog-detail-featured">⭐</span>}
            <span className="blog-detail-date">{formatDate(post.date)}</span>
          </div>
          
          <h1 className="blog-detail-title">{post.title}</h1>
          
          {post.author && post.author.trim() && post.author !== 'Unknown' && (
            <div className="blog-detail-author">
              <span>Author: {post.author}</span>
            </div>
          )}
          

        </header>

        {post.featuredImageUrl && (
          <div className="blog-detail-featured-image">
            <img src={post.featuredImageUrl} alt={post.title} />
          </div>
        )}

        <div className="blog-detail-body">
          <div 
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
          
          {post.tags && post.tags.length > 0 && (
            <div className="blog-detail-tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="blog-detail-tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <footer className="blog-detail-footer">
          <div className="blog-detail-stats">
            <span>Views: {post.viewCount || 0}</span>
            <span>Likes: {post.likes || 0}</span>
          </div>
          <button 
            className={`blog-like-btn ${post.isLiked ? 'liked' : ''}`}
            onClick={handleLikeToggle}
          >
            <span className="blog-like-icon">
              {post.isLiked ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              )}
            </span>
            <span className="blog-like-count">{post.likes || 0}</span>
          </button>
        </footer>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="related-posts">
          <h3 className="related-posts-title">Here is others</h3>
          <div className="related-posts-grid">
            {relatedPosts.map((relatedPost) => (
              <div 
                key={relatedPost.id} 
                className="related-post-card"
                onClick={() => navigate(`/blog/${relatedPost.id}`)}
              >
                {relatedPost.image && (
                  <div className="related-post-image">
                    <img src={relatedPost.image} alt={relatedPost.title} />
                  </div>
                )}
                <div className="related-post-content">
                  <h4 className="related-post-title">{relatedPost.title}</h4>
                  {/* <p className="related-post-excerpt">{relatedPost.excerpt}</p> */}
                  <div className="related-post-meta">
                    <span className="related-post-category">{relatedPost.category}</span>
                    <span className="related-post-date">{getRelativeTime(relatedPost.date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="login-prompt-overlay">
          <motion.div 
            className="login-prompt-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="login-prompt-content">
              <div className="login-prompt-icon">🔒</div>
              <h3 className="login-prompt-title">Login Required</h3>
              <p className="login-prompt-message">
                You need to be logged in to like posts. Would you like to sign in?
              </p>
              <div className="login-prompt-buttons">
                <button 
                  className="login-prompt-btn login-prompt-btn-secondary"
                  onClick={closeLoginPrompt}
                >
                  Cancel
                </button>
                <button 
                  className="login-prompt-btn login-prompt-btn-primary"
                  onClick={handleLoginPrompt}
                >
                  Sign In
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;

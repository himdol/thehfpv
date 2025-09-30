import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BlogPost, BlogFilters } from '../types/blog';
import { blogService } from '../services/blogService';
import { useAuth } from '../contexts/AuthContext';
import { getRelativeTime } from '../utils/timeUtils';

interface BlogProps {
  setCurrentPage?: (page: string) => void;
}

const Blog: React.FC<BlogProps> = ({ setCurrentPage: setAppCurrentPage }) => {
  // Navigation
  const navigate = useNavigate();
  
  // Auth context
  const { checkAuthStatus, user } = useAuth();
  
  // State management
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [filters, setFilters] = useState<BlogFilters>({
    searchTerm: ''
  });

  // Load all posts once on component mount
  const loadAllPosts = useCallback(async () => {
    try {
      setLoading(true);
      const posts = await blogService.getAllPosts();
      
      // Set posts first, then load like status if user is logged in
      setAllPosts(posts);
      
      // Load like status for each post if user is logged in
      if (user && user.email) {
        try {
          const postsWithLikeStatus = await Promise.all(
            posts.map(async (post) => {
              try {
                const likeStatus = await blogService.getLikeStatus(post.id);
                return {
                  ...post,
                  isLiked: likeStatus.isLiked,
                  likes: likeStatus.likeCount
                };
              } catch (error) {
                console.error(`Error loading like status for post ${post.id}:`, error);
                // If it's an authentication error, don't show it as it's expected for non-logged-in users
                if (error instanceof Error && !error.message.includes('401')) {
                  console.warn(`Non-auth error loading like status for post ${post.id}:`, error);
                }
                return post; // Return original post if like status fails
              }
            })
          );
          setAllPosts(postsWithLikeStatus);
        } catch (error) {
          console.error('Error loading like statuses:', error);
          // Keep original posts if like status loading fails
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load initial data
  useEffect(() => {
    loadAllPosts();
  }, [loadAllPosts]);

  // Update relative time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to update relative time
      setAllPosts(prev => [...prev]);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Client-side filtering using useMemo for performance
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...allPosts];

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (filters.category) {
      console.log('Filtering by category:', filters.category);
      console.log('Posts before category filter:', filtered.length);
      filtered = filtered.filter(post => {
        console.log('Post category:', post.category, 'Filter category:', filters.category, 'Match:', post.category === filters.category);
        return post.category === filters.category;
      });
      console.log('Posts after category filter:', filtered.length);
    }

    // Apply featured filter
    if (filters.featured !== undefined) {
      filtered = filtered.filter(post => !!post.featured === filters.featured);
    }

    // Sort: featured posts first, then by date
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return filtered;
  }, [allPosts, filters]);



  // Handle like toggle
  const handleLikeToggle = async (postId: number) => {
    console.log('handleLikeToggle called, user:', user);
    console.log('checkAuthStatus():', checkAuthStatus());
    
    // Check if user is logged in
    if (!user || !user.email) {
      console.log('User not logged in, showing login prompt');
      setShowLoginPrompt(true);
      return;
    }

    try {
      // Call API to toggle like
      const result = await blogService.toggleLike(postId);
      
      // Update local state with API response
      setAllPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { 
                ...post, 
                isLiked: result.isLiked,
                likes: result.likeCount
              }
            : post
        )
      );
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
    if (setAppCurrentPage) {
      setAppCurrentPage('login');
    }
  };

  // Close login prompt
  const closeLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  // Use filtered posts for rendering (no pagination)
  const displayPosts = filteredAndSortedPosts;

  // Handle search
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      searchTerm: value,
      category: undefined // Clear category when searching
    }));
  };

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ 
      ...prev, 
      category: prev.category === category ? undefined : category,
      searchTerm: '' // Clear search when changing category
    }));
  };

  // Handle featured filter
  const handleFeaturedChange = (featured: boolean) => {
    setFilters(prev => ({
      ...prev,
      featured: featured ? true : undefined
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ searchTerm: '' });
  };

  // Convert category to display name
  const getCategoryDisplayName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'filming': 'Filming',
      'production': 'Production',
      'running': 'Running',
      'travel': 'Travel'
    };
    return categoryMap[category] || category;
  };

  // Handle post click
  const handlePostClick = (postId: number) => {
    const post = allPosts.find((p: BlogPost) => p.id === postId);
    if (post) {
      console.log(`Blog post ${postId} clicked:`, post);
      // Navigate to the post detail page
      navigate(`/blog/${post.id}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="blog-layout">
        <div className="blog-main">
          <div className="blog-container">
            <div className="blog-header">
              <h1 className="blog-title">BLOG</h1>
              <p className="blog-subtitle">Sharing development, daily life, and various experiences.</p>
            </div>
            <div className="blog-loading">
              <div className="loading-spinner"></div>
              <p>Loading posts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="blog-layout">
        <div className="blog-main">
          <div className="blog-container">
            <div className="blog-header">
              <h1 className="blog-title">BLOG</h1>
              <p className="blog-subtitle">Sharing development, daily life, and various experiences.</p>
            </div>
            <div className="blog-error">
              <p>Error: {error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-layout">
      <div className="blog-main">
        <div className="blog-container">
          {/* Header */}
          <div className="blog-header">
            <h1 className="blog-title">BLOG</h1>
            <p className="blog-subtitle">Sharing development, daily life, and various experiences.</p>
          </div>

          {/* Search and Category Filter */}
          <div className="blog-filters-section">
            <div className="blog-filters">
              {/* Search Container */}
              <div className="blog-search-container">
                <div className="blog-search-wrapper">
                  <input
                    type="text"
                    placeholder="Search here"
                    value={filters.searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="blog-search-input"
                  />
                  <svg className="blog-search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Tag Filters */}
            <div className="blog-tag-filters">
              <button
                className={`blog-tag-filter-btn ${filters.featured ? 'active' : ''}`}
                onClick={() => handleFeaturedChange(filters.featured !== true)}
              >
                ⭐ Featured
              </button>
              <button
                className={`blog-tag-filter-btn ${filters.category === 'filming' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('filming')}
              >
                🎬 Filming
              </button>
              <button
                className={`blog-tag-filter-btn ${filters.category === 'production' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('production')}
              >
                🎥 Production
              </button>
              <button
                className={`blog-tag-filter-btn ${filters.category === 'running' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('running')}
              >
                🏃 Running
              </button>
              <button
                className={`blog-tag-filter-btn ${filters.category === 'travel' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('travel')}
              >
                ✈️ Travel
              </button>
            </div>

            {/* Results Info */}
            <div className="blog-results-info">
              <span>
                {filteredAndSortedPosts.length} posts total
                {filters.searchTerm && ` (search: "${filters.searchTerm}")`}
                {filters.category && ` • category: ${getCategoryDisplayName(filters.category)}`}
                {filters.featured && ` • featured only`}
              </span>
              {(filters.searchTerm || filters.category || filters.featured) && (
                <button onClick={clearFilters} className="blog-clear-filters-btn">
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Blog Posts */}
          <div className="blog-posts-container">
            {/* Write Blog Button - ROOT 권한만 표시 */}
            {user?.userRole === 'ROOT' && (
              <div className="blog-write-btn-container">
                <button 
                  className="blog-write-btn"
                  onClick={() => {
                    console.log('Write blog button clicked');
                    navigate('/write-blog');
                  }}
                >
                  ✍️
                </button>
              </div>
            )}
            {displayPosts.length === 0 ? (
              <div className="blog-empty-state">
                <svg className="blog-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="blog-empty-title">No posts found</h3>
                <p className="blog-empty-description">
                  {filters.searchTerm ? `No search results found for "${filters.searchTerm}".` : 'No posts are registered.'}
                </p>
                <div>
                  {(filters.searchTerm || filters.category || filters.featured) && (
                    <button onClick={clearFilters} className="blog-empty-btn">
                      RESET
                    </button>
                  )}
                </div>
              </div>
            ) : (
              displayPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="blog-post"
                  onClick={() => handlePostClick(post.id)}
                >
                  <div className="blog-post-content">
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="blog-post-image"
                      />
                    )}
                    <div className="blog-post-text">
                      <div className="blog-post-header">
                        <div className="blog-post-meta">
                          <span className={`blog-category ${
                            post.category === 'filming' ? 'filming' :
                            post.category === 'production' ? 'production' :
                            post.category === 'running' ? 'running' :
                            post.category === 'travel' ? 'travel' : ''
                          }`}>
                            {getCategoryDisplayName(post.category)}
                          </span>
                          {post.featured && (
                            <span className="blog-featured">
                              ⭐
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">{getRelativeTime(post.date)}</span>
                      </div>
                      <h2 className="blog-title">
                        {post.title}
                      </h2>
                      <p className="blog-excerpt">
                        {post.excerpt}
                      </p>
                      <div className="blog-post-footer">
                        <div className="blog-post-meta">
                          <div className="blog-tags">
                            {post.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span key={tagIndex} className="blog-tag">
                                #{tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="blog-tag-more">
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                        <button 
                          className={`blog-like-btn ${post.isLiked ? 'liked' : ''} ${!user || !user.email ? 'disabled' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Like button clicked, user:', user);
                            
                            // Double check if user is logged in
                            if (!user || !user.email) {
                              console.log('User not logged in, preventing API call');
                              setShowLoginPrompt(true);
                              return;
                            }
                            
                            handleLikeToggle(post.id);
                          }}
                          disabled={!user || !user.email}
                          title={!user || !user.email ? '로그인이 필요합니다' : ''}
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
                          <span className="blog-like-count">{post.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))
            )}
          </div>

        </div>
      </div>

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

export default Blog;
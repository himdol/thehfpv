import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BlogPost, BlogFilters, BlogCategory } from '../types/blog';
import { blogService } from '../services/blogService';

interface BlogProps {}

const Blog: React.FC<BlogProps> = () => {
  // State management
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BlogFilters>({
    searchTerm: ''
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [postsData, categoriesData] = await Promise.all([
          blogService.getAllPosts(),
          blogService.getCategories()
        ]);
        setPosts(postsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blog data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts.filter(post => {
      const matchesSearch = !filters.searchTerm || 
        post.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase()));
      
      const matchesCategory = !filters.category || post.category === filters.category;
      const matchesFeatured = filters.featured === undefined || !!post.featured === filters.featured;
      
      return matchesSearch && matchesCategory && matchesFeatured;
    });

    // Sort: featured posts first, then by date
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return filtered;
  }, [posts, filters]);

  // Handle search
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, searchTerm: value }));
  };

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category: category || undefined }));
  };

  // Handle featured filter
  const handleFeaturedChange = (featured: boolean) => {
    setFilters(prev => ({ ...prev, featured: featured }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ searchTerm: '' });
  };

  // Handle post click
  const handlePostClick = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      console.log(`Blog post ${postId} clicked:`, post);
      // In a real app, you would navigate to the post detail page
      // navigate(`/blog/${post.slug || post.id}`);
      alert(`Blog post "${post.title}" clicked!`);
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
                onClick={() => handleFeaturedChange(!filters.featured)}
              >
                ⭐ Featured
              </button>
              <button
                className={`blog-tag-filter-btn ${filters.category === '기술' ? 'active' : ''}`}
                onClick={() => handleCategoryChange(filters.category === '기술' ? '' : '기술')}
              >
                💻 Tech
              </button>
              <button
                className={`blog-tag-filter-btn ${filters.category === '일상' ? 'active' : ''}`}
                onClick={() => handleCategoryChange(filters.category === '일상' ? '' : '일상')}
              >
                📝 Vlog
              </button>
              <button
                className={`blog-tag-filter-btn ${filters.category === '여행' ? 'active' : ''}`}
                onClick={() => handleCategoryChange(filters.category === '여행' ? '' : '여행')}
              >
                ✈️ Travel
              </button>
              <button
                className={`blog-tag-filter-btn ${filters.category === '음식' ? 'active' : ''}`}
                onClick={() => handleCategoryChange(filters.category === '음식' ? '' : '음식')}
              >
                🍕 Food
              </button>
            </div>

            {/* Results Info */}
            <div className="blog-results-info">
              <span>
                {filteredAndSortedPosts.length} posts total
                {filters.searchTerm && ` (search: "${filters.searchTerm}")`}
                {filters.category && ` • category: ${filters.category}`}
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
            {filteredAndSortedPosts.length === 0 ? (
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
              filteredAndSortedPosts.map((post, index) => (
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
                            post.category === '기술' ? 'tech' :
                            post.category === '일상' ? 'life' :
                            post.category === '여행' ? 'travel' :
                            post.category === '음식' ? 'food' :
                            post.category === '독서' ? 'book' : ''
                          }`}>
                            {post.category}
                          </span>
                          {post.featured && (
                            <span className="blog-featured">
                              ⭐ Featured
                            </span>
                          )}
                          <span className="text-sm text-gray-500">{post.readTime}</span>
                        </div>
                        <span className="text-sm text-gray-500">{post.date}</span>
                      </div>
                      <h2 className="blog-title">
                        {post.title}
                      </h2>
                      <p className="blog-excerpt">
                        {post.excerpt}
                      </p>
                      <div className="blog-post-footer">
                        <div className="blog-post-meta">
                          <div className="blog-author">
                            <div className="blog-author-avatar">
                              {post.author}
                            </div>
                            <span className="text-sm text-gray-700">{post.author}</span>
                          </div>
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
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))
            )}
          </div>

          {/* Pagination */}
          {filteredAndSortedPosts.length > 0 && (
            <div className="blog-pagination">
              <nav className="blog-pagination-nav">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="blog-pagination-btn disabled"
                >
                  Previous
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="blog-pagination-btn active"
                >
                  1
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="blog-pagination-btn"
                >
                  2
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="blog-pagination-btn"
                >
                  3
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="blog-pagination-btn"
                >
                  Next
                </motion.button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
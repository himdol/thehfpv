import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import blogService from '../services/blogService';
import { BlogPost } from '../types/blog';

interface MyLikesProps {
  setCurrentPage: (page: string) => void;
}

interface LikeSection {
  id: string;
  title: string;
  icon: string;
  posts: BlogPost[];
  isExpanded: boolean;
}

const MyLikes: React.FC<MyLikesProps> = ({ setCurrentPage }) => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [likedPosts, setLikedPosts] = useState<BlogPost[]>([]);
  const [sections, setSections] = useState<LikeSection[]>([
    { id: 'blog', title: 'Blog', icon: '📝', posts: [], isExpanded: true },
    // { id: 'shopping', title: 'Shopping', icon: '🛒', posts: [], isExpanded: false }, // 나중에 쇼핑 기능 추가 시 사용
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    loadMyLikes();
  }, [isLoggedIn, navigate]);

  const loadMyLikes = async () => {
    try {
      setLoading(true);
      setError(null);
      const posts = await blogService.getMyLikes();
      setLikedPosts(posts);
      
      // Blog 섹션에 포스트 추가
      setSections(prev => prev.map(section => 
        section.id === 'blog' 
          ? { ...section, posts } 
          : section
      ));
    } catch (err) {
      console.error('Failed to load liked posts:', err);
      setError('Failed to load liked posts.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    ));
  };

  const handlePostClick = (post: BlogPost) => {
    navigate(`/blog/${post.id}`);
  };

  const handleUnlike = async (postId: number) => {
    try {
      await blogService.toggleLike(postId);
      // 목록에서 제거
      setLikedPosts(prev => prev.filter(post => post.id !== postId));
      // 섹션에서도 제거
      setSections(prev => prev.map(section => ({
        ...section,
        posts: section.posts.filter(post => post.id !== postId)
      })));
    } catch (err) {
      console.error('Failed to unlike post:', err);
    }
  };

  if (loading) {
    return (
      <div className="blog-layout">
        <div className="blog-main">
          <div className="blog-container">
            <div className="blog-header">
              <h1 className="blog-title">내 좋아요</h1>
              <p className="blog-subtitle">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalLikes = sections.reduce((sum, section) => sum + section.posts.length, 0);

  return (
    <div className="blog-layout">
      <div className="blog-main">
        <div className="my-likes-container">
          {/* Header */}
          <div className="blog-header">
            <h1 className="blog-title">What I likes?</h1>
          </div>

          {error && (
            <div style={{ 
              padding: '20px', 
              marginBottom: '20px', 
              backgroundColor: '#fee', 
              color: '#c33', 
              borderRadius: '8px',
              maxWidth: '800px',
              margin: '0 auto 20px'
            }}>
              {error}
            </div>
          )}

          {/* Sections */}
          <div className="my-likes-sections">
            {sections.map((section) => (
              <div key={section.id} className="my-likes-section">
                <div 
                  className="my-likes-section-header"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="my-likes-section-title">
                    <span className="my-likes-section-icon">{section.icon}</span>
                    <h2>{section.title}</h2>
                    <span className="my-likes-section-count">
                      {section.posts.length > 0 ? `(${section.posts.length})` : ''}
                    </span>
                  </div>
                  <span className={`my-likes-section-toggle ${section.isExpanded ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </div>

                <AnimatePresence>
                  {section.isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="my-likes-section-content">
                        {section.posts.length === 0 ? (
                          <div className="my-likes-empty">
                            <p>No liked items in {section.title} yet.</p>
                            {section.id === 'blog' && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate('/blog');
                                }}
                                className="my-likes-empty-btn"
                              >
                                Go to Blog
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="my-likes-list">
                            {section.posts.map((post, index) => (
                              <motion.div
                                key={post.id}
                                className="my-likes-item"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                                onClick={() => handlePostClick(post)}
                              >
                                <span className="my-likes-item-title">{post.title}</span>
                                <button 
                                  className="my-likes-item-remove"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnlike(post.id);
                                  }}
                                  title="Unlike"
                                >
                                  ✕
                                </button>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLikes;


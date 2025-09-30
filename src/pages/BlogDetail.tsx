import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlogPost } from '../types/blog';
import { blogService } from '../services/blogService';
import { getRelativeTime } from '../utils/timeUtils';
import './BlogDetail.css';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!id) {
        setError('포스트 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const postData = await blogService.getPostById(parseInt(id));
        setPost(postData);
        
        // Load related posts
        if (postData) {
          const related = await blogService.getRelatedPosts(postData.id, 3);
          setRelatedPosts(related);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '포스트를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const handleBackClick = () => {
    navigate('/blog');
  };

  const formatDate = (dateString: string) => {
    return getRelativeTime(dateString);
  };

  if (loading) {
    return (
      <div className="blog-detail-container">
        <div className="blog-detail-loading">
          <div className="loading-spinner"></div>
          <p>포스트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-detail-container">
        <div className="blog-detail-error">
          <h2>오류가 발생했습니다</h2>
          <p>{error || '포스트를 찾을 수 없습니다.'}</p>
          <button onClick={handleBackClick} className="back-button">
            블로그 목록으로 돌아가기
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
            {post.featured && <span className="blog-detail-featured">⭐ Featured</span>}
            <span className="blog-detail-date">{formatDate(post.date)}</span>
          </div>
          
          <h1 className="blog-detail-title">{post.title}</h1>
          
          {post.author && post.author.trim() && (
            <div className="blog-detail-author">
              <span>작성자: {post.author}</span>
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
            <span>조회수: {post.viewCount || 0}</span>
            <span>좋아요: {post.likes || 0}</span>
          </div>
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
                  <p className="related-post-excerpt">{relatedPost.excerpt}</p>
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

    </div>
  );
};

export default BlogDetail;

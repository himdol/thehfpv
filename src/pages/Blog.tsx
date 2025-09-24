import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  tags: string[];
  featured?: boolean;
  image?: string;
}

interface BlogProps {}

const Blog: React.FC<BlogProps> = () => {
  // 상태 관리
  const [searchTerm, setSearchTerm] = useState('');
  
  // 블로그 포스트 클릭 핸들러
  const handlePostClick = (postId: number) => {
    // 실제 프로젝트에서는 라우터를 사용하여 상세 페이지로 이동
    // 예: navigate(`/blog/${postId}`)
    console.log(`블로그 포스트 ${postId} 클릭됨`);
    alert(`블로그 포스트 "${blogPosts.find(p => p.id === postId)?.title}"를 클릭했습니다!`);
  };
  const blogPosts: BlogPost[] = useMemo(() => [
    {
      id: 1,
      title: "React 19 새로운 기능들",
      excerpt: "React 19에서 추가된 새로운 기능들을 살펴보고 실제 사용법을 알아봅니다. 특히 Concurrent Features와 새로운 Hooks에 대해 자세히 다룹니다.",
      category: "기술",
      date: "2024-01-15",
      readTime: "5분",
      author: "H",
      tags: ["React", "JavaScript", "Frontend"],
      featured: true,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"
    },
    {
      id: 2,
      title: "개발자의 일상",
      excerpt: "하루 종일 코딩하는 개발자의 일상과 팁을 공유합니다. 효율적인 개발 환경 설정과 생산성 향상 방법을 소개합니다.",
      category: "일상",
      date: "2024-01-12",
      readTime: "3분",
      author: "H",
      tags: ["일상", "개발팁", "생산성"],
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
    },
    {
      id: 3,
      title: "맛있는 음식 추천",
      excerpt: "개발하면서 먹기 좋은 음식들과 간단한 요리법을 소개합니다. 건강한 식습관으로 더 나은 개발을 해보세요.",
      category: "음식",
      date: "2024-01-10",
      readTime: "4분",
      author: "H",
      tags: ["음식", "요리", "건강"],
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800"
    },
    {
      id: 4,
      title: "TypeScript 고급 패턴",
      excerpt: "TypeScript의 고급 기능들을 활용한 실용적인 패턴들을 소개합니다. 제네릭, 유틸리티 타입, 조건부 타입 등을 다룹니다.",
      category: "기술",
      date: "2024-01-08",
      readTime: "7분",
      author: "H",
      tags: ["TypeScript", "JavaScript", "타입"],
      featured: true,
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800"
    },
    {
      id: 5,
      title: "여행 후기 - 일본",
      excerpt: "일본 여행에서 경험한 개발자 관점의 흥미로운 것들을 공유합니다. 기술 문화와 현지 개발자들과의 만남 이야기입니다.",
      category: "여행",
      date: "2024-01-05",
      readTime: "6분",
      author: "H",
      tags: ["여행", "일본", "문화"],
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800"
    },
    {
      id: 6,
      title: "독서 후기 - 클린 코드",
      excerpt: "로버트 C. 마틴의 '클린 코드'를 읽고 느낀 점과 실제 적용 사례를 공유합니다.",
      category: "독서",
      date: "2024-01-03",
      readTime: "4분",
      author: "H",
      tags: ["독서", "클린코드", "개발"],
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800"
    },
    {
      id: 7,
      title: "Framer Motion 애니메이션 가이드",
      excerpt: "React에서 Framer Motion을 사용하여 부드러운 애니메이션을 만드는 방법을 단계별로 설명합니다.",
      category: "기술",
      date: "2024-01-20",
      readTime: "8분",
      author: "H",
      tags: ["React", "Framer Motion", "애니메이션"],
      featured: true,
      image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800"
    },
    {
      id: 8,
      title: "GitHub Pages 배포하기",
      excerpt: "React 앱을 GitHub Pages에 무료로 배포하는 방법과 자동화 설정을 알아봅니다.",
      category: "기술",
      date: "2024-01-18",
      readTime: "6분",
      author: "H",
      tags: ["GitHub", "배포", "React"],
      image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800"
    }
  ], []);


  // 필터링 및 정렬 로직
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });

    // 정렬: 추천 포스트를 먼저, 그 다음 날짜순
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return filtered;
  }, [blogPosts, searchTerm]);

  return (
    <div className="blog-layout">
      {/* 메인 콘텐츠 */}
      <div className="blog-main">
        <div className="blog-container">
          {/* 헤더 */}
          <div className="blog-header">
            <h1 className="blog-title">블로그</h1>
            <p className="blog-subtitle">개발, 일상, 그리고 다양한 경험을 공유합니다.</p>
          </div>

          {/* 검색 및 필터 */}
          <div className="mb-8">
            <div className="blog-filters">
              {/* 검색바 */}
              <div className="blog-search-container">
                <div className="blog-search-wrapper">
                  <input
                    type="text"
                    placeholder="블로그 포스트 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="blog-search-input"
                  />
                  <svg className="blog-search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
            </div>

            {/* 결과 정보 */}
            <div className="blog-results-info">
              <span>
                총 {filteredAndSortedPosts.length}개의 포스트
                {searchTerm && ` (검색어: "${searchTerm}")`}
              </span>
              <div>
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                    }}
                    className="blog-reset-btn"
                  >
                    검색 초기화
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 블로그 포스트 목록 */}
          <div className="blog-posts-container">
            {filteredAndSortedPosts.length === 0 ? (
              <div className="blog-empty-state">
                <svg className="blog-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="blog-empty-title">포스트를 찾을 수 없습니다</h3>
                <p className="blog-empty-description">
                  {searchTerm ? `"${searchTerm}"에 대한 검색 결과가 없습니다.` : '등록된 포스트가 없습니다.'}
                </p>
                <div>
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                      }}
                      className="blog-empty-btn"
                    >
                      검색 초기화
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
                    {/* 이미지 섹션 */}
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="blog-post-image"
                      />
                    )}
                    
                    {/* 콘텐츠 섹션 */}
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
                              ⭐ 추천
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

          {/* 페이지네이션 */}
          {filteredAndSortedPosts.length > 0 && (
            <div className="blog-pagination">
              <nav className="blog-pagination-nav">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="blog-pagination-btn disabled"
                >
                  이전
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
                  다음
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

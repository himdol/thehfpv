import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';

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

interface BlogProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Blog: React.FC<BlogProps> = ({ sidebarOpen, setSidebarOpen }) => {
  // 상태 관리
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'popular' | 'title'>('date');
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

  // 카테고리 목록
  const categories = [
    { id: '', label: '모든 카테고리', count: blogPosts.length },
    { id: '기술', label: '기술', count: blogPosts.filter(post => post.category === '기술').length },
    { id: '일상', label: '일상', count: blogPosts.filter(post => post.category === '일상').length },
    { id: '여행', label: '여행', count: blogPosts.filter(post => post.category === '여행').length },
    { id: '음식', label: '음식', count: blogPosts.filter(post => post.category === '음식').length },
    { id: '독서', label: '독서', count: blogPosts.filter(post => post.category === '독서').length },
  ];

  // 필터링 및 정렬 로직
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'popular':
          // featured 포스트를 먼저, 그 다음 날짜순
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [blogPosts, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="flex">
      {/* 사이드바 */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        type="blog" 
      />

      {/* 메인 콘텐츠 */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <div className="blog-container">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">블로그</h1>
            <p className="text-gray-600">개발, 일상, 그리고 다양한 경험을 공유합니다.</p>
          </div>

          {/* 검색 및 필터 */}
          <div className="mb-8">
            <div className="blog-filters">
              {/* 검색바 */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="블로그 포스트 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* 카테고리 필터 */}
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.label} ({category.count})
                  </option>
                ))}
              </select>
              
              {/* 정렬 옵션 */}
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'popular' | 'title')}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="date">최신순</option>
                <option value="popular">인기순</option>
                <option value="title">제목순</option>
              </select>
            </div>

            {/* 결과 정보 */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>
                총 {filteredAndSortedPosts.length}개의 포스트
                {selectedCategory && ` (${selectedCategory} 카테고리)`}
                {searchTerm && ` (검색어: "${searchTerm}")`}
              </span>
              <div className="flex space-x-2">
                {(searchTerm || selectedCategory) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    필터 초기화
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 블로그 포스트 목록 */}
          <div className="space-y-8">
            {filteredAndSortedPosts.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">포스트를 찾을 수 없습니다</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? `"${searchTerm}"에 대한 검색 결과가 없습니다.` : '선택한 카테고리에 포스트가 없습니다.'}
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    필터 초기화
                  </button>
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
                      
                      <p className="text-gray-600 mb-4 leading-relaxed blog-excerpt">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
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
                              <span className="text-xs text-gray-400">
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="blog-read-more"
                        >
                          읽기
                          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))
            )}
          </div>

          {/* 페이지네이션 */}
          {filteredAndSortedPosts.length > 0 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 rounded-lg transition-colors"
                >
                  이전
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
                >
                  1
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  2
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  3
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
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

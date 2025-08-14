import React from 'react';
import Sidebar from '../components/Sidebar';

interface BlogProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Blog: React.FC<BlogProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const blogPosts = [
    {
      id: 1,
      title: "React 19 새로운 기능들",
      excerpt: "React 19에서 추가된 새로운 기능들을 살펴보고 실제 사용법을 알아봅니다. 특히 Concurrent Features와 새로운 Hooks에 대해 자세히 다룹니다.",
      category: "기술",
      date: "2024-01-15",
      readTime: "5분",
      author: "Himdol",
      tags: ["React", "JavaScript", "Frontend"]
    },
    {
      id: 2,
      title: "개발자의 일상",
      excerpt: "하루 종일 코딩하는 개발자의 일상과 팁을 공유합니다. 효율적인 개발 환경 설정과 생산성 향상 방법을 소개합니다.",
      category: "일상",
      date: "2024-01-12",
      readTime: "3분",
      author: "Himdol",
      tags: ["일상", "개발팁", "생산성"]
    },
    {
      id: 3,
      title: "맛있는 음식 추천",
      excerpt: "개발하면서 먹기 좋은 음식들과 간단한 요리법을 소개합니다. 건강한 식습관으로 더 나은 개발을 해보세요.",
      category: "음식",
      date: "2024-01-10",
      readTime: "4분",
      author: "Himdol",
      tags: ["음식", "요리", "건강"]
    },
    {
      id: 4,
      title: "TypeScript 고급 패턴",
      excerpt: "TypeScript의 고급 기능들을 활용한 실용적인 패턴들을 소개합니다. 제네릭, 유틸리티 타입, 조건부 타입 등을 다룹니다.",
      category: "기술",
      date: "2024-01-08",
      readTime: "7분",
      author: "Himdol",
      tags: ["TypeScript", "JavaScript", "타입"]
    },
    {
      id: 5,
      title: "여행 후기 - 일본",
      excerpt: "일본 여행에서 경험한 개발자 관점의 흥미로운 것들을 공유합니다. 기술 문화와 현지 개발자들과의 만남 이야기입니다.",
      category: "여행",
      date: "2024-01-05",
      readTime: "6분",
      author: "Himdol",
      tags: ["여행", "일본", "문화"]
    },
    {
      id: 6,
      title: "독서 후기 - 클린 코드",
      excerpt: "로버트 C. 마틴의 '클린 코드'를 읽고 느낀 점과 실제 적용 사례를 공유합니다.",
      category: "독서",
      date: "2024-01-03",
      readTime: "4분",
      author: "Himdol",
      tags: ["독서", "클린코드", "개발"]
    }
  ];

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">블로그</h1>
            <p className="text-gray-600">개발, 일상, 그리고 다양한 경험을 공유합니다.</p>
          </div>

          {/* 검색 및 필터 */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="블로그 포스트 검색..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">모든 카테고리</option>
              <option value="tech">기술</option>
              <option value="life">일상</option>
              <option value="travel">여행</option>
              <option value="food">음식</option>
              <option value="book">독서</option>
            </select>
          </div>

          {/* 블로그 포스트 목록 */}
          <div className="space-y-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    <span className="text-sm text-gray-500">{post.date}</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">H</span>
                        </div>
                        <span className="text-sm text-gray-700">{post.author}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                      읽기 →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50">
                이전
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">2</button>
              <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">3</button>
              <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
                다음
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;

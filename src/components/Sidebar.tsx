import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'blog' | 'shop';
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, type }) => {
  const blogCategories = [
    { id: 'tech', label: '기술', count: 12 },
    { id: 'life', label: '일상', count: 8 },
    { id: 'travel', label: '여행', count: 5 },
    { id: 'food', label: '음식', count: 15 },
    { id: 'book', label: '독서', count: 3 },
  ];

  const shopCategories = [
    { id: 'electronics', label: '전자제품', count: 25 },
    { id: 'clothing', label: '의류', count: 18 },
    { id: 'books', label: '도서', count: 32 },
    { id: 'home', label: '홈&리빙', count: 14 },
    { id: 'sports', label: '스포츠', count: 9 },
  ];

  const categories = type === 'blog' ? blogCategories : shopCategories;

  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      {/* 사이드바 */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h2 className="sidebar-title">
              {type === 'blog' ? '블로그' : '샵'} 카테고리
            </h2>
            <button
              onClick={onClose}
              className="sidebar-close-btn"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="sidebar-nav">
            {categories.map((category) => (
              <button
                key={category.id}
                className="sidebar-nav-btn"
              >
                <span className="sidebar-nav-label">{category.label}</span>
                <span className="sidebar-nav-count">
                  {category.count}
                </span>
              </button>
            ))}
          </nav>

          {/* 추가 기능 */}
          <div className="sidebar-features">
            <h3 className="sidebar-features-title">
              {type === 'blog' ? '블로그' : '샵'} 기능
            </h3>
            <div className="sidebar-features-list">
              <button className="sidebar-feature-btn">
                <svg className="sidebar-feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                검색
              </button>
              <button className="sidebar-feature-btn">
                <svg className="sidebar-feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                {type === 'blog' ? '인기 글' : '인기 상품'}
              </button>
              <button className="sidebar-feature-btn">
                <svg className="sidebar-feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                최신
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const blogCategories = [
    { id: 'tech', label: '기술', count: 12 },
    { id: 'life', label: '일상', count: 8 },
    { id: 'travel', label: '여행', count: 5 },
    { id: 'food', label: '음식', count: 15 },
    { id: 'book', label: '독서', count: 3 },
  ];

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
              블로그 카테고리
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
            {blogCategories.map((category) => (
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

        </div>
      </div>
    </>
  );
};

export default Sidebar;

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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 사이드바 */}
      <div className={`
        fixed top-16 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {type === 'blog' ? '블로그' : '샵'} 카테고리
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                <span className="font-medium">{category.label}</span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </nav>

          {/* 추가 기능 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {type === 'blog' ? '블로그' : '샵'} 기능
            </h3>
            <div className="space-y-2">
              <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                검색
              </button>
              <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                {type === 'blog' ? '인기 글' : '인기 상품'}
              </button>
              <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

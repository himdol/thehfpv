import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

interface ShopProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Shop: React.FC<ShopProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [sortBy, setSortBy] = useState('latest');

  const products = [
    {
      id: 1,
      name: "프로그래밍 책 - 클린 코드",
      price: 29000,
      originalPrice: 35000,
      category: "도서",
      image: "📚",
      rating: 4.8,
      reviewCount: 128,
      isNew: true,
      isSale: true
    },
    {
      id: 2,
      name: "개발자 머그컵",
      price: 15000,
      originalPrice: 15000,
      category: "홈&리빙",
      image: "☕",
      rating: 4.5,
      reviewCount: 89,
      isNew: false,
      isSale: false
    },
    {
      id: 3,
      name: "기계식 키보드",
      price: 89000,
      originalPrice: 120000,
      category: "전자제품",
      image: "⌨️",
      rating: 4.9,
      reviewCount: 256,
      isNew: true,
      isSale: true
    },
    {
      id: 4,
      name: "노트북 스탠드",
      price: 45000,
      originalPrice: 45000,
      category: "전자제품",
      image: "💻",
      rating: 4.3,
      reviewCount: 67,
      isNew: false,
      isSale: false
    },
    {
      id: 5,
      name: "개발자 후드티",
      price: 35000,
      originalPrice: 45000,
      category: "의류",
      image: "👕",
      rating: 4.6,
      reviewCount: 142,
      isNew: false,
      isSale: true
    },
    {
      id: 6,
      name: "무선 마우스",
      price: 25000,
      originalPrice: 25000,
      category: "전자제품",
      image: "🖱️",
      rating: 4.4,
      reviewCount: 93,
      isNew: false,
      isSale: false
    },
    {
      id: 7,
      name: "개발자 스티커 세트",
      price: 8000,
      originalPrice: 12000,
      category: "홈&리빙",
      image: "🏷️",
      rating: 4.7,
      reviewCount: 234,
      isNew: true,
      isSale: true
    },
    {
      id: 8,
      name: "운동화",
      price: 65000,
      originalPrice: 65000,
      category: "스포츠",
      image: "👟",
      rating: 4.2,
      reviewCount: 78,
      isNew: false,
      isSale: false
    }
  ];

  const formatPrice = (price: number) => {
    return price.toLocaleString() + '원';
  };

  const getDiscountRate = (price: number, originalPrice: number) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <div className="flex">
      {/* 사이드바 */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        type="shop" 
      />

      {/* 메인 콘텐츠 */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">샵</h1>
            <p className="text-gray-600">개발자들을 위한 다양한 상품들을 만나보세요.</p>
          </div>

          {/* 검색 및 필터 */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="상품 검색..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="latest">최신순</option>
              <option value="price-low">가격 낮은순</option>
              <option value="price-high">가격 높은순</option>
              <option value="rating">평점순</option>
              <option value="popular">인기순</option>
            </select>
          </div>

          {/* 상품 목록 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* 상품 이미지 */}
                <div className="relative p-6 bg-gray-50">
                  <div className="text-6xl text-center">{product.image}</div>
                  
                  {/* 뱃지 */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        NEW
                      </span>
                    )}
                    {product.isSale && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        SALE
                      </span>
                    )}
                  </div>
                </div>

                {/* 상품 정보 */}
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {/* 가격 */}
                  <div className="mb-3">
                    {product.isSale ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-red-600">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <span className="text-sm text-red-600 font-medium">
                          {getDiscountRate(product.price, product.originalPrice)}% 할인
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  
                  {/* 평점 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviewCount})
                      </span>
                    </div>
                  </div>
                  
                  {/* 버튼 */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      장바구니
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                      상세보기
                    </button>
                  </div>
                </div>
              </div>
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

export default Shop;

import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 히어로 섹션 */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          안녕하세요! 👋
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          개발자 <span className="text-blue-600 font-semibold">Himdol</span>의 블로그에 오신 것을 환영합니다.
          기술 이야기, 일상, 그리고 다양한 경험을 공유합니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            블로그 보기
          </button>
          <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors">
            샵 둘러보기
          </button>
        </div>
      </div>

      {/* 최신 블로그 포스트 */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">최신 블로그 포스트</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              id: 1,
              title: "React 19 새로운 기능들",
              excerpt: "React 19에서 추가된 새로운 기능들을 살펴보고 실제 사용법을 알아봅니다.",
              category: "기술",
              date: "2024-01-15",
              readTime: "5분"
            },
            {
              id: 2,
              title: "개발자의 일상",
              excerpt: "하루 종일 코딩하는 개발자의 일상과 팁을 공유합니다.",
              category: "일상",
              date: "2024-01-12",
              readTime: "3분"
            },
            {
              id: 3,
              title: "맛있는 음식 추천",
              excerpt: "개발하면서 먹기 좋은 음식들과 간단한 요리법을 소개합니다.",
              category: "음식",
              date: "2024-01-10",
              readTime: "4분"
            }
          ].map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-blue-600 font-medium">{post.category}</span>
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    읽기 →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* 인기 상품 */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">인기 상품</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: 1, name: "프로그래밍 책", price: "29,000원", image: "📚" },
            { id: 2, name: "개발자 머그컵", price: "15,000원", image: "☕" },
            { id: 3, name: "키보드", price: "89,000원", image: "⌨️" },
            { id: 4, name: "노트북 스탠드", price: "45,000원", image: "💻" }
          ].map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{product.image}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-green-600 font-bold">{product.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 소개 섹션 */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">저에 대해</h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            프론트엔드 개발자로서 React, TypeScript, 그리고 최신 웹 기술에 대한 
            경험과 지식을 공유하고 있습니다. 개발뿐만 아니라 일상의 다양한 이야기도 함께 나누어요.
          </p>
          <button className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
            더 알아보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

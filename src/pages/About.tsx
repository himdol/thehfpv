import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 헤더 */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">안녕하세요, Himdol입니다! 👋</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          프론트엔드 개발자로서 React, TypeScript, 그리고 최신 웹 기술에 대한 
          경험과 지식을 공유하고 있습니다.
        </p>
      </div>

      {/* 프로필 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-white">MH</span>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">개발자 Himdol</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              안녕하세요! 저는 프론트엔드 개발에 열정을 가진 개발자입니다. 
              사용자 경험을 중요시하며, 깔끔하고 효율적인 코드 작성을 지향합니다.
              새로운 기술을 배우는 것을 좋아하고, 지식을 공유하는 것을 즐깁니다.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">React</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">TypeScript</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">JavaScript</span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Node.js</span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">CSS</span>
            </div>
          </div>
        </div>
      </div>

      {/* 경력 및 경험 */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">💼 경력</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-900">프론트엔드 개발자</h4>
              <p className="text-gray-600">2023 - 현재</p>
              <p className="text-sm text-gray-500">React, TypeScript 기반 웹 애플리케이션 개발</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-gray-900">웹 개발자</h4>
              <p className="text-gray-600">2022 - 2023</p>
              <p className="text-sm text-gray-500">JavaScript, HTML, CSS를 활용한 웹사이트 개발</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🎓 교육</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-gray-900">컴퓨터공학 학사</h4>
              <p className="text-gray-600">대학교</p>
              <p className="text-sm text-gray-500">웹 개발 및 소프트웨어 엔지니어링 전공</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-gray-900">온라인 코스</h4>
              <p className="text-gray-600">Udemy, Coursera</p>
              <p className="text-sm text-gray-500">React, TypeScript, Node.js 등 다양한 기술 스택 학습</p>
            </div>
          </div>
        </div>
      </div>

      {/* 기술 스택 */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">🛠️ 기술 스택</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚛️</span>
            </div>
            <h4 className="font-semibold text-gray-900">Frontend</h4>
            <p className="text-sm text-gray-600">React, Vue.js, HTML, CSS</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📝</span>
            </div>
            <h4 className="font-semibold text-gray-900">Language</h4>
            <p className="text-sm text-gray-600">TypeScript, JavaScript</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚙️</span>
            </div>
            <h4 className="font-semibold text-gray-900">Backend</h4>
            <p className="text-sm text-gray-600">Node.js, Express</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🛠️</span>
            </div>
            <h4 className="font-semibold text-gray-900">Tools</h4>
            <p className="text-sm text-gray-600">Git, Docker, AWS</p>
          </div>
        </div>
      </div>

      {/* 프로젝트 */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">🚀 주요 프로젝트</h3>
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">개인 블로그 & 샵</h4>
            <p className="text-gray-600 mb-3">React와 TypeScript를 사용한 개인 블로그 및 온라인 쇼핑몰</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">React</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">TypeScript</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Tailwind CSS</span>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">웹 애플리케이션</h4>
            <p className="text-gray-600 mb-3">사용자 관리 및 데이터 시각화 기능을 포함한 웹 애플리케이션</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">React</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Node.js</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">MongoDB</span>
            </div>
          </div>
        </div>
      </div>

      {/* 연락처 */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">📧 연락하기</h3>
        <p className="text-gray-600 mb-6">
          궁금한 점이나 협업 제안이 있으시면 언제든 연락주세요!
        </p>
        <div className="flex justify-center space-x-6">
          <a href="mailto:himdol@example.com" className="text-blue-600 hover:text-blue-700 font-medium">
            이메일
          </a>
          <a href="https://github.com/himdol" className="text-gray-700 hover:text-gray-900 font-medium">
            GitHub
          </a>
          <a href="https://linkedin.com/in/himdol" className="text-blue-600 hover:text-blue-700 font-medium">
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;

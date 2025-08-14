import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="home-page">
            <h1>안녕하세요! 👋</h1>
            <h2>개발자 Himdol의 블로그입니다</h2>
            <p>React, TypeScript, 그리고 최신 웹 기술에 대한 경험을 공유합니다.</p>
            <div className="buttons">
              <button onClick={() => setCurrentPage('blog')}>블로그 보기</button>
              <button onClick={() => setCurrentPage('shop')}>샵 둘러보기</button>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="about-page">
            <h1>소개</h1>
            <p>프론트엔드 개발자 Himdol입니다.</p>
            <button onClick={() => setCurrentPage('home')}>홈으로 돌아가기</button>
          </div>
        );
      case 'blog':
        return (
          <div className="blog-page">
            <h1>블로그</h1>
            <p>블로그 포스트 목록이 여기에 표시됩니다.</p>
            <button onClick={() => setCurrentPage('home')}>홈으로 돌아가기</button>
          </div>
        );
      case 'shop':
        return (
          <div className="shop-page">
            <h1>샵</h1>
            <p>상품 목록이 여기에 표시됩니다.</p>
            <button onClick={() => setCurrentPage('home')}>홈으로 돌아가기</button>
          </div>
        );
      case 'login':
        return (
          <div className="login-page">
            <h1>로그인</h1>
            <p>로그인 폼이 여기에 표시됩니다.</p>
            <button onClick={() => setCurrentPage('home')}>홈으로 돌아가기</button>
          </div>
        );
      default:
        return (
          <div className="home-page">
            <h1>안녕하세요! 👋</h1>
            <h2>개발자 Himdol의 블로그입니다</h2>
            <p>React, TypeScript, 그리고 최신 웹 기술에 대한 경험을 공유합니다.</p>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <header className="header">
        <div className="logo">
          <span className="logo-m">M</span>
          <span className="logo-h">H</span>
        </div>
        <nav className="nav">
          <button 
            className={currentPage === 'home' ? 'nav-item active' : 'nav-item'}
            onClick={() => setCurrentPage('home')}
          >
            홈
          </button>
          <button 
            className={currentPage === 'about' ? 'nav-item active' : 'nav-item'}
            onClick={() => setCurrentPage('about')}
          >
            소개
          </button>
          <button 
            className={currentPage === 'blog' ? 'nav-item active' : 'nav-item'}
            onClick={() => setCurrentPage('blog')}
          >
            블로그
          </button>
          <button 
            className={currentPage === 'shop' ? 'nav-item active' : 'nav-item'}
            onClick={() => setCurrentPage('shop')}
          >
            샵
          </button>
          <button 
            className={currentPage === 'login' ? 'nav-item active' : 'nav-item'}
            onClick={() => setCurrentPage('login')}
          >
            로그인
          </button>
        </nav>
      </header>
      <main className="main">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;

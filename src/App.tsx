import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>안녕하세요! 👋</h1>
        <h2>GitHub Pages에 배포된 React 앱입니다</h2>
        <p>
          이 페이지는 <code>React + TypeScript</code>로 만들어졌습니다.
        </p>
        <div className="features">
          <div className="feature">
            <span>⚛️</span>
            <p>React 19</p>
          </div>
          <div className="feature">
            <span>📝</span>
            <p>TypeScript</p>
          </div>
          <div className="feature">
            <span>🚀</span>
            <p>GitHub Pages</p>
          </div>
        </div>
        <a
          className="App-link"
          href="https://github.com/himdol/github.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub 저장소 보기
        </a>
      </header>
    </div>
  );
}

export default App;

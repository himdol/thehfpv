import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Router from './components/Router';

function App() {
  // Initialize currentPage from localStorage or default to 'about'
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'about';
  });
  
  // 이전 페이지 정보를 저장
  const [previousPage, setPreviousPage] = useState<string | undefined>();

  // Save currentPage to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  // 페이지 변경 시 이전 페이지 정보 저장
  const handlePageChange = (page: string) => {
    if (page === 'login') {
      // 로그인 페이지로 이동할 때 현재 페이지를 이전 페이지로 저장
      setPreviousPage(currentPage);
    } else {
      // 다른 페이지로 이동할 때는 이전 페이지 정보 초기화
      setPreviousPage(undefined);
    }
    setCurrentPage(page);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <Layout 
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
        >
          <Router 
            currentPage={currentPage}
            setCurrentPage={handlePageChange}
            previousPage={previousPage}
          />
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

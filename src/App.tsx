import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Router from './components/Router';

function AppContent() {
  const { socialLogin } = useAuth();
  
  // Initialize currentPage from localStorage or default to 'about'
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'about';
  });
  
  // 이전 페이지 정보를 저장
  const [previousPage, setPreviousPage] = useState<string | undefined>();

  // OAuth2 콜백 처리
  useEffect(() => {
    const handleOAuthCallback = async () => {
      console.log('=== OAuth2 콜백 처리 시작 ===');
      
      // URL에서 토큰 파라미터 확인
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const oauthSuccess = urlParams.get('oauth_success');
      
      if (oauthSuccess === 'true' && token) {
        console.log('OAuth2 토큰 받음:', token);
        
        // 토큰을 localStorage에 저장 (authService와 일관성 유지)
        localStorage.setItem('authToken', token);
        
        // URL에서 파라미터 제거 (무한루프 방지)
        window.history.replaceState({}, document.title, '/');
        
        // 백엔드에서 사용자 정보 가져오기
        try {
          console.log('JWT 토큰으로 프로필 요청:', token);
          const response = await fetch('http://localhost:8080/auth/profile', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('OAuth2 사용자 정보:', data);
            
            // 사용자 정보를 localStorage에 저장
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('isAuthenticated', 'true');
            
            // AuthContext의 socialLogin 함수 호출하여 상태 업데이트
            await socialLogin(data.user);
            
            // About 페이지로 이동 (일반 로그인과 동일하게)
            setCurrentPage('about');
            
            // 성공 메시지 표시
            alert('Google 로그인이 완료되었습니다!');
            return;
          }
        } catch (error) {
          console.error('OAuth2 사용자 정보 가져오기 실패:', error);
        }
      }
      
      // 기존 세션 방식으로 폴백
      // URL에서 파라미터 제거
      window.history.replaceState({}, document.title, '/');
      
      // 백엔드 세션에서 사용자 정보 가져오기 (재시도 로직 포함)
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          console.log(`세션 정보 요청 시도 ${retryCount + 1}/${maxRetries}`);
          
          const response = await fetch('http://localhost:8080/session/user', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          console.log('세션 응답 상태:', response.status);
          
          if (!response.ok) {
            console.error('세션 정보 요청 실패:', response.status);
            retryCount++;
            if (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
              continue;
            }
            return;
          }
          
          const data = await response.json();
          console.log('세션 데이터:', data);
          
          if (data.authenticated && data.user && data.jwtToken) {
            // 토큰과 사용자 정보를 localStorage에 저장
            localStorage.setItem('authToken', data.jwtToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            console.log('localStorage에 사용자 정보 저장 완료');
            
            // AuthContext 업데이트
            await socialLogin(data.user);
            
            console.log('AuthContext 업데이트 완료');
            
            alert('Google 로그인이 완료되었습니다!');
            setCurrentPage('about');
            return; // 성공 시 루프 종료
          } else {
            console.log('인증되지 않은 상태 또는 데이터 부족:', data);
            retryCount++;
            if (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
              continue;
            }
          }
        } catch (error) {
          console.error(`OAuth2 콜백 처리 실패 (시도 ${retryCount + 1}):`, error);
          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
            continue;
          }
        }
      }
      
      console.error('OAuth2 콜백 처리 최종 실패');
    };

    // 페이지 로드 시 OAuth2 콜백인지 확인
    const urlParams = new URLSearchParams(window.location.search);
    const oauthSuccess = urlParams.get('oauth_success');
    const isOAuthCallback = oauthSuccess === 'true' || 
      (window.location.pathname === '/' && 
       (document.referrer.includes('accounts.google.com') || 
        document.referrer.includes('localhost:8080')));
    
    if (isOAuthCallback) {
      console.log('OAuth2 콜백 감지됨, 처리 시작...');
      handleOAuthCallback();
    }
  }, [socialLogin]);

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
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

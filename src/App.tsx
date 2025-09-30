import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import WriteBlog from './pages/WriteBlog';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AuthCallback from './pages/AuthCallback';

function AppContent() {
  const { socialLogin } = useAuth();
  
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
            console.log('프로필 데이터:', data);
            
            // 사용자 정보를 localStorage에 저장
            localStorage.setItem('user', JSON.stringify(data));
            
            // 소셜 로그인 상태 업데이트
            socialLogin(data);
            
            console.log('OAuth2 로그인 성공!');
          } else {
            console.error('프로필 요청 실패:', response.status);
          }
        } catch (error) {
          console.error('프로필 요청 중 오류:', error);
        }
      }
    };

    handleOAuthCallback();
  }, [socialLogin]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/write-blog" element={<WriteBlog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
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
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface AuthCallbackProps {
  setCurrentPage?: (page: string) => void;
}

const AuthCallback: React.FC<AuthCallbackProps> = ({ setCurrentPage }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { socialLogin } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log('=== OAuth 콜백 처리 시작 ===');
        
        // URL 파라미터 확인
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');

        if (error) {
          console.error('OAuth 에러:', error);
          alert('소셜 로그인에 실패했습니다: ' + error);
          navigate('/login');
          return;
        }

        // 백엔드 세션에서 사용자 정보 가져오기
        console.log('세션 정보 요청 중...');
        const response = await fetch('http://localhost:8080/session/user', {
          method: 'GET',
          credentials: 'include', // 쿠키 포함
        });

        console.log('세션 응답 상태:', response.status);
        
        if (!response.ok) {
          throw new Error(`세션 요청 실패: ${response.status}`);
        }

        const data = await response.json();
        console.log('세션 데이터:', data);

        if (data.authenticated && data.user && data.jwtToken) {
          // 토큰과 사용자 정보를 localStorage에 저장
          localStorage.setItem('authToken', data.jwtToken);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          console.log('로컬 스토리지에 사용자 정보 저장 완료');
          
          // AuthContext 업데이트
          await socialLogin(data.user);
          
          console.log('AuthContext 업데이트 완료');
          
          // URL을 루트 경로로 변경하고 About 페이지로 이동
          window.history.replaceState({}, document.title, '/');
          alert('Google 로그인이 완료되었습니다!');
          navigate('/');
        } else {
          console.error('세션 데이터가 올바르지 않음:', data);
          window.history.replaceState({}, document.title, '/');
          alert('세션에서 사용자 정보를 가져올 수 없습니다.');
          navigate('/login');
        }
      } catch (error) {
        console.error('OAuth 콜백 처리 실패:', error);
        window.history.replaceState({}, document.title, '/');
        alert('로그인 정보를 확인하는 중 오류가 발생했습니다.');
        setCurrentPage?.('login');
      }
    };

    handleOAuthCallback();
  }, [navigate, socialLogin, setCurrentPage]);

  return (
    <div className={`login-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="login-background">
        <div className="login-particles">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="login-particle"
              style={{
                left: `${(i * 2) % 100}%`,
                animationDelay: `${(i * 0.1) % 3}s`,
                animationDuration: `${3 + (i % 3)}s`
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="login-content">
        <div className="login-loading">
          <div className="login-spinner"></div>
          <h2>로그인 처리 중...</h2>
          <p>잠시만 기다려주세요.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;

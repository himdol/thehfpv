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
        console.log('=== OAuth callback processing started ===');
        
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');

        if (error) {
          console.error('OAuth error:', error);
          alert('Social login failed: ' + error);
          navigate('/login');
          return;
        }

        console.log('Requesting session information...');
        const response = await fetch('http://localhost:8080/session/user', {
          method: 'GET',
          credentials: 'include',
        });

        console.log('Session response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Session request failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('Session data:', data);

        if (data.authenticated && data.user && data.jwtToken) {
          localStorage.setItem('authToken', data.jwtToken);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          console.log('User information saved to local storage');
          
          await socialLogin(data.user);
          
          console.log('AuthContext updated successfully');
          
          // Change URL to root path and navigate to About page
          window.history.replaceState({}, document.title, '/');
          alert('Google login completed!');
          navigate('/');
        } else {
          console.error('Session data is invalid:', data);
          window.history.replaceState({}, document.title, '/');
          alert('Failed to retrieve user information from session.');
          navigate('/login');
        }
      } catch (error) {
        console.error('OAuth callback processing failed:', error);
        window.history.replaceState({}, document.title, '/');
        alert('An error occurred while verifying login information.');
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
          <h2>Processing login...</h2>
          <p>Please wait.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  setCurrentPage: (page: string) => void;
  previousPage?: string;
}

const Login: React.FC<LoginProps> = ({ setCurrentPage, previousPage }) => {
  const { isDarkMode } = useTheme();
  const { login, register, loading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [submitError, setSubmitError] = useState<string | null>(null);

  // URL 파라미터 제거
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error) {
      // URL에서 파라미터 제거
      window.history.replaceState({}, document.title, '/');
      
      if (error === 'oauth_cancelled') {
        setSubmitError('Google 로그인이 취소되었습니다. 다시 시도해주세요.');
        // 5초 후 에러 메시지 자동 제거
        setTimeout(() => {
          setSubmitError(null);
        }, 5000);
      } else if (error === 'oauth_failed') {
        setSubmitError('Google 로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        // 5초 후 에러 메시지 자동 제거
        setTimeout(() => {
          setSubmitError(null);
        }, 5000);
      } else {
        setSubmitError('로그인 중 오류가 발생했습니다.');
        // 5초 후 에러 메시지 자동 제거
        setTimeout(() => {
          setSubmitError(null);
        }, 5000);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    try {
      if (isLogin) {
        // Login logic
        await login({
          email: formData.email,
          password: formData.password
        });
        
        // 로그인 성공 후 이전 페이지로 이동
        const targetPage = previousPage || 'about';
        alert('로그인이 완료되었습니다!');
        setCurrentPage(targetPage);
      } else {
        // Sign up logic
        if (formData.password !== formData.confirmPassword) {
          setSubmitError('비밀번호가 일치하지 않습니다.');
          return;
        }
        
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName
        });
        alert('회원가입이 완료되었습니다! 이메일 인증을 확인해주세요.');
        
        // 회원가입 성공 후 로그인 폼으로 전환
        setIsLogin(true);
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: ''
        });
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleLogin = () => {
    // Google OAuth2 로그인 페이지로 리다이렉트
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className={`login-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="login-background">
        <div className="login-particles">
          {[...Array(100)].map((_, i) => {
            // 고정된 랜덤 값들을 미리 계산하여 저장
            const fixedValues = {
              left: (i * 7.3) % 100, // 고정된 위치 계산
              top: (i * 11.7) % 100,
              delay: (i * 0.05) % 5,
              x: (i * 13.2) % 200 - 100,
              y: (i * 8.9) % 200 - 100,
              duration: 3 + (i * 0.04) % 4
            };
            
            return (
              <motion.div
                key={i}
                className="login-particle"
                style={{
                  left: `${fixedValues.left}%`,
                  top: `${fixedValues.top}%`,
                  animationDelay: `${fixedValues.delay}s`
                }}
                animate={{
                  x: [0, fixedValues.x],
                  y: [0, fixedValues.y],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: fixedValues.duration,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut'
                }}
              />
            );
          })}
        </div>
      </div>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="login-header">
          <motion.div
            className="login-logo"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {/* 이미지가 있으면 이미지 표시, 없으면 H 텍스트 표시 */}
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="login-logo-image"
              onError={(e) => {
                // 이미지 로드 실패 시 H 텍스트 표시
                e.currentTarget.style.display = 'none';
                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                if (nextElement) {
                  nextElement.style.display = 'flex';
                }
              }}
            />
            <span className="login-logo-text">H</span>
          </motion.div>
          <h1 className="login-title">
            {isLogin ? 'Welcome Back!' : 'Join Us!'}
          </h1>
          <p className="login-subtitle">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="login-toggle">
          <button
            className={`login-toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button
            className={`login-toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <motion.form
          className="login-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {!isLogin && (
            <>
              <div className="login-input-group">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="login-input"
                  placeholder="Enter your first name"
                  required={!isLogin}
                />
              </div>
              <div className="login-input-group">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="login-input"
                  placeholder="Enter your last name"
                  required={!isLogin}
                />
              </div>
            </>
          )}

          <div className="login-input-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="login-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="login-input-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="login-input"
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && (
            <div className="login-input-group">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="login-input"
                placeholder="Confirm your password"
                required={!isLogin}
              />
            </div>
          )}

          {isLogin && (
            <motion.div
              className="login-options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <label className="login-checkbox">
                <input type="checkbox" />
                <span className="login-checkmark"></span>
                Remember me
              </label>
              <button type="button" className="login-forgot">
                Forgot password?
              </button>
            </motion.div>
          )}

          {/* Error Message */}
          {(error || submitError) && (
            <motion.div
              className="login-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error || submitError}
            </motion.div>
          )}

          <motion.button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {loading ? '처리 중...' : (isLogin ? 'Sign In' : 'Create Account')}
          </motion.button>
        </motion.form>

        {/* Social Login */}
        <motion.div
          className="login-social"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="login-divider">
            <span>Or continue with</span>
          </div>
          
          <div className="login-social-buttons">
            <motion.button
              className="login-social-btn login-google-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoogleLogin}
            >
              <svg className="login-social-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface ProfileProps {
  setCurrentPage: (page: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ setCurrentPage }) => {
  const { isDarkMode } = useTheme();
  const { user, updateProfile, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPasswordChange, setIsPasswordChange] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(null);

  // OAuth 사용자인지 확인 (provider가 'google'이면 OAuth 사용자)
  const isOAuthUser = user?.provider === 'google';

  // 사용자 정보로 폼 초기화
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      if (isPasswordChange) {
        // 비밀번호 변경 로직
        if (!formData.currentPassword) {
          setSubmitError('현재 비밀번호를 입력해주세요.');
          return;
        }
        
        if (!formData.newPassword) {
          setSubmitError('새 비밀번호를 입력해주세요.');
          return;
        }
        
        if (formData.newPassword.length < 6) {
          setSubmitError('새 비밀번호는 최소 6자 이상이어야 합니다.');
          return;
        }
        
        if (formData.newPassword !== formData.confirmPassword) {
          setSubmitError('새 비밀번호가 일치하지 않습니다.');
          return;
        }

        await updateProfile({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });
        
        setSuccessMessage('비밀번호가 성공적으로 변경되었습니다.');
        
        // 비밀번호 필드 초기화
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
      } else {
        // 개인정보 수정 로직 (이메일 제외)
        if (!formData.firstName.trim()) {
          setSubmitError('이름을 입력해주세요.');
          return;
        }
        
        if (!formData.lastName.trim()) {
          setSubmitError('성을 입력해주세요.');
          return;
        }

        await updateProfile({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim()
        });
        
        setSuccessMessage('개인정보가 성공적으로 수정되었습니다.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '오류가 발생했습니다.';
      setSubmitError(errorMessage);
      
      // 비밀번호 변경 실패 시 현재 비밀번호 필드 초기화
      if (isPasswordChange) {
        setFormData({
          ...formData,
          currentPassword: ''
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    setFormData(newFormData);
    
    // 비밀번호 일치 여부 실시간 확인
    if (e.target.name === 'newPassword' || e.target.name === 'confirmPassword') {
      checkPasswordMatch(newFormData.newPassword, newFormData.confirmPassword);
    }
  };

  const handleCancel = () => {
    setCurrentPage('about');
  };

  const getUserInitials = (firstName: string | null | undefined, lastName: string | null | undefined) => {
    const firstInitial = firstName && firstName.length > 0 ? firstName.charAt(0) : '';
    const lastInitial = lastName && lastName.length > 0 ? lastName.charAt(0) : '';
    return `${firstInitial}${lastInitial}`.toUpperCase() || 'U';
  };

  // 비밀번호 일치 여부 실시간 확인
  const checkPasswordMatch = (newPassword: string, confirmPassword: string) => {
    if (confirmPassword && newPassword !== confirmPassword) {
      setPasswordMatchError('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordMatchError(null);
    }
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
          <div className="profile-avatar">
            {user ? getUserInitials(user.firstName, user.lastName) : 'U'}
          </div>
          <h1 className="login-title">내 정보 수정</h1>
          <p className="login-subtitle">개인정보를 수정하거나 비밀번호를 변경하세요</p>
        </div>

        {/* Toggle Buttons - OAuth 사용자가 아닐 때만 비밀번호 수정 버튼 표시 */}
        <div className="login-toggle">
          <button
            className={`login-toggle-btn ${!isPasswordChange ? 'active' : ''}`}
            onClick={() => setIsPasswordChange(false)}
          >
            개인정보
          </button>
          {!isOAuthUser && (
            <button
              className={`login-toggle-btn ${isPasswordChange ? 'active' : ''}`}
              onClick={() => setIsPasswordChange(true)}
            >
              비밀번호
            </button>
          )}
        </div>

        {/* Form */}
        <motion.form
          className="login-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {!isPasswordChange ? (
            <>
              <div className="login-input-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="login-input login-input-disabled"
                  placeholder="이메일 (변경 불가)"
                  disabled
                  title="이메일은 변경할 수 없습니다"
                />
              </div>
              <div className="login-input-group">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="login-input"
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>
              <div className="login-input-group">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="login-input"
                  placeholder="성을 입력하세요"
                  required
                />
              </div>
            </>
          ) : !isOAuthUser ? (
            <>
              <div className="login-input-group">
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="login-input"
                  placeholder="현재 비밀번호를 입력하세요"
                  required
                />
              </div>
              <div className="login-input-group">
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="login-input"
                  placeholder="새 비밀번호를 입력하세요"
                  required
                />
              </div>
              <div className="login-input-group">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`login-input ${passwordMatchError ? 'error' : ''}`}
                  placeholder="새 비밀번호를 다시 입력하세요"
                  required
                />
                {passwordMatchError && (
                  <div className="password-match-error">
                    {passwordMatchError}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="oauth-user-message">
              <p>구글 계정으로 로그인한 사용자는 비밀번호를 변경할 수 없습니다.</p>
              <p>비밀번호 변경이 필요하시면 구글 계정 설정에서 변경해주세요.</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <motion.div
              className="login-success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {successMessage}
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

          <div className="profile-actions">
            <motion.button
              type="button"
              className="profile-cancel-btn"
              onClick={handleCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              취소
            </motion.button>
            <motion.button
              type="submit"
              className="profile-submit-btn"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {loading ? '처리 중...' : (isPasswordChange ? '비밀번호 변경' : '정보 수정')}
            </motion.button>
          </div>
        </motion.form>

        {/* User Info Display */}
        {user && (
          <motion.div
            className="user-info-display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="user-info-header">
              <h3>현재 정보</h3>
            </div>
            <div className="user-info-content">
              <div className="user-info-item">
                <span className="user-info-label">이름:</span>
                <span className="user-info-value">{user.firstName} {user.lastName}</span>
              </div>
              <div className="user-info-item">
                <span className="user-info-label">이메일:</span>
                <span className="user-info-value" title="이메일은 변경할 수 없습니다 (소셜 로그인 연동을 위해)">
                  {user.email} <span style={{fontSize: '0.8em', color: '#666'}}>(변경 불가)</span>
                </span>
              </div>
              <div className="user-info-item">
                <span className="user-info-label">권한:</span>
                <span className="user-info-value">{user.userRole}</span>
              </div>
              <div className="user-info-item">
                <span className="user-info-label">이메일 인증:</span>
                <span className={`user-info-value ${user.emailVerified ? 'verified' : 'unverified'}`}>
                  {user.emailVerified ? '인증됨' : '미인증'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface ProfileProps {
  setCurrentPage?: (page: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ setCurrentPage }) => {
  const navigate = useNavigate();
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
        // Password change logic
        if (!formData.currentPassword) {
          setSubmitError('Please enter your current password.');
          return;
        }
        
        if (!formData.newPassword) {
          setSubmitError('Please enter a new password.');
          return;
        }
        
        if (formData.newPassword.length < 6) {
          setSubmitError('New password must be at least 6 characters long.');
          return;
        }
        
        if (formData.newPassword !== formData.confirmPassword) {
          setSubmitError('New passwords do not match.');
          return;
        }

        await updateProfile({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });
        
        setSuccessMessage('Password changed successfully.');
        
        // Reset password fields
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
      } else {
        // Personal info update logic (excluding email)
        if (!formData.firstName.trim()) {
          setSubmitError('Please enter your first name.');
          return;
        }
        
        if (!formData.lastName.trim()) {
          setSubmitError('Please enter your last name.');
          return;
        }

        await updateProfile({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim()
        });
        
        setSuccessMessage('Personal information updated successfully.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred.';
      setSubmitError(errorMessage);
      
      // Reset current password field on password change failure
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
    navigate('/');
  };

  const getUserInitials = (firstName: string | null | undefined, lastName: string | null | undefined) => {
    const firstInitial = firstName && firstName.length > 0 ? firstName.charAt(0) : '';
    const lastInitial = lastName && lastName.length > 0 ? lastName.charAt(0) : '';
    return `${firstInitial}${lastInitial}`.toUpperCase() || 'U';
  };

  // Real-time password match check
  const checkPasswordMatch = (newPassword: string, confirmPassword: string) => {
    if (confirmPassword && newPassword !== confirmPassword) {
      setPasswordMatchError('Passwords do not match.');
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
          <h1 className="login-title">Edit Profile</h1>
          <p className="login-subtitle">Update your personal information or change your password</p>
        </div>

        {/* Toggle Buttons - Show password button only for non-OAuth users */}
        <div className="login-toggle">
          <button
            className={`login-toggle-btn ${!isPasswordChange ? 'active' : ''}`}
            onClick={() => setIsPasswordChange(false)}
          >
            Personal Info
          </button>
          {!isOAuthUser && (
            <button
              className={`login-toggle-btn ${isPasswordChange ? 'active' : ''}`}
              onClick={() => setIsPasswordChange(true)}
            >
              Password
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
                  placeholder="Email (cannot be changed)"
                  disabled
                  title="Email cannot be changed"
                />
              </div>
              <div className="login-input-group">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="login-input"
                  placeholder="Enter your first name"
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
                  placeholder="Enter your last name"
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
                  placeholder="Enter your current password"
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
                  placeholder="Enter your new password"
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
                  placeholder="Re-enter your new password"
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
              <p>Users logged in with Google cannot change their password.</p>
              <p>If you need to change your password, please do so in your Google account settings.</p>
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
              Cancel
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
              {loading ? 'Processing...' : (isPasswordChange ? 'Change Password' : 'Update Info')}
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
              <h3>Current Information</h3>
            </div>
            <div className="user-info-content">
              <div className="user-info-item">
                <span className="user-info-label">Name:</span>
                <span className="user-info-value">{user.firstName} {user.lastName}</span>
              </div>
              <div className="user-info-item">
                <span className="user-info-label">Email:</span>
                <span className="user-info-value" title="Email cannot be changed (for social login integration)">
                  {user.email} <span style={{fontSize: '0.8em', color: '#666'}}>(cannot be changed)</span>
                </span>
              </div>
              <div className="user-info-item">
                <span className="user-info-label">Role:</span>
                <span className="user-info-value">{user.userRole}</span>
              </div>
              <div className="user-info-item">
                <span className="user-info-label">Email Verified:</span>
                <span className={`user-info-value ${user.emailVerified ? 'verified' : 'unverified'}`}>
                  {user.emailVerified ? 'Verified' : 'Not Verified'}
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

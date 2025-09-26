import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentPage, 
  setCurrentPage
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'about', label: 'About H' },
    { id: 'blog', label: 'BLOG' },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    setCurrentPage(item.id);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentPage('about');
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLoginClick = () => {
    setCurrentPage('login');
  };

  const getUserInitials = (firstName: string | null | undefined, lastName: string | null | undefined) => {
    const firstInitial = firstName && firstName.length > 0 ? firstName.charAt(0) : '';
    const lastInitial = lastName && lastName.length > 0 ? lastName.charAt(0) : '';
    return `${firstInitial}${lastInitial}`.toUpperCase() || 'U';
  };

  // 외부 클릭 시 사용자 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header className="header">
      <div className="logo" onClick={() => setCurrentPage('about')} style={{ cursor: 'pointer' }}>
        <span className="logo-h">H</span>
      </div>
      <nav className="nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item)}
            className={currentPage === item.id ? 'nav-item active' : 'nav-item'}
          >
            {item.label}
          </button>
        ))}
        {!isLoggedIn && (
          <button
            onClick={handleLoginClick}
            className={currentPage === 'login' ? 'nav-item active' : 'nav-item'}
          >
            SIGN IN
          </button>
        )}
      </nav>
      <div className="header-actions">
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        {isLoggedIn && user && (
          <div className="user-profile-container" ref={userMenuRef}>
            <button
              className="user-profile-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              title={`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}
            >
              <div className="user-avatar">
                {getUserInitials(user.firstName, user.lastName)}
              </div>
            </button>
            {showUserMenu && (
              <div className="user-menu">
                <div className="user-info">
                  <div className="user-avatar-large">
                    {getUserInitials(user.firstName, user.lastName)}
                  </div>
                  <div className="user-details">
                    <div className="user-name">{`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}</div>
                    <div className="user-email">{user.email}</div>
                    <div className="user-role">{user.userRole}</div>
                  </div>
                </div>
                <div className="user-menu-actions">
                  <button 
                    className="user-menu-item" 
                    onClick={() => {
                      setShowUserMenu(false);
                      setCurrentPage('profile');
                    }}
                  >
                    내 정보
                  </button>
                  <button className="user-menu-item" onClick={handleLogout}>
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

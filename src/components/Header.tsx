import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentPage, 
  setCurrentPage
}) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const navItems = [
    { id: 'about', label: 'About H' },
    { id: 'blog', label: 'BLOG' },
    { id: 'login', label: 'SIGN IN' },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    setCurrentPage(item.id);
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer' }}>
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
      </nav>
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </header>
  );
};

export default Header;

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentPage, 
  setCurrentPage, 
  sidebarOpen, 
  setSidebarOpen 
}) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const navItems = [
    { id: 'home', label: '홈', showSidebar: false },
    { id: 'about', label: '소개', showSidebar: false },
    { id: 'blog', label: '블로그', showSidebar: true },
    { id: 'shop', label: '샵', showSidebar: true },
    { id: 'login', label: '로그인', showSidebar: false },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    setCurrentPage(item.id);
    if (item.showSidebar) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <span className="logo-m">M</span>
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

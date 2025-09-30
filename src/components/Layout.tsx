import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../contexts/ThemeContext';
import '../App.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode } = useTheme();
  const location = useLocation();

  // Get current page from location pathname
  const getCurrentPage = (pathname: string) => {
    if (pathname === '/') return 'about';
    if (pathname.startsWith('/blog/') && pathname !== '/blog') return 'blog-detail';
    return pathname.substring(1); // Remove leading slash
  };

  const currentPage = getCurrentPage(location.pathname);

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <Header 
        currentPage={currentPage}
        setCurrentPage={() => {}} // Not needed with React Router
      />
      <main className="main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

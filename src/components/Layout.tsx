import React, { ReactNode } from 'react';
import Header from './Header';
import { useTheme } from '../contexts/ThemeContext';
import '../App.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <Header />
      <main className="main">
        {children}
      </main>
    </div>
  );
};

export default Layout;

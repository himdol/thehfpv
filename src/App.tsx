import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Router from './components/Router';

function App() {
  // Initialize currentPage from localStorage or default to 'about'
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'about';
  });

  // Save currentPage to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Layout 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        >
          <Router 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

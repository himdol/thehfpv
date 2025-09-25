import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
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
      <Layout 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      >
        <Router 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </Layout>
    </ThemeProvider>
  );
}

export default App;

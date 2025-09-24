import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Router from './components/Router';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

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

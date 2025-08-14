import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import Shop from './pages/Shop';
import Login from './pages/Login';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'about':
        return <About />;
      case 'blog':
        return <Blog sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />;
      case 'shop':
        return <Shop sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />;
      case 'login':
        return <Login />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main className="pt-16">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;

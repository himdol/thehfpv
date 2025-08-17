import React from 'react';
import Home from '../pages/Home';
import About from '../pages/About';
import Blog from '../pages/Blog';
import Shop from '../pages/Shop';
import Login from '../pages/Login';

interface RouterProps {
  currentPage: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Router: React.FC<RouterProps> = ({ currentPage, sidebarOpen, setSidebarOpen }) => {
  switch (currentPage) {
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

export default Router;

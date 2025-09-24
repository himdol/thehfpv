import React from 'react';
import Home from '../pages/Home';
import About from '../pages/About';
import Blog from '../pages/Blog';
import Login from '../pages/Login';

interface RouterProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Router: React.FC<RouterProps> = ({ currentPage, setCurrentPage }) => {
  switch (currentPage) {
    case 'about':
      return <About />;
    case 'blog':
      return <Blog />;
    case 'login':
      return <Login />;
    default:
      return <Home setCurrentPage={setCurrentPage} />;
  }
};

export default Router;

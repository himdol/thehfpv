import React from 'react';
import About from '../pages/About';
import Blog from '../pages/Blog';
import Login from '../pages/Login';

interface RouterProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Router: React.FC<RouterProps> = ({ currentPage, setCurrentPage }) => {
  switch (currentPage) {
    case 'blog':
      return <Blog setCurrentPage={setCurrentPage} />;
    case 'login':
      return <Login />;
    default:
      return <About />;
  }
};

export default Router;

import React from 'react';
import About from '../pages/About';
import Blog from '../pages/Blog';
import Login from '../pages/Login';

interface RouterProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  previousPage?: string;
}

const Router: React.FC<RouterProps> = ({ currentPage, setCurrentPage, previousPage }) => {
  switch (currentPage) {
    case 'blog':
      return <Blog setCurrentPage={setCurrentPage} />;
    case 'login':
      return <Login setCurrentPage={setCurrentPage} previousPage={previousPage} />;
    default:
      return <About />;
  }
};

export default Router;

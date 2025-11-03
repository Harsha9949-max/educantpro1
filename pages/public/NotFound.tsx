import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '../../constants';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center p-4 text-center">
      <div>
        <h1 className="text-6xl font-extrabold text-primary-600">404</h1>
        <p className="text-2xl font-semibold mt-4">Page Not Found</p>
        <p className="text-gray-500 mt-2">Sorry, the page you are looking for does not exist.</p>
        <div className="mt-8">
          <Link to={PATHS.LANDING} className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
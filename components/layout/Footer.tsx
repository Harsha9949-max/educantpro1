
import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '../../constants';
import { Role } from '../../types';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a href="#" className="flex items-center mb-4 sm:mb-0">
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-primary-600">EDUCANTPRO</span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0">
            <li>
              <Link to={PATHS.PRIVACY} className="mr-4 hover:underline md:mr-6">Privacy Policy</Link>
            </li>
            <li>
              <Link to={PATHS.TERMS} className="mr-4 hover:underline md:mr-6">Terms of Service</Link>
            </li>
            <li>
              <Link to={`/login/${Role.Admin}`} className="hover:underline">Admin Login</Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center">© {new Date().getFullYear()} EDUCANTPRO™. All Rights Reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;

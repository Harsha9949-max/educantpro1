import React from 'react';

interface HeaderProps {
  onIntegrateClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onIntegrateClick }) => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm fixed w-full z-20 top-0 left-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-primary-600">EDUCANTPRO</span>
        </a>
        <div className="flex md:order-2">
          <button
            onClick={onIntegrateClick}
            type="button"
            className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0"
          >
            Integrate Your Institute
          </button>
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0">
            <li>
              <button onClick={() => scrollTo('features')} className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary-700 md:p-0">
                Features
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo('portals')} className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary-700 md:p-0">
                Portals
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
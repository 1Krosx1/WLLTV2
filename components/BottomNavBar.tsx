
import React from 'react';
import { Page } from '../types';

interface BottomNavBarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; page: Page; currentPage: Page; onNavigate: (page: Page) => void }> = ({ icon, page, currentPage, onNavigate }) => {
  const isActive = currentPage === page;
  return (
    <button
      onClick={() => onNavigate(page)}
      className={`flex flex-col items-center justify-center w-1/5 transition-colors duration-200 ${isActive ? 'text-blue-500' : 'text-gray-400'}`}
    >
      <div className={`p-3 rounded-full ${isActive ? 'bg-blue-500' : 'bg-transparent'}`}>
        <div className={`${isActive ? 'text-white' : 'text-blue-500'}`}>{icon}</div>
      </div>
    </button>
  );
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentPage, onNavigate }) => {
  const iconClasses = "w-8 h-8";

  const icons = {
    [Page.Home]: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
    [Page.Dictionary]: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4z" />
      </svg>
    ),
    [Page.Add]: (
       <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
      </svg>
    ),
    [Page.Personal]: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    ),
    [Page.Settings]: (
      <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] rounded-t-2xl">
      <div className="flex justify-around items-center h-20">
        <NavItem icon={icons[Page.Home]} page={Page.Home} currentPage={currentPage} onNavigate={onNavigate} />
        <NavItem icon={icons[Page.Dictionary]} page={Page.Dictionary} currentPage={currentPage} onNavigate={onNavigate} />
        <NavItem icon={icons[Page.Add]} page={Page.Add} currentPage={currentPage} onNavigate={onNavigate} />
        <NavItem icon={icons[Page.Personal]} page={Page.Personal} currentPage={currentPage} onNavigate={onNavigate} />
        <NavItem icon={icons[Page.Settings]} page={Page.Settings} currentPage={currentPage} onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default BottomNavBar;

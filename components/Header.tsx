import React from 'react';

interface HeaderProps {
  title: string;
  onBack: () => void;
  actionButton?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, onBack, actionButton }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4 py-2">
        <button onClick={onBack} className="bg-red-500 text-white rounded-full p-3 shadow-md flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-4xl font-extrabold text-blue-800">{title}</h1>
      </div>
      {actionButton}
    </div>
  );
};

export default Header;
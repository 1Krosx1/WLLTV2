
import React, { useState, useEffect } from 'react';
import Header from './Header';

interface UpdatesScreenProps {
  onBack: () => void;
}

const UpdatesScreen: React.FC<UpdatesScreenProps> = ({ onBack }) => {
    const [isChecking, setIsChecking] = useState(false);
    const [lastChecked, setLastChecked] = useState<string>('Not checked yet');

    useEffect(() => {
        // Simulate an initial check on screen load
        handleCheckForUpdates();
    }, []);

    const handleCheckForUpdates = () => {
        setIsChecking(true);
        setTimeout(() => {
            const now = new Date();
            setLastChecked(`Just now at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
            setIsChecking(false);
        }, 1500); // Simulate network delay
    };


  return (
    <div className="p-4 pb-12 bg-white min-h-screen flex flex-col">
      <Header title="Updates" onBack={onBack} />
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <div className="bg-green-100 rounded-full p-6 mb-6">
            <svg className="w-24 h-24 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <h2 className="text-4xl font-extrabold text-blue-800 mb-2">You're Up to Date!</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-sm">
            The Minasbate Language App has the latest features and improvements.
        </p>
        <button
            onClick={handleCheckForUpdates}
            disabled={isChecking}
            className="bg-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-wait"
        >
            {isChecking ? 'Checking...' : 'Check for Updates'}
        </button>
        <p className="text-sm text-gray-500 mt-4">
            Last checked: {lastChecked}
        </p>
      </div>
    </div>
  );
};

export default UpdatesScreen;
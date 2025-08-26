

import React, { useState } from 'react';
import Header from './Header';
import { Page } from '../types';
import ClearDataModal from './ClearDataModal';

interface SettingsScreenProps {
  onBack: () => void;
  onNavigate: (page: Page) => void;
  onClearAllData: () => void;
}

const SettingsButton: React.FC<{ label: string; color: string; onClick?: () => void; className?: string }> = ({ label, color, onClick, className = '' }) => {
  return (
    <button onClick={onClick} className={`${color} ${className} text-white font-bold text-2xl rounded-2xl shadow-md p-4 flex items-center justify-center text-center h-24`}>
      {label}
    </button>
  );
};


const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onNavigate, onClearAllData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmClear = () => {
    onClearAllData();
    setIsModalOpen(false);
  };
  
  return (
    <div className="p-4">
      <Header title="Settings" onBack={onBack} />
      <div className="mt-8 grid grid-cols-2 gap-4">
        <SettingsButton label="POLICY" color="bg-cyan-400" onClick={() => onNavigate(Page.Policy)} />
        <SettingsButton label="UPDATES" color="bg-purple-600" onClick={() => onNavigate(Page.Updates)} />
        <SettingsButton label="ARCHIVES" color="bg-green-500" onClick={() => onNavigate(Page.Archives)} />
        <SettingsButton label="MISSION & VISION" color="bg-orange-400" onClick={() => onNavigate(Page.MissionVision)} />
        <SettingsButton label="BACKUP & RESTORE" color="bg-teal-500" className="col-span-2" onClick={() => onNavigate(Page.BackupRestore)} />
        <SettingsButton label="CLEAR ALL DATA" color="bg-red-600" className="col-span-2" onClick={() => setIsModalOpen(true)} />
      </div>
      <ClearDataModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmClear}
      />
    </div>
  );
};

export default SettingsScreen;

import React from 'react';
import { playSound, SoundType } from './sounds';

interface ClearDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ClearDataModal: React.FC<ClearDataModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const handleConfirmClick = () => {
    playSound(SoundType.Delete);
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm text-center" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 text-black">Are you sure?</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to clear all data including: words, recordings, and profile? This action cannot be undone.
        </p>
        
        <div className="flex justify-center gap-4">
          <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-lg w-1/2">
            No
          </button>
          <button onClick={handleConfirmClick} className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg w-1/2">
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearDataModal;

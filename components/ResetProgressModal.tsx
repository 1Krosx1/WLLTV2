import React, { useState, useEffect } from 'react';
import { Activity, ActivityCategory } from '../types';
import { playSound, SoundType } from './sounds';

interface ResetProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (activityIds: ActivityCategory[]) => void;
  activities: Activity[];
}

const ResetProgressModal: React.FC<ResetProgressModalProps> = ({ isOpen, onClose, onConfirm, activities }) => {
  const [selectedActivities, setSelectedActivities] = useState<Set<ActivityCategory>>(new Set());

  // Reset selection when modal is opened/closed
  useEffect(() => {
    setSelectedActivities(new Set());
  }, [isOpen]);
  
  if (!isOpen) return null;

  const quizActivities = activities.filter(a => a.type === 'quiz');

  const handleToggleActivity = (id: ActivityCategory) => {
    const newSelection = new Set(selectedActivities);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedActivities(newSelection);
  };
  
  const handleSelectAll = () => {
      if (selectedActivities.size === quizActivities.length) {
          setSelectedActivities(new Set());
      } else {
          const allIds = new Set(quizActivities.map(a => a.id));
          setSelectedActivities(allIds);
      }
  };

  const handleConfirmClick = () => {
    if (selectedActivities.size === 0) {
      alert("Please select at least one activity to reset.");
      return;
    }
    if (window.confirm(`Are you sure you want to reset the progress for ${selectedActivities.size} activit(y/ies)?`)) {
      playSound(SoundType.Delete);
      onConfirm(Array.from(selectedActivities));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 text-black">Reset Progress</h2>
        <p className="text-gray-600 mb-4">Select the activities you want to reset to 0% progress.</p>
        
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {quizActivities.map(activity => (
                 <label key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={selectedActivities.has(activity.id)}
                        onChange={() => handleToggleActivity(activity.id)}
                        className="h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-lg font-medium text-black">{activity.title}</span>
                </label>
            ))}
        </div>

        <div className="mt-4">
             <label className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 cursor-pointer border-t border-gray-200">
                <input
                    type="checkbox"
                    checked={selectedActivities.size === quizActivities.length && quizActivities.length > 0}
                    onChange={handleSelectAll}
                    className="h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-lg font-bold text-black">Select All</span>
            </label>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg">Cancel</button>
          <button onClick={handleConfirmClick} className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg" disabled={selectedActivities.size === 0}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default ResetProgressModal;
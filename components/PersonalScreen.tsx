
import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import Header from './Header';
import { UserProfile } from '../types';
import { playSound, SoundType } from './sounds';

interface PersonalScreenProps {
  onBack: () => void;
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

const PersonalScreen: React.FC<PersonalScreenProps> = ({ onBack, userProfile, onSaveProfile }) => {
  const [nickname, setNickname] = useState(userProfile.nickname);
  const [photo, setPhoto] = useState<string | null>(userProfile.photo);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'success'>('idle');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changesMade = nickname !== userProfile.nickname || photo !== userProfile.photo;
    setHasChanges(changesMade);
    if (changesMade) {
      setSaveState('idle');
    }
  }, [nickname, photo, userProfile.nickname, userProfile.photo]);
  
  useEffect(() => {
    // Sync component state if userProfile prop changes from parent
    setNickname(userProfile.nickname);
    setPhoto(userProfile.photo);
  }, [userProfile]);


  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!hasChanges || saveState === 'saving') return;

    setSaveState('saving');
    setTimeout(() => {
      onSaveProfile({ nickname, photo });
      playSound(SoundType.Save);
      setSaveState('success');

      setTimeout(() => {
         setSaveState(s => s === 'success' ? 'idle' : s);
      }, 2000);
    }, 1000);
  };

  const getButtonState = () => {
      if (saveState === 'saving') return { text: 'Saving...', disabled: true, className: 'bg-yellow-500' };
      if (saveState === 'success') return { text: 'Saved!', disabled: true, className: 'bg-green-500' };
      if (!hasChanges) return { text: 'SAVE', disabled: true, className: 'bg-gray-400' };
      return { text: 'SAVE', disabled: false, className: 'bg-red-500' };
  }

  const buttonState = getButtonState();

  return (
    <div className="p-4 pb-28">
      <Header title="Personal" onBack={onBack} />
      <div className="mt-8 flex flex-col items-center">
        <div className="w-full max-w-sm space-y-6">
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />

            <div>
              <label htmlFor="nickname" className="text-xl font-semibold text-black px-4 mb-2 block">Nickname</label>
              <input 
                id="nickname" 
                type="text" 
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter nickname"
                className="w-full bg-gray-200 rounded-full py-3 px-6 text-lg text-black placeholder:text-gray-500" />
            </div>
            
            <div className="flex justify-center">
                <button onClick={handleUploadClick} className="bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg">
                  Upload a Photo
                </button>
            </div>

            <div className="w-full aspect-square bg-gray-200 rounded-2xl shadow-md flex items-center justify-center overflow-hidden">
                {photo ? (
                    <img src={photo} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-400 text-2xl">Photo here</span>
                )}
            </div>

            <button 
                onClick={handleSave} 
                disabled={buttonState.disabled}
                className={`w-full text-white font-bold py-4 rounded-full shadow-lg text-xl transition-colors duration-300 ${buttonState.className} ${buttonState.disabled ? 'cursor-not-allowed' : ''}`}>
              {buttonState.text}
            </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalScreen;


import React, { useRef, ChangeEvent } from 'react';
import Header from './Header';

interface BackupRestoreScreenProps {
  onBack: () => void;
  onBackup: () => void;
  onRestore: (fileContent: string) => void;
}

const BackupRestoreScreen: React.FC<BackupRestoreScreenProps> = ({ onBack, onBackup, onRestore }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          onRestore(content);
        } catch (error) {
          console.error("Failed to read file:", error);
          alert('Failed to read the selected file.');
        } finally {
            // Reset the input value to allow selecting the same file again
            if(fileInputRef.current) fileInputRef.current.value = "";
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-4">
      <Header title="Backup & Restore" onBack={onBack} />
      
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="mt-8 space-y-8">
        {/* Backup Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black">Create Backup</h2>
              <p className="text-gray-600">Save all your data to a file on your device.</p>
            </div>
          </div>
          <button
            onClick={onBackup}
            className="w-full mt-4 bg-blue-500 text-white font-bold py-3 rounded-lg text-lg"
          >
            Download Backup File
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-yellow-500">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black">Restore from Backup</h2>
              <p className="text-gray-600">Load data from a backup file.</p>
            </div>
          </div>
          <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
            <p className="font-bold">Warning!</p>
            <p>Restoring will overwrite all current data in the app. This action cannot be undone.</p>
          </div>
          <button
            onClick={handleRestoreClick}
            className="w-full mt-4 bg-yellow-500 text-white font-bold py-3 rounded-lg text-lg"
          >
            Select Backup File to Restore
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackupRestoreScreen;

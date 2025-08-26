
import React from 'react';
import Header from './Header';

interface MissionVisionScreenProps {
  onBack: () => void;
}

const MissionVisionScreen: React.FC<MissionVisionScreenProps> = ({ onBack }) => {
  return (
    <div className="p-4 pb-12 bg-white min-h-screen">
      <Header title="Mission & Vision" onBack={onBack} />
      <div className="mt-6 space-y-8 text-black text-justify">
        
        <div>
          <h2 className="text-3xl font-bold text-blue-800 mb-2">Our Mission</h2>
          <p className="mb-4 text-lg">
            To preserve and promote the Minasbate language by providing an accessible, engaging, and highly personalized learning tool. We empower individuals to learn at their own pace and become active participants in their language journey by enabling them to build their own custom dictionaries. By prioritizing offline, on-device data storage, we ensure that every user has complete ownership and privacy over their learning progress and personal contributions to the language.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-blue-800 mb-2">Our Vision</h2>
          <p className="mb-4 text-lg">
            To create a vibrant, thriving digital community where the Minasbate language is not only learned but lived. We envision a future where every generation, near or far, can connect with their cultural heritage, share their knowledge, and ensure that the richness of Minasbate is carried forward. Our app will serve as a catalyst for cultural pride and a living, user-built archive that helps the language flourish in the modern world.
          </p>
        </div>

      </div>
    </div>
  );
};

export default MissionVisionScreen;

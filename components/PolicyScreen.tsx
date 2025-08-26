import React from 'react';
import Header from './Header';

interface PolicyScreenProps {
  onBack: () => void;
}

const PolicyScreen: React.FC<PolicyScreenProps> = ({ onBack }) => {
  return (
    <div className="p-4 pb-12 bg-white min-h-screen">
      <Header title="Policy & Terms" onBack={onBack} />
      <div className="mt-6 space-y-8 text-black text-justify">
        
        <div>
          <h2 className="text-3xl font-bold text-blue-800 mb-2">Privacy Policy</h2>
          <p className="mb-4">
            Your privacy is critically important to us. This policy outlines how we handle your information. The core principle of this app is that <strong>your data is your own</strong>.
          </p>
          <p className="mb-4">
            All user data, including your profile (nickname and photo), custom words, audio recordings, and activity progress, is stored <strong>only on your own device</strong>. This information is never uploaded to any server, and it is never seen by us or any third party. Because your data is stored locally, you have complete control over it.
          </p>
          <p className="mb-4">
            We collect this information solely to provide and improve the app's features—personalizing greetings, building your personal dictionary, and tracking your learning progress. The app requests microphone access only when you choose to record audio for a new word. You can modify, edit, delete, export, or completely erase all of your data at any time using the features within the app.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-blue-800 mb-2">Terms of Service</h2>
          <p className="mb-4">
            By using the Minasbate Language Learning App, you agree to these terms. This app is provided for the purpose of learning the Minasbate language.
          </p>
          <p className="mb-4">
            You, the user, are responsible for the content you add to the app, such as custom words, images, and audio. You agree not to add any offensive, illegal, or copyrighted material for which you do not own the rights.
          </p>
          <p className="mb-4">
            The app's code, design, and initial content are the intellectual property of the developers. The content you personally add remains your own. This app is provided "as-is" without any warranties. We do not guarantee that it will be free of errors, but we strive to provide the best experience possible.
          </p>
        </div>

      </div>
    </div>
  );
};

export default PolicyScreen;

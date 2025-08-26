
import React from 'react';
import { Activity, ActivityCategory, UserProfile } from '../types';

interface HomeScreenProps {
  activities: Activity[];
  onStartActivity: (activity: ActivityCategory) => void;
  onNavigateToPhrases: () => void;
  userProfile: UserProfile;
}

const UserIcon: React.FC = () => (
  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const ActivityCard: React.FC<{ activity: Activity, onStart: () => void }> = ({ activity, onStart }) => {
  const isStarted = activity.progress > 0;
  const progressColor = isStarted ? 'bg-yellow-400' : 'bg-green-500';

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-3xl font-bold text-black">{activity.title}</h3>
          <p className="text-gray-500">{activity.description}</p>
        </div>
        <div className="text-4xl">{activity.icon}</div>
      </div>
       <div className="mt-4 flex items-center gap-4">
        <button 
            onClick={onStart}
            className={`w-14 h-14 flex items-center justify-center rounded-full shadow-md cursor-pointer transition-transform transform active:scale-95 ${progressColor}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.3 5.14A1 1 0 005 6v8a1 1 0 001.3.94l7-4a1 1 0 000-1.88l-7-4z" />
            </svg>
        </button>
        <div className="relative flex-grow bg-gray-200 rounded-full h-12 shadow-inner flex items-center justify-center overflow-hidden">
            <div 
              className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${activity.progress}%` }}
            />
            <span className="relative z-10 text-lg font-bold text-black">{activity.progress}%</span>
        </div>
      </div>
    </div>
  );
};

const PhrasesCard: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-3xl font-bold text-black">Phrases & Greetings</h3>
          <p className="text-gray-500">Learn common phrases and greetings.</p>
        </div>
        <div className="text-4xl">💬</div>
      </div>
       <div className="mt-4 flex items-center gap-4">
        <button 
            onClick={onNavigate}
            className={`w-14 h-14 flex items-center justify-center rounded-full shadow-md cursor-pointer transition-transform transform active:scale-95 bg-blue-500`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
        </button>
        <div className="relative flex-grow bg-gray-200 rounded-full h-12 shadow-inner flex items-center justify-center">
            <span className="text-lg font-bold text-gray-700">Go to section</span>
        </div>
      </div>
    </div>
  );
};

const HomeScreen: React.FC<HomeScreenProps> = ({ activities, onStartActivity, onNavigateToPhrases, userProfile }) => {
  return (
    <div className="w-full h-full">
        <div className="bg-gradient-to-b from-blue-400 to-blue-500 rounded-b-[3rem] px-6 py-8 shadow-lg">
            <div className="flex justify-between items-center">
                <div className='flex-grow'>
                    <h1 className="text-2xl text-white font-bold">Welcome back, {userProfile.nickname}!</h1>
                    <p className="text-white text-lg">Malipayon na pagbalik, {userProfile.nickname}!</p>
                </div>
                <div className="flex items-center flex-shrink-0">
                    <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center overflow-hidden">
                        {userProfile.photo ? (
                            <img src={userProfile.photo} alt={userProfile.nickname} className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon />
                        )}
                    </div>
                </div>
            </div>
        </div>
        
        <div className="p-6 pb-28">
            <h2 className="text-4xl font-extrabold text-blue-800 mb-4">Activities</h2>
            {activities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} onStart={() => onStartActivity(activity.id)} />
            ))}
            <PhrasesCard onNavigate={onNavigateToPhrases} />
        </div>
    </div>
  );
};

export default HomeScreen;

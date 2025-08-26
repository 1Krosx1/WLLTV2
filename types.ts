

export enum Page {
  Home = 'Home',
  Dictionary = 'Dictionary',
  Add = 'Add',
  Personal = 'Personal',
  Settings = 'Settings',
  Activity = 'Activity',
  Phrases = 'Phrases',
  WordList = 'WordList',
  Archives = 'Archives',
  Policy = 'Policy',
  MissionVision = 'MissionVision',
  Updates = 'Updates',
  BackupRestore = 'BackupRestore',
}

export enum ActivityCategory {
    Actions = 'Actions',
    Animals = 'Animals',
    Values = 'Values',
    Greetings = 'Greetings',
    Phrases = 'Phrases',
    Food = 'Food',
}

export interface Activity {
    id: ActivityCategory;
    title: string;
    description: string;
    icon: string;
    progress: number;
    type?: 'quiz' | 'wordlist';
}

export interface QuizQuestion {
  id: number;
  image: string;
  audio?: string;
  question: string;
  questionEnglish: string;
  options: string[];
  correctAnswer: string;
  category: ActivityCategory;
}

export interface Word {
    id: number;
    word: string;
    meaning: string;
    audio_path: string;
    image_path: string;
    category: ActivityCategory;
}

export interface UserProfile {
    nickname: string;
    photo: string | null;
}

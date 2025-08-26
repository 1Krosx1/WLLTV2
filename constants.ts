import { Activity, ActivityCategory, Word, QuizQuestion } from './types';

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: ActivityCategory.Actions,
    title: 'Actions',
    description: 'Words for things we do everyday.',
    icon: '🏃',
    progress: 0,
    type: 'quiz',
  },
  {
    id: ActivityCategory.Animals,
    title: 'Animals',
    description: 'Names of animals in Masbate.',
    icon: '🐘',
    progress: 0,
    type: 'quiz',
  },
  {
    id: ActivityCategory.Values,
    title: 'Values',
    description: 'Words for good manners and actions.',
    icon: '❤️',
    progress: 0,
    type: 'quiz',
  },
  {
    id: ActivityCategory.Greetings,
    title: 'Greetings',
    description: 'Learn common greetings.',
    icon: '👋',
    progress: 0,
    type: 'wordlist',
  },
  {
    id: ActivityCategory.Phrases,
    title: 'Phrases',
    description: 'Useful phrases for conversations.',
    icon: '🗣️',
    progress: 0,
    type: 'wordlist',
  },
  {
    id: ActivityCategory.Food,
    title: 'Food',
    description: 'Learn words related to food.',
    icon: '🍔',
    progress: 0,
    type: 'wordlist',
  },
];

export const ACTIVITY_QUESTIONS: Record<ActivityCategory, Omit<QuizQuestion, 'id'>[]> = {
  [ActivityCategory.Actions]: [],
  [ActivityCategory.Animals]: [],
  [ActivityCategory.Values]: [],
  [ActivityCategory.Greetings]: [],
  [ActivityCategory.Phrases]: [],
  [ActivityCategory.Food]: [],
};

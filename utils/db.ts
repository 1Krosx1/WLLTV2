

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Word, QuizQuestion, UserProfile, ActivityCategory } from '../types';
import { logger } from './logger';

const DB_NAME = 'minasbate-app-db';
const DB_VERSION = 2;

interface MinasbateDB extends DBSchema {
  words: {
    key: number;
    value: Word;
    indexes: { 'category': ActivityCategory };
  };
  'archived-words': {
    key: number;
    value: Word;
  };
  'quiz-questions': {
    key: number;
    value: QuizQuestion;
    indexes: { 'category': ActivityCategory };
  };
  'user-profile': {
    key: string;
    value: UserProfile;
  };
}

let db: IDBPDatabase<MinasbateDB>;

export async function initDB() {
  logger.log('Initializing IndexedDB...');
  db = await openDB<MinasbateDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      logger.log(`Upgrading DB from version ${oldVersion} to ${DB_VERSION}`);
      if (oldVersion < 2) {
         if (!db.objectStoreNames.contains('words')) {
            const wordStore = db.createObjectStore('words', { keyPath: 'id' });
            wordStore.createIndex('category', 'category');
          }
          if (!db.objectStoreNames.contains('archived-words')) {
            db.createObjectStore('archived-words', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('quiz-questions')) {
            const questionStore = db.createObjectStore('quiz-questions', { keyPath: 'id' });
            questionStore.createIndex('category', 'category');
          }
          if (!db.objectStoreNames.contains('user-profile')) {
            db.createObjectStore('user-profile');
          }
      }
    },
  });
  logger.log('IndexedDB initialized successfully.');
}

// User Profile
export async function saveUserProfile(profile: UserProfile) {
  logger.log('Saving user profile:', profile);
  return db.put('user-profile', profile, 'profile');
}
export async function getUserProfile(): Promise<UserProfile | undefined> {
  logger.log('Getting user profile...');
  const profile = await db.get('user-profile', 'profile');
  logger.log('Retrieved user profile:', profile);
  return profile;
}

// Words
export async function addWord(wordData: Omit<Word, 'id'>): Promise<Word> {
  const newId = Date.now();
  const newWord: Word = { id: newId, ...wordData };
  logger.log('Adding new word:', newWord);
  await db.add('words', newWord);
  logger.log('Word added successfully.');
  return newWord;
}
export async function updateWord(word: Word) {
  logger.log('Updating word:', word);
  return db.put('words', word);
}
export async function getAllWords(): Promise<Word[]> {
  logger.log('Getting all words...');
  const words = await db.getAll('words');
  logger.log(`Retrieved ${words.length} words.`);
  return words;
}
export async function bulkAddWords(words: Word[]) {
  logger.log(`Bulk adding ${words.length} words...`);
  const tx = db.transaction('words', 'readwrite');
  await Promise.all(words.map(word => tx.store.put(word)));
  await tx.done;
  logger.log('Bulk add words complete.');
}
export async function archiveWords(wordIds: number[]): Promise<Word[]> {
    logger.log(`Archiving ${wordIds.length} words:`, wordIds);
    const tx = db.transaction(['words', 'archived-words'], 'readwrite');
    const wordsToArchive: Word[] = [];
    await Promise.all(wordIds.map(async id => {
        const word = await tx.objectStore('words').get(id);
        if(word) {
            wordsToArchive.push(word);
            await tx.objectStore('archived-words').put(word);
            await tx.objectStore('words').delete(id);
        }
    }));
    await tx.done;
    logger.log('Words archived successfully.', wordsToArchive);
    return wordsToArchive;
}
export async function deleteWords(wordIds: number[]) {
    logger.log(`Deleting ${wordIds.length} words:`, wordIds);
    const tx = db.transaction('words', 'readwrite');
    await Promise.all(wordIds.map(id => tx.store.delete(id)));
    await tx.done;
    logger.log('Words deleted successfully.');
}

// Archived Words
export async function getAllArchivedWords(): Promise<Word[]> {
    logger.log('Getting all archived words...');
    const words = await db.getAll('archived-words');
    logger.log(`Retrieved ${words.length} archived words.`);
    return words;
}
export async function bulkAddArchivedWords(words: Word[]) {
    logger.log(`Bulk adding ${words.length} archived words...`);
    const tx = db.transaction('archived-words', 'readwrite');
    await Promise.all(words.map(word => tx.store.put(word)));
    await tx.done;
    logger.log('Bulk add archived words complete.');
}
export async function unarchiveWords(wordIds: number[]): Promise<Word[]> {
    logger.log(`Unarchiving ${wordIds.length} words:`, wordIds);
    const tx = db.transaction(['words', 'archived-words'], 'readwrite');
    const wordsToUnarchive: Word[] = [];
    await Promise.all(wordIds.map(async id => {
        const word = await tx.objectStore('archived-words').get(id);
        if(word) {
            wordsToUnarchive.push(word);
            await tx.objectStore('words').put(word);
            await tx.objectStore('archived-words').delete(id);
        }
    }));
    await tx.done;
    logger.log('Words unarchived successfully.', wordsToUnarchive);
    return wordsToUnarchive;
}

// Quiz Questions
export async function addQuizQuestion(questionData: Omit<QuizQuestion, 'id'>): Promise<QuizQuestion> {
  const newId = Date.now();
  const newQuestion = { id: newId, ...questionData };
  logger.log('Adding new quiz question:', newQuestion);
  await db.add('quiz-questions', newQuestion);
  logger.log('Quiz question added successfully.');
  return newQuestion;
}
export async function updateQuizQuestion(question: QuizQuestion) {
  logger.log('Updating quiz question:', question);
  return db.put('quiz-questions', question);
}
export async function deleteQuizQuestions(questionIds: number[]) {
    logger.log(`Deleting ${questionIds.length} quiz questions:`, questionIds);
    const tx = db.transaction('quiz-questions', 'readwrite');
    await Promise.all(questionIds.map(id => tx.store.delete(id)));
    await tx.done;
    logger.log('Quiz questions deleted successfully.');
}
export async function getAllQuizQuestions(): Promise<QuizQuestion[]> {
  logger.log('Getting all quiz questions...');
  const questions = await db.getAll('quiz-questions');
  logger.log(`Retrieved ${questions.length} quiz questions.`);
  return questions;
}
export async function bulkAddQuizQuestions(questions: QuizQuestion[]) {
  logger.log(`Bulk adding ${questions.length} quiz questions...`);
  const tx = db.transaction('quiz-questions', 'readwrite');
  await Promise.all(questions.map(q => tx.store.put(q)));
  await tx.done;
  logger.log('Bulk add quiz questions complete.');
}

// General
export async function clearAllData() {
    logger.warn('Clearing all data from IndexedDB...');
    await Promise.all([
        db.clear('words'),
        db.clear('archived-words'),
        db.clear('quiz-questions'),
        db.clear('user-profile')
    ]);
    logger.warn('All IndexedDB data cleared.');
}

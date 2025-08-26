

import React, { useState, useCallback, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import BottomNavBar from './components/BottomNavBar';
import DictionaryScreen from './components/DictionaryScreen';
import AddScreen from './components/AddScreen';
import PersonalScreen from './components/PersonalScreen';
import SettingsScreen from './components/SettingsScreen';
import ActivityScreen from './components/ActivityScreen';
import PhrasesScreen from './components/PhrasesScreen';
import WordListScreen from './components/WordListScreen';
import ArchivesScreen from './components/ArchivesScreen';
import PolicyScreen from './components/PolicyScreen';
import MissionVisionScreen from './components/MissionVisionScreen';
import UpdatesScreen from './components/UpdatesScreen';
import BackupRestoreScreen from './components/BackupRestoreScreen';
import { Page, ActivityCategory, UserProfile, Word, QuizQuestion } from './types';
import { INITIAL_ACTIVITIES, ACTIVITY_QUESTIONS } from './constants';
import { playSound, SoundType } from './components/sounds';
import * as db from './utils/db';
import { logger } from './utils/logger';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [currentActivity, setCurrentActivity] = useState<ActivityCategory | null>(null);
  const [currentWordListCategory, setCurrentWordListCategory] = useState<ActivityCategory | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>({ nickname: 'Juan', photo: null });
  const [words, setWords] = useState<Word[]>([]);
  const [archivedWords, setArchivedWords] = useState<Word[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Record<ActivityCategory, QuizQuestion[]>>({
    [ActivityCategory.Actions]: [],
    [ActivityCategory.Animals]: [],
    [ActivityCategory.Values]: [],
    [ActivityCategory.Greetings]: [],
    [ActivityCategory.Phrases]: [],
    [ActivityCategory.Food]: [],
  });
  
  const [activities, setActivities] = useState(() => {
    try {
      const savedProgress = localStorage.getItem('minasbate-app-progress');
      if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        return INITIAL_ACTIVITIES.map(activity => ({
          ...activity,
          progress: progressData[activity.id] || 0,
        }));
      }
    } catch (error) {
      logger.error("Failed to parse progress from localStorage", error);
    }
    return INITIAL_ACTIVITIES;
  });

  const loadAppData = useCallback(async () => {
    logger.log('Starting to load app data...');
    try {
      await db.initDB();

      const isFirstLoad = !localStorage.getItem('minasbate-app-initialized');
      logger.log(`Is this the first load? ${isFirstLoad}`);

      if (isFirstLoad) {
        logger.info('Performing first-time setup...');
        // First time load, populate from JSON if it exists
        try {
          const response = await fetch('/Masterdatalist.json');
          if (response.ok) {
            const data = await response.json();
            const initialWords = (data.words || []).map((w: Word) => ({ ...w, id: Number(w.id) }));
            if (initialWords.length > 0) {
              logger.log(`Found ${initialWords.length} words in Masterdatalist.json, adding to DB.`);
              await db.bulkAddWords(initialWords);
            }
          } else {
            logger.warn('Masterdatalist.json not found. Starting with empty data.');
          }
        } catch (error) {
           logger.warn('Could not fetch Masterdatalist.json:', error);
        }
        
        let idCounter = Date.now();
        const initialQuestions: QuizQuestion[] = [];
        Object.keys(ACTIVITY_QUESTIONS).forEach(key => {
          const category = key as ActivityCategory;
          ACTIVITY_QUESTIONS[category].forEach((q, index) => {
            initialQuestions.push({
              ...q,
              id: idCounter + index,
              category,
            });
          });
        });

        if(initialQuestions.length > 0) {
          logger.log(`Adding ${initialQuestions.length} initial quiz questions to DB.`);
          await db.bulkAddQuizQuestions(initialQuestions);
        }
        
        // Mark initialization as complete
        localStorage.setItem('minasbate-app-initialized', 'true');
        logger.info('First-time setup complete.');
      }
      
      logger.log('Fetching all data from IndexedDB...');
      const [
        profile, 
        allWords, 
        allArchived,
        allQuestions,
      ] = await Promise.all([
        db.getUserProfile(),
        db.getAllWords(),
        db.getAllArchivedWords(),
        db.getAllQuizQuestions(),
      ]);
      
      logger.log(`Loaded ${allWords.length} words, ${allArchived.length} archived words, ${allQuestions.length} questions.`);

      // Load all data from DB into state
      setUserProfile(profile || { nickname: 'Juan', photo: null });
      setWords(allWords);
      setArchivedWords(allArchived);
      
      const groupedQs = allQuestions.reduce((acc, q) => {
        if (!acc[q.category]) acc[q.category] = [];
        acc[q.category].push(q);
        return acc;
      }, {} as Record<ActivityCategory, QuizQuestion[]>);

      // Ensure all categories exist in the state, even if empty
       Object.values(ActivityCategory).forEach(cat => {
            if (!groupedQs[cat]) {
                groupedQs[cat] = [];
            }
        });
      setQuizQuestions(groupedQs);
      logger.log('App data loaded and state updated.');

    } catch (error) {
      logger.error("Failed to load app data from IndexedDB:", error);
    }
  }, []);

  useEffect(() => {
    loadAppData();
  }, [loadAppData]);

  useEffect(() => {
    try {
      const progressData = activities.reduce((acc, activity) => {
        acc[activity.id] = activity.progress;
        return acc;
      }, {} as Record<ActivityCategory, number>);
      localStorage.setItem('minasbate-app-progress', JSON.stringify(progressData));
      logger.log('User progress saved to localStorage.');
    } catch (error) {
      logger.error("Failed to save progress to localStorage", error);
    }
  }, [activities]);

  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('[data-nosound]')) {
        return;
      }
      // Play sound on buttons and elements with cursor-pointer
      if (target.closest('button') || window.getComputedStyle(target).cursor === 'pointer') {
        playSound(SoundType.Click);
      }
    };

    document.addEventListener('click', handleGlobalClick, true);

    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, []);

  const handleUpdateProfile = async (newProfile: UserProfile) => {
    logger.log('Action: Update Profile', newProfile);
    await db.saveUserProfile(newProfile);
    setUserProfile(newProfile);
  };


  const navigateTo = useCallback((page: Page) => {
    logger.log(`Navigating to page: ${page}`);
    setCurrentPage(page);
    setCurrentActivity(null);
    setCurrentWordListCategory(null);
  }, []);

  const handleNavigateToPhrases = () => {
    setCurrentPage(Page.Phrases);
  };

  const handleStartActivity = (activityId: ActivityCategory) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity || activity.type !== 'quiz') return;
    logger.log(`Starting activity: ${activityId}`);
    setCurrentActivity(activity.id);
    setCurrentPage(Page.Activity);
  };
  
  const handleStartWordList = (categoryId: ActivityCategory) => {
    logger.log(`Starting word list: ${categoryId}`);
    setCurrentWordListCategory(categoryId);
    setCurrentPage(Page.WordList);
  };

  const handleCorrectAnswer = (activityId: ActivityCategory) => {
    const questionsForActivity = quizQuestions[activityId];
    if (!questionsForActivity || questionsForActivity.length === 0) return;
    logger.log(`Correct answer for activity: ${activityId}`);
    const increment = 100 / questionsForActivity.length;

    setActivities(prevActivities =>
      prevActivities.map(activity => {
        if (activity.id === activityId) {
          const newProgress = Math.min(100, activity.progress + increment);
          return { ...activity, progress: Math.round(newProgress) };
        }
        return activity;
      })
    );
  };
  
    const handleResetProgress = (activityIdsToReset: ActivityCategory[]) => {
        logger.warn(`Action: Reset Progress for activities:`, activityIdsToReset);
        setActivities(prevActivities =>
            prevActivities.map(activity =>
                activityIdsToReset.includes(activity.id)
                    ? { ...activity, progress: 0 }
                    : activity
            )
        );
    };

  const handleAddWord = async (wordData: Omit<Word, 'id'>) => {
    logger.log('Action: Add Word', wordData);
    const newWord = await db.addWord(wordData);
    setWords(prevWords => [...prevWords, newWord]);
  };
  
   const handleAddQuizQuestion = async (category: ActivityCategory, questionData: Omit<QuizQuestion, 'id'>) => {
    logger.log(`Action: Add Quiz Question to ${category}`, questionData);
    const newQuestion = await db.addQuizQuestion({ ...questionData, category });
    setQuizQuestions(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), newQuestion]
    }));
  };
  
  const handleUpdateWord = async (updatedWord: Word) => {
    logger.log('Action: Update Word', updatedWord);
    await db.updateWord(updatedWord);
    setWords(prevWords => prevWords.map(w => w.id === updatedWord.id ? updatedWord : w));
  };

  const handleUpdateQuizQuestion = async (category: ActivityCategory, updatedQuestion: QuizQuestion) => {
    logger.log(`Action: Update Quiz Question in ${category}`, updatedQuestion);
    await db.updateQuizQuestion({ ...updatedQuestion, category });
    setQuizQuestions(prev => ({
      ...prev,
      [category]: (prev[category] || []).map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
    }));
  };
  
  const handleCreateBackup = async () => {
    logger.log('Action: Create Backup');
    try {
        const [profile, allWords, allArchived, allQuestions] = await Promise.all([
            db.getUserProfile(),
            db.getAllWords(),
            db.getAllArchivedWords(),
            db.getAllQuizQuestions(),
        ]);
        
        const progressData = JSON.parse(localStorage.getItem('minasbate-app-progress') || '{}');
        
        const backupData = {
            version: 1, // Versioning can be improved in future updates
            createdAt: new Date().toISOString(),
            data: {
                profile,
                words: allWords,
                archivedWords: allArchived,
                quizQuestions: allQuestions,
                progress: progressData
            }
        };
        logger.log('Backup data compiled, creating download link.');

        const date = new Date().toISOString().slice(0, 10);
        const jsonStr = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `minasbate-backup-${date}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        logger.log('Backup successfully downloaded.');
        alert('Backup created successfully!');
    } catch (error) {
        logger.error("Failed to create backup:", error);
        alert('Error creating backup. See console for details.');
    }
  };
  
  const handleRestoreBackup = async (fileContent: string) => {
    logger.warn('Action: Restore Backup');
    if (!window.confirm('Are you sure you want to restore from this backup? This will overwrite all current data in the app.')) {
        logger.warn('Restore cancelled by user.');
        return;
    }

    try {
        const backupData = JSON.parse(fileContent);

        if (!backupData || !backupData.data) {
            alert('Invalid or corrupted backup file.');
            logger.error('Invalid backup file format.');
            return;
        }
        
        logger.log('Backup file parsed. Clearing current data...');
        await db.clearAllData();
        localStorage.removeItem('minasbate-app-progress');
        // We keep the 'minasbate-app-initialized' flag

        const { profile, words, archivedWords, quizQuestions, progress } = backupData.data;

        logger.log('Restoring data from backup file...');
        await Promise.all([
            profile ? db.saveUserProfile(profile) : Promise.resolve(),
            words?.length > 0 ? db.bulkAddWords(words) : Promise.resolve(),
            archivedWords?.length > 0 ? db.bulkAddArchivedWords(archivedWords) : Promise.resolve(),
            quizQuestions?.length > 0 ? db.bulkAddQuizQuestions(quizQuestions) : Promise.resolve(),
        ]);

        localStorage.setItem('minasbate-app-progress', JSON.stringify(progress || {}));
        
        // Reload all data into state
        await loadAppData();

        logger.info('Restore complete.');
        alert('Restore complete! The app has been updated with your backup data.');
        navigateTo(Page.Home);

    } catch (error) {
        logger.error('Failed to restore backup:', error);
        alert('Error restoring backup. The file may be invalid. See console for details.');
    }
};


  const handleArchiveWords = async (wordIds: number[]) => {
      logger.log('Action: Archive Words', wordIds);
      const wordsToArchive = await db.archiveWords(wordIds);
      setWords(prev => prev.filter(w => !wordIds.includes(w.id)));
      setArchivedWords(prev => [...prev, ...wordsToArchive]);
  };

  const handleDeleteWords = async (wordIds: number[]) => {
      logger.log('Action: Delete Words', wordIds);
      await db.deleteWords(wordIds);
      setWords(prev => prev.filter(w => !wordIds.includes(w.id)));
  };
  
  const handleDeleteQuizQuestions = async (questionIds: number[]) => {
    logger.log('Action: Delete Quiz Questions', questionIds);
    await db.deleteQuizQuestions(questionIds);
    const deletedIds = new Set(questionIds);
    setQuizQuestions(prev => {
        const newQuestionsState = { ...prev };
        for (const category in newQuestionsState) {
            newQuestionsState[category as ActivityCategory] = newQuestionsState[category as ActivityCategory].filter(q => !deletedIds.has(q.id));
        }
        return newQuestionsState;
    });
  };

  const handleUnarchiveWords = async (wordIds: number[]) => {
      logger.log('Action: Unarchive Words', wordIds);
      const wordsToUnarchive = await db.unarchiveWords(wordIds);
      setArchivedWords(prev => prev.filter(w => !wordIds.includes(w.id)));
      setWords(prev => [...prev, ...wordsToUnarchive]);
  };

  const handleClearAllData = async () => {
      logger.warn('Action: Clear All Data');
      localStorage.removeItem('minasbate-app-progress');
      await db.clearAllData();

      setUserProfile({ nickname: 'Juan', photo: null });
      setWords([]);
      setArchivedWords([]);
      setQuizQuestions({ [ActivityCategory.Actions]: [], [ActivityCategory.Animals]: [], [ActivityCategory.Values]: [], [ActivityCategory.Greetings]: [], [ActivityCategory.Phrases]: [], [ActivityCategory.Food]: [] });
      const resetActivities = INITIAL_ACTIVITIES.map(activity => ({ ...activity, progress: 0 }));
      setActivities(resetActivities);

      logger.warn('All app data has been cleared.');
      navigateTo(Page.Home);
      setTimeout(() => alert('All app data has been successfully cleared.'), 100);
  };


  const handleBack = () => {
    const settingsSubPages = [Page.Archives, Page.Policy, Page.MissionVision, Page.Updates, Page.BackupRestore];
    logger.log(`Back action from page: ${currentPage}`);
    if (currentActivity) {
      setCurrentActivity(null);
      setCurrentPage(Page.Home);
    } else if (currentWordListCategory) {
        setCurrentWordListCategory(null);
        setCurrentPage(Page.Phrases);
    } else if (settingsSubPages.includes(currentPage)) {
        setCurrentPage(Page.Settings);
    } else {
      setCurrentPage(Page.Home);
    }
  };

  const renderContent = () => {
    if (currentPage === Page.Activity && currentActivity) {
      return <ActivityScreen category={currentActivity} questions={quizQuestions[currentActivity] || []} onBack={handleBack} onCorrectAnswer={handleCorrectAnswer} onResetProgress={handleResetProgress} />;
    }
    switch (currentPage) {
      case Page.Home:
        return <HomeScreen activities={activities.filter(a => a.type === 'quiz')} onStartActivity={handleStartActivity} onNavigateToPhrases={handleNavigateToPhrases} userProfile={userProfile} />;
      case Page.Dictionary:
        return <DictionaryScreen 
                  onBack={handleBack} 
                  words={words} 
                  onUpdateWord={handleUpdateWord} 
                  onArchiveWords={handleArchiveWords}
                  onDeleteWords={handleDeleteWords}
                  quizQuestions={quizQuestions}
                  onUpdateQuizQuestion={handleUpdateQuizQuestion}
                  onDeleteQuizQuestions={handleDeleteQuizQuestions}
                />;
      case Page.Add:
        return <AddScreen onBack={handleBack} onAddWord={handleAddWord} onAddQuizQuestion={handleAddQuizQuestion} />;
      case Page.Personal:
        return <PersonalScreen onBack={handleBack} userProfile={userProfile} onSaveProfile={handleUpdateProfile} />;
      case Page.Settings:
        return <SettingsScreen onBack={handleBack} onNavigate={navigateTo} onClearAllData={handleClearAllData} />;
      case Page.Phrases:
        const phraseCategories = activities.filter(a => a.type === 'wordlist');
        return <PhrasesScreen categories={phraseCategories} onCategoryClick={handleStartWordList} onBack={handleBack} />;
      case Page.WordList:
        return <WordListScreen category={currentWordListCategory!} onBack={handleBack} words={words} />;
      case Page.Archives:
        return <ArchivesScreen onBack={handleBack} archivedWords={archivedWords} onUnarchiveWords={handleUnarchiveWords} />;
      case Page.Policy:
        return <PolicyScreen onBack={handleBack} />;
      case Page.MissionVision:
        return <MissionVisionScreen onBack={handleBack} />;
      case Page.Updates:
        return <UpdatesScreen onBack={handleBack} />;
      case Page.BackupRestore:
        return <BackupRestoreScreen onBack={handleBack} onBackup={handleCreateBackup} onRestore={handleRestoreBackup} />;
      default:
        return <HomeScreen activities={activities.filter(a => a.type === 'quiz')} onStartActivity={handleStartActivity} onNavigateToPhrases={handleNavigateToPhrases} userProfile={userProfile} />;
    }
  };
  
  const showNavBar = ![Page.Activity, Page.WordList, Page.Phrases, Page.Archives, Page.Policy, Page.MissionVision, Page.Updates, Page.BackupRestore].includes(currentPage);

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col font-poppins">
      <main className="flex-grow">
        {renderContent()}
      </main>
      {showNavBar && (
         <BottomNavBar currentPage={currentPage} onNavigate={navigateTo} />
      )}
    </div>
  );
};

export default App;

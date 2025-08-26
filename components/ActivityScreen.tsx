

import React, { useState } from 'react';
import Header from './Header';
import { ActivityCategory, QuizQuestion } from '../types';
import { playSound, SoundType } from './sounds';

interface ActivityScreenProps {
  category: ActivityCategory;
  questions: QuizQuestion[];
  onBack: () => void;
  onCorrectAnswer: (category: ActivityCategory) => void;
  onResetProgress: (activityIds: ActivityCategory[]) => void;
}

type Feedback = {
  type: 'correct' | 'incorrect';
  message: string;
} | null;

const ActivityScreen: React.FC<ActivityScreenProps> = ({ category, questions, onBack, onCorrectAnswer, onResetProgress }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = questions?.[currentQuestionIndex];

  const handleSubmit = () => {
    if (!selectedAnswer || !currentQuestion) return;

    setIsSubmitted(true);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
      playSound(SoundType.Correct);
      setFeedback({ type: 'correct', message: 'Correct!' });
      onCorrectAnswer(category);
    } else {
      playSound(SoundType.Incorrect);
      setFeedback({ type: 'incorrect', message: `Wrong! The correct answer is: ${currentQuestion.correctAnswer}` });
    }

    setTimeout(() => {
      setIsSubmitted(false);
      setFeedback(null);
      setSelectedAnswer(null);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        onBack(); // End of activity
      }
    }, 2500);
  };

  const handleReset = () => {
    if (window.confirm(`Are you sure you want to reset your progress for the "${category}" activity?`)) {
        playSound(SoundType.Delete);
        onResetProgress([category]);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setFeedback(null);
        setIsSubmitted(false);
    }
  };

  const getButtonClass = (option: string) => {
    if (!isSubmitted) {
      return selectedAnswer === option ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800';
    }
    
    if (option === currentQuestion.correctAnswer) {
      return 'bg-green-500 text-white';
    }

    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
      return 'bg-red-500 text-white';
    }

    return 'bg-gray-200 text-gray-800 opacity-60';
  };

  if (!questions || questions.length === 0) {
      return (
          <div className="p-4 flex flex-col h-screen bg-white">
              <Header title={category} onBack={onBack} />
              <div className="flex-grow flex flex-col items-center justify-center text-center">
                <p className="text-xl text-gray-700">No questions available for this category yet.</p>
                 <p className="text-md text-gray-500 mt-2">You can add some from the 'Add' screen!</p>
                <button onClick={onBack} className="mt-4 bg-blue-500 text-white font-bold py-2 px-6 rounded-lg">
                    Go Back
                </button>
              </div>
          </div>
      )
  }
  
  const resetButton = (
    <button onClick={handleReset} className="bg-gray-200 text-gray-700 rounded-full p-3 shadow-md flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 9a9 9 0 0114.13-4.13M20 15a9 9 0 01-14.13 4.13" />
        </svg>
    </button>
  );

  return (
    <div className="p-4 flex flex-col h-screen bg-white">
      <Header 
        title={`${category} (${currentQuestionIndex + 1}/${questions.length})`} 
        onBack={onBack} 
        actionButton={resetButton}
      />
      
      <div className="my-4">
        <p className="font-semibold text-lg text-black">Minasbate: {currentQuestion.question}</p>
        <p className="text-md text-black italic">English: {currentQuestion.questionEnglish}</p>
      </div>
      
      <div className="flex justify-center my-4">
        <img src={currentQuestion.image} alt="Activity" className="max-w-xs rounded-lg shadow-md" />
      </div>

      <div className="mt-auto space-y-3 pb-4">
        {currentQuestion.options.map(option => (
          <button
            key={option}
            onClick={() => !isSubmitted && setSelectedAnswer(option)}
            disabled={isSubmitted}
            className={`w-full text-center text-xl font-semibold py-3 rounded-xl shadow-md transition-all duration-300 ${getButtonClass(option)}`}
          >
            {option}
          </button>
        ))}

        <div className="h-12 mt-2 flex items-center justify-center">
            {feedback && (
                <p className={`text-xl font-bold ${feedback.type === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                    {feedback.message}
                </p>
            )}
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={!selectedAnswer || isSubmitted}
          data-nosound
          className="w-full bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg text-2xl mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitted ? 'Checking...' : 'SUBMIT'}
        </button>
      </div>
    </div>
  );
};

export default ActivityScreen;

import React, { useState } from 'react';
import Header from './Header';
import { Word, QuizQuestion } from '../types';
import { playSound, SoundType } from './sounds';

// Reusable card for selection lists (Words)
const SelectableWordCard: React.FC<{ 
    word: Word;
    onSelect: () => void;
    isSelected: boolean;
}> = ({ word, onSelect, isSelected }) => {
    return (
        <div onClick={onSelect} className={`bg-stone-300 rounded-2xl shadow-md p-4 mb-4 flex items-center gap-4 transition-all duration-200 cursor-pointer ${isSelected ? 'ring-4 ring-blue-500 bg-stone-200' : ''}`}>
            <div className="w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center flex-shrink-0">
                {isSelected && <div className="w-4 h-4 bg-blue-500 rounded-full"></div>}
            </div>
            <div className="text-left flex-grow">
                <h3 className="text-3xl font-bold text-black">{word.word}</h3>
                <hr className="border-t border-gray-400 my-1" />
                <p className="text-gray-600 text-md">{word.meaning}</p>
            </div>
        </div>
    );
};

// Reusable card for selection lists (Quiz Questions)
const SelectableQuizQuestionCard: React.FC<{ 
    question: QuizQuestion;
    onSelect: () => void;
    isSelected: boolean;
}> = ({ question, onSelect, isSelected }) => {
    return (
        <div onClick={onSelect} className={`bg-stone-300 rounded-2xl shadow-md p-4 mb-4 flex items-start gap-4 transition-all duration-200 cursor-pointer ${isSelected ? 'ring-4 ring-blue-500 bg-stone-200' : ''}`}>
            <div className="w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center flex-shrink-0 mt-1">
                {isSelected && <div className="w-4 h-4 bg-blue-500 rounded-full"></div>}
            </div>
            <img src={question.image} alt="Question visual" className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
            <div className="text-left flex-grow">
                <p className="text-lg font-bold text-black">{question.question}</p>
                <p className="text-sm italic text-gray-700">{question.questionEnglish}</p>
            </div>
        </div>
    );
};

// Reusable action bar
const ActionBar: React.FC<{
    count: number;
    actions: { label: string, handler: () => void, color: string }[];
    onSelectAll: () => void;
    onCancel: () => void;
}> = ({ count, actions, onSelectAll, onCancel }) => {
    return (
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg p-2 flex items-center justify-between z-40 border-t-4 border-blue-500">
            <div className="flex items-center gap-3">
                <button onClick={onCancel} className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center font-bold text-gray-700">X</button>
                <button onClick={onSelectAll} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg">Select All</button>
                <span className="font-bold text-lg text-black">{count} selected</span>
            </div>
            <div className="flex gap-2">
                {actions.map(action => (
                    <button key={action.label} onClick={action.handler} className={`${action.color} text-white font-bold py-2 px-4 rounded-lg`}>
                        {action.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

interface RecentlyDeletedScreenProps {
  onBack: () => void;
  deletedWords: Word[];
  onRestoreWords: (wordIds: number[]) => void;
  onPermanentlyDeleteWords: (wordIds: number[]) => void;
  deletedQuizQuestions: QuizQuestion[];
  onRestoreQuizQuestions: (questionIds: number[]) => void;
  onPermanentlyDeleteQuizQuestions: (questionIds: number[]) => void;
}

const RecentlyDeletedScreen: React.FC<RecentlyDeletedScreenProps> = ({ 
    onBack, 
    deletedWords, onRestoreWords, onPermanentlyDeleteWords,
    deletedQuizQuestions, onRestoreQuizQuestions, onPermanentlyDeleteQuizQuestions
}) => {
    const [selectedWords, setSelectedWords] = useState<Set<number>>(new Set());
    const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
    
    const allDeletedItems = [
        ...deletedWords.map(w => ({ ...w, type: 'word' as const })),
        ...deletedQuizQuestions.map(q => ({ ...q, type: 'question' as const }))
    ].sort((a, b) => b.id - a.id);

    const handleSelectItem = (id: number, type: 'word' | 'question') => {
        if (type === 'word') {
            const newSelection = new Set(selectedWords);
            newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);
            setSelectedWords(newSelection);
        } else {
            const newSelection = new Set(selectedQuestions);
            newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);
            setSelectedQuestions(newSelection);
        }
    };

    const handleSelectAll = () => {
        if (selectedWords.size === deletedWords.length && selectedQuestions.size === deletedQuizQuestions.length) {
            setSelectedWords(new Set());
            setSelectedQuestions(new Set());
        } else {
            setSelectedWords(new Set(deletedWords.map(w => w.id)));
            setSelectedQuestions(new Set(deletedQuizQuestions.map(q => q.id)));
        }
    };

    const handleCancelSelection = () => {
        setSelectedWords(new Set());
        setSelectedQuestions(new Set());
    };

    const handleRestoreAction = () => {
        if (selectedWords.size > 0) onRestoreWords(Array.from(selectedWords));
        if (selectedQuestions.size > 0) onRestoreQuizQuestions(Array.from(selectedQuestions));
        handleCancelSelection();
    };
    
    const handlePermanentDeleteAction = () => {
        const total = selectedWords.size + selectedQuestions.size;
        if (window.confirm(`Are you sure you want to permanently delete ${total} item(s)? This action cannot be undone.`)) {
            playSound(SoundType.Delete);
            if (selectedWords.size > 0) onPermanentlyDeleteWords(Array.from(selectedWords));
            if (selectedQuestions.size > 0) onPermanentlyDeleteQuizQuestions(Array.from(selectedQuestions));
            handleCancelSelection();
        }
    };

    const actions = [
        { label: 'Restore', handler: handleRestoreAction, color: 'bg-green-500' },
        { label: 'Delete Permanently', handler: handlePermanentDeleteAction, color: 'bg-red-600' }
    ];

    const selectionCount = selectedWords.size + selectedQuestions.size;

    return (
        <div className="p-4 pb-28">
            <Header title="Recently Deleted" onBack={onBack} />
            <div className="mt-6">
                {allDeletedItems.length > 0 ? (
                    allDeletedItems.map((item) => (
                        item.type === 'word' ? (
                            <SelectableWordCard 
                                key={`word-${item.id}`} 
                                word={item}
                                onSelect={() => handleSelectItem(item.id, 'word')}
                                isSelected={selectedWords.has(item.id)}
                            />
                        ) : (
                            <SelectableQuizQuestionCard
                                key={`question-${item.id}`}
                                question={item}
                                onSelect={() => handleSelectItem(item.id, 'question')}
                                isSelected={selectedQuestions.has(item.id)}
                            />
                        )
                    ))
                ) : (
                    <p className="text-center text-gray-500 mt-8">No recently deleted items.</p>
                )}
            </div>
            {selectionCount > 0 && (
                <ActionBar
                    count={selectionCount}
                    actions={actions}
                    onSelectAll={handleSelectAll}
                    onCancel={handleCancelSelection}
                />
            )}
        </div>
    );
};

export default RecentlyDeletedScreen;
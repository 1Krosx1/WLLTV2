import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Word } from '../types';

// A simplified Word Card for selection lists
const SelectableWordCard: React.FC<{ 
    word: Word;
    onSelect: (wordId: number) => void;
    isSelected: boolean;
}> = ({ word, onSelect, isSelected }) => {
    return (
        <div onClick={() => onSelect(word.id)} className={`bg-stone-300 rounded-2xl shadow-md p-4 mb-4 flex items-center gap-4 transition-all duration-200 cursor-pointer ${isSelected ? 'ring-4 ring-blue-500 bg-stone-200' : ''}`}>
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


interface ArchivesScreenProps {
  onBack: () => void;
  archivedWords: Word[];
  onUnarchiveWords: (wordIds: number[]) => void;
}

const ArchivesScreen: React.FC<ArchivesScreenProps> = ({ onBack, archivedWords, onUnarchiveWords }) => {
    const [selectedWords, setSelectedWords] = useState<Set<number>>(new Set());
    
    const handleSelectWord = (wordId: number) => {
        const newSelection = new Set(selectedWords);
        if (newSelection.has(wordId)) {
            newSelection.delete(wordId);
        } else {
            newSelection.add(wordId);
        }
        setSelectedWords(newSelection);
    };

    const handleSelectAll = () => {
        const allWordIds = new Set(archivedWords.map(w => w.id));
        setSelectedWords(allWordIds);
    };

    const handleCancelSelection = () => {
        setSelectedWords(new Set());
    };

    const handleUnarchiveAction = () => {
        onUnarchiveWords(Array.from(selectedWords));
        setSelectedWords(new Set());
    };

    const actions = [
        { label: 'Unarchive', handler: handleUnarchiveAction, color: 'bg-green-500' }
    ];

    return (
        <div className="p-4 pb-28">
            <Header title="Archives" onBack={onBack} />
            <div className="mt-6">
                {archivedWords.length > 0 ? (
                    archivedWords.map((word) => (
                        <SelectableWordCard 
                            key={word.id} 
                            word={word}
                            onSelect={handleSelectWord}
                            isSelected={selectedWords.has(word.id)}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500 mt-8">No archived words.</p>
                )}
            </div>
            {selectedWords.size > 0 && (
                <ActionBar
                    count={selectedWords.size}
                    actions={actions}
                    onSelectAll={handleSelectAll}
                    onCancel={handleCancelSelection}
                />
            )}
        </div>
    );
};

export default ArchivesScreen;



import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import Header from './Header';
import { Word, QuizQuestion, ActivityCategory } from '../types';
import { playSound, SoundType } from './sounds';


const EditWordModal: React.FC<{ word: Word; onSave: (word: Word) => void; onCancel: () => void; onDelete: (wordId: number) => void; }> = ({ word, onSave, onCancel, onDelete }) => {
  const [editedWord, setEditedWord] = useState(word.word);
  const [editedMeaning, setEditedMeaning] = useState(word.meaning);
  const [audioURL, setAudioURL] = useState<string | null>(word.audio_path || null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleAudioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setAudioURL(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSaveClick = () => {
    onSave({ ...word, word: editedWord, meaning: editedMeaning, audio_path: audioURL || '' });
  };

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to permanently delete this word? This action cannot be undone.')) {
        onDelete(word.id);
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
            <input type="file" accept="audio/*" ref={audioInputRef} onChange={handleAudioChange} className="hidden" />
            <h2 className="text-2xl font-bold mb-4 text-black">Edit Word</h2>
            <div className="space-y-4">
                <input type="text" value={editedWord} onChange={e => setEditedWord(e.target.value)} className="w-full bg-gray-100 rounded-lg p-3 text-lg text-black placeholder:text-gray-500" placeholder="Word" />
                <input type="text" value={editedMeaning} onChange={e => setEditedMeaning(e.target.value)} className="w-full bg-gray-100 rounded-lg p-3 text-lg text-black placeholder:text-gray-500" placeholder="Meaning" />
            </div>

            <div className="mt-6">
                <h3 className="font-semibold mb-2 text-black">Audio</h3>
                {audioURL && <audio src={audioURL} controls className="w-full" />}
                <button onClick={() => audioInputRef.current?.click()} className="w-full mt-2 bg-green-500 text-white font-bold py-2 px-4 rounded-lg">
                    Upload New Audio
                </button>
            </div>

            <div className="flex justify-between items-center mt-6">
                <button onClick={handleDeleteClick} className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg">Delete</button>
                <div className="flex gap-4">
                    <button onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg">Cancel</button>
                    <button onClick={handleSaveClick} data-nosound className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg">Save</button>
                </div>
            </div>
        </div>
    </div>
  );
};

const EditQuizQuestionModal: React.FC<{
  question: QuizQuestion;
  onSave: (question: QuizQuestion) => void;
  onCancel: () => void;
  onDelete: (questionId: number) => void;
}> = ({ question: initialQuestion, onSave, onCancel, onDelete }) => {
  const [question, setQuestion] = useState(initialQuestion.question);
  const [questionEnglish, setQuestionEnglish] = useState(initialQuestion.questionEnglish);
  const [options, setOptions] = useState(initialQuestion.options);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(initialQuestion.options.indexOf(initialQuestion.correctAnswer));
  const [image, setImage] = useState<string>(initialQuestion.image);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  const handleSaveClick = () => {
    if (!question || !questionEnglish || options.some(o => !o) || correctOptionIndex === -1 || !image) {
      alert('Please fill all fields, provide 4 options, and select a correct answer.');
      return;
    }
    playSound(SoundType.Save);
    onSave({
      ...initialQuestion,
      question,
      questionEnglish,
      image,
      options,
      correctAnswer: options[correctOptionIndex],
    });
  };

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to permanently delete this question? This action cannot be undone.')) {
        onDelete(initialQuestion.id);
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-black">Edit Question</h2>
        <div className="space-y-4">
          <input type="text" placeholder="Question (Minasbate)" value={question} onChange={e => setQuestion(e.target.value)} className="w-full bg-gray-100 rounded-lg p-3 text-lg text-black placeholder:text-gray-700" />
          <input type="text" placeholder="Question (English)" value={questionEnglish} onChange={e => setQuestionEnglish(e.target.value)} className="w-full bg-gray-100 rounded-lg p-3 text-lg text-black placeholder:text-gray-700" />
          <button onClick={() => imageInputRef.current?.click()} className="w-full bg-blue-100 text-blue-800 font-semibold p-3 rounded-lg">Change Image</button>
          <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} className="hidden" />
          <img src={image} alt="Question" className="rounded-lg max-h-40 w-auto mx-auto" />
          
          <h3 className="font-semibold pt-2 text-black">Options (Select correct answer)</h3>
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-3">
               <button
                  type="button"
                  onClick={() => setCorrectOptionIndex(index)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-colors flex-shrink-0 ${correctOptionIndex === index ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-400'}`}
                  aria-pressed={correctOptionIndex === index}
                  aria-label={`Select option ${index + 1} as correct`}
              >
                  {correctOptionIndex === index && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                  )}
              </button>
              <input 
                type="text" 
                value={option} 
                onChange={e => handleOptionChange(index, e.target.value)} 
                className="w-full bg-gray-100 rounded-lg p-3 text-lg text-black placeholder:text-gray-500" 
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-6">
            <button onClick={handleDeleteClick} className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg">Delete</button>
            <div className="flex gap-4">
                <button onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg">Cancel</button>
                <button onClick={handleSaveClick} data-nosound className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg">Save</button>
            </div>
        </div>
      </div>
    </div>
  );
};


const WordCard: React.FC<{ 
    word: Word; 
    onEdit: (word: Word) => void;
    onSelect: (wordId: number) => void;
    isSelected: boolean;
    selectionMode: boolean;
}> = ({ word, onEdit, onSelect, isSelected, selectionMode }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const playAudio = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (word.audio_path) {
            const audio = audioRef.current;
            if (audio) { audio.paused ? audio.play() : (audio.pause(), audio.currentTime = 0); }
        } else {
            if (speechSynthesis.speaking) { speechSynthesis.cancel(); setIsPlaying(false); return; }
            const utterance = new SpeechSynthesisUtterance(word.word);
            const filipinoVoice = speechSynthesis.getVoices().find(v => v.lang === 'fil-PH' || v.lang === 'tl-PH');
            if (filipinoVoice) utterance.voice = filipinoVoice;
            utterance.lang = 'tl-PH';
            utterance.onstart = () => setIsPlaying(true);
            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = () => setIsPlaying(false);
            speechSynthesis.speak(utterance);
        }
    };
    
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const events = ['play', 'playing', 'pause', 'ended'];
            const handlers = [() => setIsPlaying(true), () => setIsPlaying(true), () => setIsPlaying(false), () => setIsPlaying(false)];
            events.forEach((e, i) => audio.addEventListener(e, handlers[i]));
            return () => events.forEach((e, i) => audio.removeEventListener(e, handlers[i]));
        }
    }, [word.audio_path]);

    return (
        <div onClick={() => selectionMode && onSelect(word.id)} className={`bg-stone-300 rounded-2xl shadow-md p-4 mb-4 flex items-center gap-4 transition-all duration-200 ${selectionMode ? 'cursor-pointer' : ''} ${isSelected ? 'ring-4 ring-blue-500 bg-stone-200' : ''}`}>
            {selectionMode && (
                <div className="w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center flex-shrink-0" onClick={() => onSelect(word.id)}>
                    {isSelected && <div className="w-4 h-4 bg-blue-500 rounded-full"></div>}
                </div>
            )}
            <button onClick={(e) => { e.stopPropagation(); onEdit(word); }} className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
            </button>
            <div className="text-left flex-grow">
                <h3 className="text-3xl font-bold text-black">{word.word}</h3>
                <hr className="border-t border-gray-400 my-1" />
                <p className="text-gray-600 text-md">{word.meaning}</p>
            </div>
            {word.audio_path && <audio ref={audioRef} src={word.audio_path} preload="auto" className="hidden" />}
            <button onClick={playAudio} data-nosound className={`${isPlaying ? 'bg-green-500' : 'bg-gray-400'} text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md flex-shrink-0 transition-colors duration-200`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M11 5.054a1 1 0 011.366-.928A6.987 6.987 0 0118 10a6.987 6.987 0 01-5.634 5.874 1 1 0 01-1.366-.928v-1.148a1 1 0 01.634-.949 3 3 0 000-5.698 1 1 0 01-.634-.949V5.054z" /><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            </button>
        </div>
    );
};

const QuizQuestionCard: React.FC<{
  question: QuizQuestion & { category: ActivityCategory };
  onEdit: () => void;
  onSelect: () => void;
  isSelected: boolean;
  selectionMode: boolean;
}> = ({ question, onEdit, onSelect, isSelected, selectionMode }) => {
  return (
    <div onClick={() => selectionMode && onSelect()} className={`bg-stone-300 rounded-2xl shadow-md p-4 mb-4 flex items-start gap-4 transition-all duration-200 ${selectionMode ? 'cursor-pointer' : ''} ${isSelected ? 'ring-4 ring-blue-500 bg-stone-200' : ''}`}>
      {selectionMode && (
        <div className="w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center flex-shrink-0 mt-1" onClick={onSelect}>
          {isSelected && <div className="w-4 h-4 bg-blue-500 rounded-full"></div>}
        </div>
      )}
      <img src={question.image} alt="Question visual" className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
      <div className="text-left flex-grow">
        <p className="text-lg font-bold text-black">{question.question}</p>
        <p className="text-sm italic text-gray-700">{question.questionEnglish}</p>
        <hr className="border-t border-gray-400 my-1" />
        <ul className="text-sm text-gray-600 list-disc list-inside">
          {question.options.map((opt, i) => <li key={i} className={opt === question.correctAnswer ? 'font-bold text-green-700' : ''}>{opt}</li>)}
        </ul>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md flex-shrink-0">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
      </button>
    </div>
  );
};

const SelectionActionBar: React.FC<{
    count: number;
    actions: { label: string, handler: () => void, color: string }[];
    onSelectAll: () => void;
    onCancel: () => void;
}> = ({ count, actions, onSelectAll, onCancel }) => {
    return (
        <div className="fixed bottom-20 left-4 right-4 bg-white rounded-2xl shadow-lg p-2 flex items-center justify-between z-40 border-t-4 border-blue-500">
            <div className="flex items-center gap-3">
                <button onClick={onCancel} className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center font-bold text-gray-700">X</button>
                 <button onClick={onSelectAll} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg">Select All</button>
                <span className="font-bold text-lg text-black">{count} selected</span>
            </div>
            <div className="flex gap-2">
                 {actions.map(action => <button key={action.label} onClick={action.handler} className={`${action.color} text-white font-bold py-2 px-4 rounded-lg`}>{action.label}</button>)}
            </div>
        </div>
    );
};

interface DictionaryScreenProps {
  onBack: () => void;
  words: Word[];
  onUpdateWord: (word: Word) => void;
  onArchiveWords: (wordIds: number[]) => void;
  onDeleteWords: (wordIds: number[]) => void;
  quizQuestions: Record<ActivityCategory, QuizQuestion[]>;
  onUpdateQuizQuestion: (category: ActivityCategory, question: QuizQuestion) => void;
  onDeleteQuizQuestions: (questionIds: number[]) => void;
}

type ViewMode = 'words' | 'questions';

const DictionaryScreen: React.FC<DictionaryScreenProps> = ({ 
    onBack, 
    words, onUpdateWord, onArchiveWords, onDeleteWords,
    quizQuestions, onUpdateQuizQuestion, onDeleteQuizQuestions
}) => {
    const [viewMode, setViewMode] = useState<ViewMode>('words');
    const [editingWord, setEditingWord] = useState<Word | null>(null);
    const [editingQuestion, setEditingQuestion] = useState<{question: QuizQuestion, category: ActivityCategory} | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedWords, setSelectedWords] = useState<Set<number>>(new Set());
    const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());

    const filteredWords = words.filter(word => 
        word.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
        word.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const allQuestions = Object.entries(quizQuestions).flatMap(([category, questions]) => questions.map(q => ({ ...q, category: category as ActivityCategory })));
    const filteredQuestions = allQuestions.filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        q.questionEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.options.some(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    useEffect(() => {
        setSelectedWords(new Set());
        setSelectedQuestions(new Set());
        setSearchTerm('');
    }, [viewMode]);
    
    // Word Handlers
    const handleSelectWord = (wordId: number) => {
        const newSelection = new Set(selectedWords);
        newSelection.has(wordId) ? newSelection.delete(wordId) : newSelection.add(wordId);
        setSelectedWords(newSelection);
    };
    const handleSelectAllWords = () => setSelectedWords(new Set(filteredWords.map(w => w.id)));
    const handleSaveWord = (updatedWord: Word) => { playSound(SoundType.Save); onUpdateWord(updatedWord); setEditingWord(null); };
    const handleDeleteWord = (wordId: number) => { playSound(SoundType.Delete); onDeleteWords([wordId]); setEditingWord(null); };
    
    const handleArchiveAction = () => { onArchiveWords(Array.from(selectedWords)); setSelectedWords(new Set()); };
    const handleDeleteWordsAction = () => { 
        if(window.confirm(`Are you sure you want to permanently delete ${selectedWords.size} word(s)? This action cannot be undone.`)) {
            playSound(SoundType.Delete);
            onDeleteWords(Array.from(selectedWords)); 
            setSelectedWords(new Set()); 
        }
    };
    
    // Question Handlers
    const handleSelectQuestion = (questionId: number) => {
        const newSelection = new Set(selectedQuestions);
        newSelection.has(questionId) ? newSelection.delete(questionId) : newSelection.add(questionId);
        setSelectedQuestions(newSelection);
    };
    const handleSelectAllQuestions = () => setSelectedQuestions(new Set(filteredQuestions.map(q => q.id)));
    const handleSaveQuestion = (updatedQuestion: QuizQuestion) => { 
        if (!editingQuestion) return;
        playSound(SoundType.Save); 
        onUpdateQuizQuestion(editingQuestion.category, updatedQuestion); 
        setEditingQuestion(null); 
    };
    const handleDeleteQuestion = (questionId: number) => { playSound(SoundType.Delete); onDeleteQuizQuestions([questionId]); setEditingQuestion(null); };
    const handleDeleteQuestionsAction = () => {
         if(window.confirm(`Are you sure you want to permanently delete ${selectedQuestions.size} question(s)? This action cannot be undone.`)) {
            playSound(SoundType.Delete);
            onDeleteQuizQuestions(Array.from(selectedQuestions));
            setSelectedQuestions(new Set());
         }
    };
    
    const wordActions = [ 
        { label: 'Archive', handler: handleArchiveAction, color: 'bg-yellow-500' },
        { label: 'Delete', handler: handleDeleteWordsAction, color: 'bg-red-600' }
    ];
    const questionActions = [
        { label: 'Delete', handler: handleDeleteQuestionsAction, color: 'bg-red-600' }
    ];

    return (
        <div className="p-4 pb-40">
            {editingWord && <EditWordModal word={editingWord} onSave={handleSaveWord} onCancel={() => setEditingWord(null)} onDelete={handleDeleteWord} />}
            {editingQuestion && <EditQuizQuestionModal question={editingQuestion.question} onSave={handleSaveQuestion} onCancel={() => setEditingQuestion(null)} onDelete={handleDeleteQuestion} />}
            <Header title="Dictionary" onBack={onBack} />
            
            <div className="mt-4 flex gap-2 rounded-full bg-gray-200 p-1">
                <button onClick={() => setViewMode('words')} className={`w-1/2 rounded-full py-2 font-bold transition-colors ${viewMode === 'words' ? 'bg-blue-500 text-white shadow' : 'text-gray-600'}`}>Words</button>
                <button onClick={() => setViewMode('questions')} className={`w-1/2 rounded-full py-2 font-bold transition-colors ${viewMode === 'questions' ? 'bg-blue-500 text-white shadow' : 'text-gray-600'}`}>Questions</button>
            </div>
            
            <div className="mt-6 relative">
                <input type="text" placeholder={`Search for a ${viewMode === 'words' ? 'word' : 'question'}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-gray-200 rounded-full py-3 pl-12 pr-4 text-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500" />
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
            </div>

            <div className="mt-6">
                {viewMode === 'words' ? (
                    filteredWords.length > 0 ? (
                        filteredWords.map((word) => <WordCard key={word.id} word={word} onEdit={setEditingWord} onSelect={handleSelectWord} isSelected={selectedWords.has(word.id)} selectionMode={selectedWords.size > 0} />)
                    ) : <p className="text-center text-gray-500 mt-8">No words found.</p>
                ) : (
                    filteredQuestions.length > 0 ? (
                        filteredQuestions.map((q) => <QuizQuestionCard key={q.id} question={q} onEdit={() => setEditingQuestion({question: q, category: q.category})} onSelect={() => handleSelectQuestion(q.id)} isSelected={selectedQuestions.has(q.id)} selectionMode={selectedQuestions.size > 0} />)
                    ) : <p className="text-center text-gray-500 mt-8">No questions found.</p>
                )}
            </div>

             {(selectedWords.size > 0 && viewMode === 'words') && <SelectionActionBar count={selectedWords.size} actions={wordActions} onSelectAll={handleSelectAllWords} onCancel={() => setSelectedWords(new Set())} />}
             {(selectedQuestions.size > 0 && viewMode === 'questions') && <SelectionActionBar count={selectedQuestions.size} actions={questionActions} onSelectAll={handleSelectAllQuestions} onCancel={() => setSelectedQuestions(new Set())} />}
        </div>
    );
};

export default DictionaryScreen;
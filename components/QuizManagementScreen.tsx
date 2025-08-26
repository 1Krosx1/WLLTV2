/*
  NOTE FOR DEVELOPER:
  This file is currently unused and can be considered deprecated.
  The functionality for managing, editing, and deleting quiz questions
  has been consolidated into the `DictionaryScreen.tsx` component.
  Please refer to `DictionaryScreen.tsx` for the active implementation
  of the `EditQuizQuestionModal`.

  This file is kept for historical reference but can be safely removed
  from the project to avoid confusion.
*/
import React, { useState, useRef, ChangeEvent } from 'react';
import Header from './Header';
import { ActivityCategory, QuizQuestion } from '../types';
import { playSound, SoundType } from './sounds';

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
    if (window.confirm(`Are you sure you want to delete this question? This action cannot be undone.`)) {
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
              <input type="text" value={option} onChange={e => handleOptionChange(index, e.target.value)} className="w-full bg-white rounded-lg p-3 text-black" />
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

const QuizQuestionCard: React.FC<{
  question: QuizQuestion;
  onEdit: () => void;
  onSelect: () => void;
  isSelected: boolean;
  selectionMode: boolean;
}> = ({ question, onEdit, onSelect, isSelected, selectionMode }) => {
  const handleCardClick = () => {
    onSelect();
  };

  return (
    <div onClick={handleCardClick} className={`bg-stone-300 rounded-2xl shadow-md p-4 mb-4 flex items-start gap-4 transition-all duration-200 ${selectionMode ? 'cursor-pointer' : ''} ${isSelected ? 'ring-4 ring-blue-500 bg-stone-200' : ''}`}>
      {selectionMode && (
        <div className="w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center flex-shrink-0 mt-1">
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
  onDelete: () => void;
  onSelectAll: () => void;
  onCancel: () => void;
}> = ({ count, onDelete, onSelectAll, onCancel }) => (
  <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg p-2 flex items-center justify-between z-40 border-t-4 border-blue-500">
    <div className="flex items-center gap-3">
      <button onClick={onCancel} className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center font-bold text-gray-700">X</button>
      <button onClick={onSelectAll} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg">Select All</button>
      <span className="font-bold text-lg text-black">{count} selected</span>
    </div>
    <div className="flex gap-2">
      <button onClick={onDelete} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg">Delete</button>
    </div>
  </div>
);

interface QuizManagementScreenProps {
  category: ActivityCategory;
  questions: QuizQuestion[];
  onBack: () => void;
  onUpdateQuestion: (category: ActivityCategory, question: QuizQuestion) => void;
  onDeleteQuestions: (category: ActivityCategory, questionIds: number[]) => void;
}

const QuizManagementScreen: React.FC<QuizManagementScreenProps> = ({ category, questions, onBack, onUpdateQuestion, onDeleteQuestions }) => {
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
  const selectionMode = selectedQuestions.size > 0;

  const handleSelectQuestion = (questionId: number) => {
    const newSelection = new Set(selectedQuestions);
    if (newSelection.has(questionId)) {
      newSelection.delete(questionId);
    } else {
      newSelection.add(questionId);
    }
    setSelectedQuestions(newSelection);
  };
  
  const handleSelectAll = () => {
    if (selectedQuestions.size === questions.length) {
      setSelectedQuestions(new Set());
    } else {
      setSelectedQuestions(new Set(questions.map(q => q.id)));
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedQuestions.size} question(s)?`)) {
        playSound(SoundType.Delete);
        onDeleteQuestions(category, Array.from(selectedQuestions));
        setSelectedQuestions(new Set());
    }
  };

  const handleDeleteSingleQuestion = (questionId: number) => {
    playSound(SoundType.Delete);
    onDeleteQuestions(category, [questionId]);
    setEditingQuestion(null);
  };

  return (
    <div className="p-4 pb-40">
      {editingQuestion && (
        <EditQuizQuestionModal
          question={editingQuestion}
          onSave={(q) => { onUpdateQuestion(category, q); setEditingQuestion(null); }}
          onCancel={() => setEditingQuestion(null)}
          onDelete={handleDeleteSingleQuestion}
        />
      )}
      <Header title={`Manage ${category}`} onBack={onBack} />
      <div className="mt-6">
        {questions.length > 0 ? (
          questions.map((q) => (
            <QuizQuestionCard
              key={q.id}
              question={q}
              onEdit={() => setEditingQuestion(q)}
              onSelect={() => handleSelectQuestion(q.id)}
              isSelected={selectedQuestions.has(q.id)}
              selectionMode={selectionMode}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 mt-8">No questions in this category yet. Add one from the 'Add' screen!</p>
        )}
      </div>
      {selectionMode && (
        <SelectionActionBar
          count={selectedQuestions.size}
          onDelete={handleDelete}
          onSelectAll={handleSelectAll}
          onCancel={() => setSelectedQuestions(new Set())}
        />
      )}
    </div>
  );
};

export default QuizManagementScreen;
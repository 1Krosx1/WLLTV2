
import React, { useState, useRef, ChangeEvent } from 'react';
import Header from './Header';
import { ActivityCategory, QuizQuestion, Word } from '../types';
import { playSound, SoundType } from './sounds';
import { INITIAL_ACTIVITIES } from '../constants';

interface AddScreenProps {
  onBack: () => void;
  onAddWord: (wordData: Omit<Word, 'id'>) => void;
  onAddQuizQuestion: (category: ActivityCategory, questionData: Omit<QuizQuestion, 'id'>) => void;
}

const AddScreen: React.FC<AddScreenProps> = ({ onBack, onAddWord, onAddQuizQuestion }) => {
  const [category, setCategory] = useState<ActivityCategory>(ActivityCategory.Actions);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const categories: ActivityCategory[] = Object.values(ActivityCategory);
  
  // Word state
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [wordAudio, setWordAudio] = useState<{ url: string; name: string } | null>(null);

  // Quiz Question state
  const [question, setQuestion] = useState('');
  const [questionEnglish, setQuestionEnglish] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number | null>(null);
  const [quizAudio, setQuizAudio] = useState<{ url: string; name: string } | null>(null);
  
  // Shared state
  const [image, setImage] = useState<{ url: string; name: string } | null>(null);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const activityDetails = INITIAL_ACTIVITIES.find(a => a.id === category);
  const isQuizCategory = activityDetails?.type === 'quiz';
  
  const resetForm = () => {
    setWord('');
    setMeaning('');
    setWordAudio(null);
    setQuestion('');
    setQuestionEnglish('');
    setOptions(['', '', '', '']);
    setCorrectOptionIndex(null);
    setQuizAudio(null);
    setImage(null);
    if(imageInputRef.current) imageInputRef.current.value = "";
    if(audioInputRef.current) audioInputRef.current.value = "";
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({ url: reader.result as string, name: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isQuizCategory) {
          setQuizAudio({ url: reader.result as string, name: file.name });
        } else {
          setWordAudio({ url: reader.result as string, name: file.name });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveImage = () => {
      setImage(null);
      if(imageInputRef.current) imageInputRef.current.value = "";
  }

  const handleRemoveAudio = () => {
    if (isQuizCategory) {
      setQuizAudio(null);
    } else {
      setWordAudio(null);
    }
    if (audioInputRef.current) audioInputRef.current.value = "";
  }

  const handleSave = () => {
    playSound(SoundType.Save);

    if (isQuizCategory) {
        if (!question || !questionEnglish || options.some(o => !o) || correctOptionIndex === null || !image || !quizAudio) {
            alert('Please fill all fields, provide 4 options, select a correct answer, and upload an image and audio for the quiz question.');
            return;
        }
        const newQuestionData = {
            question,
            questionEnglish,
            image: image?.url || '',
            audio: quizAudio?.url || '',
            options,
            correctAnswer: options[correctOptionIndex],
        };
        onAddQuizQuestion(category, newQuestionData as Omit<QuizQuestion, 'id'>);
        alert('Quiz question saved successfully!');
    } else {
        if (!word || !meaning) {
            alert('Please fill in both the word and meaning fields.');
            return;
        }
        const newWordData = {
            word,
            meaning,
            category,
            image_path: image?.url || '',
            audio_path: wordAudio?.url || '',
        };
        onAddWord(newWordData);
        alert('Word saved successfully!');
    }
    
    resetForm();
  };


  const renderWordForm = () => (
    <>
      <div className="bg-gray-200 rounded-2xl shadow-md p-6 space-y-6">
        <input type="text" placeholder="Word here" value={word} onChange={e => setWord(e.target.value)} className="w-full bg-transparent border-b-2 border-gray-400 text-2xl font-bold focus:outline-none focus:border-blue-500 text-black placeholder:text-gray-500" />
        <input type="text" placeholder="Meaning/ Phrases" value={meaning} onChange={e => setMeaning(e.target.value)} className="w-full bg-transparent text-lg focus:outline-none text-black placeholder:text-gray-500" />
      </div>
       <div className="grid grid-cols-2 gap-4">
            <button onClick={() => imageInputRef.current?.click()} className="bg-blue-500 text-white font-bold py-3 px-4 rounded-full shadow-lg text-lg flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span>Image</span>
            </button>
            <button onClick={() => audioInputRef.current?.click()} className="bg-green-500 text-white font-bold py-3 px-4 rounded-full shadow-lg text-lg flex items-center justify-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1V10a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                <span>Upload Audio</span>
            </button>
      </div>
      {wordAudio && (
            <div className="bg-gray-200 rounded-2xl shadow-md p-4">
                <h3 className="font-semibold mb-2 text-black">Audio Preview:</h3>
                    <div className="relative group">
                    <audio controls src={wordAudio.url} className="w-full" />
                    <button onClick={handleRemoveAudio} className="absolute -top-1 -right-1 bg-red-500/80 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            </div>
        )}
    </>
  );

  const renderQuizForm = () => (
    <>
        <div className="bg-gray-200 rounded-2xl shadow-md p-6 space-y-6">
            <h3 className="text-xl font-bold text-black">Quiz Question</h3>
            <input type="text" placeholder="Question (Minasbate)" value={question} onChange={e => setQuestion(e.target.value)} className="w-full bg-transparent border-b-2 border-gray-400 text-xl focus:outline-none focus:border-blue-500 text-black placeholder:text-gray-500" />
            <input type="text" placeholder="Question (English)" value={questionEnglish} onChange={e => setQuestionEnglish(e.target.value)} className="w-full bg-transparent text-lg focus:outline-none text-black placeholder:text-gray-500" />
            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => imageInputRef.current?.click()} className="bg-blue-500 text-white font-bold py-3 px-4 rounded-full shadow-lg text-lg flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span>Image*</span>
                </button>
                <button onClick={() => audioInputRef.current?.click()} className="bg-green-500 text-white font-bold py-3 px-4 rounded-full shadow-lg text-lg flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1V10a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                    <span>Audio*</span>
                </button>
            </div>
        </div>
        {quizAudio && (
            <div className="bg-gray-200 rounded-2xl shadow-md p-4">
                <h3 className="font-semibold mb-2 text-black">Audio Preview:</h3>
                <div className="relative group">
                    <audio controls src={quizAudio.url} className="w-full" />
                    <button onClick={handleRemoveAudio} className="absolute -top-1 -right-1 bg-red-500/80 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            </div>
        )}
        <div className="bg-gray-200 rounded-2xl shadow-md p-6 space-y-4">
            <h3 className="text-xl font-bold text-black">Options (Select correct answer)</h3>
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
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="w-full bg-white rounded-lg p-3 text-lg text-black placeholder:text-gray-500"
                    />
                </div>
            ))}
        </div>
    </>
  );

  return (
    <div className="p-4 pb-28">
      <Header title="Add" onBack={onBack} />
      
      <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} className="hidden" />
      <input type="file" accept="audio/mpeg, audio/wav, audio/ogg" ref={audioInputRef} onChange={handleAudioChange} className="hidden" />

      <div className="mt-8 space-y-8">
        <div className="bg-gray-200 rounded-2xl shadow-md p-4">
          {!isDropdownOpen ? (
            <button 
              onClick={() => setIsDropdownOpen(true)}
              className="w-full flex justify-between items-center text-left text-lg font-semibold text-black"
            >
              <span>Category: {category}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 text-white bg-blue-500 rounded-full transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          ) : (
            <div className="flex justify-between items-start">
              <div className="w-full pr-4 space-y-1">
                {categories.map(cat => (
                  <div
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setIsDropdownOpen(false);
                      resetForm();
                    }}
                    className="p-3 text-lg text-black rounded-lg hover:bg-gray-300 cursor-pointer"
                  >
                    {cat}
                  </div>
                ))}
              </div>
              <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="bg-blue-500 text-white rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center shadow-md"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
              </button>
            </div>
          )}
        </div>
        
        {isQuizCategory ? renderQuizForm() : renderWordForm()}

        {image && (
            <div className="bg-gray-200 rounded-2xl shadow-md p-4">
                <h3 className="font-semibold mb-2 text-black">Image Preview:</h3>
                <div className="relative group">
                    <img src={image.url} alt="Preview" className="rounded-lg w-full max-h-60 object-contain" />
                    <button onClick={handleRemoveImage} className="absolute top-2 right-2 bg-red-500/80 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        )}

        <button onClick={handleSave} data-nosound className="w-full bg-red-500 text-white font-bold py-4 rounded-full shadow-lg text-xl">
          SAVE
        </button>
      </div>
    </div>
  );
};

export default AddScreen;

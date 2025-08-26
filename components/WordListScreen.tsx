
import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import { ActivityCategory, Word } from '../types';

interface WordListScreenProps {
  category: ActivityCategory;
  onBack: () => void;
  words: Word[];
}

const WordCard: React.FC<{ word: Word; }> = ({ word }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const playAudio = () => {
        if (word.audio_path) {
            const audio = audioRef.current;
            if (audio) {
                if (audio.paused) {
                    audio.play().catch(e => console.error("Error playing audio:", e));
                } else {
                    audio.pause();
                    audio.currentTime = 0;
                }
            }
        } else {
            // Fallback to Text-to-Speech
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
                setIsPlaying(false); // Manually update state as onend won't fire for cancel
                return;
            }
            const utterance = new SpeechSynthesisUtterance(word.word);
            // Attempt to find a Filipino voice for better pronunciation
            const voices = speechSynthesis.getVoices();
            const filipinoVoice = voices.find(voice => voice.lang === 'fil-PH' || voice.lang === 'tl-PH');
            if (filipinoVoice) {
                utterance.voice = filipinoVoice;
            }
            utterance.lang = 'tl-PH'; // Set language for better pronunciation fallback

            utterance.onstart = () => setIsPlaying(true);
            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = (e) => {
                console.error("Speech synthesis error:", e);
                setIsPlaying(false);
            };
            speechSynthesis.speak(utterance);
        }
    };
    
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const handlePlay = () => setIsPlaying(true);
            const handlePause = () => setIsPlaying(false);
            const handleEnded = () => setIsPlaying(false);

            audio.addEventListener('play', handlePlay);
            audio.addEventListener('playing', handlePlay);
            audio.addEventListener('pause', handlePause);
            audio.addEventListener('ended', handleEnded);

            return () => {
                audio.removeEventListener('play', handlePlay);
                audio.removeEventListener('playing', handlePlay);
                audio.removeEventListener('pause', handlePause);
                audio.removeEventListener('ended', handleEnded);
            };
        }
    }, [word.audio_path]);


    return (
        <div className="bg-stone-300 rounded-2xl shadow-md p-4 mb-4 flex items-center gap-4">
            <div className="text-left flex-grow">
                <h3 className="text-3xl font-bold text-black">{word.word}</h3>
                <hr className="border-t border-gray-400 my-1" />
                <p className="text-gray-600 text-md">{word.meaning}</p>
            </div>
            {word.audio_path && <audio ref={audioRef} src={word.audio_path} preload="auto" className="hidden" />}
            <button
                onClick={playAudio}
                data-nosound
                className={`${isPlaying ? 'bg-green-500' : 'bg-gray-400'} text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md flex-shrink-0 transition-colors duration-200`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 5.054a1 1 0 011.366-.928A6.987 6.987 0 0118 10a6.987 6.987 0 01-5.634 5.874 1 1 0 01-1.366-.928v-1.148a1 1 0 01.634-.949 3 3 0 000-5.698 1 1 0 01-.634-.949V5.054z" />
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
};

const WordListScreen: React.FC<WordListScreenProps> = ({ category, onBack, words }) => {
    const categoryWords = words.filter(word => word.category === category);

    return (
        <div className="p-4">
            <Header title={category} onBack={onBack} />
            <div className="mt-6">
                {categoryWords.map((word) => (
                    <WordCard key={word.id} word={word} />
                ))}
            </div>
        </div>
    );
};

export default WordListScreen;

export enum SoundType {
  Correct = 'Correct',
  Incorrect = 'Incorrect',
  Click = 'Click',
  Save = 'Save',
  Delete = 'Delete',
}

const soundUrls: Record<SoundType, string> = {
  [SoundType.Correct]: '/mixkit-correct-answer-reward-952.wav',
  [SoundType.Incorrect]: '/mixkit-wrong-answer-fail-notification-946.wav',
  [SoundType.Click]: '/mixkit-modern-technology-select-3124.wav',
  [SoundType.Save]: 'https://cdn.pixabay.com/audio/2022/03/10/audio_1321480041.mp3',
  [SoundType.Delete]: 'https://cdn.pixabay.com/audio/2022/03/15/audio_b6528d7b7e.mp3',
};

// Create a pool of audio objects to reduce delay on first play
const audioPool: Partial<Record<SoundType, HTMLAudioElement>> = {};

export const playSound = (sound: SoundType) => {
  try {
    if (!audioPool[sound]) {
      audioPool[sound] = new Audio(soundUrls[sound]);
    }
    const audio = audioPool[sound];
    if (audio) {
      audio.currentTime = 0; // Rewind to start
      audio.play().catch(error => {
        // Autoplay was prevented.
        console.warn(`Sound playback failed for ${sound}:`, error);
      });
    }
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

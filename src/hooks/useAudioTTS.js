import { useState, useEffect } from 'react';
import { audioEngine } from '../features/audio/AudioEngine';

export function useAudioTTS() {
  const [status, setStatus] = useState({
    isPlaying: audioEngine.isPlaying,
    isPaused: audioEngine.isPaused,
    rate: audioEngine.currentRate,
    text: audioEngine.currentText,
  });

  useEffect(() => {
    const unsubscribe = audioEngine.subscribe(newStatus => {
      setStatus(newStatus);
    });
    return unsubscribe;
  }, []);

  const speak = (text, rate) => audioEngine.speak(text, rate);
  const pause = () => audioEngine.pause();
  const resume = () => audioEngine.resume();
  const stop = () => audioEngine.stop();
  const setRate = (rate) => audioEngine.setRate(rate);

  return {
    ...status,
    speak,
    pause,
    resume,
    stop,
    setRate,
  };
}

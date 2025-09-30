'use client';

import { useState, useRef, useEffect } from 'react';
import { textToSpeech } from '@/ai/flows/text-to-speech';

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup audio element on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const speak = async (text: string) => {
    if (!text) return;

    setIsSpeaking(true);
    setError(null);

    try {
      const { audio } = await textToSpeech({ text });
      
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const newAudio = new Audio(audio);
      audioRef.current = newAudio;
      
      newAudio.play();
      
      newAudio.onended = () => {
        setIsSpeaking(false);
      };
      
      newAudio.onerror = () => {
        setError('Error playing audio.');
        setIsSpeaking(false);
      };

    } catch (e) {
      console.error("Text-to-speech failed:", e);
      setError('Failed to generate audio. Please try again.');
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
  };

  return { isSpeaking, error, speak, stopSpeaking };
}

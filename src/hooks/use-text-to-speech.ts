'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { textToSpeech } from '@/ai/flows/text-to-speech';

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(async (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
    }
    
    if (!text || !text.trim()) {
      return;
    }

    setIsSpeaking(true);
    setError(null);

    try {
      const result = await textToSpeech({ text });
      
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.onended = () => setIsSpeaking(false);
        audioRef.current.onerror = (e) => {
          console.error("Error playing audio.", e);
          setError("An error occurred during audio playback.");
          setIsSpeaking(false);
        };
      }

      audioRef.current.src = result.audio;
      audioRef.current.load();
      audioRef.current.play().catch((e) => {
        if (e.name !== 'AbortError') {
            console.error("Error starting audio playback:", e);
            setError("Could not start audio playback.");
        }
        setIsSpeaking(false);
      });

    } catch (e) {
      console.error("Failed to fetch audio:", e);
      setError('Audio generation failed. You may have hit a rate limit.');
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
    }
    setIsSpeaking(false);
  };
  
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopSpeaking();
    };
  }, []);


  return { isSpeaking, error, speak, stopSpeaking };
}

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { textToSpeech } from '@/ai/flows/text-to-speech';

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioQueueRef = useRef<HTMLAudioElement[]>([]);
  const isPlayingRef = useRef(false);
  const currentAudioIndexRef = useRef(0);
  const stopPlaybackRef = useRef(false);

  const playNextInQueue = useCallback(() => {
    if (stopPlaybackRef.current) {
        audioQueueRef.current = [];
        isPlayingRef.current = false;
        setIsSpeaking(false);
        stopPlaybackRef.current = false;
        return;
    }

    if (currentAudioIndexRef.current < audioQueueRef.current.length) {
      isPlayingRef.current = true;
      const audio = audioQueueRef.current[currentAudioIndexRef.current];
      // The audio source should already be loaded, so we just play.
      audio.play().catch((e) => {
        // Ignore interruption errors as we handle the queue logic.
        if (e.name === 'AbortError') return;
        console.error("Error playing audio:", e);
        setError("Error playing audio.");
        // Attempt to skip to the next clip
        currentAudioIndexRef.current++;
        playNextInQueue();
      });
    } else {
      isPlayingRef.current = false;
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(async (text: string | string[]) => {
    const textSegments = Array.isArray(text) ? text.filter(s => s.trim().length > 0) : [text];
    if (textSegments.length === 0) return;

    if (isPlayingRef.current) {
        stopSpeaking();
    }

    setIsSpeaking(true);
    setError(null);
    stopPlaybackRef.current = false;
    currentAudioIndexRef.current = 0;
    audioQueueRef.current = [];

    try {
      const audioPromises = textSegments.map(segment => textToSpeech({ text: segment }));
      
      const audioResults = await Promise.all(audioPromises);
      
      if (stopPlaybackRef.current) return;

      audioQueueRef.current = audioResults.map(({ audio: audioSrc }) => {
        const audio = new Audio(audioSrc);
        audio.onended = () => {
          currentAudioIndexRef.current++;
          playNextInQueue();
        };
         audio.onerror = (e) => {
          console.error("Error playing audio segment.", e);
          setError("Error playing audio.");
          currentAudioIndexRef.current++;
          playNextInQueue();
        };
        return audio;
      });

      if (audioQueueRef.current.length > 0) {
        playNextInQueue();
      } else {
        setIsSpeaking(false);
      }
    } catch (e) {
      console.error("Text-to-speech failed:", e);
      setError('Failed to generate audio. Please try again.');
      setIsSpeaking(false);
    }
  }, [playNextInQueue]);

  const stopSpeaking = () => {
    stopPlaybackRef.current = true;
    if (audioQueueRef.current.length > 0 && currentAudioIndexRef.current < audioQueueRef.current.length) {
      const currentAudio = audioQueueRef.current[currentAudioIndexRef.current];
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    }
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setIsSpeaking(false);
  };
  
  useEffect(() => {
    return () => {
      stopPlaybackRef.current = true;
      audioQueueRef.current.forEach(audio => {
        if (audio) {
            audio.pause();
            audio.src = '';
        }
      });
      audioQueueRef.current = [];
    };
  }, []);


  return { isSpeaking, error, speak, stopSpeaking };
}

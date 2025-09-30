'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { textToSpeech } from '@/ai/flows/text-to-speech';

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioQueueRef = useRef<HTMLAudioElement[]>([]);
  const currentAudioIndexRef = useRef(0);
  const stopPlaybackRef = useRef(false);

  const playNextInQueue = useCallback(() => {
    if (stopPlaybackRef.current) {
      stopPlaybackRef.current = false;
      return;
    }

    if (currentAudioIndexRef.current < audioQueueRef.current.length) {
      const audio = audioQueueRef.current[currentAudioIndexRef.current];
      audio.play().catch((e) => {
        if (e.name !== 'AbortError') {
          console.error("Error playing audio:", e);
          setError("Error playing audio.");
        }
        // Whether it's an error or not, try to continue the queue
        currentAudioIndexRef.current++;
        playNextInQueue();
      });
    } else {
      setIsSpeaking(false);
      audioQueueRef.current = [];
      currentAudioIndexRef.current = 0;
    }
  }, []);


  const speak = useCallback(async (textSegments: string[]) => {
    if (isSpeaking) {
      stopSpeaking();
    }
    
    if (!textSegments || textSegments.length === 0) {
      return;
    }

    setIsSpeaking(true);
    setError(null);
    stopPlaybackRef.current = false;
    currentAudioIndexRef.current = 0;
    audioQueueRef.current = [];
    
    try {
      const audioElements: HTMLAudioElement[] = [];

      for (const segment of textSegments) {
        if (stopPlaybackRef.current) break;
        if (!segment.trim()) continue;

        const result = await textToSpeech({ text: segment });
        if (result.audio) {
          const audio = new Audio(result.audio);
          audio.onended = () => {
            currentAudioIndexRef.current++;
            playNextInQueue();
          };
          audioElements.push(audio);
        }
      }
      
      if (stopPlaybackRef.current) {
        setIsSpeaking(false);
        return;
      };

      audioQueueRef.current = audioElements;
      
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
  }, [isSpeaking, playNextInQueue]);

  const stopSpeaking = () => {
    stopPlaybackRef.current = true;
    if (audioQueueRef.current.length > currentAudioIndexRef.current) {
      const currentAudio = audioQueueRef.current[currentAudioIndexRef.current];
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    }
    setIsSpeaking(false);
    audioQueueRef.current = [];
    currentAudioIndexRef.current = 0;
  };
  
  useEffect(() => {
    // Cleanup function to stop any playback when the component unmounts
    return () => {
      stopSpeaking();
    };
  }, []);


  return { isSpeaking, error, speak, stopSpeaking };
}

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { textToSpeech } from '@/ai/flows/text-to-speech';

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs to manage the queue and current audio
  const audioQueueRef = useRef<HTMLAudioElement[]>([]);
  const isPlayingRef = useRef(false);
  const audioSourcesRef = useRef<string[]>([]);
  const currentAudioIndexRef = useRef(0);
  const stopPlaybackRef = useRef(false);

  const playNextInQueue = useCallback(() => {
    if (stopPlaybackRef.current) {
        // Clear queue and reset state if stop was requested
        audioQueueRef.current = [];
        isPlayingRef.current = false;
        setIsSpeaking(false);
        stopPlaybackRef.current = false;
        return;
    }

    if (currentAudioIndexRef.current < audioQueueRef.current.length) {
      isPlayingRef.current = true;
      const audio = audioQueueRef.current[currentAudioIndexRef.current];
      audio.play();
    } else {
      // End of queue
      isPlayingRef.current = false;
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(async (text: string | string[]) => {
    const textSegments = Array.isArray(text) ? text : [text];
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
      // Generate audio for all segments in parallel
      const audioPromises = textSegments.map(segment => textToSpeech({ text: segment }));
      const audioResults = await Promise.all(audioPromises);
      
      if (stopPlaybackRef.current) return; // Stop if a new request came in

      audioQueueRef.current = audioResults.map(({ audio: audioSrc }) => {
        const audio = new Audio(audioSrc);
        audio.onended = () => {
          currentAudioIndexRef.current++;
          playNextInQueue();
        };
        audio.onerror = () => {
          console.error("Error playing audio segment.");
          setError("Error playing audio.");
          // Try to play the next one
          currentAudioIndexRef.current++;
          playNextInQueue();
        };
        return audio;
      });

      // Start playing the first audio clip
      playNextInQueue();

    } catch (e) {
      console.error("Text-to-speech failed:", e);
      setError('Failed to generate audio. Please try again.');
      setIsSpeaking(false);
    }
  }, [playNextInQueue]);

  const stopSpeaking = () => {
    stopPlaybackRef.current = true; // Signal to stop playback
    if (audioQueueRef.current.length > 0 && currentAudioIndexRef.current < audioQueueRef.current.length) {
      const currentAudio = audioQueueRef.current[currentAudioIndexRef.current];
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    // The playNextInQueue function will handle the rest of the cleanup.
    // Resetting state here directly could cause race conditions.
    isPlayingRef.current = false;
    setIsSpeaking(false);
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPlaybackRef.current = true;
      audioQueueRef.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioQueueRef.current = [];
    };
  }, []);


  return { isSpeaking, error, speak, stopSpeaking };
}

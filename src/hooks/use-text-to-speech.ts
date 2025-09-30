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
      audio.play().catch((e) => {
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
      // Create audio elements first
      const audioElements = textSegments.map(segment => {
        const audio = new Audio();
        audio.onended = () => {
          currentAudioIndexRef.current++;
          playNextInQueue();
        };
        audio.onerror = () => {
          console.error("Error playing audio segment.");
          setError("Error playing audio.");
          currentAudioIndexRef.current++;
          playNextInQueue();
        };
        return audio;
      });

      audioQueueRef.current = audioElements;
      
      // Start playing as soon as the first one is ready
      playNextInQueue();

      // Generate and load audio sources sequentially
      for (let i = 0; i < textSegments.length; i++) {
        if (stopPlaybackRef.current) break; // Stop fetching if user cancelled
        try {
            const { audio: audioSrc } = await textToSpeech({ text: textSegments[i] });
            if (audioQueueRef.current[i]) {
                audioQueueRef.current[i].src = audioSrc;
                // If this is the currently playing (or about to be playing) audio, load it.
                if (i === currentAudioIndexRef.current) {
                    audioQueueRef.current[i].load();
                }
            }
        } catch (e) {
            console.error(`Failed to generate audio for segment ${i}:`, e);
            // We can decide to skip this segment or stop entirely.
            // For now, let's just log and the queue will skip it as it won't play.
        }
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

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { textToSpeech } from '@/ai/flows/text-to-speech';

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This will hold the queue of audio sources to be played.
  const audioQueueRef = useRef<string[]>([]);
  // This holds the currently playing audio element.
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // This ref helps manage stopping playback cleanly.
  const stopPlaybackRef = useRef(false);

  const playNextInQueue = useCallback(() => {
    // If stop was called or the queue is empty, we stop.
    if (stopPlaybackRef.current || audioQueueRef.current.length === 0) {
      setIsSpeaking(false);
      stopPlaybackRef.current = false;
      return;
    }

    const audioSrc = audioQueueRef.current.shift(); // Get the next audio source
    if (!audioSrc) {
        setIsSpeaking(false);
        return;
    }
    
    if (!audioRef.current) {
        audioRef.current = new Audio();
        // This event listener is key. When one clip ends, it calls playNextInQueue to start the next.
        audioRef.current.onended = playNextInQueue;
        audioRef.current.onerror = (e) => {
            console.error("Error playing audio.", e);
            setError("An error occurred during audio playback.");
            // Try to recover by playing the next in queue
            playNextInQueue();
        };
    }
    
    audioRef.current.src = audioSrc;
    audioRef.current.load();
    audioRef.current.play().catch((e) => {
        // This can happen if a user interacts with the page, interrupting playback.
        if (e.name !== 'AbortError') {
            console.error("Error starting audio playback:", e);
            setError("Could not start audio playback.");
        }
        // Even on error, we try to continue the queue.
        playNextInQueue();
    });

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
    audioQueueRef.current = [];
    
    try {
      // Sequentially fetch audio for each segment to avoid rate limiting
      for (const segment of textSegments) {
        if (stopPlaybackRef.current) break; // If user stopped, exit the loop
        if (!segment.trim()) continue;

        try {
            const result = await textToSpeech({ text: segment });
            if (result.audio) {
                audioQueueRef.current.push(result.audio);
            }
        } catch(e) {
            // Log the error but continue trying to fetch other segments
            console.error("Failed to fetch audio for segment:", segment, e);
        }
      }
      
      // If playback was stopped during fetching, don't start playing.
      if (stopPlaybackRef.current) {
        setIsSpeaking(false);
        return;
      };

      // Start playing the first item in the now-populated queue.
      if (audioQueueRef.current.length > 0) {
        playNextInQueue();
      } else {
        setError("Could not generate any audio for the provided text.");
        setIsSpeaking(false);
      }

    } catch (e) {
      console.error("Text-to-speech generation failed:", e);
      setError('Failed to generate audio. Please try again.');
      setIsSpeaking(false);
    }
  }, [isSpeaking, playNextInQueue]);

  const stopSpeaking = () => {
    stopPlaybackRef.current = true;
    audioQueueRef.current = []; // Clear the upcoming queue
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
  };
  
  useEffect(() => {
    // Cleanup function to stop any playback when the component unmounts.
    return () => {
      stopSpeaking();
    };
  }, []);


  return { isSpeaking, error, speak, stopSpeaking };
}

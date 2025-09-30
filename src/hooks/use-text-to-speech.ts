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
    
    // This function will process the text segments one by one.
    const processQueue = async () => {
      for (const segment of textSegments) {
        if (stopPlaybackRef.current) break; // If user stopped, exit the loop
        if (!segment.trim()) continue;

        try {
          const result = await textToSpeech({ text: segment });
          if (result.audio) {
            audioQueueRef.current.push(result.audio);
            // If this is the first item and we're not already playing, start playback.
            if (audioQueueRef.current.length === 1 && !audioRef.current?.src) {
              playNextInQueue();
            }
          }
        } catch (e) {
          console.error("Failed to fetch audio for segment:", segment, e);
          setError('Audio generation failed. You may have hit a rate limit.');
          // Stop processing the queue on failure
          stopPlaybackRef.current = true;
          setIsSpeaking(false);
          break;
        }
      }
      
      // If we finished processing and nothing is playing, make sure to set speaking to false.
      if (!stopPlaybackRef.current && textSegments.indexOf(textSegments[textSegments.length - 1]) === textSegments.length -1) {
         // This is a bit of a tricky state. The last item is processing.
         // The onended event of the audio player will eventually set isSpeaking to false.
      }
    };
    
    processQueue();

  }, [isSpeaking, playNextInQueue]);

  const stopSpeaking = () => {
    stopPlaybackRef.current = true;
    audioQueueRef.current = []; // Clear the upcoming queue
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = ""; // Detach the source
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

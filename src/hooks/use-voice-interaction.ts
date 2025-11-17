'use client';

import { useState, useEffect, useCallback } from 'react';

const VOICE_INTERACTION_KEY = 'voiceInteractionEnabled';

export function useVoiceInteraction() {
  const [isVoiceInteractionEnabled, setIsVoiceInteractionEnabled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This effect runs once on mount to read the initial value from localStorage.
    try {
        const item = window.localStorage.getItem(VOICE_INTERACTION_KEY);
        if (item) {
            setIsVoiceInteractionEnabled(JSON.parse(item));
        }
    } catch (error) {
        console.error("Could not read voice interaction setting from localStorage", error);
    }
    // Mark as mounted after the initial read.
    setIsMounted(true);
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    try {
        // This function is now memoized with useCallback for stability.
        setIsVoiceInteractionEnabled(enabled);
        window.localStorage.setItem(VOICE_INTERACTION_KEY, JSON.stringify(enabled));
    } catch (error) {
        console.error("Could not save voice interaction setting to localStorage", error);
    }
  }, []);

  return {
    isVoiceInteractionEnabled: isMounted ? isVoiceInteractionEnabled : false,
    setIsVoiceInteractionEnabled: setEnabled,
  };
}

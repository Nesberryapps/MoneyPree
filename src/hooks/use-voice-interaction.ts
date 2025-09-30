'use client';

import { useState, useEffect } from 'react';

const VOICE_INTERACTION_KEY = 'voiceInteractionEnabled';

export function useVoiceInteraction() {
  const [isVoiceInteractionEnabled, setIsVoiceInteractionEnabled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
        const item = window.localStorage.getItem(VOICE_INTERACTION_KEY);
        setIsVoiceInteractionEnabled(item ? JSON.parse(item) : false);
    } catch (error) {
        console.error("Could not read voice interaction setting from localStorage", error);
        setIsVoiceInteractionEnabled(false);
    }
  }, []);

  const setEnabled = (enabled: boolean) => {
    try {
        setIsVoiceInteractionEnabled(enabled);
        window.localStorage.setItem(VOICE_INTERACTION_KEY, JSON.stringify(enabled));
    } catch (error) {
        console.error("Could not save voice interaction setting to localStorage", error);
    }
  };

  return {
    isVoiceInteractionEnabled: isMounted ? isVoiceInteractionEnabled : false,
    setIsVoiceInteractionEnabled: setEnabled,
  };
}

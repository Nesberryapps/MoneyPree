'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';

const VOICE_INTERACTION_KEY = 'voiceInteractionEnabled';

interface VoiceInteractionContextType {
  isVoiceInteractionEnabled: boolean;
  setIsVoiceInteractionEnabled: (enabled: boolean) => void;
}

const VoiceInteractionContext = createContext<VoiceInteractionContextType | undefined>(undefined);

export function VoiceInteractionProvider({ children }: { children: ReactNode }) {
  const [isVoiceInteractionEnabled, setIsVoiceInteractionEnabledState] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const item = window.localStorage.getItem(VOICE_INTERACTION_KEY);
      if (item) {
        setIsVoiceInteractionEnabledState(JSON.parse(item));
      }
    } catch (error) {
      console.error("Could not read voice interaction setting from localStorage", error);
    }
  }, []);

  const setIsVoiceInteractionEnabled = useCallback((enabled: boolean) => {
    try {
      setIsVoiceInteractionEnabledState(enabled);
      window.localStorage.setItem(VOICE_INTERACTION_KEY, JSON.stringify(enabled));
    } catch (error) {
      console.error("Could not save voice interaction setting to localStorage", error);
    }
  }, []);
  
  const value = {
    isVoiceInteractionEnabled: isMounted ? isVoiceInteractionEnabled : false,
    setIsVoiceInteractionEnabled,
  };

  return (
    <VoiceInteractionContext.Provider value={value}>
      {children}
    </VoiceInteractionContext.Provider>
  );
}

export function useVoiceInteraction() {
  const context = useContext(VoiceInteractionContext);
  if (context === undefined) {
    throw new Error('useVoiceInteraction must be used within a VoiceInteractionProvider');
  }
  return context;
}

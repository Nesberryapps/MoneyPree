'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

const PRO_STATUS_KEY = 'isPro';

interface ProStatusContextType {
  isPro: boolean;
  setIsPro: (isPro: boolean) => void;
}

const ProStatusContext = createContext<ProStatusContextType | undefined>(undefined);

export function ProStatusProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsProState] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const item = window.localStorage.getItem(PRO_STATUS_KEY);
      if (item) {
        setIsProState(JSON.parse(item));
      }
    } catch (error) {
      console.error("Could not read pro status from localStorage", error);
    }
  }, []);

  const setIsPro = (newIsPro: boolean) => {
    try {
      setIsProState(newIsPro);
      window.localStorage.setItem(PRO_STATUS_KEY, JSON.stringify(newIsPro));
    } catch (error) {
      console.error("Could not save pro status to localStorage", error);
    }
  };
  
  const value = {
    isPro: isMounted ? isPro : false,
    setIsPro,
  };

  return (
    <ProStatusContext.Provider value={value}>
      {children}
    </ProStatusContext.Provider>
  );
}

export function useProStatus() {
  const context = useContext(ProStatusContext);
  if (context === undefined) {
    throw new Error('useProStatus must be used within a ProStatusProvider');
  }
  return context;
}

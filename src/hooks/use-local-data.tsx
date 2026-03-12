
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { Transaction, Goal, BusinessTransaction } from '@/lib/types';

const LOCAL_STORAGE_KEYS = {
  TRANSACTIONS: 'moneypree_transactions',
  GOALS: 'moneypree_goals',
  BUSINESS_TRANSACTIONS: 'moneypree_business_transactions',
};

interface DataContextType {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  businessTransactions: BusinessTransaction[];
  setBusinessTransactions: (transactions: BusinessTransaction[]) => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void, boolean] {
  const [isLoading, setIsLoading] = useState(true);
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        // When reading from localStorage, dates are strings. We need to parse them back to Date objects.
        const parsed = JSON.parse(item, (key, value) => {
            if (key === 'date' || key === 'deadline' || key === 'createdAt') {
                if(value) return new Date(value);
            }
            return value;
        });
        setStoredValue(parsed);
      }
    } catch (error) {
      console.log(error);
      setStoredValue(initialValue);
    } finally {
        setIsLoading(false);
    }
  }, [key, initialValue]);

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue, isLoading];
}


export function DataProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions, isTransactionsLoading] = useLocalStorage<Transaction[]>(LOCAL_STORAGE_KEYS.TRANSACTIONS, []);
  const [goals, setGoals, isGoalsLoading] = useLocalStorage<Goal[]>(LOCAL_STORAGE_KEYS.GOALS, []);
  const [businessTransactions, setBusinessTransactions, isBizTransactionsLoading] = useLocalStorage<BusinessTransaction[]>(LOCAL_STORAGE_KEYS.BUSINESS_TRANSACTIONS, []);
  
  const isLoading = isTransactionsLoading || isGoalsLoading || isBizTransactionsLoading;

  const value = {
    transactions,
    setTransactions,
    goals,
    setGoals,
    businessTransactions,
    setBusinessTransactions,
    isLoading,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useLocalData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useLocalData must be used within a DataProvider');
  }
  return context;
}

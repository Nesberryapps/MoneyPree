
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { Transaction, Goal, Business, BusinessTransaction } from '@/lib/types';
import { initialTransactions, initialGoals } from '@/lib/initial-data';

const LOCAL_STORAGE_KEYS = {
  TRANSACTIONS: 'moneypree_transactions',
  GOALS: 'moneypree_goals',
  BUSINESS: 'moneypree_business',
  BUSINESS_TRANSACTIONS: 'moneypree_business_transactions',
};

interface DataContextType {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  business: Business;
  setBusiness: (business: Business) => void;
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
        let parsed = JSON.parse(item, (key, value) => {
            if (key === 'date' || key === 'deadline' || key === 'createdAt') {
                if(value) return new Date(value);
            }
            return value;
        });
        
        // One-time data migration for the typo "funf" -> "Fund"
        if (key === LOCAL_STORAGE_KEYS.GOALS) {
            const goals = parsed as Goal[];
            let hasBeenMigrated = false;
            const migratedGoals = goals.map(g => {
                if (g.name.toLowerCase() === 'vacation funf') {
                    hasBeenMigrated = true;
                    return { ...g, name: 'Vacation Fund' };
                }
                return g;
            });
            if (hasBeenMigrated) {
                parsed = migratedGoals;
                window.localStorage.setItem(key, JSON.stringify(parsed));
            }
        }

        setStoredValue(parsed);
      } else {
        // If no item, set the initial value in local storage
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.log(error);
      setStoredValue(initialValue);
    } finally {
        setIsLoading(false);
    }
  }, [key]);

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
  const [transactions, setTransactions, isTransactionsLoading] = useLocalStorage<Transaction[]>(LOCAL_STORAGE_KEYS.TRANSACTIONS, initialTransactions);
  const [goals, setGoals, isGoalsLoading] = useLocalStorage<Goal[]>(LOCAL_STORAGE_KEYS.GOALS, initialGoals);
  const [business, setBusiness, isBusinessLoading] = useLocalStorage<Business>(LOCAL_STORAGE_KEYS.BUSINESS, {
    id: 'main_business',
    userId: 'anonymous',
    name: 'My Side Hustle',
    industry: 'Consultant',
    entityType: 'Sole Proprietorship',
    createdAt: new Date(),
  });
  const [businessTransactions, setBusinessTransactions, isBizTransactionsLoading] = useLocalStorage<BusinessTransaction[]>(LOCAL_STORAGE_KEYS.BUSINESS_TRANSACTIONS, []);
  
  const isLoading = isTransactionsLoading || isGoalsLoading || isBizTransactionsLoading || isBusinessLoading;

  const value = {
    transactions,
    setTransactions,
    goals,
    setGoals,
    business,
    setBusiness,
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

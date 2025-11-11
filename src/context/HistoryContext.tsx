// src/context/HistoryContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Snapshot } from '../types/Snapshot';

interface HistoryContextType {
  history: Snapshot[];
  currentIndex: number;
  addSnapshot: (snapshot: Snapshot) => Promise<void>;
  clearHistory: () => void;
  goBack: () => void;
  goForward: () => void;
  loadSnapshot: (index: number) => void;
  saveSnapshot: (code: string) => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const addSnapshot = async (snapshot: Snapshot) => {
    setHistory([...history, snapshot]);
    setCurrentIndex(history.length);
  };

  const clearHistory = () => {
    setHistory([]);
    setCurrentIndex(-1);
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (currentIndex === -1 && history.length > 0) {
      setCurrentIndex(history.length - 1);
    }
  };

  const goForward = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (currentIndex === history.length - 1) {
      setCurrentIndex(-1);
    }
  };

  const loadSnapshot = (index: number) => {
    if (index >= 0 && index < history.length) {
      setCurrentIndex(index);
    } else if (index === history.length) {
      setCurrentIndex(-1);
    }
  };

  const saveSnapshot = async (code: string) => {
    const snapshot = {
      code,
      timestamp: new Date().toISOString(),
    };
    await addSnapshot(snapshot);
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        currentIndex,
        addSnapshot,
        clearHistory,
        goBack,
        goForward,
        loadSnapshot,
        saveSnapshot,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};

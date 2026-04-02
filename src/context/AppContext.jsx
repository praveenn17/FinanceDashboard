import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialTransactions } from '../data/mockData';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('dashboard_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('dashboard_role') || 'viewer';
  });

  // Dark mode based on tailwind class 'dark' on HTML tag
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dashboard_theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('dashboard_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('dashboard_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('dashboard_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const addTransaction = (transaction) => {
    if (role !== 'admin') return;
    setTransactions(prev => [...prev, { ...transaction, id: Date.now() }]);
  };

  const editTransaction = (id, updatedTransaction) => {
    if (role !== 'admin') return;
    setTransactions(prev => prev.map(t => (t.id === id ? { ...t, ...updatedTransaction } : t)));
  };

  const deleteTransaction = (id) => {
    if (role !== 'admin') return;
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const value = {
    transactions,
    role,
    setRole,
    theme,
    toggleTheme,
    addTransaction,
    editTransaction,
    deleteTransaction,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

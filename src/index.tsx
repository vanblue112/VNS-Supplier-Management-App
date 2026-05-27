import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Polyfill window.storage dùng localStorage
(window as any).storage = {
  get: async (key: string) => {
    const val = localStorage.getItem(key);
    return val ? { key, value: val } : null;
  },
  set: async (key: string, value: string) => {
    localStorage.setItem(key, value);
    return { key, value };
  },
  delete: async (key: string) => {
    localStorage.removeItem(key);
    return { key, deleted: true };
  },
  list: async (prefix?: string) => {
    const keys = Object.keys(localStorage).filter(k => !prefix || k.startsWith(prefix));
    return { keys };
  }
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<React.StrictMode><App /></React.StrictMode>);

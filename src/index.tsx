import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Polyfill window.storage -> dùng localStorage thay cho claude.ai storage
(window as any).storage = {
  get: async (key: string) => {
    try {
      const val = localStorage.getItem(key);
      return val ? { key, value: val } : null;
    } catch { return null; }
  },
  set: async (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      return { key, value };
    } catch { return null; }
  },
  delete: async (key: string) => {
    try {
      localStorage.removeItem(key);
      return { key, deleted: true };
    } catch { return null; }
  },
  list: async (prefix?: string) => {
    try {
      const keys = Object.keys(localStorage).filter(k => !prefix || k.startsWith(prefix));
      return { keys };
    } catch { return { keys: [] }; }
  }
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

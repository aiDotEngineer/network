import { useContext } from 'react';

import { LocalStorageContext } from './LocalStorageContext';

export function useLocalStorage() {
  const localStorage = useContext(LocalStorageContext);
  if (localStorage === null) {
    throw new Error('useLocalStorage must be within LocalStorageProvider');
  }
  return localStorage;
}

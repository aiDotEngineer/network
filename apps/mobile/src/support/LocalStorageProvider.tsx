import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createLocalStorage, LocalStorageContext } from '@pkg/ui';

const prefix = '@ls:';

const store = new Map<string, string>();

const localStorage = createLocalStorage({
  store,
  onChange: (key, value) => {
    if (value === null) {
      void AsyncStorage.removeItem(prefix + key);
    } else {
      void AsyncStorage.setItem(prefix + key, value);
    }
  },
});

// Make this a global for compatibility with the web frontend
globalThis.localStorage = localStorage;

async function loadFromAsyncStorage() {
  const keys = await AsyncStorage.getAllKeys();
  for (const key of keys) {
    if (key.startsWith(prefix)) {
      const value = await AsyncStorage.getItem(key);
      if (value != null) {
        store.set(key.slice(prefix.length), value);
      }
    }
  }
}

export function LocalStorageProvider(props: { children: ReactNode }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    loadFromAsyncStorage()
      .catch((error) => {
        console.warn('Error loading from AsyncStorage:', error);
      })
      .finally(() => {
        setDone(true);
      });
  }, []);
  if (!done) {
    return null;
  }
  return (
    <LocalStorageContext.Provider value={localStorage}>
      {props.children}
    </LocalStorageContext.Provider>
  );
}

type Init = {
  store: Map<string, string>;
  onChange: (key: string, value: string | null) => void;
};

export function createLocalStorage(init: Init): Storage {
  const { store, onChange } = init;
  // Match the API of the browser
  return {
    getItem: (key: string) => {
      return store.get(key) ?? null;
    },
    setItem: (key: string, value: string) => {
      store.set(key, value);
      onChange(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
      onChange(key, null);
    },
    getAllKeys: () => {
      return [...store.keys()];
    },
    get length() {
      return store.size;
    },
    clear: () => {
      const keys = Array.from(store.keys());
      store.clear();
      for (const key of keys) {
        onChange(key, null);
      }
    },
    key: (index: number) => {
      const keys = Array.from(store.keys());
      return keys[index] ?? null;
    },
  };
}

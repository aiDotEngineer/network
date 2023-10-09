import { createContext } from 'react';

import type { createLocalStorage } from './createLocalStorage';

type Context = ReturnType<typeof createLocalStorage>;

export const LocalStorageContext = createContext<Context | null>(null);

import { createContext } from 'react';

type EdgeInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type Os = 'ios' | 'android';

type Context = {
  safeAreaInsets: EdgeInsets;
  os: Os;
};

export const ConfigContext = createContext<Context | null>(null);

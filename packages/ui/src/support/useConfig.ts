import { useContext } from 'react';

import { ConfigContext } from './ConfigContext';

export function useConfig() {
  const localStorage = useContext(ConfigContext);
  if (localStorage === null) {
    throw new Error('useConfig must be within ConfigProvider');
  }
  return localStorage;
}

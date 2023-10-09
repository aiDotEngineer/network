import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConfigContext } from '@pkg/ui';

const os = Platform.OS === 'ios' ? 'ios' : 'android';

export function ConfigProvider(props: { children: ReactNode }) {
  const safeAreaInsets = useSafeAreaInsets();
  const context = useMemo(
    () => ({ safeAreaInsets, os }) as const,
    [safeAreaInsets],
  );
  return (
    <ConfigContext.Provider value={context}>
      {props.children}
    </ConfigContext.Provider>
  );
}

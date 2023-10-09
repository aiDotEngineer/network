import React from 'react';
import type { ReactNode } from 'react';
import { TamaguiProvider, Theme } from 'tamagui';

import config from '../config/tamagui.config';

export function ThemeProvider(props: { children: ReactNode }) {
  return (
    <TamaguiProvider config={config} disableInjectCSS>
      <Theme name="dark">{props.children}</Theme>
    </TamaguiProvider>
  );
}

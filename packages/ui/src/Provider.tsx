import type { ReactNode } from 'react';

import { FontProvider } from './providers/FontProvider';
import { ThemeProvider } from './providers/ThemeProvider';

type Props = {
  onLoaded: () => void;
  children: ReactNode;
};

export function Provider(props: Props) {
  return (
    <FontProvider onLoaded={props.onLoaded}>
      <ThemeProvider>{props.children}</ThemeProvider>
    </FontProvider>
  );
}

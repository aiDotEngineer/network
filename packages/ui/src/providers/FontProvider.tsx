import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useFonts } from 'expo-font';

import { fonts } from '../config/fonts';

type Props = {
  onLoaded: () => void;
  children: ReactNode;
};

export function FontProvider(props: Props) {
  const [fontsLoaded, fontLoadingError] = useFonts(fonts);

  useEffect(() => {
    if (fontLoadingError) {
      throw fontLoadingError;
    }
  }, [fontLoadingError]);

  useEffect(() => {
    if (fontsLoaded) {
      props.onLoaded();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return <>{props.children}</>;
}

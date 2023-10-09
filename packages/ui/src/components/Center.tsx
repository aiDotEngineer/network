import type { ReactNode } from 'react';
import { YStack } from 'tamagui';

export function Center(props: { children: ReactNode }) {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
      {props.children}
    </YStack>
  );
}

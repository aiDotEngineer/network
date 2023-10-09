import type { ComponentProps } from 'react';
import { View } from 'tamagui';

type Props = ComponentProps<typeof View>;

export function Divider(props: Props) {
  return <View h={3} backgroundColor="#212121" my={16} {...props} />;
}

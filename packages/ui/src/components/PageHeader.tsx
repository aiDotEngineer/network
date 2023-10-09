import type { ComponentProps } from 'react';
import { Paragraph } from 'tamagui';

type Props = ComponentProps<typeof Paragraph>;

export function PageHeader(props: Props) {
  return (
    <Paragraph
      p={16}
      fontWeight="600"
      fontSize={24}
      lineHeight={32}
      {...props}
    />
  );
}

import type { ComponentProps } from 'react';
import { Paragraph } from 'tamagui';

type Props = ComponentProps<typeof Paragraph>;

export function PageHeaderSm(props: Props) {
  return (
    <Paragraph
      p={16}
      fontWeight="600"
      fontSize={12}
      lineHeight={18}
      letterSpacing={1.2}
      color="white"
      opacity={0.6}
      textTransform="uppercase"
      {...props}
    />
  );
}

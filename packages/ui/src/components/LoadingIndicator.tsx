import { Spinner } from 'tamagui';

import { Center } from './Center';

export function LoadingIndicator() {
  return (
    <Center>
      <Spinner />
    </Center>
  );
}

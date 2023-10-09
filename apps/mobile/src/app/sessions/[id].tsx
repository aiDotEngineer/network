import { Stack, useLocalSearchParams } from 'expo-router';

import { useTranslation } from '@pkg/support';
import { SessionDetailsScreen } from '@pkg/ui/features';

export default () => {
  const { id } = useLocalSearchParams();
  const t = useTranslation();
  return (
    <>
      <Stack.Screen
        options={{
          title: t('Session Details'),
        }}
      />
      <SessionDetailsScreen id={String(id ?? '')} />
    </>
  );
};

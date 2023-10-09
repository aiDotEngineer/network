import { Stack, useLocalSearchParams } from 'expo-router';

import { AttendeeProfileScreen } from '@pkg/ui/features';

export default () => {
  const { id } = useLocalSearchParams();
  return (
    <>
      <Stack.Screen options={{ title: 'Profile' }} />
      <AttendeeProfileScreen id={String(id ?? '')} />
    </>
  );
};

import { router } from 'expo-router';

import { ScheduleScreen } from '@pkg/ui/features';

export default () => {
  return (
    <ScheduleScreen
      onPressSession={(sessionId) => {
        router.push(`/sessions/${sessionId}`);
      }}
    />
  );
};

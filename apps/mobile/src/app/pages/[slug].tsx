import { Stack, useLocalSearchParams } from 'expo-router';

import { CmsContentScreen } from '@pkg/ui/features';

export default () => {
  const { slug } = useLocalSearchParams();
  return (
    <CmsContentScreen
      slug={String(slug ?? '')}
      renderTitle={(title) => <Stack.Screen options={{ title }} />}
    />
  );
};

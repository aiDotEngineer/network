import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';

import { TRPCApiClientProvider } from '@pkg/ui';

import { api, TRPCProvider } from '~/support/api';
import { ConfigProvider } from '~/support/ConfigProvider';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default () => {
  return (
    <TRPCProvider>
      <TRPCApiClientProvider apiClient={api}>
        <ThemeProvider value={DarkTheme}>
          <ConfigProvider>
            <Stack screenOptions={{ headerTintColor: '#fff' }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </ConfigProvider>
        </ThemeProvider>
      </TRPCApiClientProvider>
    </TRPCProvider>
  );
};

import Constants from 'expo-constants';

export const apiBaseUrl = getApiBaseUrl();

export const appVersion = Constants.expoConfig?.version ?? '';

function getApiBaseUrl(): string {
  const EXPO_API_HOST = process.env.EXPO_API_HOST;
  if (EXPO_API_HOST) {
    return EXPO_API_HOST;
  }
  const { expoConfig } = Constants;
  if (__DEV__) {
    // TODO: Allow this to be overridden in .env
    const hostUri = expoConfig?.hostUri ?? '';
    const localhost = hostUri.split(':')[0] ?? '';
    return `http://${localhost}:3000`;
  }
  const host: unknown = expoConfig?.extra?.productionApiHost;
  if (typeof host !== 'string') {
    throw new Error('Must specify productionApiHost');
  }
  return host;
}

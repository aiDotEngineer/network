import { registerRootComponent } from 'expo';
import { useLocales } from 'expo-localization';
import { ExpoRoot, SplashScreen } from 'expo-router';

import { getUserLocale, LocaleProvider } from '@pkg/support';
import { Provider } from '@pkg/ui';

import { LocalStorageProvider } from './support/LocalStorageProvider';

SplashScreen.preventAutoHideAsync();

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context('./app');
  const locales = useLocales();
  const localeList = locales.map((locale) => locale.languageTag).join(', ');
  return (
    <LocaleProvider locale={getUserLocale(localeList)}>
      <LocalStorageProvider>
        <Provider onLoaded={() => SplashScreen.hideAsync()}>
          <ExpoRoot
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            context={ctx}
          />
        </Provider>
      </LocalStorageProvider>
    </LocaleProvider>
  );
}

registerRootComponent(App);

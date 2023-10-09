import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

import { defaultLocale } from './locales';
import type { SupportedLocale } from './locales';

const LocaleContext = createContext<SupportedLocale>(defaultLocale);

type Props = {
  locale: SupportedLocale;
  children: ReactNode;
};

export function LocaleProvider({ locale, children }: Props) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

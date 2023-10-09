import { t as tBase } from '@intl/t';
import type { Translate as TranslateBase } from '@intl/t';
import { t as tReact } from '@intl/t/react';
import type { Translate as TranslateReact } from '@intl/t/react';

export type Translate = TranslateBase & {
  jsx: TranslateReact;
};

const t: Translate = Object.assign(tBase, { jsx: tReact });

export function useTranslation() {
  // This is kinda cheating. Since we only support a single locale (for now),
  // we're not using `useLocale()` here.
  return t;
}

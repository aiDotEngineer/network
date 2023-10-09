export const supportedLocales = {
  en_us: true,
};

export type SupportedLocale = keyof typeof supportedLocales;

export const defaultLocale: SupportedLocale = 'en_us';

// Parse the supportedLocales above so that it's indexed by language
// e.g. `{ en: new Map([['us', 'en_us']]) }`
const byLanguage: Record<string, Map<string, SupportedLocale>> = {};
for (const locale of Object.keys(supportedLocales)) {
  const [lang = '', region = ''] = locale.split('_');
  const map =
    byLanguage[lang] ?? (byLanguage[lang] = new Map<string, SupportedLocale>());
  map.set(region, locale);
}

/**
 * Gets the closest supported locale from the list of the user's preferred
 * locales. If, for example, the user prefers `en-CA` but the only `en` locale we
 * have is `en-US`, it will use that. If no match, will fall back to the default
 * locale.
 *
 * Accepts either a string in the format provided by the `Accept-Language`
 * request header, or an array from the `navigator.languages` browser API.
 *
 * For reference, the `Accept-Language` header looks like:
 * - `Accept-Language: en-US, fr-CA;q=0.7, en;q=0.3`
 * In the browser, the global `navigator.languages` is an array like:
 * - `['en-US', 'fr-CA', 'en']`
 */
export function getUserLocale(
  preferredLocaleList: string | Array<string>,
): SupportedLocale {
  const array = Array.isArray(preferredLocaleList)
    ? preferredLocaleList
    : preferredLocaleList.split(',');
  for (const item of array) {
    // Normalize from the form `fr-CA;q=0.7`
    const locale = item.toLowerCase().split(';')[0] ?? '';
    const [lang = '', region] = locale.trim().split('-');
    const byRegion = byLanguage[lang];
    if (byRegion) {
      const locale = region ? byRegion.get(region) : undefined;
      if (locale) {
        return locale;
      }
      const maybeLocale = Array.from(byRegion.values())[0];
      if (maybeLocale) {
        return maybeLocale;
      }
    }
  }
  return defaultLocale;
}

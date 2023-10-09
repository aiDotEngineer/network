import { TITO_BASE_URL, TITO_EVENT_SLUG, TITO_ORG_SLUG } from '../constants';

const prefix = `/${TITO_ORG_SLUG}/${TITO_EVENT_SLUG}`;

export function url(path: string, params?: Record<string, unknown>) {
  const url = TITO_BASE_URL + prefix + path;
  const parsed = new URL(url);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      parsed.searchParams.set(key, String(value));
    }
  }
  return parsed.toString();
}

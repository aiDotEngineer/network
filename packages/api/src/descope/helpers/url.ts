import { DESCOPE_API_BASE_URL } from '../constants';

export function url(path: string, params?: Record<string, unknown>) {
  const url = DESCOPE_API_BASE_URL + path;
  const parsed = new URL(url);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      parsed.searchParams.set(key, String(value));
    }
  }
  return parsed.toString();
}

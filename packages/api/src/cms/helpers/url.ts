import { CMS_HOST } from '../constants';

export function url(path: string, params?: Record<string, unknown>) {
  const parsed = new URL(path, CMS_HOST);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      parsed.searchParams.set(key, String(value));
    }
  }
  return parsed.toString();
}

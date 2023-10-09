import { fetchJson } from '../../support/fetchJson';
import { TITO_API_KEY } from '../constants';
import { url } from './url';

export async function get<T = unknown>(
  path: string,
  params?: Record<string, unknown>,
) {
  const result = await fetchJson(url(path, params), {
    headers: {
      Authorization: `Bearer ${TITO_API_KEY}`,
      Accept: 'application/json',
    },
  });
  return result as T;
}

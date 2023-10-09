import { DESCOPE_PROJECT_ID } from '../constants';
import { url } from './url';

type Init = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

type UpstreamError = {
  errorCode: string;
  errorDescription: string;
  errorMessage: string;
  message: string;
};

type FetchResult<T> =
  | { success: true; payload: T }
  | { success: false; error: UpstreamError };

export async function fetchFromApi<T = unknown>(
  path: string,
  init: Init = {},
): Promise<FetchResult<T>> {
  const headers = new Headers(init.headers);
  if (!headers.get('Authorization')) {
    headers.set('Authorization', `Bearer ${DESCOPE_PROJECT_ID}`);
  }
  const { body } = init;
  // Default to POST if not specified but has body
  const method = init.method ?? (body === undefined ? 'GET' : 'POST');
  if (method === 'POST' || method === 'PUT') {
    headers.set('Content-Type', 'application/json');
  }
  const response = await fetch(url(path), {
    ...init,
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });
  const contentType = response.headers.get('Content-Type') ?? '';
  if (!isJson(contentType)) {
    throw new Error(
      `Invalid JSON response with status ${response.status} and content-type "${contentType}"`,
    );
  }
  if (!response.ok) {
    const error = (await response.json()) as UpstreamError;
    return { success: false, error };
  }
  const payload = (await response.json()) as T;
  return { success: true, payload };
}

function isJson(contentType: string) {
  const firstPart = contentType.split(';')[0] ?? '';
  return firstPart.toLowerCase().trim() === 'application/json';
}

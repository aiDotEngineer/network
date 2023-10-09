// Put this elsewhere, maybe support/constants
const AUTH_TOKEN_KEY = 'auth-token';

export function setAuthToken(token: string | null) {
  if (token === null) {
    globalThis.localStorage?.removeItem(AUTH_TOKEN_KEY);
  } else {
    globalThis.localStorage?.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function getAuthToken() {
  return globalThis.localStorage?.getItem(AUTH_TOKEN_KEY) ?? null;
}

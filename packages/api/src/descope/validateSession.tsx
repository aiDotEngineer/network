import { DESCOPE_PROJECT_ID } from './constants';
import { fetchFromApi } from './helpers/fetchFromApi';

type ApiValidateResult = {
  amr: Array<string>;
  drn: string;
  exp: string;
  iat: string;
  iss: string;
  rexp: string;
  sub: string;
};

type ApiRefreshResult = {
  sessionJwt: string;
  refreshJwt: string;
  cookieDomain: string;
  cookiePath: string;
  cookieMaxAge: number;
  cookieExpiration: number;
  user: null;
  firstSeen: boolean;
};

async function refreshSession(refreshJwt: string) {
  const result = await fetchFromApi<ApiRefreshResult>('/auth/refresh', {
    headers: {
      Authorization: `Bearer ${DESCOPE_PROJECT_ID}:${refreshJwt}`,
    },
    body: {},
  });
  if (result.success) {
    const { sessionJwt, refreshJwt } = result.payload;
    return { sessionJwt, refreshJwt };
  }
  return null;
}

export async function validateSession(input: {
  sessionJwt: string;
  refreshJwt: string;
}) {
  const { sessionJwt, refreshJwt } = input;
  const result = await fetchFromApi<ApiValidateResult>('/auth/validate', {
    headers: {
      Authorization: `Bearer ${DESCOPE_PROJECT_ID}:${sessionJwt}`,
    },
    body: {},
  });
  if (result.success) {
    return { sessionJwt, refreshJwt };
  }
  // Token is likely invalid or expired. `result.error` should look like:
  // { "errorCode": "E061005", "errorDescription": "Invalid token", ... }
  return await refreshSession(refreshJwt);
}

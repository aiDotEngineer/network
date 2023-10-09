import { DESCOPE_PROJECT_ID } from './constants';
import { fetchFromApi } from './helpers/fetchFromApi';
import { fromSessionToken } from './helpers/tokens';
import type { DescopeUser } from './types/DescopeUser';

type ApiResult = DescopeUser;

export async function getUserByToken(token: string) {
  const { refreshJwt } = fromSessionToken(token);
  const result = await fetchFromApi<ApiResult>('/auth/me', {
    headers: {
      Authorization: `Bearer ${DESCOPE_PROJECT_ID}:${refreshJwt}`,
    },
  });
  if (!result.success) {
    return null;
  }
  const { loginIds, name, email } = result.payload;
  const [loginId = ''] = loginIds;
  return { id: loginId, name, email };
}

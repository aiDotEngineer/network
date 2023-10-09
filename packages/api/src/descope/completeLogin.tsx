import { getPrisma } from '@pkg/db';

import { storeEmbeddings } from '../other/storeEmbeddings';
import { fetchFromApi } from './helpers/fetchFromApi';
import { getSessionToken } from './helpers/tokens';
import type { DescopeUser } from './types/DescopeUser';

type ApiResult = {
  sessionJwt: string;
  refreshJwt: string;
  cookieDomain: string;
  cookiePath: string;
  cookieMaxAge: number;
  cookieExpiration: number;
  user: DescopeUser;
  firstSeen: boolean;
};

type Result =
  | { success: true; session: ReturnType<typeof cleanSession> }
  | { success: false; errorCode: string; errorMessage: string };

export async function completeLogin(id: string, code: string): Promise<Result> {
  const prisma = getPrisma();
  const result = await fetchFromApi<ApiResult>('/auth/otp/verify/email', {
    body: {
      loginId: id,
      code,
    },
  });
  if (!result.success) {
    const { errorCode, errorMessage } = result.error;
    return { success: false, errorCode, errorMessage };
  }
  const emailAddress = result.payload.user.email;
  const email = await prisma.userEmail.findFirst({ where: { emailAddress } });
  const emailId = email?.id ?? '';
  const userProfile = await prisma.userProfile.findFirst({
    where: { emailId },
  });
  if (userProfile) {
    await storeEmbeddings(userProfile.id);
  }
  return { success: true, session: cleanSession(result.payload) };
}

function cleanSession(input: ApiResult) {
  const { sessionJwt, refreshJwt, user } = input;
  const { loginIds, name, email } = user;
  const [loginId = ''] = loginIds;
  return {
    token: getSessionToken({ sessionJwt, refreshJwt }),
    user: { id: loginId, name, email },
  };
}

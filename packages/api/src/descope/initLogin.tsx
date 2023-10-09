import { getAttendeeByEmail } from '../tito/getAttendeeByEmail';
import { fetchFromApi } from './helpers/fetchFromApi';

const ERROR_USER_EXISTS = 'E062107';

type ApiResult = {
  maskedEmail: string;
};

type Result =
  | { success: true; id: string; emailSent?: boolean }
  | { success: false; errorCode: string; errorMessage: string };

type AuthBody = {
  email: string;
  loginId: string;
  user: {
    username: string;
    name: string;
  };
};

async function signIn(loginId: string) {
  return await fetchFromApi<ApiResult>('/auth/otp/signin/email', {
    body: {
      loginId,
    },
  });
}

async function signUpOrSignIn(input: AuthBody) {
  const result = await fetchFromApi<ApiResult>('/auth/otp/signup/email', {
    body: input,
  });
  if (!result.success && result.error.errorCode === ERROR_USER_EXISTS) {
    return await signIn(input.loginId);
  }
  return result;
}

export async function initLogin(emailAddress: string): Promise<Result> {
  const attendee = await getAttendeeByEmail(emailAddress);
  if (!attendee) {
    return {
      success: false,
      errorCode: 'USER_NOT_FOUND',
      errorMessage: 'No user found with the given email address',
    };
  }
  const { id, name, email } = attendee;
  const result = await signUpOrSignIn({
    email,
    loginId: id,
    user: {
      username: id,
      name,
    },
  });
  if (result.success) {
    return { success: true, id };
  } else {
    const { errorCode, errorMessage } = result.error;
    return { success: false, errorCode, errorMessage };
  }
}

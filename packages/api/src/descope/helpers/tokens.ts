export function getSessionToken(input: {
  sessionJwt: string;
  refreshJwt: string;
}) {
  const { sessionJwt, refreshJwt } = input;
  return sessionJwt + '|' + refreshJwt;
}

export function fromSessionToken(token: string) {
  const [sessionJwt = '', refreshJwt = ''] = token.split('|');
  return { sessionJwt, refreshJwt };
}

// TODO: More choices here?
type UserStatus = 'enabled' | 'disabled';

export type DescopeUser = {
  loginIds: Array<string>;
  userId: string;
  name: string;
  email: string;
  phone: string;
  verifiedEmail: boolean;
  verifiedPhone: boolean;
  roleNames: Array<unknown>;
  userTenants: Array<unknown>;
  status: UserStatus;
  externalIds: Array<string>;
  picture: string;
  test: boolean;
  customAttributes: Record<string, unknown>;
  createdTime: number;
  TOTP: boolean;
  SAML: boolean;
  OAuth: Record<string, unknown>;
  webauthn: boolean;
  password: boolean;
};

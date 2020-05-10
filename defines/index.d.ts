type GoogleOAuthProfileType = {
  sub: string;
  email: string;
  name: string;
  picture: string;
  iss?: string;
  azp?: string;
  aud?: string;
  email_verified?: string;
  at_hash?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  iat?: string;
  exp?: string;
  alg?: string;
  kid?: string;
  typ?: string;
};

type GoogleOAuthTokenType = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
};

import { OAuth2Client } from 'google-auth-library';
import { StatusCode, ApiError } from '@utils/apiUtils';

const clientId = process.env.google_oauth_client_id as string;
const oauthClient = new OAuth2Client(clientId);

export async function getProfileByIdToken(idToken: string): Promise<GoogleOAuthProfileType> {
  try {
    const ticket = await oauthClient.verifyIdToken({
      idToken,
      audience: clientId,
    });
    // @ts-ignore
    return ticket.getPayload();
  } catch (error) {
    const msg = error.message;

    if (msg.includes('Token used too late') || msg.includes('invalid_token')) {
      throw new ApiError(StatusCode.unAuth, msg);
    }

    throw error;
  }
}

export async function verifyToken(token: string): Promise<any> {
  try {
    const tokenContent = token.replace(/^Bearer /, '');
    const tokenInfo = await oauthClient.getTokenInfo(tokenContent);

    if (!tokenInfo) {
      throw new Error('fail to get token info');
    }

    if (!tokenInfo.aud || tokenInfo.aud !== clientId) {
      throw new Error('client_id did not match');
    }

    return tokenInfo;
  } catch (error) {
    const msg = error.message;

    if (msg.includes('Token used too late') || msg.includes('invalid_token')) {
      throw new ApiError(StatusCode.unAuth, msg);
    }

    throw error;
  }
}

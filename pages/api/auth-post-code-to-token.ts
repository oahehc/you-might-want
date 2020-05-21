import express from 'express';
import axios from 'axios';
import { responseFactory, StatusCode } from '@utils/apiUtils';

export default async (req: express.Request, res: express.Response) => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const oauth2TokenEndpoint = 'https://www.googleapis.com/oauth2/v4/token';
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;

  res.setHeader('Content-Type', 'application/json');
  const response = responseFactory(res);

  try {
    let hasError = false;
    const { code } = req.body;

    if (!code) {
      hasError = true;
      response(StatusCode.missParam, { errorMsg: 'miss param: code' });
    }

    if (!hasError) {
      const params = {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      };
      const { data } = await axios.post(oauth2TokenEndpoint, null, {
        params,
      });
      response(StatusCode.success, { data });
    }
  } catch (err) {
    console.log('auth-get-user-profile err', err);
    response(err.statusCode || StatusCode.unKnowError, { errorMsg: err.message });
  }
};

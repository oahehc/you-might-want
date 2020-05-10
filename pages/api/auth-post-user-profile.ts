import express from 'express';
import { responseFactory, StatusCode } from '@utils/apiUtils';
import { getProfileByIdToken } from '@apis/google';
import { getUser, postUser, patchUserLastVisited } from '@apis/aws';

export default async (req: express.Request, res: express.Response) => {
  res.setHeader('Content-Type', 'application/json');
  const response = responseFactory(res);

  try {
    const { idToken } = req.body;
    let hasError = false;

    if (!idToken) {
      hasError = true;
      response(StatusCode.missParam, { errorMsg: 'miss param: idToken' });
    }

    if (!hasError) {
      const res = await getProfileByIdToken(idToken);

      if (res && res.sub) {
        response(StatusCode.success, { data: res });

        const profileRes = await getUser(res.sub);

        if (profileRes && profileRes.Item) {
          await patchUserLastVisited(res.sub);
        } else {
          const { sub, email, name } = res;
          const now = new Date().toISOString();
          postUser({
            userId: sub,
            email,
            name,
            created: now,
            lastVisited: now,
          });
        }
      } else {
        response(StatusCode.unAuth, { errorMsg: 'token validate fail' });
      }
    }
  } catch (err) {
    console.log('auth-get-user-profile err', err);
    response(err.statusCode || StatusCode.unKnowError, { errorMsg: err.message });
  }
};

import express from 'express';
import { responseFactory, StatusCode } from '@utils/apiUtils';
import { verifyToken } from '@apis/google';
import { patchPostVote } from '@apis/aws';

export default async (req: express.Request, res: express.Response) => {
  res.setHeader('Content-Type', 'application/json');
  const response = responseFactory(res);

  try {
    let hasError = false;
    const { authorization } = req.headers;
    const { postId, type } = req.body;

    if (!authorization) {
      hasError = true;
      response(StatusCode.unAuth, { errorMsg: 'without token' });
    }
    if (!postId) {
      hasError = true;
      response(StatusCode.missParam, { errorMsg: 'miss param: postId' });
    }
    if (!type) {
      hasError = true;
      response(StatusCode.missParam, { errorMsg: 'miss param: type' });
    }

    if (!hasError) {
      try {
        // @ts-ignore
        const { sub } = await verifyToken(authorization);

        patchPostVote({ userId: sub, postId, type })
          .then(res => {
            response(StatusCode.success, { res: 'patch vote success' });
          })
          .catch(err => response(StatusCode.unKnowError, { errorMsg: err.message }));
      } catch (e) {
        response(StatusCode.unAuth, { errorMsg: e.message });
      }
    }
  } catch (err) {
    response(StatusCode.unKnowError, { errorMsg: err.message });
  }
};

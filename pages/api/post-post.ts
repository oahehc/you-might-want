import express from 'express';
import { responseFactory, StatusCode } from '@utils/apiUtils';
import { verifyToken } from '@apis/google';
import { postPost } from '@apis/aws';

export default async (req: express.Request, res: express.Response) => {
  res.setHeader('Content-Type', 'application/json');
  const response = responseFactory(res);

  try {
    let hasError = false;
    const { authorization } = req.headers;
    const { id, text } = req.body;

    if (!authorization) {
      hasError = true;
      response(StatusCode.unAuth, { errorMsg: 'without token' });
    }

    if (!id) {
      hasError = true;
      response(StatusCode.missParam, { errorMsg: 'miss param: id' });
    }

    if (!text) {
      hasError = true;
      response(StatusCode.missParam, { errorMsg: 'miss param: text' });
    }

    if (!hasError) {
      try {
        // @ts-ignore
        await verifyToken(authorization);

        postPost({
          userId: id,
          text,
        })
          .then(res => {
            response(StatusCode.success, { res: 'postPost success' });
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

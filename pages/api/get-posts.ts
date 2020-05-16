import express from 'express';
import { responseFactory, StatusCode } from '@utils/apiUtils';
import { getPosts } from '@apis/aws';

export default async (req: express.Request, res: express.Response) => {
  res.setHeader('Content-Type', 'application/json');
  const response = responseFactory(res);

  try {
    let hasError = false;
    const { startKey, isRevest } = req.body;

    if (!hasError) {
      try {
        getPosts({ startKey, isRevest })
          .then(data => {
            const result = data || {};
            const list = result.Items || [];
            const lastKey = (result.LastEvaluatedKey && result.LastEvaluatedKey) || null;
            response(StatusCode.success, { list, lastKey });
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

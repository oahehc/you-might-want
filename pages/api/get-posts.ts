import express from 'express';
import { responseFactory, StatusCode } from '@utils/apiUtils';
import { getPosts } from '@apis/aws';

export default async (req: express.Request, res: express.Response) => {
  res.setHeader('Content-Type', 'application/json');
  const response = responseFactory(res);

  try {
    const { startKey, isRevest } = req.body;

    const data = await getPosts({ startKey, isRevest });
    const result = data || {};
    const list = result.Items || [];
    const lastKey = (result.LastEvaluatedKey && result.LastEvaluatedKey) || null;
    response(StatusCode.success, { list, lastKey });
  } catch (err) {
    response(StatusCode.unKnowError, { errorMsg: err.message });
  }
};

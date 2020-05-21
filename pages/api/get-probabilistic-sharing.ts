import express from 'express';
import { responseFactory, StatusCode } from '@utils/apiUtils';
import { getProbabilisticSharing } from '@apis/aws';

export default async (req: express.Request, res: express.Response) => {
  res.setHeader('Content-Type', 'application/json');
  const response = responseFactory(res);

  try {
    const data = await getProbabilisticSharing();
    response(StatusCode.success, { data });
  } catch (err) {
    response(StatusCode.unKnowError, { errorMsg: err.message });
  }
};

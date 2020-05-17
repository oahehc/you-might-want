import express from 'express';
import { responseFactory, StatusCode } from '@utils/apiUtils';
import { getProbabilisticSharing } from '@apis/aws';

export default async (req: express.Request, res: express.Response) => {
  res.setHeader('Content-Type', 'application/json');
  const response = responseFactory(res);

  try {
    let hasError = false;

    if (!hasError) {
      try {
        getProbabilisticSharing()
          .then(data => {
            response(StatusCode.success, { data });
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

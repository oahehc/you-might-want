import express from 'express';

export function responseFactory(res: express.Response) {
  return (statusCode: number, responseObj: any) => {
    res.statusCode = statusCode;
    res.json({ statusCode, ...responseObj });
  };
}

export const StatusCode = {
  success: 200,
  unKnowError: 400,
  unAuth: 401,
  missParam: 422,
  paramFormatError: 423,
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
export class ApiError extends Error {
  constructor(statusCode = 400, ...params: any[]) {
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    // @ts-ignore
    this.statusCode = statusCode;
  }
}

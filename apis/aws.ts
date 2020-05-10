import AWS from 'aws-sdk';

const region = process.env.aws_region || 'us-east-1';
const accessKeyId = process.env.aws_access_key_id;
const secretAccessKey = process.env.aws_secret_access_key;
const userTable = 'you-might-want-users';

const config = {
  region,
  accessKeyId,
  secretAccessKey,
};
const docClient = new AWS.DynamoDB.DocumentClient({ ...config, apiVersion: '2012-08-10' });

// get user profile
export function getUser(userId: string): Promise<any> {
  const params = {
    TableName: userTable,
    Key: {
      userId,
    },
  };

  return new Promise((resolve, reject) => {
    docClient.get(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
// create user profile
type UserProfile = {
  userId: string;
  email: string;
  name: string;
  created: string;
  lastVisited: string;
  wallet?: string;
};
export function postUser(data: UserProfile): Promise<any> {
  const params = {
    TableName: userTable,
    Item: data,
  };

  return new Promise((resolve, reject) => {
    docClient.put(params, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}
// update user profile
export function patchUserLastVisited(userId: string): Promise<any> {
  const now = new Date().toISOString();
  const params = {
    TableName: userTable,
    Key: {
      userId,
    },
    ExpressionAttributeNames: {
      '#lastVisited': 'lastVisited',
    },
    ExpressionAttributeValues: {
      ':now': now,
    },
    UpdateExpression: 'SET #lastVisited = :now',
  };

  return new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

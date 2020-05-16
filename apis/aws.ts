import AWS from 'aws-sdk';
import { v1 as uuidv1 } from 'uuid';

const region = process.env.aws_region || 'us-east-1';
const accessKeyId = process.env.aws_access_key_id;
const secretAccessKey = process.env.aws_secret_access_key;
const userTable = 'you-might-want-users';
const postTable = 'you-might-want-posts';

const config = {
  region,
  accessKeyId,
  secretAccessKey,
};
const docClient = new AWS.DynamoDB.DocumentClient({ ...config, apiVersion: '2012-08-10' });

type UserProfile = {
  userId: string;
  email: string;
  name: string;
  created: string;
  lastVisited: string;
  wallet?: string;
};

// get user profile
export function getUser(
  userId: string
): Promise<{
  Item: UserProfile;
}> {
  const params = {
    TableName: userTable,
    Key: {
      userId,
    },
  };

  return new Promise((resolve, reject) => {
    docClient.get(params, (err, data) => {
      if (err) reject(err);
      // @ts-ignore
      else resolve(data);
    });
  });
}
// create user profile
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
// update user wallet
type PatchUserWalletInput = {
  userId: string;
  wallet: string;
};
export function patchUserWallet({ userId, wallet }: PatchUserWalletInput): Promise<any> {
  const params = {
    TableName: userTable,
    Key: {
      userId,
    },
    ExpressionAttributeNames: {
      '#wallet': 'wallet',
    },
    ExpressionAttributeValues: {
      ':wallet': wallet,
    },
    UpdateExpression: 'SET #wallet = :wallet',
  };

  return new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
// create post
type PostPostInput = {
  userId: string;
  text: string;
};
export function postPost({ userId, text }: PostPostInput): Promise<any> {
  const now = new Date().toISOString();
  const data = {
    postId: uuidv1(),
    userId,
    text,
    created: now,
    upVotes: [],
    downVotes: [],
    isDisplay: 1,
  };
  const params = {
    TableName: postTable,
    Item: data,
  };

  return new Promise((resolve, reject) => {
    docClient.put(params, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

type GetPostsInput = {
  startKey: string;
};
type GetPostsResponse = {
  Items: Post[];
  Count: number;
  ScannedCount: number;
  LastEvaluatedKey: PostsPaginateKey;
};
export function getPosts({ startKey }: GetPostsInput): Promise<GetPostsResponse> {
  const params = {
    TableName: postTable,
    IndexName: 'isDisplay-created-index',
    KeyConditions: {
      isDisplay: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [1],
      },
    },
    Limit: 5, // FIXME:
    ScanIndexForward: false,
  };

  if (startKey && Object.keys(startKey).length > 0) {
    // @ts-ignore
    params.ExclusiveStartKey = startKey;
  }

  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if (err) reject(err);
      // @ts-ignore
      else resolve(data);
    });
  });
}

type GetPostInput = {
  postId: string;
};
type GetPostResponse = {
  Item: Post;
};
export function getPost({ postId }: GetPostInput): Promise<GetPostResponse> {
  const params = {
    TableName: postTable,
    Key: {
      postId,
    },
  };

  return new Promise((resolve, reject) => {
    docClient.get(params, (err, data) => {
      if (err) reject(err);
      // @ts-ignore
      else resolve(data);
    });
  });
}

type PatchPostVoteInput = {
  type: VoteTypes;
  postId: string;
  userId: string;
};
export function patchPostVote({ type, postId, userId }: PatchPostVoteInput): Promise<any> {
  return new Promise((resolve, reject) => {
    getPost({ postId })
      .then(({ Item }) => {
        const votes = type === 'up' ? Item.upVotes : Item.downVotes;
        const idx = votes.indexOf(userId);

        if (idx < 0) {
          votes.push(userId);
        } else {
          votes.splice(idx, 1);
        }

        const params = {
          TableName: postTable,
          Key: {
            postId,
          },
          ExpressionAttributeNames: {
            '#vote': `${type}Votes`,
          },
          ExpressionAttributeValues: {
            ':vote': votes,
          },
          UpdateExpression: 'SET #vote = :vote',
        };
        docClient.update(params, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      })
      .catch(err => reject(err));
  });
}

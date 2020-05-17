import AWS from 'aws-sdk';
import { v1 as uuidv1, v1 } from 'uuid';

const region = process.env.aws_region || 'us-east-1';
const accessKeyId = process.env.aws_access_key_id;
const secretAccessKey = process.env.aws_secret_access_key;
const userTable = 'you-might-want-users';
const postTable = 'you-might-want-posts';
const shareTable = 'you-might-want-shares';
const PROBABILISTIC_UPDATE_PERIOD = 60 * 60 * 1000; // one hour

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
      else resolve(data);
    });
  });
}

type GetPostsInput = {
  startKey: string;
  isRevest?: boolean;
};
type GetPostsResponse = {
  Items: Post[];
  Count: number;
  ScannedCount: number;
  LastEvaluatedKey: PostsPaginateKey;
};
export function getPosts({ startKey, isRevest }: GetPostsInput): Promise<GetPostsResponse> {
  const params = {
    TableName: postTable,
    IndexName: 'isDisplay-created-index',
    KeyConditions: {
      isDisplay: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [1],
      },
    },
    Limit: 20,
    ScanIndexForward: !!isRevest,
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

// TODO: query posts within xx days
function getAllPosts(): Promise<Post[]> {
  const params = {
    TableName: postTable,
    IndexName: 'isDisplay-created-index',
    KeyConditions: {
      isDisplay: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [1],
      },
    },
  };

  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if (err) reject(err);
      // @ts-ignore
      else resolve(data.Items);
    });
  });
}
function getUsersWithWallet(): Promise<User[]> {
  const params = {
    TableName: userTable,
    IndexName: 'wallet-index',
    KeyConditions: {
      wallet: {
        ComparisonOperator: 'NE',
        AttributeValueList: '',
      },
    },
  };

  return new Promise((resolve, reject) => {
    // TODO: use query instead scan
    docClient.scan(params, (err, data) => {
      if (err) reject(err);
      // @ts-ignore
      else resolve(data.Items);
    });
  });
}
function getPostPoint({
  created,
  upVotes,
  downVotes,
}: {
  created: string;
  upVotes: string[];
  downVotes: string[];
}): number {
  const votesDiff = upVotes.length - downVotes.length;
  if (votesDiff <= 0) return 0;

  const timeDiff = Date.now() - new Date(created).getTime();
  return (100000000 / timeDiff) ** 1.2 * votesDiff ** 1.2;
}

async function updateProbabilisticSharing() {
  try {
    const [posts, users] = await Promise.all([getAllPosts(), getUsersWithWallet()]);
    const userMap = users.reduce(
      (res: { [w: string]: string }, { userId, wallet }) => ({
        ...res,
        [userId]: wallet,
      }),
      {}
    );

    let totalPoints = 0;
    const points = posts.reduce((res: { [w: string]: number }, post) => {
      const wallet = userMap[post.userId];
      if (!wallet) return res;

      const postPoint = getPostPoint(post);
      totalPoints += postPoint;
      if (res[wallet]) {
        res[wallet] = res[wallet] + postPoint;
      } else {
        res[wallet] = postPoint;
      }
      return res;
    }, {});

    const pointsPortion = Object.entries(points).reduce(
      (res, [key, value]) => ({
        ...res,
        [key]: Number(value) / totalPoints,
      }),
      {}
    );

    const now = new Date().toISOString();
    const params = {
      TableName: shareTable,
      Item: {
        id: uuidv1(),
        created: now,
        data: pointsPortion,
        isValid: 1,
      },
    };
    docClient.put(params, (err, res) => {
      if (err) console.error('update probabilistic sharing fail:', err);
      else console.log('update probabilistic sharing success');
    });
  } catch (e) {
    console.error('update probabilistic sharing fail:', e);
  }
}

export function getProbabilisticSharing(): Promise<{
  Item: { [w: string]: number };
}> {
  const params = {
    TableName: shareTable,
    IndexName: 'isValid-created-index',
    KeyConditions: {
      isValid: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [1],
      },
    },
    Limit: 1,
    ScanIndexForward: false,
  };

  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if (err) reject(err);
      else {
        const item = data?.Items?.[0];
        if (item) {
          const lastModify = Date.now() - new Date(item.created).getTime();
          if (lastModify > PROBABILISTIC_UPDATE_PERIOD) updateProbabilisticSharing();
        }
        resolve(item?.data || {});
      }
    });
  });
}

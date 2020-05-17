const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const region = process.env.aws_region || 'us-east-1';
const accessKeyId = process.env.aws_access_key_id;
const secretAccessKey = process.env.aws_secret_access_key;
const postTable = 'you-might-want-posts';

const config = {
  region,
  accessKeyId,
  secretAccessKey,
};
const dynamodb = new AWS.DynamoDB({ ...config, apiVersion: '2012-08-10' });

(async function () {
  try {
    const filePath = path.resolve(__dirname, '../faker/posts.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const items = JSON.parse(data).posts.map(({ postId, userId, text, created, isDisplay, downVotes, upVotes }) => ({
      PutRequest: {
        Item: {
          postId: {
            S: String(postId),
          },
          userId: {
            S: String(userId),
          },
          text: {
            S: String(text),
          },
          created: {
            S: String(created),
          },
          isDisplay: {
            N: String(isDisplay),
          },
          downVotes: {
            L: downVotes.map(s => ({ S: String(s) })),
          },
          upVotes: {
            L: upVotes.map(s => ({ S: String(s) })),
          },
        },
      },
    }));
    const params = {
      RequestItems: {
        [postTable]: items,
      },
    };
    dynamodb.batchWriteItem(params, function (err, data) {
      if (err) throw err;
      else console.log('batch insert posts success');
    });
  } catch (e) {
    console.error('batch insert posts fail:', e);
  }
})();

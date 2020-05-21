import axios, { AxiosInstance } from 'axios';

export const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || '/';
const axiosInstance = axios.create({ baseURL: apiUrl });

export const getProfileByIdTokenApi = (
  idToken: string
): Promise<{
  statusCode: number;
  data: GoogleOAuthProfileType;
}> => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`${apiUrl}/api/auth-post-user-profile`, { idToken })
      .then(res => resolve(res.data))
      .catch(reject);
  });
};

export const postTokenByAuthCode = (
  code: string
): Promise<{
  statusCode: number;
  data: {
    access_token: string;
    refresh_token: string;
    id_token: string;
    scope: string;
    token_type: string;
    expires_in: number;
  };
}> => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`${apiUrl}/api/auth-post-code-to-token`, { code })
      .then(res => resolve(res.data))
      .catch(reject);
  });
};

export const postRefreshToken = (
  refreshToken: string
): Promise<{
  statusCode: number;
  data: {
    access_token: string;
    id_token: string;
    scope: string;
    token_type: string;
    expires_in: number;
  };
}> => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`${apiUrl}/api/auth-post-refresh-token`, { refreshToken })
      .then(res => resolve(res.data))
      .catch(reject);
  });
};

export const patchUserWalletApi = (id: string, wallet: string, authInstance?: AxiosInstance): Promise<any> => {
  const instance = authInstance || axiosInstance;

  return new Promise((resolve, reject) => {
    instance
      .patch(`${apiUrl}/api/patch-user-wallet`, { id, wallet })
      .then(res => resolve(res))
      .catch(reject);
  });
};

export type PostPostResponse = {
  statusCode: number;
  post: Post;
};
export const postPostApi = (id: string, text: string, authInstance?: AxiosInstance): Promise<PostPostResponse> => {
  const instance = authInstance || axiosInstance;
  return new Promise((resolve, reject) => {
    instance
      .post(`${apiUrl}/api/post-post`, { id, text })
      .then(res => resolve(res.data))
      .catch(reject);
  });
};

export type GetPostsResponse = {
  statusCode: number;
  list: Post[];
  lastKey: PostsPaginateKey | null;
};
export const getPostsApi = (startKey?: PostsPaginateKey | null, isRevest?: boolean): Promise<GetPostsResponse> => {
  const data = {
    startKey,
    isRevest,
  };
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`${apiUrl}/api/get-posts`, data)
      .then(res => resolve(res.data))
      .catch(reject);
  });
};

type PatchVoteInput = {
  type: VoteTypes;
  postId: string;
};
export const patchVote = (data: PatchVoteInput, authInstance?: AxiosInstance): Promise<any> => {
  const instance = authInstance || axiosInstance;

  return new Promise((resolve, reject) => {
    instance
      .patch(`${apiUrl}/api/patch-vote`, data)
      .then(res => resolve(res.data))
      .catch(reject);
  });
};

type ProbabilisticSharingResponse = {
  statusCode: number;
  data: {
    [wallet: string]: number;
  };
};
export const getProbabilisticSharing = (): Promise<ProbabilisticSharingResponse> => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .patch(`${apiUrl}/api/get-probabilistic-sharing`)
      .then(res => resolve(res.data))
      .catch(reject);
  });
};

import axios, { AxiosInstance } from 'axios';

export const apiUrl = process.env.base_url;
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

export const patchUserWalletApi = (id: string, wallet: string, authInstance?: AxiosInstance): Promise<any> => {
  const instance = authInstance || axiosInstance;

  return new Promise((resolve, reject) => {
    instance
      .patch(`${apiUrl}/api/patch-user-wallet`, { id, wallet })
      .then(res => resolve(res))
      .catch(reject);
  });
};

export const postPostApi = (id: string, text: string, authInstance?: AxiosInstance): Promise<any> => {
  const instance = authInstance || axiosInstance;

  return new Promise((resolve, reject) => {
    instance
      .post(`${apiUrl}/api/post-post`, { id, text })
      .then(res => resolve(res))
      .catch(reject);
  });
};

type GetPostsResponse = {
  statusCode: number;
  list: Post[];
  lastKey: PostsPaginateKey | null;
};
export const getPostsApi = (startKey?: PostsPaginateKey | null): Promise<GetPostsResponse> => {
  const data = startKey ? { startKey } : {};
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`${apiUrl}/api/get-posts`, data)
      .then(res => resolve(res.data))
      .catch(reject);
  });
};

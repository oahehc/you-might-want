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

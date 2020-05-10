import axios from 'axios';

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

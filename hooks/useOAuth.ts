import { useEffect, useReducer } from 'react';
import axios, { AxiosInstance } from 'axios';
import useLocalStorage, { oauthKeys } from '@hooks/useLocalStorage';
import { getProfileByIdTokenApi } from '@utils/apis';

const clientId = process.env.google_oauth_client_id;
const clientSecret = process.env.google_oauth_client_secret;
const redirectUri = `${process.env.base_url}/login`;
const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
const oauth2TokenEndpoint = 'https://www.googleapis.com/oauth2/v4/token';

type OAuthStateType = 'init' | 'login' | 'logout';
type UseOAuthResponse = {
  oauthState: authStateType;
  handleLogin: (p?: string) => void;
  handleLogout: () => void;
  handleExchangeAuthCodeToToken: (c: string) => Promise<null>;
  authRequestFactory: (baseUrl?: string) => AxiosInstance;
  updateProfile: (d: any) => void;
};

type authStateType = {
  status: OAuthStateType;
  profile: GoogleOAuthProfileType | null | undefined;
  isLogin?: boolean;
  isInit?: boolean;
};
let globalAuthState: authStateType = {
  status: 'init',
  profile: null,
};
type authActionType = {
  type: OAuthStateType;
  data?: GoogleOAuthProfileType | null;
};
function authReducer(state: authStateType, action: authActionType) {
  let nextState;

  switch (action.type) {
    case 'init':
      nextState = { status: action.type, profile: null };
      break;
    case 'login':
      nextState = { status: action.type, profile: action.data };
      break;
    case 'logout':
      nextState = { status: action.type, profile: null };
      break;
    default:
      nextState = state;
      break;
  }

  globalAuthState = nextState;

  return nextState;
}

function useOAuth(): UseOAuthResponse {
  const [oauthState, dispatch] = useReducer(authReducer, globalAuthState);
  const [profile, setProfile] = useLocalStorage<GoogleOAuthProfileType | null>(oauthKeys.profile, null, true);
  const [accessToken, setAccessToken] = useLocalStorage<string>(oauthKeys.access, '');
  const [refreshToken, setRefreshToken] = useLocalStorage<string>(oauthKeys.refresh, '');

  /*
   * init process:
   * with refreshToken -> refresh token -> get profile by idToken
   */
  useEffect(() => {
    async function verifyToken(refreshToken: string) {
      try {
        const { id_token } = await handleRefreshToken(refreshToken);

        if (id_token) {
          dispatch({ type: 'login', data: profile });
        }
      } catch (e) {
        handleLogout();
      }
    }

    if (oauthState.status === 'init') {
      if (profile && profile.sub) {
        dispatch({ type: 'login', data: profile });
      } else if (!refreshToken) {
        handleLogout();
      } else {
        verifyToken(refreshToken);
      }
    }
  }, []);

  // https://developers.google.com/identity/protocols/OAuth2UserAgent#redirecting
  function handleLogin(page?: string) {
    const form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);

    const params = {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'profile email',
      access_type: 'offline', // allow refresh token
      // include_granted_scopes: 'true', // https://developers.google.com/identity/protocols/OAuth2UserAgent#incrementalAuth
      prompt: 'consent', // https://stackoverflow.com/questions/10827920/not-receiving-google-oauth-refresh-token
      state: page || '/',
    };

    // Add form parameters as hidden input values.
    for (const p in params) {
      const input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      // @ts-ignore
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  }

  // https://developers.google.com/identity/protocols/OAuth2InstalledApp#exchange-authorization-code
  async function handleExchangeAuthCodeToToken(code: string): Promise<null> {
    const params = {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    };
    const { data } = await axios.post(oauth2TokenEndpoint, null, {
      params,
    });

    const { access_token, refresh_token, id_token } = data || {};
    if (id_token) {
      const { data } = await getProfileByIdTokenApi(id_token);
      const { sub, email, name, picture, wallet } = data || {};
      dispatch({ type: 'login', data: { sub, email, name, picture, wallet } });
      setProfile({ sub, email, name, picture, wallet });
      setAccessToken(access_token);
      setRefreshToken(refresh_token);

      return null;
    }
    throw new Error('exchange token fail');
  }

  // https://developers.google.com/identity/protocols/OAuth2InstalledApp#offline
  async function handleRefreshToken(refreshToken: string): Promise<GoogleOAuthTokenType> {
    const params = {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    };

    const { data } = await axios.post(oauth2TokenEndpoint, null, {
      params,
    });

    if (!data || !data.access_token || !data.id_token) {
      throw new Error('refresh token fail');
    }
    setAccessToken(data.access_token);

    return data;
  }

  function handleLogout() {
    setAccessToken('');
    setRefreshToken('');
    setProfile(null);
    dispatch({ type: 'logout' });
  }

  function authRequestFactory(baseURL: string = '/') {
    const axiosInstance = axios.create({
      baseURL,
    });

    axiosInstance.interceptors.request.use(
      config => {
        if (accessToken && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        config.headers['content-type'] = 'application/json';

        return config;
      },
      error => Promise.reject(error)
    );

    // refresh token and resend when 401: https://github.com/axios/axios/issues/934
    axiosInstance.interceptors.response.use(
      response => response,
      error => {
        const status = error.response ? error.response.status : null;

        if (status === 401 && !error.config.headers.retry && refreshToken) {
          return handleRefreshToken(refreshToken).then(({ access_token }) => {
            if (access_token) {
              error.config.headers['Authorization'] = `Bearer ${access_token}`;
              error.config.headers.retry = true;

              if (error.config.data) error.config.data = JSON.parse(error.config.data);

              return axiosInstance.request(error.config);
            }
          });
        }

        return Promise.reject(error);
      }
    );

    return axiosInstance;
  }

  function updateProfile(data: any) {
    setProfile({
      ...profile,
      ...data,
    });
  }

  const state = {
    status: oauthState.status,
    profile: oauthState.profile,
    isInit: oauthState.status === 'init',
    isLogin: oauthState.status === 'login',
  };

  return {
    oauthState: state,
    handleLogin,
    handleLogout,
    handleExchangeAuthCodeToToken,
    authRequestFactory,
    updateProfile,
  };
}

export default useOAuth;

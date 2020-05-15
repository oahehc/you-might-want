import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { LoadingWrapper } from '@components/index';
import LoginModal from '@components/LoginModal/LoginModal';
import useOAuth from '@hooks/useOAuth';

type Query = {
  state: string;
  code: string;
  error: string;
  path: string;
};

const Login = () => {
  const router = useRouter();
  const { state, code, error, path } = router.query as Query;
  const { handleLogin, handleExchangeAuthCodeToToken } = useOAuth();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [loginError, setError] = useState<string>('');

  // exchange google auth code to token
  useEffect(() => {
    async function handleExchange(code: string) {
      setLoading(true);
      setError('');
      try {
        await handleExchangeAuthCodeToToken(code);
        Router.push(state || '/');
      } catch (error) {
        console.error('exchange auth code to token fail', error);
        setLoading(false);
        setError(error.message);
      }
    }
    if (code && !error) {
      handleExchange(code);
    }
  }, [code]);

  if (code) {
    return (
      <div className="wrapper">
        <h2>Login Your Account...</h2>
        <LoadingWrapper isLoading={isLoading} />
        <style jsx>{`
          .wrapper {
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          h2 {
            font-size: 2.4rem;
            text-align: center;
            margin-bottom: 2rem;
          }
        `}</style>
      </div>
    );
  }

  if (path) {
    return <LoginModal handleBack={() => Router.push('/')} handleGoogleLogin={() => handleLogin(path)} />;
  }

  // TODO: display useful message and action button/link when login fail
  if (error || loginError) {
    return <div>Login Fail</div>;
  }

  // TODO: display useful info or link to allow user continue process?
  return null;
};

export default Login;

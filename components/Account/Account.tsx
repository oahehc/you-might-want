import React from 'react';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { Loading, Avatar } from '@components/index';
import useOAuth from '@hooks/useOAuth';
import styles from './Account.style';

const Account: React.FC = () => {
  const { oauthState, handleLogin, handleLogout } = useOAuth();
  const { picture, name, email } = (oauthState && oauthState.profile) || {};
  const isInit = oauthState && oauthState.status === 'init';
  const isLogin = oauthState && oauthState.status === 'login';

  return (
    <div className="account-wrapper">
      {isInit && <Loading />}
      {isLogin && (
        <>
          <Avatar src={picture} name={name || email} size="m" />
          <button className="account-btn" onClick={handleLogout} title="logout">
            <FaSignOutAlt />
          </button>
        </>
      )}
      {!isInit && !isLogin && (
        <button className="account-btn" onClick={() => handleLogin('/')} title="login">
          <FaSignInAlt />
        </button>
      )}
      <style jsx>{styles}</style>
    </div>
  );
};

export { Account };

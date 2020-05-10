import React, { useState, useEffect } from 'react';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { Loading, Avatar, Modal, Button, Input } from '@components/index';
import useOAuth from '@hooks/useOAuth';
import { apiUrl, patchUserWalletApi } from '@utils/apis';
import styles from './Account.style';

const Account: React.FC = () => {
  const { oauthState, handleLogin, handleLogout, authRequestFactory, updateProfile } = useOAuth();
  const authRequest = authRequestFactory(apiUrl);
  const { sub, picture, name, email, wallet: currentWallet } = (oauthState && oauthState.profile) || {};
  const isInit = oauthState && oauthState.status === 'init';
  const isLogin = oauthState && oauthState.status === 'login';
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [wallet, setWallet] = useState(currentWallet || '');

  function openProfileModal() {
    setProfileModalOpen(true);
  }
  function closeProfileModal() {
    setProfileModalOpen(false);
  }
  async function updateWallet() {
    try {
      // @ts-ignore
      await patchUserWalletApi(sub, wallet, authRequest);
      updateProfile({ wallet });
      setProfileModalOpen(false);
    } catch (error) {
      // TODO: error handle
    }
  }
  function changeWallet(value: string) {
    setWallet(value);
  }

  useEffect(() => {
    if (currentWallet) setWallet(currentWallet);
  }, [currentWallet]);

  return (
    <>
      <div className="account-wrapper">
        {isInit && <Loading />}
        {isLogin && (
          <>
            <Avatar src={picture} name={name || email} size="m" onClick={openProfileModal} />
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
      <Modal width="320px" show={isProfileModalOpen}>
        <h2>Edit Your Wallet</h2>
        <Input value={wallet} handleChange={changeWallet} placeholder="add your wallet" />
        <Modal.Footer>
          <Button onClick={closeProfileModal} invert>
            Cancel
          </Button>
          <Button onClick={updateWallet}>Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export { Account };

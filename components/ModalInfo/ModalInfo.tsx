import React from 'react';
import { MdExposurePlus1 } from 'react-icons/md';
import useOAuth from '@hooks/useOAuth';
import { Button, Modal } from '@components/index';
import styles from './ModalInfo.style';

type ModalInfoProps = {
  closeModal: () => void;
};

const RegisterInfo: React.FC<ModalInfoProps> = ({ closeModal }) => {
  const { handleLogin } = useOAuth();

  return (
    <div className="wrapper">
      <h2>Login or Join us in 10 seconds</h2>
      <p>join the community to start sharing you knowledge and make money.</p>
      <Modal.Footer>
        <Button onClick={closeModal} invert>
          Close
        </Button>
        <Button onClick={() => handleLogin('/')}>
          <img className="google-icon" src="./static/google-logo.svg" alt="google" />
          <span>Continue By Google</span>
        </Button>
      </Modal.Footer>
      <style jsx>{styles}</style>
    </div>
  );
};
const MonetizationInfo: React.FC<ModalInfoProps> = ({ closeModal }) => {
  function goToMonetization() {
    window.open('https://help.coil.com/accounts/membership-accounts');
  }

  return (
    <div className="wrapper">
      <h2>Join web monetization</h2>
      <p>
        Join web monetization, you not just encourage more people to share valuable information, but also have the
        ability to decide which post is wealth to share the profit.
        <br /> Moreover, you will be able to enjoy the ads-free and more oncoming advance features.
      </p>
      <ul>
        <li>
          <a href="https://help.coil.com/accounts/membership-accounts" target="_blank" rel="noreferrer noopener">
            How to apply web monetization?
          </a>
        </li>
        <li>
          <a href="https://webmonetization.org/" target="_blank" rel="noreferrer noopener">
            What's web monetization?
          </a>
        </li>
      </ul>
      <Modal.Footer>
        <Button onClick={closeModal} invert>
          Close
        </Button>
        <Button onClick={goToMonetization}>
          Join Us Now
          <MdExposurePlus1 />
        </Button>
      </Modal.Footer>
      <style jsx>{styles}</style>
    </div>
  );
};

export { RegisterInfo, MonetizationInfo };

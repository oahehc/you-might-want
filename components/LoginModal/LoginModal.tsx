import React from 'react';
import { Modal, Button } from '@components/index';
import styles from './LoginModal.style';

type Props = {
  handleBack: () => void;
  handleGoogleLogin: () => void;
};

const LoginModal = ({ handleBack, handleGoogleLogin }: Props) => {
  return (
    <Modal width="520px" show>
      <h2>Please login or create account to continue</h2>
      <Modal.Footer>
        <Button onClick={handleBack} invert>
          Back To Home
        </Button>
        <Button onClick={handleGoogleLogin}>
          <img className="google-icon" src="./static/google-logo.svg" alt="google" />
          <span>Continue By Google</span>
        </Button>
      </Modal.Footer>
      <style jsx>{styles}</style>
    </Modal>
  );
};

export default LoginModal;

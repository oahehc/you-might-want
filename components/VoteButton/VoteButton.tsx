import React from 'react';
import { MdThumbDown, MdThumbUp } from 'react-icons/md';
import cx from 'classnames';
import { useGlobalModalContext } from '@contexts/GlobalModal';
import useOAuth from '@hooks/useOAuth';
import useMonetization from '@hooks/useMonetization';
import { apiUrl, patchVote } from '@utils/apis';
import styles from './VoteButton.style';

type Props = {
  type: VoteTypes;
  postId: string;
  votes: string[];
};

const VoteButton: React.FC<Props> = ({ postId, type, votes }) => {
  const { oauthState, authRequestFactory } = useOAuth();
  const authRequest = authRequestFactory(apiUrl);
  const { sub } = (oauthState && oauthState.profile) || {};
  const isVoted = sub && votes.includes(sub);
  const { isLogin } = oauthState || {};
  const [{ isStarted }] = useMonetization();
  const { showRegisterModal, showMonetizationModal } = useGlobalModalContext();

  async function handleVote() {
    if (!isLogin) {
      showRegisterModal();
    } else if (!isStarted) {
      // DISCUSS: allow monetization user vote without register?
      showMonetizationModal();
    } else {
      await patchVote(
        {
          type,
          postId,
        },
        authRequest
      );
    }
  }

  return (
    <button
      className={cx('wrapper', {
        active: isVoted,
        disabled: !isLogin,
      })}
      onClick={handleVote}
    >
      {type === 'up' ? <MdThumbUp /> : <MdThumbDown />}
      <span>{votes.length}</span>
      <style jsx>{styles}</style>
    </button>
  );
};

export { VoteButton };

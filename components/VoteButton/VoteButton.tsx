import React, { useState } from 'react';
import { MdThumbDown, MdThumbUp } from 'react-icons/md';
import cx from 'classnames';
import { useGlobalModalContext } from '@contexts/GlobalModal';
import { useOAuth } from '@contexts/OAuth';
import useMonetization from '@hooks/useMonetization';
import { usePostsContext } from '@contexts/Posts';
import styles from './VoteButton.style';

type Props = {
  type: VoteTypes;
  postId: string;
  votes: string[];
};

const VoteButton: React.FC<Props> = ({ postId, type, votes }) => {
  const { oauthState } = useOAuth();
  const { sub } = oauthState?.profile || {};
  const isVoted = sub && votes.includes(sub);
  const { isLogin } = oauthState || {};
  const [{ isStarted }] = useMonetization();
  const { showRegisterModal, showMonetizationModal } = useGlobalModalContext();
  const [animate, setAnimate] = useState<'plus' | 'minus' | ''>('');
  const { toggleVote } = usePostsContext();

  async function handleVote() {
    if (!isLogin) {
      showRegisterModal();
    } else if (!isStarted) {
      // DISCUSS: allow monetization user vote without register?
      showMonetizationModal();
    } else {
      setAnimate(isVoted ? 'minus' : 'plus');
      await toggleVote(type, postId);
      setAnimate('');
    }
  }

  return (
    <button
      className={cx('wrapper', {
        active: isVoted,
        disabled: !isLogin,
        plus_animate: animate === 'plus',
        minus_animate: animate === 'minus',
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

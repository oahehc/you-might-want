import React, { useState, useEffect } from 'react';
import useOAuth from '@hooks/useOAuth';
import { usePostsContext } from '@contexts/Posts';
import { Loading, Avatar, Button } from '@components/index';
import styles from './CreatePost.style';

const MAX_INPUT = 500;

const CreatePost: React.FC = () => {
  const { oauthState } = useOAuth();
  const { picture, name, email } = oauthState?.profile || {};
  const { isLogin } = oauthState || {};
  const [text, setText] = useState('');
  const { state, createPost } = usePostsContext();

  function handleTyping(event: React.ChangeEvent<HTMLTextAreaElement>) {
    // TODO: prevent hyperlink?
    if (event.target.value.length <= MAX_INPUT) {
      setText(event.target.value);
    }
  }
  function handleSubmit() {
    if (text) {
      createPost(text);
    }
  }
  function getCharacterLimitWarning() {
    if (text.length > MAX_INPUT * 0.9) return 'red';
    if (text.length > MAX_INPUT * 0.8) return 'yellow';
    return '';
  }

  useEffect(() => {
    if (state?.isPostCreated) {
      setText('');
    }
  }, [state?.isPostCreated]);

  if (!isLogin) return null;

  return (
    <div className="wrapper">
      <Avatar src={picture} name={name || email} size="l" />
      <textarea placeholder="share useful information and earn money form it..." onChange={handleTyping} value={text} />
      <span className={getCharacterLimitWarning()}>
        {text.length} / {MAX_INPUT}
      </span>
      <div className="button">
        <Button
          onClick={handleSubmit}
          invert={!text}
          disabled={!text || state?.isPostCreating}
          style={{ width: '100px', height: '40px' }}
        >
          {state?.isPostCreating ? <Loading /> : 'Submit'}
        </Button>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

export { CreatePost };

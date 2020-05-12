import React, { useState } from 'react';
import useOAuth from '@hooks/useOAuth';
import { apiUrl, postPostApi } from '@utils/apis';
import { Loading, Avatar, Button } from '@components/index';
import styles from './CreatePost.style';

const MAX_INPUT = 500;

const CreatePost: React.FC = () => {
  const { oauthState, authRequestFactory } = useOAuth();
  const authRequest = authRequestFactory(apiUrl);
  const { sub, picture, name, email } = (oauthState && oauthState.profile) || {};
  const { isLogin } = oauthState || {};
  const [text, setText] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  function handleTyping(event: React.ChangeEvent<HTMLTextAreaElement>) {
    // TODO: prevent hyperlink?
    if (event.target.value.length <= MAX_INPUT) {
      setText(event.target.value);
    }
  }
  async function handleSubmit() {
    if (text) {
      try {
        setSubmitting(true);
        // @ts-ignore
        await postPostApi(sub, text, authRequest);
        setText('');
        setSubmitting(false);
        // TODO: insert the new post to the top of the list
      } catch (error) {
        setSubmitting(false);
        // TODO: error handle
      }
    }
  }
  function getCharacterLimitWarning() {
    if (text.length > MAX_INPUT * 0.9) return 'red';
    if (text.length > MAX_INPUT * 0.8) return 'yellow';
    return '';
  }

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
          disabled={!text || isSubmitting}
          style={{ width: '100px', height: '40px' }}
        >
          {isSubmitting ? <Loading /> : 'Submit'}
        </Button>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

export { CreatePost };
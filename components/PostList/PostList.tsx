import React, { useState, useRef } from 'react';
import { LoadingWrapper, Time, VoteButton } from '@components/index';
import { getPostsApi } from '@utils/apis';
import useIntersectionObserver from '@hooks/useIntersectionObserver';
import styles from './PostList.style';

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastKey, setLastKey] = useState<PostsPaginateKey | null | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);

  async function loadPosts() {
    setLoading(true);
    const res = await getPostsApi(lastKey);
    setPosts(list => [...list, ...res.list]);
    setLastKey(res.lastKey);
    setLoading(false);
  }

  // infinite loading
  const element = useRef(null);
  function onView() {
    if (lastKey !== null) {
      loadPosts();
    } else {
      return true;
    }
  }
  useIntersectionObserver({
    element,
    onView,
    threshold: [0.5],
  });

  return (
    <div className="post__wrapper">
      {posts.map(({ postId, text, created, upVotes, downVotes }) => (
        <div key={postId} className="post__content">
          {text.split('\n').map((s, index) => (
            <p key={index}>{s}</p>
          ))}
          <VoteButton postId={postId} type="up" votes={upVotes} />
          <VoteButton postId={postId} type="down" votes={downVotes} />
          <div className="post__time">
            <Time utcTimeString={created} />
          </div>
        </div>
      ))}
      <LoadingWrapper innerRef={element} isLoading={isLoading} />
      <style jsx>{styles}</style>
    </div>
  );
};

export { PostList };

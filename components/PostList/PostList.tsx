import React, { useRef } from 'react';
import { LoadingWrapper, Time, VoteButton } from '@components/index';
import useIntersectionObserver from '@hooks/useIntersectionObserver';
import { usePostsContext } from '@contexts/Posts';
import { selectPosts, selectFirstKey } from '@contexts/PostsSelector';
import styles from './PostList.style';

const PostList: React.FC = () => {
  const { state, loadPosts, loadNewPosts } = usePostsContext();
  const posts = selectPosts(state.posts, state.postMap);
  const firstKey = selectFirstKey(posts[0] || {});

  // infinite loading
  const loadMoreIndicator = useRef(null);
  function onView() {
    if (state && state.paginateKey !== null) {
      loadPosts();
    } else {
      return true;
    }
  }
  useIntersectionObserver({
    element: loadMoreIndicator,
    onView,
    threshold: [0.5],
  });

  // load newest post
  const loadNewPostIndicator = useRef(null);
  function loadNewPost() {
    if (firstKey !== null) {
      loadNewPosts(firstKey);
    }
  }
  useIntersectionObserver({
    element: loadNewPostIndicator,
    onView: loadNewPost,
  });

  return (
    <div className="post__wrapper">
      <LoadingWrapper innerRef={loadNewPostIndicator} isLoading={state && state.isNewPostLoading} />
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
      <LoadingWrapper innerRef={loadMoreIndicator} isLoading={state && state.isPostLoading} />
      <style jsx>{styles}</style>
    </div>
  );
};

export { PostList };

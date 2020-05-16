export const selectPosts = (posts: string[], postMap: PostMap): Post[] => {
  return posts.map(id => postMap[id] || {}).filter(({ postId }) => !!postId);
};

export const selectFirstKey = ({ isDisplay, created, postId }: Post): PostsPaginateKey | null => {
  if (isDisplay === undefined || created === undefined || postId === undefined) return null;

  return {
    isDisplay,
    created,
    postId,
  };
};

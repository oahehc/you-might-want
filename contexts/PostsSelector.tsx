export const selectPosts = (posts: string[], postMap: PostMap): Post[] => {
  return posts.map(id => postMap[id] || {}).filter(({ postId }) => !!postId);
};

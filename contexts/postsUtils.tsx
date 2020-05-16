export function toggleVote(type: VoteTypes, userId: string, post: Post): Post {
  const votesKey = type === 'up' ? 'upVotes' : 'downVotes';
  const votes = post?.[votesKey];

  if (!votes) return post;

  const idx = votes.indexOf(userId);
  if (idx < 0) {
    votes.push(userId);
  } else {
    votes.splice(idx, 1);
  }

  return {
    ...post,
    [votesKey]: votes,
  };
}

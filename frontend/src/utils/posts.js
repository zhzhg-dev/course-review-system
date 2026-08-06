import { defaultPostReplies } from "../data/mockData";

export function normalizePost(post, index) {
  const replies = post.replies || defaultPostReplies[post.body] || [];
  const sourceCounts = post.counts || [];
  const replyCount = sourceCounts.length >= 3 ? sourceCounts[2] : sourceCounts[1];

  return {
    ...post,
    id: post.id || post._id,
    createdAt: post.createdAt || Date.now() - index * 3600000,
    counts: [sourceCounts[0] || 0, replyCount || replies.length],
    likedBy: post.likedBy || [],
    replies
  };
}

export function getPostMatchesTarget(post, targetPost) {
  const postId = post.id || post._id;
  const targetId = targetPost.id || targetPost._id;

  if (postId && targetId) {
    return postId === targetId;
  }

  return post.createdAt === targetPost.createdAt || post.body === targetPost.body;
}


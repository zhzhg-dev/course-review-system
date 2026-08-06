import { listDemoDiscussions, saveDemoDiscussions } from '../data/demoStore';

export async function getDiscussionPosts({ mine = '', sort = 'recent', tags = [] } = {}) {
  const posts = [...listDemoDiscussions()]
    .filter((post) => !mine || post.name === mine)
    .filter((post) => tags.length === 0 || tags.every((tag) => (post.tags || []).includes(tag)));

  return posts.sort((a, b) => {
    if (sort === 'helpful') return Number(b.counts?.[0] || 0) - Number(a.counts?.[0] || 0);
    return Number(b.createdAt || 0) - Number(a.createdAt || 0);
  });
}

export async function getDiscussionTags() {
  return Array.from(new Set(listDemoDiscussions().flatMap((post) => post.tags || []))).sort();
}

export async function createDiscussionPost(post) {
  const created = { ...post, id: `demo-post-${Date.now()}`, createdAt: Date.now(), likedBy: [] };
  saveDemoDiscussions([created, ...listDemoDiscussions()]);
  return created;
}

export async function updateDiscussionMetric(postId, index, userKey = '') {
  let updated = null;
  const posts = listDemoDiscussions().map((post) => {
    if (post.id !== postId) return post;
    const likedBy = post.likedBy || [];
    if (index === 0 && likedBy.includes(userKey)) {
      updated = post;
      return post;
    }
    const counts = [...(post.counts || [0, 0])];
    counts[index] = Number(counts[index] || 0) + 1;
    updated = { ...post, counts, likedBy: index === 0 ? [...likedBy, userKey] : likedBy };
    return updated;
  });

  if (!updated) throw new Error('Post not found');
  saveDemoDiscussions(posts);
  return updated;
}

export async function createDiscussionReply(postId, reply) {
  let updated = null;
  const posts = listDemoDiscussions().map((post) => {
    if (post.id !== postId) return post;
    const replies = [...(post.replies || []), { ...reply, id: `demo-reply-${Date.now()}` }];
    const counts = [...(post.counts || [0, 0])];
    counts[1] = replies.length;
    updated = { ...post, replies, counts };
    return updated;
  });

  if (!updated) throw new Error('Post not found');
  saveDemoDiscussions(posts);
  return updated;
}


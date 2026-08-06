const express = require('express');
const DiscussionPost = require('../../schema/discussionSchema');

const router = express.Router();

// EN: Convert a MongoDB document into the shape already used by the frontend Discussion page.
function formatPost(post) {
  const item = post.toObject ? post.toObject() : post;

  return {
    id: String(item._id),
    initials: item.initials,
    name: item.name,
    time: item.time,
    body: item.body,
    tags: item.tags || [],
    counts: normalizeCounts(item.counts, (item.replies || []).length),
    likedBy: item.likedBy || [],
    replies: (item.replies || []).map((reply) => ({
      replierId: reply.replierId,
      id: String(reply._id),
      initials: reply.initials,
      name: reply.name,
      time: reply.time,
      body: reply.body,
      createdAt: new Date(reply.createdAt).getTime()
    })),
    createdAt: new Date(item.createdAt).getTime()
  };
}

// EN: Normalize tag input so the database always receives clean tag strings.
function normalizeTags(tags) {
  if (!Array.isArray(tags)) {
    return ['general'];
  }

  const normalized = tags
    .map((tag) => String(tag).trim().replace(/^#/, ''))
    .filter(Boolean);

  return normalized.length ? normalized : ['general'];
}

function parseTagFilters(tags) {
  const tagValues = Array.isArray(tags) ? tags : [tags];

  return [...new Set(
    tagValues
      .filter(Boolean)
      .flatMap((value) => String(value).split(','))
      .map((tag) => tag.trim().replace(/^#/, ''))
      .filter(Boolean)
  )];
}

// EN: Convert old three-item counts into new [Helpful, Reply] counts.
function normalizeCounts(counts = [], replyCount = 0) {
  if (counts.length >= 3) {
    return [counts[0] || 0, counts[2] || replyCount];
  }

  return [counts[0] || 0, counts[1] || replyCount];
}

// GET /discussion
// EN: List discussion posts. Supports filtering by author and sorting by helpful count.
router.get('/', async (req, res) => {
  try {
    const { mine, sort = 'recent', tag, tags } = req.query;
    const filter = {};

    if (mine) {
      filter.name = mine;
    }

    const tagFilters = parseTagFilters(tags || tag);

    if (tagFilters.length === 1) {
      filter.tags = tagFilters[0];
    } else if (tagFilters.length > 1) {
      filter.tags = { $all: tagFilters };
    }

    const mongoSort = sort === 'helpful'
      ? { 'counts.0': -1, createdAt: -1 }
      : { createdAt: -1 };

    const posts = await DiscussionPost.find(filter)
    .populate({
      path: 'replies.replierId',
      select: 'fullName avatar'
    }).sort(mongoSort);
    res.json(posts.map(formatPost));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /discussion/tags
// EN: Return tags ordered by how often they appear in discussion posts.
router.get('/tags', async (_req, res) => {
  try {
    const tags = await DiscussionPost.aggregate([
      { $unwind: '$tags' },
      { $match: { tags: { $type: 'string', $ne: '' } } },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      { $project: { _id: 0, tag: '$_id' } }
    ]);

    res.json(tags.map((item) => item.tag));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /discussion/:id
// EN: Get one discussion post by MongoDB _id.
router.get('/:id', async (req, res) => {
  try {
    const post = await DiscussionPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Discussion post not found' });
    }

    res.json(formatPost(post));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /discussion
// EN: Create a new discussion post from the frontend compose form.
router.post('/', async (req, res) => {
  try {
    const { initials = '', name, body, tags = [] } = req.body;
    const trimmedBody = body ? String(body).trim() : '';

    if (!name || !trimmedBody) {
      return res.status(400).json({ message: 'name and body are required' });
    }

    const post = await DiscussionPost.create({
      initials,
      name,
      time: 'Just now',
      body: trimmedBody,
      tags: normalizeTags(tags),
      counts: [0, 0],
      likedBy: [],
      replies: []
    });

    res.status(201).json({
      message: 'Discussion post created successfully',
      post: formatPost(post)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /discussion/:id
// EN: Update post text or tags by MongoDB _id.
router.put('/:id', async (req, res) => {
  try {
    const { body, tags } = req.body;
    const update = {};

    if (body !== undefined) {
      const trimmedBody = String(body).trim();
      if (!trimmedBody) {
        return res.status(400).json({ message: 'body cannot be empty' });
      }
      update.body = trimmedBody;
    }

    if (tags !== undefined) {
      update.tags = normalizeTags(tags);
    }

    const post = await DiscussionPost.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Discussion post not found' });
    }

    res.json({
      message: 'Discussion post updated successfully',
      post: formatPost(post)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /discussion/:id/metrics
// EN: Increment Helpful only.
router.patch('/:id/metrics', async (req, res) => {
  try {
    const { userKey = '' } = req.body;
    const index = Number(req.body.index);

    if (index !== 0) {
      return res.status(400).json({ message: 'Only helpful likes can be updated' });
    }

    const post = await DiscussionPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Discussion post not found' });
    }

    const normalizedUserKey = String(userKey).trim().toLowerCase();

    if (!normalizedUserKey) {
      return res.status(400).json({ message: 'userKey is required for helpful likes' });
    }

    post.likedBy = post.likedBy || [];

    if (post.likedBy.includes(normalizedUserKey)) {
      return res.status(400).json({ message: 'You have already marked this post as helpful' });
    }

    post.likedBy.push(normalizedUserKey);

    post.counts = normalizeCounts(post.counts, post.replies.length);
    post.counts.set(index, (post.counts[index] || 0) + 1);
    await post.save();

    res.json({
      message: 'Discussion metric updated successfully',
      post: formatPost(post)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /discussion/:id
// EN: Delete one discussion post by MongoDB _id.
router.delete('/:id', async (req, res) => {
  try {
    const post = await DiscussionPost.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Discussion post not found' });
    }

    res.json({ message: 'Discussion post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /discussion/:id/replies
// EN: Add one reply and keep the reply count synchronized.
router.post('/:id/replies', async (req, res) => {
  try {
    const { initials = '', name, body, replierId } = req.body;
    const trimmedBody = body ? String(body).trim() : '';

    if (!name || !trimmedBody) {
      return res.status(400).json({ message: 'name and body are required' });
    }

    const post = await DiscussionPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Discussion post not found' });
    }

    post.replies.push({
      initials,
      name,
      time: 'Just now',
      body: trimmedBody,
      replierId: replierId
    });
    post.counts = normalizeCounts(post.counts, post.replies.length);
    post.counts.set(1, post.replies.length);
    await post.save();
    const populatedPost = await DiscussionPost
      .findById(post._id)
      .populate({
        path: 'replies.replierId',
        select: 'fullName avatar'
      })
    res.status(201).json({
      message: 'Discussion reply created successfully',
      post: formatPost(populatedPost)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /discussion/:id/replies/:replyId
// EN: Delete one reply and keep the reply count synchronized.
router.delete('/:id/replies/:replyId', async (req, res) => {
  try {
    const post = await DiscussionPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Discussion post not found' });
    }

    const reply = post.replies.id(req.params.replyId);

    if (!reply) {
      return res.status(404).json({ message: 'Discussion reply not found' });
    }

    reply.deleteOne();
    post.counts = normalizeCounts(post.counts, post.replies.length);
    post.counts.set(1, post.replies.length);
    await post.save();

    res.json({
      message: 'Discussion reply deleted successfully',
      post: formatPost(post)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


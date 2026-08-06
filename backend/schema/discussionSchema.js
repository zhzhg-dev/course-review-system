const mongoose = require('mongoose');

// EN: Replies are stored inside their parent discussion post because the frontend displays them together.
const replySchema = new mongoose.Schema({
  // EN: Short initials used by the current avatar UI.
  initials: {
    type: String,
    default: '',
    trim: true
  },

  // EN: Reply author display name.
  name: {
    type: String,
    required: true,
    trim: true
  },

  // EN: Human readable label used by the current frontend.
  time: {
    type: String,
    default: 'Just now'
  },

  // EN: Main reply content.
  body: {
    type: String,
    required: true,
    trim: true
  },
  replierId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// EN: DiscussionPost stores forum posts for the Discussion page.
const discussionSchema = new mongoose.Schema({
  // EN: Short initials used by the current avatar UI.
  initials: {
    type: String,
    default: '',
    trim: true
  },

  // EN: Post author display name.
  name: {
    type: String,
    required: true,
    trim: true
  },

  // EN: Human readable label used by the current frontend.
  time: {
    type: String,
    default: 'Just now'
  },

  // EN: Main post content.
  body: {
    type: String,
    required: true,
    trim: true
  },

  // EN: Tags are displayed as chips on each discussion card.
  tags: {
    type: [String],
    default: ['general']
  },

  // EN: counts[0] = helpful likes, counts[1] = replies.
  counts: {
    type: [Number],
    default: [0, 0],
    validate: {
      validator: (value) => value.length === 2,
      message: 'counts must contain exactly helpful and reply totals'
    }
  },

  // EN: User keys that already clicked Helpful, used to prevent duplicate likes.
  likedBy: {
    type: [String],
    default: []
  },

  // EN: Embedded replies belonging to this post.
  replies: {
    type: [replySchema],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DiscussionPost', discussionSchema);


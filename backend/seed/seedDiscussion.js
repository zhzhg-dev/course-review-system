const mongoose = require('mongoose');
const DiscussionPost = require('../schema/discussionSchema');
const discussionSeed = require('../data/discussionSeed');

// EN: Keep this aligned with the current backend app.js MongoDB connection.
const MONGODB_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/27017';

async function seedDiscussion() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for discussion seed');

    // EN: Use body as a simple stable key so running the seed twice will not duplicate default posts.
    const operations = discussionSeed.map((post) => ({
      updateOne: {
        filter: { body: post.body },
        update: { $set: post },
        upsert: true
      }
    }));

    const result = await DiscussionPost.bulkWrite(operations);

    console.log('Discussion seed completed');
    console.log(`Inserted: ${result.upsertedCount}`);
    console.log(`Updated: ${result.modifiedCount}`);

    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (err) {
    console.error('Discussion seed failed:', err.message);
    process.exit(1);
  }
}

seedDiscussion();


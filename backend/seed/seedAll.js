const mongoose = require('mongoose');
const Course = require('../schema/courseSchema');
const CourseReview = require('../schema/courseReviewSchema');
const DiscussionPost = require('../schema/discussionSchema');
const courseSeed = require('../data/courseSeed');
const courseReviewSeed = require('../data/courseReviewSeed');
const discussionSeed = require('../data/discussionSeed');

const DEFAULT_LOCAL_MONGO_URI = 'mongodb://127.0.0.1:27017/27017';
const MONGODB_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  DEFAULT_LOCAL_MONGO_URI;

const requireCloudTarget = process.argv.includes('--cloud');

function assertCloudTarget() {
  if (!requireCloudTarget) {
    return;
  }

  if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
    throw new Error('seed:cloud requires MONGO_URI or MONGODB_URI to be set.');
  }

  if (MONGODB_URI.includes('127.0.0.1') || MONGODB_URI.includes('localhost')) {
    throw new Error('seed:cloud cannot run against localhost. Use an Atlas connection string.');
  }
}

async function seedCourses() {
  const courseOperations = courseSeed.map((course) => ({
    updateOne: {
      filter: { code: course.code },
      update: { $set: course },
      upsert: true
    }
  }));

  const courseResult = await Course.bulkWrite(courseOperations);
  console.log(`Courses inserted: ${courseResult.upsertedCount}`);
  console.log(`Courses updated: ${courseResult.modifiedCount}`);

  const courses = await Course.find({});
  const courseMap = new Map(courses.map((course) => [course.code, course]));

  const reviewOperations = courseReviewSeed
    .map((review) => {
      const course = courseMap.get(review.courseCode);

      if (!course) {
        console.warn(`Course not found for review seed: ${review.courseCode}`);
        return null;
      }

      const { courseCode, ...reviewData } = review;

      return {
        updateOne: {
          filter: { seedKey: review.seedKey },
          update: {
            $set: {
              ...reviewData,
              courseId: course._id
            }
          },
          upsert: true
        }
      };
    })
    .filter(Boolean);

  if (!reviewOperations.length) {
    console.log('Course reviews skipped: no valid review seed data');
    return;
  }

  const reviewResult = await CourseReview.bulkWrite(reviewOperations);
  console.log(`Course reviews inserted: ${reviewResult.upsertedCount}`);
  console.log(`Course reviews updated: ${reviewResult.modifiedCount}`);
}

async function seedDiscussion() {
  const operations = discussionSeed.map((post) => ({
    updateOne: {
      filter: { body: post.body },
      update: { $set: post },
      upsert: true
    }
  }));

  const result = await DiscussionPost.bulkWrite(operations);
  console.log(`Discussion posts inserted: ${result.upsertedCount}`);
  console.log(`Discussion posts updated: ${result.modifiedCount}`);
}

async function seedAll() {
  try {
    assertCloudTarget();

    await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB connected: ${mongoose.connection.name}`);

    await seedCourses();
    await seedDiscussion();

    console.log('Seed data upload completed');
  } catch (err) {
    console.error('Seed data upload failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

seedAll();


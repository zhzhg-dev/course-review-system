const mongoose = require('mongoose');
const Course = require('../schema/courseSchema');
const CourseReview = require('../schema/courseReviewSchema');
const courseSeed = require('../data/courseSeed');
const courseReviewSeed = require('../data/courseReviewSeed');

// Use the same MongoDB URI style as the backend app.
// MONGO_URI is used by the current .env file.
// MONGODB_URI is kept as a backup name.
const MONGODB_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/27017';

async function seedCourses() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for course seed');

    // 1. Seed course base information.
    // upsert means:
    // - if the course code already exists, update it
    // - if it does not exist, insert it
    const courseOperations = courseSeed.map((course) => ({
      updateOne: {
        filter: { code: course.code },
        update: { $set: course },
        upsert: true
      }
    }));

    const courseResult = await Course.bulkWrite(courseOperations);

    console.log('Course seed completed');
    console.log(`Courses inserted: ${courseResult.upsertedCount}`);
    console.log(`Courses updated: ${courseResult.modifiedCount}`);

    // 2. Read all courses again, so we can use real MongoDB _id values.
    const courses = await Course.find({});
    const courseMap = new Map(
      courses.map((course) => [course.code, course])
    );

    // 3. Seed course reviews.
    // The seed review file uses courseCode, but the real review document needs courseId.
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
                courseId: course._id.toString()
              }
            },
            upsert: true
          }
        };
      })
      .filter(Boolean);

    if (reviewOperations.length > 0) {
      const reviewResult = await CourseReview.bulkWrite(reviewOperations);

      console.log('Course review seed completed');
      console.log(`Reviews inserted: ${reviewResult.upsertedCount}`);
      console.log(`Reviews updated: ${reviewResult.modifiedCount}`);
    }

    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (err) {
    console.error('Course seed failed:', err.message);
    process.exit(1);
  }
}

seedCourses();


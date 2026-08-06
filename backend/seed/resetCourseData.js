const mongoose = require('mongoose');
const Course = require('../schema/courseSchema');
const CourseReview = require('../schema/courseReviewSchema');
const Enrollment = require('../schema/enrollmentSchema');

const MONGODB_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1/27017';

async function resetCourseData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for course data reset');

    const reviewResult = await CourseReview.deleteMany({});
    const enrollmentResult = await Enrollment.deleteMany({});
    const courseResult = await Course.deleteMany({});

    console.log(`Deleted reviews: ${reviewResult.deletedCount}`);
    console.log(`Deleted enrollments: ${enrollmentResult.deletedCount}`);
    console.log(`Deleted courses: ${courseResult.deletedCount}`);

    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (err) {
    console.error('Course data reset failed:', err.message);
    process.exit(1);
  }
}

resetCourseData();

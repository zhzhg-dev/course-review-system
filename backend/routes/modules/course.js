const express = require('express');
const Course = require('../../schema/courseSchema');
const CourseReview = require('../../schema/courseReviewSchema');

const router = express.Router();

// Attach dynamic review summary to course data.
// rating and reviews are not fixed seed values anymore.
// They are calculated from CourseReview documents.
async function attachReviewSummary(courses) {
  const courseArray = Array.isArray(courses) ? courses : [courses];

  // Use real ObjectId values for aggregate matching.
  // Some schemas store courseId as ObjectId, so string matching may fail.
  const courseIds = courseArray.map((course) => course._id);

  const reviewStats = await CourseReview.aggregate([
    {
      $match: {
        courseId: { $in: courseIds }
      }
    },
    {
      $group: {
        _id: '$courseId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  const statsMap = new Map(
    reviewStats.map((item) => [
      item._id.toString(),
      {
        rating: item.averageRating.toFixed(1),
        reviews: String(item.reviewCount)
      }
    ])
  );

  const result = courseArray.map((course) => {
    const courseObject = course.toObject();
    const summary = statsMap.get(courseObject._id.toString());

    return {
      ...courseObject,
      rating: summary ? summary.rating : '0.0',
      reviews: summary ? summary.reviews : '0'
    };
  });

  return Array.isArray(courses) ? result : result[0];
}

// GET /course
// Get all courses. Supports simple search and difficulty filter.
router.get('/', async (req, res) => {
  try {
    const { search, difficulty } = req.query;

    const filter = {};

    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }

    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { professor: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { semester: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(filter).sort({ code: 1 });
    const coursesWithSummary = await attachReviewSummary(courses);

    res.json(coursesWithSummary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /course/:id
// Get one course by MongoDB _id.
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const courseWithSummary = await attachReviewSummary(course);

    res.json(courseWithSummary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /course
// Create a new course for testing or initial seed data.
router.post('/', async (req, res) => {
  try {
    const {
      code,
      title,
      professor,
      difficulty,
      credits,
      semester,
      description,
      location,
      passRates,
      assignments
    } = req.body;

    if (!code || !title || !professor) {
      return res.status(400).json({
        error: 'code, title, and professor are required'
      });
    }

    const existingCourse = await Course.findOne({ code });

    if (existingCourse) {
      return res.status(400).json({
        error: 'Course code already exists'
      });
    }

    const course = await Course.create({
      code,
      title,
      professor,
      difficulty,
      credits,
      semester,
      description,
      location,
      passRates,
      assignments
    });

    const courseWithSummary = await attachReviewSummary(course);

    res.status(201).json({
      message: 'Course created successfully',
      course: courseWithSummary
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /course/:id
// Update a course by MongoDB _id.
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const courseWithSummary = await attachReviewSummary(course);

    res.json({
      message: 'Course updated successfully',
      course: courseWithSummary
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /course/:id
// Delete a course by MongoDB _id.
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({
      message: 'Course deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


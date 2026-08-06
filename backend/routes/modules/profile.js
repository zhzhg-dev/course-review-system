const express = require('express');
const mongoose = require('mongoose');
const Course = require('../../schema/courseSchema');
const Enrollment = require('../../schema/enrollmentSchema');
const { authenticate } = require('../../middleware/auth');

const router = express.Router();
router.use(authenticate);

router.use('/:userId', (req, res, next) => {
  if (req.userId !== req.params.userId) {
    return res.status(403).json({ message: 'You can only access your own profile' });
  }
  next();
});

function formatEnrollment(enrollment) {
  const course = enrollment.courseId;

  return {
    enrollmentId: enrollment._id,
    id: course._id,
    _id: course._id,
    code: course.code,
    title: course.title,
    professor: course.professor,
    semester: course.semester,
    credits: course.credits,
    difficulty: course.difficulty,
    status: enrollment.status,
    source: enrollment.source,
    addedAt: enrollment.addedAt
  };
}

// GET /profile/:userId/enrollments
// Get current courses added by one user.
router.get('/:userId/enrollments', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const enrollments = await Enrollment.find({ userId })
      .populate('courseId')
      .sort({ addedAt: -1 });

    res.json(enrollments.filter((item) => item.courseId).map(formatEnrollment));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /profile/:userId/enrollments
// Add one course to the user's current courses.
router.post('/:userId/enrollments', async (req, res) => {
  try {
    const { userId } = req.params;
    const { courseId } = req.body || {};

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course id' });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const existingEnrollment = await Enrollment.findOne({ userId, courseId });

    if (existingEnrollment) {
      const populatedEnrollment = await existingEnrollment.populate('courseId');

      return res.status(200).json({
        message: 'Course already added',
        enrollment: formatEnrollment(populatedEnrollment)
      });
    }

    const enrollment = await Enrollment.create({
      userId,
      courseId
    });

    const populatedEnrollment = await enrollment.populate('courseId');

    res.status(201).json({
      message: 'Course added to profile successfully',
      enrollment: formatEnrollment(populatedEnrollment)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /profile/:userId/enrollments/:courseId
// Remove one course from the user's current courses.
router.delete('/:userId/enrollments/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course id' });
    }

    const deletedEnrollment = await Enrollment.findOneAndDelete({
      userId,
      courseId
    });

    if (!deletedEnrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json({
      message: 'Course removed from profile successfully'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


const express = require('express');
const mongoose = require('mongoose');
const Course = require('../../schema/courseSchema');
const CourseReview = require('../../schema/courseReviewSchema');

const router = express.Router();

function getInitials(name) {
  if (!name || typeof name !== 'string') {
    return 'U';
  }

  return name
    .trim()
    .split(/\s+/)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

// GET /course/:courseId/reviews
// Get all reviews for one course.
router.get('/course/:courseId/reviews', async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const reviews = await CourseReview.find({ courseId })
      .populate('replierId', 'fullName avatar')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /course/:courseId/reviews
// Create a review for one course.
router.post('/course/:courseId/reviews', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { name, rating, term, text, replierId} = req.body || {};

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!name || !rating || !term || !text) {
      return res.status(400).json({
        message: 'name, rating, term, and text are required'
      });
    }

    const review = await CourseReview.create({
      replierId,
      courseId,
      name,
      initials: getInitials(name),
      rating: Number(rating),
      term,
      text,
    });

    const populatedReview = await CourseReview
    .findById(review._id)
    .populate('replierId', 'fullName avatar')

    res.status(201).json({
      message: 'Review created successfully',
      review: populatedReview
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /course-reviews/:reviewId/helpful
// Increase helpful count by 1.

router.post('/course-reviews/:reviewId/helpful', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const review = await CourseReview.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (!Array.isArray(review.helpfulBy)) {
      review.helpfulBy = [];
    }

    const alreadyMarked = review.helpfulBy.includes(userId);

    if (alreadyMarked) {
      review.helpfulBy = review.helpfulBy.filter((id) => id !== userId);
      review.helpful = Math.max((review.helpful || 0) - 1, 0);
    } else {
      review.helpful = (review.helpful || 0) + 1;
      review.helpfulBy.push(userId);
    }

    await review.save();

    res.json({
      message: alreadyMarked
        ? 'Helpful removed successfully'
        : 'Helpful count updated successfully',
      review
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

import { addDemoReview, listDemoReviews, markDemoReviewHelpful } from '../data/demoStore';

export async function getCourseReviews(courseId) {
  return listDemoReviews(courseId);
}

export async function createCourseReview(courseId, reviewData) {
  return addDemoReview(courseId, reviewData);
}

export async function markCourseReviewHelpful(reviewId, userId) {
  const review = markDemoReviewHelpful(reviewId, userId);
  if (!review) throw new Error('Review not found');
  return review;
}


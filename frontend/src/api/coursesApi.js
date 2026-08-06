import { getDemoCourse, listDemoCourses } from '../data/demoStore';

export async function getCourses({ search = '', difficulty = 'All' } = {}) {
  return listDemoCourses({ search, difficulty });
}

export async function getCourseById(courseId) {
  const course = getDemoCourse(courseId);
  if (!course) throw new Error('Course not found');
  return course;
}


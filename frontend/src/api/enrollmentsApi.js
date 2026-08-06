import { addDemoEnrollment, listDemoEnrollments, removeDemoEnrollment } from '../data/demoStore';

export async function getUserEnrollments(userId) {
  return listDemoEnrollments(userId);
}

export async function addUserEnrollment(userId, courseId) {
  return addDemoEnrollment(userId, courseId);
}

export async function removeUserEnrollment(userId, courseId) {
  removeDemoEnrollment(userId, courseId);
  return { success: true };
}


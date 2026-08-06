export function getCourseId(course) {
  return course.id || course.code || course.title;
}

export function normalizeEnrollment(course) {
  return {
    id: getCourseId(course),
    code: course.code || "COURSE",
    title: course.title,
    professor: course.professor,
    semester: course.semester,
    credits: course.credits,
    difficulty: course.difficulty,
    source: course.source || "Student added",
    status: course.status || "In Progress",
    grade: course.grade || "In Progress",
    addedAt: course.addedAt || Date.now()
  };
}

export function isCourseEnrolled(enrolledCourses, course) {
  const id = getCourseId(course);
  return enrolledCourses.some((enrolledCourse) => getCourseId(enrolledCourse) === id);
}


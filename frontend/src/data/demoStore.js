import { defaultCourseReviews, posts as seedPosts } from "./mockData";

const STORAGE_KEYS = {
  discussions: "crs_demo_discussions",
  enrollments: "crs_demo_enrollments",
  reviews: "crs_demo_reviews"
};

function readStore(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
  return value;
}

function makeCourse({ code, title, difficulty, description, professor = "Teaching team", semester = "2026" }) {
  const id = `demo-course-${code.toLowerCase().replace(/\s+/g, "-")}`;

  return {
    _id: id,
    id,
    code,
    title,
    professor,
    difficulty,
    credits: "15 Points",
    semester,
    description,
    rating: code === "COMPSCI 732" ? "4.8" : "4.5",
    reviews: code === "COMPSCI 732" ? "4" : "Sample data",
    location: {
      building: "University of Auckland City Campus",
      room: "Demo location",
      description: "Sample location data for this portfolio demonstration."
    },
    passRates: [
      { year: 2022, rate: 86 },
      { year: 2023, rate: 89 },
      { year: 2024, rate: 91 },
      { year: 2025, rate: 93 }
    ],
    assignments: [
      { title: "Applied coursework", due: "Sample schedule", state: "Completed" },
      { title: "Team project", due: "Sample schedule", state: "In Progress" },
      { title: "Final assessment", due: "Sample schedule", state: "Upcoming" }
    ]
  };
}

export const demoCourses = [
  makeCourse({
    code: "COMPSCI 732",
    title: "Software Tools and Techniques",
    professor: "Andrew Meads",
    difficulty: "Medium",
    semester: "Semester One 2026",
    description: "A practical software-development course covering modern full-stack tools, team delivery, testing, containers, and deployment workflows."
  }),
  makeCourse({
    code: "COMPSCI 701",
    title: "Creating Maintainable Software",
    difficulty: "Medium",
    semester: "Semester Two 2026",
    description: "Software quality, maintainability, design decisions, technical debt, and the long-term evolution of software systems."
  }),
  makeCourse({
    code: "COMPSCI 751",
    title: "Advanced Topics in Database Systems",
    difficulty: "Medium",
    semester: "Semester One 2026",
    description: "Advanced data modelling, relational systems, transactions, storage, retrieval, and distributed database concepts."
  }),
  makeCourse({
    code: "COMPSCI 760",
    title: "Advanced Topics in Machine Learning",
    difficulty: "Hard",
    semester: "Semester One and Two 2026",
    description: "Modern machine-learning algorithms, model design, evaluation, and applied work in data-rich environments."
  }),
  makeCourse({
    code: "COMPSCI 762",
    title: "Foundations of Machine Learning",
    difficulty: "Hard",
    semester: "Semester One 2026",
    description: "Foundational supervised and unsupervised learning methods, model evaluation, and practical challenges when learning from data."
  }),
  makeCourse({
    code: "INFOSYS 704",
    title: "IT Consultancy",
    difficulty: "Easy",
    semester: "Semester Two 2026",
    description: "Client engagement, problem definition, analysis, recommendations, and professional communication in technology consulting."
  }),
  makeCourse({
    code: "DIGIHLTH 706",
    title: "Health Data Analytics",
    difficulty: "Medium",
    semester: "Semester Two 2026",
    description: "Quantitative summaries, visualisation, evidence interpretation, and analytical models for healthcare data."
  }),
  makeCourse({
    code: "OPSMGT 741",
    title: "System Dynamics and Complex Modelling",
    difficulty: "Medium",
    semester: "Semester One 2026",
    description: "Feedback structures, causal-loop thinking, behaviour over time, and the modelling of complex systems."
  })
];

const seededReviews = {
  "demo-course-compsci-732": defaultCourseReviews.map((review, index) => ({
    ...review,
    id: `demo-review-${index + 1}`,
    helpfulBy: []
  }))
};

const seededDiscussions = seedPosts.map((post, index) => ({
  ...post,
  id: `demo-post-${index + 1}`,
  createdAt: Date.now() - index * 3_600_000,
  likedBy: [],
  replies: (post.replies || []).map((reply, replyIndex) => ({
    ...reply,
    id: `demo-reply-${index + 1}-${replyIndex + 1}`
  }))
}));

export function listDemoCourses({ search = "", difficulty = "All" } = {}) {
  const needle = search.trim().toLowerCase();

  return demoCourses.filter((course) => {
    const matchesDifficulty = difficulty === "All" || course.difficulty === difficulty;
    const haystack = `${course.code} ${course.title} ${course.professor} ${course.description}`.toLowerCase();
    return matchesDifficulty && (!needle || haystack.includes(needle));
  });
}

export function getDemoCourse(courseId) {
  return demoCourses.find((course) => course.id === courseId || course._id === courseId || course.code === courseId) || null;
}

export function listDemoReviews(courseId) {
  const reviews = readStore(STORAGE_KEYS.reviews, seededReviews);
  return reviews[courseId] || [];
}

export function addDemoReview(courseId, review) {
  const reviews = readStore(STORAGE_KEYS.reviews, seededReviews);
  const created = {
    ...review,
    id: `demo-review-${Date.now()}`,
    initials: review.name?.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "S",
    helpful: 0,
    helpfulBy: [],
    createdAt: Date.now()
  };

  reviews[courseId] = [created, ...(reviews[courseId] || [])];
  writeStore(STORAGE_KEYS.reviews, reviews);
  return created;
}

export function markDemoReviewHelpful(reviewId, userId) {
  const reviews = readStore(STORAGE_KEYS.reviews, seededReviews);
  let updated = null;

  Object.keys(reviews).forEach((courseId) => {
    reviews[courseId] = reviews[courseId].map((review) => {
      if ((review.id || review._id) !== reviewId) return review;
      const helpfulBy = review.helpfulBy || [];
      if (helpfulBy.includes(userId)) {
        updated = review;
        return review;
      }
      updated = { ...review, helpful: Number(review.helpful || 0) + 1, helpfulBy: [...helpfulBy, userId] };
      return updated;
    });
  });

  writeStore(STORAGE_KEYS.reviews, reviews);
  return updated;
}

export function listDemoDiscussions() {
  return readStore(STORAGE_KEYS.discussions, seededDiscussions);
}

export function saveDemoDiscussions(posts) {
  return writeStore(STORAGE_KEYS.discussions, posts);
}

export function listDemoEnrollments(userId) {
  const enrollments = readStore(STORAGE_KEYS.enrollments, {});
  return enrollments[userId] || [];
}

export function addDemoEnrollment(userId, courseId) {
  const enrollments = readStore(STORAGE_KEYS.enrollments, {});
  const course = getDemoCourse(courseId);
  if (!course) throw new Error("Course not found");

  const current = enrollments[userId] || [];
  if (!current.some((item) => (item.id || item._id) === courseId)) {
    enrollments[userId] = [course, ...current];
    writeStore(STORAGE_KEYS.enrollments, enrollments);
  }

  return course;
}

export function removeDemoEnrollment(userId, courseId) {
  const enrollments = readStore(STORAGE_KEYS.enrollments, {});
  enrollments[userId] = (enrollments[userId] || []).filter((course) => (course.id || course._id) !== courseId);
  writeStore(STORAGE_KEYS.enrollments, enrollments);
}


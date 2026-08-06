# Backend handoff

This frontend is a React/Vite prototype for a course review and forum system.
It currently uses `localStorage` and mock data so the UI can work without a backend.

## Where to look

- `src/App.jsx`
  - Main app composition, route switch, and page-level state handlers.
- `src/data/mockData.js`
  - Mock courses, posts, course reviews, demo accounts, and default profile.
- `src/hooks/useLocalStorageState.js`
  - Temporary persistence layer. Replace this with API calls when the backend is ready.
- `src/hooks/useHashRoute.js`
  - Simple hash router used by this prototype. The default route is `home`.
- `src/utils/courses.js`
  - Course enrollment helpers.
- `src/utils/posts.js`
  - Forum post normalization helpers.
- `src/utils/profile.js`
  - Display helpers such as user initials.

## Current localStorage keys

These keys are the temporary frontend data stores:

- `crs_profile`
  - User profile shown in Profile and Settings.
- `crs_posts`
  - Forum posts and replies.
- `crs_course_reviews`
  - Student reviews on the course detail page.
- `crs_enrolled_courses`
  - Courses the student manually added to Profile.
- `crs_recovery_email`
  - Temporary password recovery flow state.
- `crs_login_notice`
  - One-time login page success message after password reset.
- `crs_is_authenticated`
  - Temporary frontend-only auth flag used to allow guests to browse and require login for forum interactions.
- `crs_remember_me`
  - Login checkbox preference.

## Suggested backend resources

The frontend is easiest to connect if the backend exposes these resources:

## Current routes

- `#/home`
  - Public landing page for the University of Auckland student forum.
- `#/discussion`
  - Public forum feed. Guests can browse, while posting, liking, bookmarking, and replying require login.
- `#/courses`
  - Public course list. Guests can browse; adding courses to Profile requires login.
- `#/course-overview`, `#/course-pass-rate`, `#/course-assignments`
  - Course detail views. Guests only see Overview.
- `#/map`
  - Campus map view.
- `#/profile`, `#/settings`
  - Authenticated user areas hidden from the sidebar while logged out.
- `#/login`, `#/forgot`, `#/verify`, `#/reset`
  - Local demo auth and password recovery screens.

### Auth

- `POST /api/auth/login`
- `POST /api/auth/password/forgot`
- `POST /api/auth/password/verify-answer`
- `POST /api/auth/password/reset`

### Profile

- `GET /api/me`
- `PATCH /api/me`
- `PATCH /api/me/password`

### Courses

- `GET /api/courses`
- `GET /api/courses/:courseId`
- `GET /api/me/enrollments`
- `POST /api/me/enrollments`
- `DELETE /api/me/enrollments/:courseId`

### Course reviews

- `GET /api/courses/:courseId/reviews`
- `POST /api/courses/:courseId/reviews`
- `POST /api/course-reviews/:reviewId/helpful`

### Forum

- `GET /api/posts`
- `POST /api/posts`
- `POST /api/posts/:postId/helpful`
- `POST /api/posts/:postId/bookmark`
- `GET /api/posts/:postId/replies`
- `POST /api/posts/:postId/replies`

## Frontend integration plan

1. Keep the page components mostly as they are.
2. Replace `useLocalStorageState` usage in `src/App.jsx` with async API loading.
3. Move page actions such as `addPostReply`, `addCourseToProfile`, and `markHelpful` to API calls.
4. Keep the same normalized frontend shapes while mapping backend DTOs at the API boundary.
5. Once real auth exists, remove `demoAccounts` and the local password recovery state.

## Data shape notes

Course:

```js
{
  id: "CS 202",
  code: "CS 202",
  title: "Data Structures and Algorithms",
  professor: "Professor Zhang",
  difficulty: "Hard",
  credits: "4 Credits",
  rating: "4.8",
  reviews: "124",
  semester: "Fall 2025",
  description: "..."
}
```

Enrollment:

```js
{
  id: "CS 202",
  code: "CS 202",
  title: "Data Structures and Algorithms",
  professor: "Professor Zhang",
  semester: "Fall 2025",
  credits: "4 Credits",
  difficulty: "Hard",
  status: "In Progress",
  source: "Student added",
  addedAt: 1710000000000
}
```

Forum post:

```js
{
  id: "post-1",
  initials: "SJ",
  name: "Sarah Johnson",
  time: "2 hours ago",
  body: "...",
  tags: ["study"],
  counts: [45, 12, 2],
  replies: [],
  createdAt: 1710000000000
}
```

Course review:

```js
{
  id: "review-1",
  initials: "J",
  name: "John Smith",
  term: "Fall 2024",
  rating: 5,
  text: "...",
  helpful: 12,
  createdAt: 1710000000000
}
```


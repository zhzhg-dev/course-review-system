// Authentication and account-related routes
// Includes login, sign up, password recovery notice, and policy pages
export const authRoutes = ["login", "signup", "terms", "privacy", "forgot"];

// Main application pages available inside the platform
// Includes discussion, courses, map, profile, and settings pages
export const mainRoutes = [
  "home",
  "discussion",
  "discussion-filter",
  "courses",
  "course-filter",
  "course-overview",
  "course-pass-rate",
  "course-assignments",
  "map",
  "profile",
  "profile-alt",
  "settings",
  "about",
  "contact",
  "faq",
  "guidelines"
];

// Combined route list used by the custom hash router
// Helps validate and manage all available routes in the app
export const allRoutes = [...authRoutes, ...mainRoutes];


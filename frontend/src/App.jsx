import React, { useEffect, useState } from "react";
import { defaultCourseReviews, defaultProfile, posts } from "./data/mockData";
import { getCourses, getCourseById } from "./api/coursesApi";
import { getCourseReviews, createCourseReview, markCourseReviewHelpful } from "./api/courseReviewsApi";
import { getUserEnrollments, addUserEnrollment, removeUserEnrollment } from "./api/enrollmentsApi";
import { useHashRoute, navigate } from "./hooks/useHashRoute";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { isCourseEnrolled, normalizeEnrollment } from "./utils/courses";
import { createDiscussionPost, createDiscussionReply, getDiscussionPosts, getDiscussionTags, updateDiscussionMetric } from "./api/discussionApi";
import { getPostMatchesTarget, normalizePost } from "./utils/posts";
import { getInitials } from "./utils/profile";
import { login, register } from "./api/user";
import SettingsPage from "./pages/SettingsPage"
import UserAvatar from "./components/UserAvatar";
import Icon from "./components/Icon";


// Reusable navigation button for hash-based routing
// It changes the current page without refreshing the browser
function RouteButton({ to, className = "btn ghost", children, ...props }) {
  return (
    <button className={className} type="button" onClick={() => navigate(to)} {...props}>
      {children}
    </button>
  );
}



// Hidden route shortcuts used for development and Figma frame testing
// These links are not visible in the final UI because CSS hides them
function QuickRoutes({ active }) {
  const labels = [
    ["home", "Home"],
    ["login", "Login"],
    ["signup", "Sign Up"],
    ["forgot", "Forgot"],
    ["discussion", "Forum"],
    ["courses", "Courses"],
    ["course-overview", "Detail"],
    ["map", "Map"],
    ["profile", "Profile"],
    ["settings", "Settings"]
  ];

  return (
    <nav className="quick-routes" aria-label="Figma frames">
      {labels.map(([key, label]) => (
        <a className={active === key ? "is-active" : ""} href={`#/${key}`} key={key}>
          {label}
        </a>
      ))}
    </nav>
  );
}

function PortfolioDemoNotice() {
  return (
    <aside className="portfolio-demo-notice" aria-label="Portfolio demo notice">
      <strong>Portfolio demo</strong>
      <span>Sample data only. Form entries stay in this browser; external maps open only when you choose.</span>
      <a href="https://github.com/zhzhg-dev/course-review-system" rel="noreferrer" target="_blank">
        View source
      </a>
    </aside>
  );
}

// Public landing page
// Introduces the student forum, course reviews, campus map, and main actions
function HomePage({ profile, isAuthenticated }) {
  const topics = [
    ["Campus Stories", "Nearby food, events, study spots, and everyday student life around Auckland."],
    ["Course Reviews", "Compare course difficulty, workload, assignment style, and student tips before enrolling."],
    ["Student Answers", "Ask questions, reply to classmates, and keep useful advice attached to each discussion."]
  ];

  return (
    <main className="home-page">
      <header className="home-nav">
        <button className="home-brand" type="button" onClick={() => navigate("home")}>
          <span className="home-brand-mark">U</span>
          <span>
            <strong>UoA Student Forum</strong>
            <span>Campus life and course reviews</span>
          </span>
        </button>
        <div className="home-actions">
          <RouteButton className="btn ghost" to="courses">
            Courses
          </RouteButton>
          {isAuthenticated ? (
            <RouteButton className="profile-chip home-profile-chip" to="profile">
              <UserAvatar profile={profile} />
              <span>
                <strong>{profile.fullName}</strong>
                <span>View Profile</span>
              </span>
            </RouteButton>
          ) : (
            <RouteButton className="btn outline" to="login">
              Log In
            </RouteButton>
          )}
        </div>
      </header>
      <PortfolioDemoNotice />
      <section className="home-hero">
        <div className="home-scene" aria-hidden="true">
          <span className="scene-sky" />
          <span className="scene-sun" />
          <span className="scene-harbour" />
          <span className="scene-land" />
          <span className="scene-tower">
            <span />
          </span>
          <span className="scene-building scene-library" />
          <span className="scene-building scene-engineering" />
          <span className="scene-building scene-students" />
          <span className="scene-path" />
          <span className="scene-pin scene-pin-one" />
          <span className="scene-pin scene-pin-two" />
          <span className="scene-chat-card scene-chat-one">CS 220 workload?</span>
          <span className="scene-chat-card scene-chat-two">Best lunch near OGGB</span>
        </div>
        <div className="home-hero-content">
          <p className="home-kicker">Built for University of Auckland students</p>
          <h1>UoA Student Forum</h1>
          <p className="home-copy">
            Browse campus stories, nearby recommendations, course difficulty, workload, assignment pressure, and practical study advice from other students.
          </p>
          <div className="home-cta-row">
            <RouteButton className="btn primary home-primary" to="discussion">
              Enter Forum
            </RouteButton>
            <RouteButton className="btn outline home-secondary" to="courses">
              Browse Courses
            </RouteButton>
          </div>
          <div className="home-metrics" aria-label="Forum highlights">
            <RouteButton className="home-metric-card" to="discussion">
              <strong>Forum</strong>
              <span>Campus updates and student posts</span>
            </RouteButton>

            <RouteButton className="home-metric-card" to="courses">
              <strong>Courses</strong>
              <span>Difficulty, workload, and reviews</span>
            </RouteButton>

            <RouteButton className="home-metric-card" to="map">
              <strong>Map</strong>
              <span>Find study spaces and class locations</span>
            </RouteButton>
          </div>
        </div>
      </section>
      <section className="home-preview-band">
        <div className="home-section">
          <div className="home-section-head">
            <span className="home-section-label">What students can do</span>
            <h2>One place for course choices and daily campus questions.</h2>
          </div>
          <div className="home-feature-grid">
            {topics.map(([title, text]) => (
              <article className="home-feature" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <HomeFooter />
      <QuickRoutes active="home" />
    </main>
  );
}

// Footer used on the public home page
// Provides common website links and prototype project information
function HomeFooter() {
  const footerColumns = [
    {
      title: "Platform",
      links: [
        ["Courses", "courses"],
        ["Forum", "discussion"],
        ["Campus Map", "map"],
        ["Sign In", "login"]
      ]
    },
    {
      title: "Support",
      links: [
        ["About Us", "about"],
        ["Contact Us", "contact"],
        ["FAQ", "faq"],
        ["Student Guidelines", "guidelines"]
      ]
    },
    {
      title: "Legal",
      links: [
        ["Terms of Service", "terms"],
        ["Privacy Policy", "privacy"]
      ]
    }
  ];

  return (
    <footer className="home-footer">
      <div className="home-footer-inner">
        <section className="footer-brand-block">
          <button className="footer-brand" type="button" onClick={() => navigate("home")}>
            <span className="home-brand-mark">U</span>
            <span>
              <strong>UoA Student Forum</strong>
              <span>Campus life and course reviews</span>
            </span>
          </button>
          <p>
            A student-focused prototype for course reviews, campus questions, study tips, and everyday university life at the University of Auckland.
          </p>
          <span className="footer-made-by">Original team project by Team Power Up · Portfolio adaptation by Grant Zhang</span>
        </section>
        <nav className="footer-link-grid" aria-label="Footer navigation">
          {footerColumns.map((column) => (
            <div className="footer-column" key={column.title}>
              <h3>{column.title}</h3>
              {column.links.map(([label, route]) => (
                <RouteButton className="footer-link" key={label} to={route}>
                  {label}
                </RouteButton>
              ))}
            </div>
          ))}
        </nav>
      </div>
      <div className="footer-bottom">
        <span>Built for student discussion and course planning.</span>
      </div>
    </footer>
  );
}

// Main application layout used after entering the system
// Provides the sidebar navigation, top bar, login/profile chip, and page content area
function AppShell({ active, children, profile, isAuthenticated }) {
  // Public pages are available to both guests and signed-in users
  const publicNav = [
    ["discussion", "Discussion", "chat"],
    ["courses", "Courses", "courses"],
    ["map", "Map", "map"]
  ];
  // Private pages are only shown after the user is signed in
  const privateNav = [
    ["profile", "Profile", "user"],
    ["settings", "Settings", "settings"]
  ];
  const nav = isAuthenticated ? [...publicNav, ...privateNav] : publicNav;

  return (
    <>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-lockup">
              <div className="brand-title">
                <strong>Course Review</strong>
                <span>System</span>
              </div>
            </div>
          </div>
          <nav className="sidebar-nav" aria-label="Main navigation">
            {nav.map(([key, label, iconName]) => {
              const isActive = active.startsWith(key.split("-")[0]) || (active.startsWith("course") && key === "courses");
              return (
                <RouteButton className={`nav-link ${isActive ? "is-active" : ""}`} key={key} to={key}>
                  <Icon name={iconName} />
                  {label}
                </RouteButton>
              );
            })}
          </nav>
        </aside>
        <main className="main-area">
          <header className="topbar">
            <h1>Welcome Back, Course Review System</h1>
            {isAuthenticated ? (
              <RouteButton className="profile-chip" to="profile">
                <UserAvatar profile={profile} />
                <span>
                  <strong>{profile.fullName}</strong>
                  <span>View Profile</span>
                </span>
              </RouteButton>
            ) : (
              <RouteButton className="profile-chip login-chip" to="login">
                <span className="avatar">
                  <Icon name="lock" />
                </span>
                <span>
                  <strong>Log In</strong>
                  <span>Sign in to interact</span>
                </span>
              </RouteButton>
            )}
          </header>
          <PortfolioDemoNotice />
          {children}
        </main>
      </div>
      <QuickRoutes active={active} />
    </>
  );
}

// Course preview card used on the course listing page
// Shows course metadata and allows signed-in users to add the course to their profile
function CourseCard({ course, isEnrolled, onAddCourse, onRemoveCourse, isAuthenticated }) {
  return (
    <article className="card course-card">
      <div className="course-head">
        <div>
          <h2>{course.title}</h2>
          <p className="prof">
            {course.code} - {course.professor}
          </p>
        </div>
        <span className={`badge ${course.difficulty.toLowerCase()}`}>{course.difficulty}</span>
      </div>
      <p className="desc">{course.description}</p>
      <div className="course-meta">
        <span className="star">
          <Icon name="star" />
        </span>
        <span className="rating">{course.rating}</span>
        <span>({course.reviews})</span>
        <span>
          <Icon name="book" />
          {course.credits}
        </span>
      </div>
      <div className="course-bottom">
        <span>
          <Icon name="clock" />
          {course.semester}
        </span>
        <div className="course-actions">
          {isAuthenticated && (
            <button
              className={`btn ${isEnrolled ? "outline" : "primary"}`}
              type="button"
              onClick={() => {
                if (isEnrolled) {
                  onRemoveCourse(course._id || course.id);
                } else {
                  onAddCourse(course);
                }
              }}
            >
              {isEnrolled ? "Added" : "Add to My Courses"}
            </button>
          )}
          <button
            className="btn ghost link"
            type="button"
            onClick={() => {
              window.localStorage.setItem("crs_selected_course_id", course._id || course.id);
              navigate("course-overview");
            }}
          >
            View Details -&gt;
          </button>
        </div>
      </div>
    </article>
  );
}

// Course listing page
// Supports keyword search, difficulty filtering, and adding courses to the current user's profile
function CoursesPage({
  filtered = false,
  profile,
  enrolledCourses,
  addCourseToProfile,
  removeCourseFromProfile,
  isAuthenticated
}) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseError, setCourseError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadCourses() {
      try {
        setLoading(true);
        setCourseError("");

        const data = await getCourses({
          search: query,
          difficulty
        });

        if (!ignore) {
          setCourseList(data);
        }
      } catch (err) {
        if (!ignore) {
          setCourseError("Could not load the sample course data.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      ignore = true;
    };
  }, [query, difficulty]);

  return (
    <AppShell active={filtered ? "course-filter" : "courses"} profile={profile} isAuthenticated={isAuthenticated}>
      <section className="content">
        <div className="course-tools">
          <div className="toolbar-search">
            <Icon name="search" />
            <input
              value={query}
              placeholder="Search course name, professor, or keywords..."
              onChange={(event) => {
                setQuery(event.target.value);
                if (!filtered) navigate("course-filter");
              }}
            />
          </div>
          <label className="field compact-field">
            <span>Difficulty</span>
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
              <option>All</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </label>
        </div>

        {loading && <p className="meta-line">Loading sample courses...</p>}
        {courseError && <p className="error-note">{courseError}</p>}

        {!loading && !courseError && (
          <>
            <p className="meta-line">
              Found <strong>{courseList.length}</strong> courses
            </p>
            <div className="courses-grid" style={{ marginTop: 24 }}>
              {courseList.map((course) => (
                <CourseCard
                  course={course}
                  isEnrolled={enrolledCourses.some((item) => {
                    const itemId = item._id || item.id;
                    const courseId = course._id || course.id;

                    return itemId === courseId || item.code === course.code;
                  })}
                  isAuthenticated={isAuthenticated}
                  key={course._id || course.code}
                  onAddCourse={addCourseToProfile}
                  onRemoveCourse={removeCourseFromProfile}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </AppShell>
  );
}

// Discussion forum page
// Allows users to browse posts, create posts, reply, like helpful posts, and filter their own posts
function getUniquePostTags(posts) {
  return Array.from(new Set(posts.flatMap((post) => post.tags || []))).sort();
}

function getMergedTags(tags) {
  return tags.filter((tag, index) => tag && tags.indexOf(tag) === index);
}

function parsePostTags(tagsText) {
  return Array.from(
    new Set(
      tagsText
        .split(/[\s,#]+/)
        .map((tag) => tag.trim().replace(/^#/, ""))
        .filter(Boolean)
    )
  );
}

function getActiveTagQuery(tagsText) {
  const match = tagsText.match(/(^|[\s,])#([A-Za-z0-9_-]*)$/);
  return match ? match[2].toLowerCase() : null;
}

function replaceActiveTagQuery(tagsText, tag) {
  const match = tagsText.match(/(^|[\s,])#[A-Za-z0-9_-]*$/);

  if (!match) {
    return `${tagsText.trim()} #${tag} `.trimStart();
  }

  const prefix = tagsText.slice(0, match.index);
  return `${prefix}${match[1]}#${tag} `;
}

function DiscussionPage({ filterOpen = false, profile, discussionPosts, setDiscussionPosts, isAuthenticated }) {
  const [showMineOnly, setShowMineOnly] = useState(filterOpen);
  const [sortBy, setSortBy] = useState("Most Recent");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isComposing, setIsComposing] = useState(filterOpen);
  const [draft, setDraft] = useState({ body: "", tags: "" });
  const [discussionApiMessage, setDiscussionApiMessage] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);
  const [discussionTags, setDiscussionTags] = useState(() => getUniquePostTags(discussionPosts));
  const trendingTags = discussionTags.length ? discussionTags : getUniquePostTags(discussionPosts);
  const displayedTrendingTags = showAllTags ? trendingTags : trendingTags.slice(0, 15);
  const selectedTagSet = new Set(selectedTags);
  const activeTagQuery = getActiveTagQuery(draft.tags);
  const draftTagSet = new Set(parsePostTags(draft.tags).map((tag) => tag.toLowerCase()));
  const tagSuggestions = activeTagQuery === null
    ? []
    : trendingTags
        .filter((tag) => tag.toLowerCase().startsWith(activeTagQuery) && !draftTagSet.has(tag.toLowerCase()))
        .slice(0, 6);
  const visiblePosts = [...discussionPosts]
    .filter((post) => !showMineOnly || post.name === profile.fullName)
    .filter((post) => selectedTags.length === 0 || selectedTags.every((tag) => (post.tags || []).includes(tag)))
    .sort((a, b) => {
      if (sortBy === "Most Helpful") return b.counts[0] - a.counts[0];
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

  useEffect(() => {
    let cancelled = false;

    getDiscussionTags()
      .then((apiTags) => {
        if (!cancelled) {
          setDiscussionTags(getMergedTags(apiTags));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDiscussionTags((currentTags) => (currentTags.length ? currentTags : getUniquePostTags(discussionPosts)));
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    // Load browser-local discussion post…13230 tokens truncated…olicy layout component
function PrivacyPage() {
  const sections = [
    {
      number: "01",
      title: "No server-side collection",
      text: "This public portfolio build does not send account details, course selections, posts, replies, or reviews to a server."
    },
    {
      number: "02",
      title: "Browser-local demonstration",
      text: "Fictional details entered in the demo are used only to render the interface and demonstrate interactive features in the current browser."
    },
    {
      number: "03",
      title: "Local storage",
      text: "At this stage, the app uses browser local storage for demo data. This means some information may stay in the same browser until it is cleared."
    },
    {
      number: "04",
      title: "Clear your demo data",
      text: "You can remove all demo changes at any time by clearing this site's browser storage."
    }
  ];

  return <PolicyPage type="privacy" title="Privacy Policy" subtitle="Basic privacy information for this prototype" badge="Data and privacy notice" sections={sections} />;
}

// Reusable layout for Terms and Privacy pages
// Displays hero section, policy cards, and navigation buttons
function PolicyPage({ type, title, subtitle, badge, sections }) {
  return (
    <main className="auth-page policy-page">
      <section className="policy-container">
        <div className="policy-hero">
          <div>
            <span className="policy-kicker">Course Review System</span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <span className="policy-hero-mark">{type === "privacy" ? "P" : "T"}</span>
        </div>
        <article className="policy-panel">
          <div className="policy-panel-head">
            <span className="policy-badge">{badge}</span>
            <p>Last updated for prototype review</p>
          </div>
          <div className="policy-list">
            {sections.map((section) => (
              <section className="policy-item" key={section.number}>
                <span className="policy-number">{section.number}</span>
                <div>
                  <h2>{section.title}</h2>
                  <p>{section.text}</p>
                </div>
              </section>
            ))}
          </div>
          <div className="policy-actions">
            <RouteButton className="btn ghost" to="home">
              Back to Home
            </RouteButton>

            <RouteButton className="btn outline" to="login">
              Back to Sign In
            </RouteButton>

            <RouteButton className="btn primary" to="signup">
              Create Account
            </RouteButton>
          </div>
        </article>
      </section>
      <QuickRoutes active={type} />
    </main>
  );
}

// Simple informational pages used by footer links
// These keep the footer links functional without requiring a backend
function InfoPage({ type, title, subtitle, cards }) {
  return (
    <main className="auth-page info-page">
      <section className="info-container">
        <div className="info-hero">
          <span className="policy-kicker">UoA Student Forum</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="info-card-grid">
          {cards.map((card) => (
            <article className="info-card" key={card.title}>
              <h2>{card.title}</h2>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
        <div className="policy-actions info-actions">
          <RouteButton className="btn ghost" to="home">
            Back to Home
          </RouteButton>
          <RouteButton className="btn primary" to="discussion">
            Enter Forum
          </RouteButton>
        </div>
      </section>
      <QuickRoutes active={type} />
    </main>
  );
}

function AboutPage() {
  const cards = [
    {
      title: "Our purpose",
      text: "UoA Student Forum is designed as a student-friendly space for sharing course experiences, campus tips, and practical study advice."
    },
    {
      title: "Who it is for",
      text: "The platform is mainly for University of Auckland students who want to compare courses, ask questions, and learn from other students."
    },
    {
      title: "Prototype note",
      text: "This public portfolio version uses sample data and browser storage so it can be demonstrated safely without collecting visitor information."
    }
  ];

  return <InfoPage type="about" title="About Us" subtitle="Learn more about the purpose of this student forum prototype." cards={cards} />;
}

function ContactPage() {
  const cards = [
    {
      title: "General questions",
      text: "For this prototype, students can use the forum to ask course-related or campus-life questions. A real contact form can be connected later."
    },
    {
      title: "Report content",
      text: "If a post or review is inappropriate, the future version should include reporting and moderation features for safer discussion."
    },
    {
      title: "Project team",
      text: "The original six-person university project was built by Team Power Up. This public portfolio adaptation was prepared by Grant Zhang with team permission and preserves full attribution in the repository."
    }
  ];

  return (
    <main className="auth-page info-page">
      <section className="info-container contact-page-layout">
        <div className="info-hero">
          <span className="policy-kicker">UoA Student Forum</span>
          <h1>Contact Us</h1>
          <p>Get in touch with the project team, ask questions, or send feedback about the platform.</p>
        </div>

        <article className="contact-combined-card">
          <section className="contact-message-section">
            <div className="contact-card-head">
              <h2>Send Us a Message</h2>
              <p>Fill in the form below and contact the project team.</p>
            </div>

            <form className="contact-form">
              <label className="field">
                <span>Email Address</span>
                <input type="email" placeholder="your@email.com" />
              </label>

              <label className="field">
                <span>Message</span>
                <textarea
                  placeholder="Write your feedback, questions, or suggestions here..."
                  rows="7"
                />
              </label>

              <button className="btn primary" type="button">
                Send Message
              </button>
            </form>
          </section>

          <section className="contact-email-section">
            <div className="contact-card-head">
              <h2>Contact Information</h2>
              <p>You can also contact the project team directly.</p>
            </div>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <strong>Email</strong>
                <span>ysun801@aucklanduni.ac.nz</span>
              </div>
            </div>
          </section>
        </article>

        <div className="info-card-grid">
          {cards.map((card) => (
            <article className="info-card" key={card.title}>
              <h2>{card.title}</h2>
              <p>{card.text}</p>
            </article>
          ))}
        </div>

        <div className="policy-actions info-actions">
          <RouteButton className="btn ghost" to="home">
            Back to Home
          </RouteButton>

          <RouteButton className="btn primary" to="discussion">
            Enter Forum
          </RouteButton>
        </div>
      </section>

      <QuickRoutes active="contact" />
    </main>
  );
}

function FAQPage() {
  const sections = [
    {
      category: "Account & Access",
      items: [
        {
          question: "Can guests browse the website?",
          answer:
            "Yes. Guests can browse courses, the forum, and the map, but they need to sign in before posting, replying, liking, or saving content."
        },
        {
          question: "Do I need a University of Auckland account?",
          answer:
            "This prototype currently uses demo accounts, but a future version could support university login integration."
        }
      ]
    },
    {
      category: "Courses & Reviews",
      items: [
        {
          question: "Are the course reviews official?",
          answer:
            "No. Reviews are student opinions. Students should still check official university sources before making final enrolment decisions."
        },
        {
          question: "Can I save courses to my profile?",
          answer:
            "Yes. Signed-in users can add courses to their profile and manage them locally in the prototype."
        }
      ]
    },
    {
      category: "Privacy & Data",
      items: [
        {
          question: "Where is my data saved?",
          answer:
            "In this prototype, profile and forum data is saved in browser localStorage. A future backend can replace this with a proper database."
        },
        {
          question: "Can I delete my account?",
          answer:
            "The delete account button is currently a frontend-only prototype feature and does not permanently remove data yet."
        }
      ]
    }
  ];

  return (
    <main className="auth-page info-page faq-page">
      <section className="info-container">
        <div className="info-hero">
          <span className="policy-kicker">UoA Student Forum</span>
          <h1>FAQ</h1>
          <p>Common questions about accounts, courses, reviews, and platform features.</p>
        </div>

        <div className="faq-sections">
          {sections.map((section) => (
            <article className="faq-category-card" key={section.category}>
              <div className="faq-category-head">
                <h2>{section.category}</h2>
              </div>

              <div className="faq-question-list">
                {section.items.map((item) => (
                  <div className="faq-question-item" key={item.question}>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="policy-actions info-actions">
          <RouteButton className="btn ghost" to="home">
            Back to Home
          </RouteButton>

          <RouteButton className="btn primary" to="discussion">
            Enter Forum
          </RouteButton>
        </div>
      </section>

      <QuickRoutes active="faq" />
    </main>
  );
}

function GuidelinesPage() {
  const cards = [
    {
      title: "Be respectful",
      text: "Write posts and reviews in a respectful way. Avoid personal attacks, harmful language, or sharing private information about others."
    },
    {
      title: "Stay helpful",
      text: "Try to share useful details such as workload, assignment style, study tips, or campus advice that can help other students."
    },
    {
      title: "Use reliable sources",
      text: "Student experience is useful, but official course details should still be checked through university systems and course outlines."
    }
  ];

  return <InfoPage type="guidelines" title="Student Guidelines" subtitle="Basic community rules for safe and useful student discussion." cards={cards} />;
}

// Shared heading used by authentication and policy pages
function AuthHeader({ title, subtitle }) {
  return (
    <header className="auth-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}

// Progress indicator for the password reset flow
function Steps({ active }) {
  return (
    <div className="steps">
      <StepItem number={1} label="Email" active={active} />
      <span className={`step-line ${active > 1 ? "done" : ""}`} />
      <StepItem number={2} label="Security Question" active={active} split />
      <span className={`step-line ${active > 2 ? "done" : ""}`} />
      <StepItem number={3} label="New Password" active={active} split />
    </div>
  );
}

// Single step inside the password reset progress indicator
function StepItem({ number, label, active, split = false }) {
  const state = active > number ? "done" : active === number ? "active" : "";
  const labelParts = label.split(" ");

  return (
    <div className={`step ${state}`}>
      <span>
        {split ? (
          <>
            {labelParts[0]}
            <br />
            {labelParts.slice(1).join(" ")}
          </>
        ) : (
          label
        )}
      </span>
    </div>
  );
}

// Safe sign-in instructions for the browser-local portfolio demo
function DemoAccounts() {
  return (
    <aside className="demo-card">
      <h2>Safe demo sign-in</h2>
      <div className="demo-list">
        <article>
          <h3>Use fictional details</h3>
          <p>Enter any made-up email and password. They are not stored or transmitted.</p>
        </article>
      </div>
    </aside>
  );
}

// Root component of the application
// Stores global app state, defines all routes, and decides which page to render
export default function App() {
  // Read the current hash route, for example #/login or #/courses
  const currentRoute = useHashRoute();
  // Persist main application state in browser localStorage for the prototype
  const [isAuthenticated, setIsAuthenticated] = useLocalStorageState("crs_is_authenticated", false);
  const [profile, setProfile] = useLocalStorageState("crs_profile", defaultProfile);
  const [discussionPosts, setDiscussionPosts] = useLocalStorageState(
    "crs_posts",
    posts.map((post, index) => normalizePost(post, index))
  );
  const [courseReviews, setCourseReviews] = useLocalStorageState("crs_course_reviews", defaultCourseReviews);
  const [enrolledCourses, setEnrolledCourses] = useLocalStorageState("crs_enrolled_courses", []);
  const normalizedDiscussionPosts = discussionPosts.map((post, index) => normalizePost(post, index));
  const normalizedEnrolledCourses = enrolledCourses.map(normalizeEnrollment);

  useEffect(() => {
  let ignore = false;

  async function loadEnrollments() {
    const userId = profile.id || profile.email;

    if (!isAuthenticated || !userId) {
      setEnrolledCourses([]);
      return;
    }

    try {
      const data = await getUserEnrollments(userId);

      if (!ignore) {
        setEnrolledCourses(data);
      }
    } catch (err) {
      console.log("Could not load enrollments", err);
    }
  }

  loadEnrollments();

  return () => {
    ignore = true;
  };
}, [isAuthenticated, profile.id, profile.email]);

  // Add a course to the current user's local profile if it is not already added
  async function addCourseToProfile(course) {
  const userId = profile.id || profile.email;
  const courseId = course._id || course.id;

  if (!isAuthenticated || !userId || !courseId) {
    window.localStorage.setItem("crs_login_notice", "Please sign in before adding courses.");
    navigate("login");
    return;
  }

  try {
    const enrollment = await addUserEnrollment(userId, courseId);

    setEnrolledCourses((currentCourses) => {
      const alreadyAdded = currentCourses.some((item) => {
        const itemId = item._id || item.id;
        return itemId === enrollment.id || itemId === enrollment._id || item.code === enrollment.code;
      });

      if (alreadyAdded) {
        return currentCourses;
      }

      return [enrollment, ...currentCourses];
    });
  } catch (err) {
    console.log("Could not add course", err);
  }
}

  // Remove a locally added course from the user's profile
  async function removeCourseFromProfile(courseId) {
  const userId = profile.id || profile.email;

  if (!isAuthenticated || !userId || !courseId) {
    return;
  }

  try {
    await removeUserEnrollment(userId, courseId);

    setEnrolledCourses((currentCourses) =>
      currentCourses
        .map(normalizeEnrollment)
        .filter((course) => course.id !== courseId && course._id !== courseId)
    );
  } catch (err) {
    console.log("Could not remove course", err);
  }
}

  // Log out the current user and return them to the home page
  function handleLogout() {
    setIsAuthenticated(false);
    window.localStorage.setItem("crs_remember_me", JSON.stringify(false));
    window.localStorage.setItem("crs_login_notice", "You have signed out. You can keep browsing as a guest.");
    navigate("home");
  }

  // Route table: maps each hash route name to the page component that should render
  const pages = {
    home: <HomePage profile={profile} isAuthenticated={isAuthenticated} />,
    login: <LoginPage setIsAuthenticated={setIsAuthenticated} setProfile={setProfile}/>,
    signup: <SignUpPage setIsAuthenticated={setIsAuthenticated} setProfile={setProfile} />,
    terms: <TermsPage />,
    privacy: <PrivacyPage />,
    about: <AboutPage />,
    contact: <ContactPage />,
    faq: <FAQPage />,
    guidelines: <GuidelinesPage />,
    forgot: <AuthPage />,
    discussion: (
      <DiscussionPage
        profile={profile}
        discussionPosts={normalizedDiscussionPosts}
        setDiscussionPosts={setDiscussionPosts}
        isAuthenticated={isAuthenticated}
      />
    ),
    "discussion-filter": (
      <DiscussionPage
        filterOpen
        profile={profile}
        discussionPosts={normalizedDiscussionPosts}
        setDiscussionPosts={setDiscussionPosts}
        isAuthenticated={isAuthenticated}
      />
    ),
    courses: (
      <CoursesPage
        profile={profile}
        enrolledCourses={normalizedEnrolledCourses}
        addCourseToProfile={addCourseToProfile}
        removeCourseFromProfile={removeCourseFromProfile}
        isAuthenticated={isAuthenticated}
      />
    ),
    "course-filter": (
      <CoursesPage
        filtered
        profile={profile}
        enrolledCourses={normalizedEnrolledCourses}
        addCourseToProfile={addCourseToProfile}
        removeCourseFromProfile={removeCourseFromProfile}
        isAuthenticated={isAuthenticated}
      />
    ),
    "course-overview": (
      <CourseDetail
        tab="overview"
        profile={profile}
        courseReviews={courseReviews}
        setCourseReviews={setCourseReviews}
        enrolledCourses={normalizedEnrolledCourses}
        addCourseToProfile={addCourseToProfile}
        isAuthenticated={isAuthenticated}
      />
    ),
    "course-pass-rate": (
      <CourseDetail
        tab="pass-rate"
        profile={profile}
        courseReviews={courseReviews}
        setCourseReviews={setCourseReviews}
        enrolledCourses={normalizedEnrolledCourses}
        addCourseToProfile={addCourseToProfile}
        isAuthenticated={isAuthenticated}
      />
    ),
    "course-assignments": (
      <CourseDetail
        tab="assignments"
        profile={profile}
        courseReviews={courseReviews}
        setCourseReviews={setCourseReviews}
        enrolledCourses={normalizedEnrolledCourses}
        addCourseToProfile={addCourseToProfile}
        isAuthenticated={isAuthenticated}
      />
    ),
    map: <MapPage profile={profile} isAuthenticated={isAuthenticated} />,
    profile: (
      <ProfilePage
        profile={profile}
        enrolledCourses={normalizedEnrolledCourses}
        removeCourseFromProfile={removeCourseFromProfile}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
    ),
    "profile-alt": (
      <ProfilePage
        alt
        profile={profile}
        enrolledCourses={normalizedEnrolledCourses}
        removeCourseFromProfile={removeCourseFromProfile}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
    ),
    settings: 
    <AppShell active="settings" profile={profile} isAuthenticated={isAuthenticated}>
      <SettingsPage profile={profile} setProfile={setProfile} isAuthenticated={isAuthenticated} />
    </AppShell>
  };

  return pages[currentRoute] || pages.home;
}


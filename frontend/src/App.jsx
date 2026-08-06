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

    // Load browser-local discussion posts when the page opens or filters change.
    getDiscussionPosts({
      mine: showMineOnly ? profile.fullName : "",
      sort: sortBy === "Most Helpful" ? "helpful" : "recent",
      tags: selectedTags
    })
      .then((apiPosts) => {
        if (!cancelled) {
          setDiscussionPosts(apiPosts.map((post, index) => normalizePost(post, index)));
          setDiscussionApiMessage("");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDiscussionApiMessage("Using browser-local discussion data.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [profile.fullName, selectedTags, setDiscussionPosts, showMineOnly, sortBy]);

  // Protect interactive actions for guests
    // Guests can read content, but must sign in before posting, replying, or liking
  function requireLogin() {
    if (isAuthenticated) return false;
    window.localStorage.setItem("crs_login_notice", "Please sign in to like, reply, or post in the forum.");
    navigate("login");
    return true;
  }

  // Create a new browser-local forum post for the portfolio demo.
  async function handleCreatePost(event) {
    event.preventDefault();
    if (requireLogin()) return;
    const body = draft.body.trim();
    if (!body) return;
    const tags = parsePostTags(draft.tags);
    const postDraft = {
      initials: getInitials(profile.fullName),
      name: profile.fullName,
      time: "Just now",
      body,
      tags: tags.length ? tags : ["general"],
      counts: [0, 0],
      replies: [],
      createdAt: Date.now()
    };

    try {
      const createdPost = await createDiscussionPost(postDraft);
      const normalizedPost = normalizePost(createdPost, 0);
      setDiscussionPosts([normalizedPost, ...discussionPosts]);
      setDiscussionTags((currentTags) => getMergedTags([...(normalizedPost.tags || []), ...currentTags]));
      setDiscussionApiMessage("");
    } catch {
      setDiscussionPosts([postDraft, ...discussionPosts]);
      setDiscussionTags((currentTags) => getMergedTags([...postDraft.tags, ...currentTags]));
      setDiscussionApiMessage("Post saved in this browser.");
    }

    setDraft({ body: "", tags: "" });
    setIsComposing(false);
    setShowMineOnly(false);
    setSelectedTags([]);
    navigate("discussion");
  }

  function toggleTagFilter(tag) {
    setSelectedTags((currentTags) =>
      currentTags.includes(tag)
        ? currentTags.filter((currentTag) => currentTag !== tag)
        : [...currentTags, tag]
    );
  }

  function selectDraftTag(tag) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      tags: replaceActiveTagQuery(currentDraft.tags, tag)
    }));
  }

  // EN: Update the Helpful counter.
  async function updatePostMetric(targetPost, index) {
    const userKey = (profile.email || profile.fullName || "").trim().toLowerCase();
    const hasLikedPost = (targetPost.likedBy || []).includes(userKey);

    if (index === 0 && hasLikedPost) {
      setDiscussionApiMessage("You have already marked this post as helpful.");
      return;
    }

    if (targetPost.id) {
      try {
        const updatedPost = await updateDiscussionMetric(targetPost.id, index, userKey);
        setDiscussionPosts((currentPosts) =>
          currentPosts.map((post) => (getPostMatchesTarget(post, targetPost) ? normalizePost(updatedPost, 0) : post))
        );
        setDiscussionApiMessage("");
        return;
      } catch {
        setDiscussionApiMessage(
          index === 0
            ? "You have already marked this post as helpful."
            : "Metric saved in this browser."
        );
        if (index === 0) return;
      }
    }

    setDiscussionPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (!getPostMatchesTarget(post, targetPost)) return post;
        const normalizedPost = normalizePost(post, 0);
        const nextCounts = [...normalizedPost.counts];
        nextCounts[index] += 1;
        const nextLikedBy = index === 0 ? [...normalizedPost.likedBy, userKey] : normalizedPost.likedBy;
        return { ...normalizedPost, counts: nextCounts, likedBy: nextLikedBy };
      })
    );
  }

  // EN: Add a reply to a specific post and update its reply count.
  async function addPostReply(targetPost, body) {
    const reply = {
      initials: getInitials(profile.fullName),
      name: profile.fullName,
      time: "Just now",
      body,
      createdAt: Date.now(),
      replierId: profile.id
    };

    if (targetPost.id) {
      try {
        const updatedPost = await createDiscussionReply(targetPost.id, reply);
        setDiscussionPosts((currentPosts) =>
          currentPosts.map((post) => (getPostMatchesTarget(post, targetPost) ? normalizePost(updatedPost, 0) : post))
        );
        setDiscussionApiMessage("");
        return;
      } catch {
        setDiscussionApiMessage("Reply saved in this browser.");
      }
    }

    setDiscussionPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (!getPostMatchesTarget(post, targetPost)) return post;
        const normalizedPost = normalizePost(post, 0);
        const nextReplies = [...normalizedPost.replies, reply];
        return { ...normalizedPost, replies: nextReplies, counts: [normalizedPost.counts[0], nextReplies.length] };
      })
    );
  }

  return (
    <AppShell active={filterOpen ? "discussion-filter" : "discussion"} profile={profile} isAuthenticated={isAuthenticated}>
      <section className="content">
        <div className="discussion-layout">
          <div className="post-list">
            {discussionApiMessage && <p className="status-note">{discussionApiMessage}</p>}
            {isComposing && (
              <form className="card compose-card" onSubmit={handleCreatePost}>
                <label className="field">
                  <span>New Post</span>
                  <textarea
                    value={draft.body}
                    placeholder="Share a course tip, ask a question, or start a discussion..."
                    onChange={(event) => setDraft({ ...draft, body: event.target.value })}
                  />
                </label>
                <div className="field tag-field">
                  <span>Tags</span>
                  <input
                    value={draft.tags}
                    placeholder="#study #algorithms, campus-life"
                    onChange={(event) => setDraft({ ...draft, tags: event.target.value })}
                  />
                  {tagSuggestions.length > 0 && (
                    <div className="tag-suggestions" aria-label="Suggested tags">
                      {tagSuggestions.map((tag) => (
                        <button key={tag} type="button" onClick={() => selectDraftTag(tag)}>
                          #{tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="form-actions">
                  <button className="btn primary" type="submit">
                    Publish Post
                  </button>
                  <button className="btn outline" type="button" onClick={() => setIsComposing(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
            {visiblePosts.map((post) => (
              <PostCard
                addPostReply={addPostReply}
                post={post}
                key={`${post.name}-${post.body}`}
                profile={profile}
                requireLogin={requireLogin}
                selectedTags={selectedTags}
                onTagSelect={toggleTagFilter}
                updatePostMetric={updatePostMetric}
              />
            ))}
            {visiblePosts.length === 0 && <p className="empty-state">No posts match the current filters.</p>}
          </div>
          <aside className="side-stack">
            <section className="card side-card">
              <h2 className="side-title">
                <Icon name="star" />
                Trending Tags
              </h2>
              <div className="tag-cloud">
                {displayedTrendingTags.map((tag) => (
                  <button
                    className={`tag ${selectedTagSet.has(tag) ? "is-selected" : ""}`}
                    key={tag}
                    type="button"
                    aria-pressed={selectedTagSet.has(tag)}
                    onClick={() => toggleTagFilter(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <div className="tag-filter-summary">
                  <span>{selectedTags.length} tags selected</span>
                  <button type="button" onClick={() => setSelectedTags([])}>
                    Clear
                  </button>
                </div>
              )}
              {trendingTags.length > 15 && (
                <button className="tag-show-toggle" type="button" onClick={() => setShowAllTags(!showAllTags)}>
                  {showAllTags ? "Show less" : "Show all"}
                </button>
              )}
            </section>
            <section className="card side-card">
              <h2 className="side-title">
                <Icon name="settings" />
                Sort Options
              </h2>
              <div className="sort-box">
                <div className="toggle-row">
                  <span>Show My Posts Only</span>
                  <button
                    className={`switch ${showMineOnly ? "on" : ""}`}
                    type="button"
                    aria-label="Toggle my posts only"
                    onClick={() => setShowMineOnly(!showMineOnly)}
                  />
                </div>
                <label className="field">
                  <span>Sort By</span>
                  <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                    <option>Most Recent</option>
                    <option>Most Helpful</option>
                  </select>
                </label>
              </div>
            </section>
          </aside>
        </div>
        <button className="fab" type="button" aria-label="Create post" onClick={() => (requireLogin() ? null : setIsComposing(true))}>
          <Icon name="plus" />
        </button>
      </section>
    </AppShell>
  );
}

// Single forum post card
// Handles helpful count and local replies for one post
function PostCard({ post, profile, updatePostMetric, addPostReply, requireLogin, selectedTags, onTagSelect }) {
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const replies = post.replies || [];
  const selectedTagSet = new Set(selectedTags);
  const userKey = (profile.email || profile.fullName || "").trim().toLowerCase();
  const hasLikedPost = (post.likedBy || []).includes(userKey);

  function increment(index) {
    if (requireLogin()) return;
    updatePostMetric(post, index);
  }

  function handleReply(event) {
    event.preventDefault();
    if (requireLogin()) return;
    const body = replyText.trim();
    if (!body) return;
    addPostReply(post, body);
    setReplyText("");
    setIsReplyOpen(true);
  }

  return (
    <article className="card post-card">
      <div className="avatar">{post.initials}</div>
      <div>
        <div className="post-author">
          <div>
            <strong>{post.name}</strong>
            <time>{post.time}</time>
          </div>
        </div>
        <p className="post-body">{post.body}</p>
        <div className="tag-row">
          {post.tags.map((tag) => (
            <button
              className={`tag ${selectedTagSet.has(tag) ? "is-selected" : ""}`}
              key={tag}
              type="button"
              aria-pressed={selectedTagSet.has(tag)}
              onClick={() => onTagSelect(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="card-actions" style={{ marginTop: 16 }}>
          <button className="btn ghost link" type="button" disabled={hasLikedPost} onClick={() => increment(0)}>
            <Icon name="thumbs" />
            Helpful ({post.counts[0]})
          </button>
          <button className="btn ghost" type="button" onClick={() => (requireLogin() ? null : setIsReplyOpen(!isReplyOpen))}>
            <Icon name="reply" />
            Reply ({replies.length})
          </button>
        </div>
        {isReplyOpen && (
          <div className="reply-panel">
            <div className="reply-list">
              {replies.length === 0 && <p className="reply-empty">No replies yet. Start the conversation.</p>}
              {replies.map((reply) => (
                <div className="reply-item" key={`${reply.name}-${reply.createdAt || reply.body}`}>
                  {reply.replierId?.avatar ?
                  <span className={'avatar small'}>
                    <img alt={`${reply.replierId?.fullName} avatar`} src={reply.replierId?.avatar} />
                  </span>
                  :
                   <span className="avatar small">{getInitials(reply.replierId?.fullName)||reply.initials}</span>
                  }
                  <div>
                    <div className="reply-head">
                      <strong>{reply.replierId?.fullName || reply.name}</strong>
                      <time>{reply.time}</time>
                    </div>
                    <p>{reply.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <form className="reply-form" onSubmit={handleReply}>
              {profile.photo?
                <span className={'avatar small'}>
                  <img alt={`${getInitials(profile.fullName)} avatar`} src={profile.photo} />
                </span>
                :
                <span className="avatar small">{getInitials(profile.fullName)}</span>
              }
              <input value={replyText} placeholder="Write a reply..." onChange={(event) => setReplyText(event.target.value)} />
              <button className="btn primary" type="submit">
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
}

// Course detail page
// Shows course overview, pass rate history, assignment information, and student reviews
function CourseDetail({ tab = "overview", profile, courseReviews, setCourseReviews, enrolledCourses, addCourseToProfile, isAuthenticated }) {
  // Guests can only see the overview tab; signed-in users can access extra course details
  const visibleTab = isAuthenticated ? tab : "overview";
  const active = visibleTab === "overview" ? "course-overview" : visibleTab === "pass-rate" ? "course-pass-rate" : "course-assignments";

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courseError, setCourseError] = useState("");
  const [courseMessage, setCourseMessage] = useState("");

  const reviewCount = courseReviews.length;

  const averageRating = reviewCount
    ? (
        courseReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
        reviewCount
      ).toFixed(1)
    : course?.rating || "0.0";

  const enrolled = course ? isCourseEnrolled(enrolledCourses, course) : false;

  useEffect(() => {
    let ignore = false;

    async function loadCourseDetail() {
      try {
        setLoading(true);
        setCourseError("");

        const selectedCourseId = window.localStorage.getItem("crs_selected_course_id");

        if (!selectedCourseId) {
          setCourseError("No course was selected. Please go back to the courses page.");
          return;
        }

        const data = await getCourseById(selectedCourseId);
        const reviews = await getCourseReviews(selectedCourseId);

        if (!ignore) {
          setCourse(data);
          setCourseReviews(reviews);
        }

      } catch (err) {
        if (!ignore) {
          setCourseError("Could not load this sample course.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadCourseDetail();

    return () => {
      ignore = true;
    };
  }, []);

  function requireLogin() {
    if (isAuthenticated) return false;
    window.localStorage.setItem("crs_login_notice", "Please sign in to comment or like course reviews.");
    navigate("login");
    return true;
  }

  function handleAddCourse() {
    if (!course) return;
    addCourseToProfile(course);
    setCourseMessage("Course added to your profile.");
  }

  if (loading) {
    return (
      <AppShell active={active} profile={profile} isAuthenticated={isAuthenticated}>
        <section className="content narrow detail-stack">
          <p className="meta-line">Loading sample course detail...</p>
        </section>
      </AppShell>
    );
  }

  if (courseError || !course) {
    return (
      <AppShell active={active} profile={profile} isAuthenticated={isAuthenticated}>
        <section className="content narrow detail-stack">
          <p className="error-note">{courseError || "Course not found."}</p>
          <RouteButton className="btn primary" to="courses">
            Back to Courses
          </RouteButton>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell active={active} profile={profile} isAuthenticated={isAuthenticated}>
      <section className="content narrow detail-stack">
        <div className="back-row">
          <RouteButton to="courses">
            <Icon name="arrowLeft" />
            Back to Courses
          </RouteButton>
        </div>

        <article className="card detail-hero">
          <div className="detail-title-row">
            <div>
              <h2 className="detail-title">{course.title}</h2>
              <p className="detail-subtitle">
                {course.code} - Instructor: {course.professor}
              </p>
            </div>

            {isAuthenticated && (
              <button className={`btn ${enrolled ? "outline" : "primary"}`} disabled={enrolled} type="button" onClick={handleAddCourse}>
                {enrolled ? "Added to Profile" : "Add to My Courses"}
              </button>
            )}
          </div>

          {courseMessage && <p className="status-note inline detail-status">{courseMessage}</p>}

          <div className="detail-badges">
            <span className="star">
              <Icon name="star" />
            </span>
            <strong>{averageRating}</strong>
            <span>({reviewCount} student reviews)</span>
            <span className="badge">{course.credits}</span>
            <span className={`badge ${course.difficulty.toLowerCase()}`}>{course.difficulty}</span>
            <span className="badge">{course.semester}</span>
          </div>

          <p className="detail-location">
            <Icon name="location" />
            {course.location?.building || "Location not set"}, {course.location?.room || "Room not set"}
          </p>

          <p className="detail-desc">{course.description}</p>
        </article>

        <article className="card tabs-card">
          <div className={`tab-list ${!isAuthenticated ? "single" : ""}`}>
            <RouteButton className={visibleTab === "overview" ? "is-active" : ""} to="course-overview">
              <Icon name="book" />
              Overview
            </RouteButton>

            {isAuthenticated && (
              <>
                <RouteButton className={visibleTab === "pass-rate" ? "is-active" : ""} to="course-pass-rate">
                  <Icon name="star" />
                  Pass Rate History
                </RouteButton>
                <RouteButton className={visibleTab === "assignments" ? "is-active" : ""} to="course-assignments">
                  <Icon name="courses" />
                  Assignments
                </RouteButton>
              </>
            )}
          </div>

          <div className="tab-panel">
            {visibleTab === "overview" && <OverviewTab course={course} averageRating={averageRating} />}
            {visibleTab === "pass-rate" && <PassRateTab course={course} />}
            {visibleTab === "assignments" && <AssignmentsTab course={course} />}
          </div>
        </article>

        <article className="card reviews-card">
          <h3 className="section-title">Student Reviews</h3>
          <Reviews
            courseId={course._id || course.id}
            courseReviews={courseReviews}
            profile={profile}
            requireLogin={requireLogin}
            setCourseReviews={setCourseReviews}
          />
        </article>
      </section>
    </AppShell>
  );
}

function OverviewTab({ course, averageRating }) {
  const location = course.location || {};

  return (
    <>
      <section>
        <h3 className="section-title">Location Details</h3>
        <div className="info-callout">
          <strong>
            <Icon name="location" />
            {location.building || "Location not set"}, {location.room || "Room not set"}
          </strong>
          <p className="meta-line" style={{ fontSize: 14 }}>
            {location.description || "No location description has been added for this course yet."}
          </p>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h3 className="section-title">Course Information</h3>
        <div className="metric-grid">
          <Metric label="Semester" value={course.semester} />
          <Metric label="Credits" value={course.credits} />
          <Metric label="Difficulty" value={course.difficulty} />
          <Metric label="Average Rating" value={`${averageRating} / 5.0`} />
        </div>
      </section>
    </>
  );
}

// Simple visual pass-rate chart for prototype display
function PassRateTab({ course }) {
  const passRates = course.passRates || [];

  return (
    <>
      <h3 className="section-title">Pass Rate History</h3>

      {passRates.length === 0 ? (
        <p className="meta-line">No pass rate history has been added for this course yet.</p>
      ) : (
        <div className="chart">
          {passRates.map((item) => (
            <div className="bar" key={item.year}>
              <span style={{ height: item.rate * 2 }} />
              <strong>{item.rate}%</strong>
              <span>{item.year}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// Assignment summary tab for the selected course
function AssignmentsTab({ course }) {
  const assignments = course.assignments || [];

  return (
    <>
      <h3 className="section-title">Assignments</h3>

      {assignments.length === 0 ? (
        <p className="meta-line">No assignments have been added for this course yet.</p>
      ) : (
        <div className="assignment-list">
          {assignments.map((assignment) => (
            <Assignment
              key={`${assignment.title}-${assignment.due}`}
              title={assignment.title}
              due={assignment.due}
              state={assignment.state}
            />
          ))}
        </div>
      )}
    </>
  );
}

// Small reusable statistic card used in the course overview tab
function Metric({ label, value }) {
  return (
    <div className="card metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

// Single assignment item used in the assignment tab
function Assignment({ title, due, state }) {
  return (
    <div className="card assignment">
      <div>
        <strong>{title}</strong>
        <p className="meta-line" style={{ fontSize: 14 }}>
          {due}
        </p>
      </div>
      <span className={`badge ${state === "Completed" ? "done" : "info"}`}>{state}</span>
    </div>
  );
}

// Student review section
// Allows signed-in users to submit reviews and mark existing reviews as helpful
function Reviews({ courseId, courseReviews, profile, requireLogin, setCourseReviews }) {
  const [draft, setDraft] = useState({ rating: "5", term: "Spring 2026", text: "" });
  const [message, setMessage] = useState("");

  async function addReview(event) {
    event.preventDefault();

    if (requireLogin()) return;

    const text = draft.text.trim();

    if (!text) {
      setMessage("Please write a review before submitting.");
      return;
    }

    try {
      const newReview = await createCourseReview(courseId, {
        replierId: profile.id,
        name: profile.fullName || "Student",
        rating: Number(draft.rating),
        term: draft.term,
        text
      });

      setCourseReviews((currentReviews) => [newReview, ...currentReviews]);
      setDraft({ rating: "5", term: "Spring 2026", text: "" });
      setMessage("Review posted successfully.");
    } catch (err) {
      setMessage("Could not post review. Please try again.");
    }
  }

  async function markHelpful(targetReview) {
  if (requireLogin()) return;

  const reviewId = targetReview._id || targetReview.id;
  const userId = profile.id || profile.email;

  if (!reviewId || !userId) {
    setMessage("Could not update this review.");
    return;
  }

  try {
    const updatedReview = await markCourseReviewHelpful(reviewId, userId);

    setCourseReviews((currentReviews) =>
      currentReviews.map((review) =>
        (review._id || review.id) === (updatedReview._id || updatedReview.id)
          ? updatedReview
          : review
      )
    );

    setMessage("");
  } catch (err) {
    setMessage("Could not update helpful count.");
  }
}

  return (
    <>
      <form className="review-form" onSubmit={addReview}>
        <div className="review-form-row">
          <label className="field">
            <span>Rating</span>
            <select value={draft.rating} onChange={(event) => setDraft({ ...draft, rating: event.target.value })}>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </label>
          <label className="field">
            <span>Term</span>
            <input value={draft.term} onChange={(event) => setDraft({ ...draft, term: event.target.value })} />
          </label>
        </div>

        <label className="field">
          <span>Add Course Review</span>
          <textarea
            value={draft.text}
            placeholder="Share workload, exams, teaching quality, or tips for future students..."
            onChange={(event) => setDraft({ ...draft, text: event.target.value })}
          />
        </label>

        <div className="form-actions">
          <button className="btn primary" type="submit">
            Submit Review
          </button>
          {message && <p className={message.includes("successfully") ? "status-note inline" : "error-note inline"}>{message}</p>}
        </div>
      </form>

      <div className="review-list">
        {courseReviews.length === 0 && <p className="meta-line">No reviews yet. Be the first student to share feedback.</p>}

        {courseReviews.map((review) => (
          <div className="review" key={review._id || review.id}>
            {
              review.replierId?.avatar ?
              <span className={'avatar'}>
                <img alt={`${getInitials(review.replierId?.fullName)} avatar`} src={review.replierId?.avatar} />
              </span>
              :
              <span className="avatar">{getInitials(review.replierId?.fullName) || review.initials || getInitials(review.name)}</span>
            }
            <div>
              <h4>
                {review.replierId?.fullName || review.name} <span className="star">{"*".repeat(Number(review.rating) || 0)}</span>
              </h4>
              <p className="meta-line" style={{ fontSize: 14 }}>
                {review.term}
              </p>
              <p>{review.text}</p>
              <div className="card-actions" style={{ marginTop: 8 }}>
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => markHelpful(review)}
                >
                  <Icon name="thumbs" />
                  {review.helpfulBy?.includes(profile.id || profile.email) ? "Helpful marked" : "Helpful"} ({review.helpful || 0})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const campusLocations = [
  {
    id: "eng-401",
    name: "Engineering Lecture Theatre 401",
    building: "Faculty of Engineering, Building 401",
    room: "Lecture Theatre 401",
    type: "Classroom",
    address: "20 Symonds Street, Auckland Central",
    lat: -36.85294,
    lng: 174.76902,
    color: "#2b7fff",
    note: "Common engineering lecture area near Symonds Street."
  },
  {
    id: "science-303",
    name: "Science Centre Lecture Theatre",
    building: "Science Centre, Building 303",
    room: "Lecture theatre level",
    type: "Classroom",
    address: "38 Princes Street, Auckland Central",
    lat: -36.85141,
    lng: 174.76984,
    color: "#ad46ff",
    note: "Central science teaching building close to Albert Park."
  },
  {
    id: "oggbs",
    name: "Owen G Glenn Building",
    building: "Business School, Building 260",
    room: "Case rooms and lecture theatres",
    type: "Classroom",
    address: "12 Grafton Road, Auckland Central",
    lat: -36.85271,
    lng: 174.77239,
    color: "#0f9f8f",
    note: "Business School teaching spaces and group study areas."
  },
  {
    id: "kate-edger",
    name: "Kate Edger Information Commons",
    building: "Kate Edger Information Commons",
    room: "Study and computer labs",
    type: "Study",
    address: "2 Alfred Street, Auckland Central",
    lat: -36.85199,
    lng: 174.76845,
    color: "#ff6900",
    note: "Useful for study, printing, and between-class work."
  },
  {
    id: "general-library",
    name: "General Library",
    building: "University of Auckland Library",
    room: "Library study floors",
    type: "Library",
    address: "5 Alfred Street, Auckland Central",
    lat: -36.85147,
    lng: 174.76818,
    color: "#00a63e",
    note: "Main library and quiet study space near the city campus core."
  },
  {
    id: "clocktower",
    name: "ClockTower",
    building: "Old Arts Building",
    room: "University landmark",
    type: "Landmark",
    address: "22 Princes Street, Auckland Central",
    lat: -36.85072,
    lng: 174.77017,
    color: "#b7791f",
    note: "Useful landmark for orienting around the City Campus."
  },
  {
    id: "architecture",
    name: "Architecture and Planning",
    building: "Building 421",
    room: "Studios and critique rooms",
    type: "Classroom",
    address: "26 Symonds Street, Auckland Central",
    lat: -36.85373,
    lng: 174.76879,
    color: "#64748b",
    note: "Design studios and teaching rooms near Engineering."
  }
];

function getCampusMapQuery(location) {
  return `${location.name}, ${location.address}`;
}

function getMapPosition(location) {
  const longitudeRange = { min: 174.7678, max: 174.7728 };
  const latitudeRange = { min: -36.8541, max: -36.8503 };
  const left = 8 + ((location.lng - longitudeRange.min) / (longitudeRange.max - longitudeRange.min)) * 84;
  const top = 8 + ((latitudeRange.max - location.lat) / (latitudeRange.max - latitudeRange.min)) * 84;
  return { left: `${left}%`, top: `${top}%` };
}

function getGoogleDirectionsUrl(location) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${location.lat},${location.lng}`)}&travelmode=walking`;
}

function getGoogleSearchUrl(location) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getCampusMapQuery(location))}`;
}

// Campus map page
// Uses a privacy-safe schematic map with optional outbound Google Maps links
function MapPage({ profile, isAuthenticated }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(campusLocations[0].id);
  const filteredLocations = campusLocations.filter((location) =>
    [location.name, location.building, location.room, location.type, location.address]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase())
  );
  const selectedLocation = campusLocations.find((location) => location.id === selected) || campusLocations[0];

  return (
    <AppShell active="map" profile={profile} isAuthenticated={isAuthenticated}>
      <section className="content">
        <div className="map-layout card">
          <aside className="map-panel">
            <div className="map-panel-head">
              <h2>Campus Map</h2>
              <div className="toolbar-search" style={{ margin: 0 }}>
                <Icon name="search" />
                <input value={query} placeholder="Search locations..." onChange={(event) => setQuery(event.target.value)} />
              </div>
            </div>
            <div className="location-list">
              {filteredLocations.map((location) => (
                <button className={`card location-card ${selectedLocation.id === location.id ? "is-selected" : ""}`} key={location.id} type="button" onClick={() => setSelected(location.id)}>
                  <span className="pinbox" style={{ background: location.color }}>
                    <Icon name="location" />
                  </span>
                  <div>
                    <h3>{location.name}</h3>
                    <p className="meta-line" style={{ fontSize: 14 }}>
                      {location.building}
                    </p>
                    <p className="meta-line" style={{ fontSize: 12 }}>
                      {location.room}
                    </p>
                    <span className="badge dark">{location.type}</span>
                  </div>
                </button>
              ))}
              {filteredLocations.length === 0 && <p className="empty-state">No campus locations match your search.</p>}
            </div>
          </aside>
          <div className="map-canvas">
            <div className="demo-map-surface" aria-label="Schematic University of Auckland City Campus map">
              <span className="demo-map-park">Albert Park</span>
              <span className="demo-map-road road-horizontal">Alfred Street</span>
              <span className="demo-map-road road-vertical">Symonds Street</span>
              {campusLocations.map((location) => (
                <button
                  aria-label={`Select ${location.name}`}
                  className={`map-marker ${selectedLocation.id === location.id ? "is-selected" : ""}`}
                  key={location.id}
                  onClick={() => setSelected(location.id)}
                  style={{ ...getMapPosition(location), background: location.color }}
                  type="button"
                >
                  <Icon name="location" />
                </button>
              ))}
            </div>
            <div className="map-actions">
              <a className="btn primary" href={getGoogleDirectionsUrl(selectedLocation)} target="_blank" rel="noreferrer">
                <Icon name="arrowLeft" />
                Directions
              </a>
              <a className="btn outline" href={getGoogleSearchUrl(selectedLocation)} target="_blank" rel="noreferrer">
                Open in Google Maps
              </a>
            </div>
            <div className="map-info">
              <strong>{selectedLocation.name}</strong>
              <p>{selectedLocation.address}</p>
              <p>{selectedLocation.note}</p>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

// User profile page
// Shows account information, current courses, and logout controls
function ProfilePage({ alt = false, profile, enrolledCourses, removeCourseFromProfile, isAuthenticated, onLogout }) {
  const currentCourses = enrolledCourses.map(normalizeEnrollment);
  const totalCourses = currentCourses.length;

  return (
    <AppShell active={alt ? "profile-alt" : "profile"} profile={profile} isAuthenticated={isAuthenticated}>
      <section className="content narrow detail-stack">
        <article className="card profile-hero">
          <UserAvatar profile={profile} size="large" />
          <div className="profile-main">
            <div className="profile-topline">
              <div>
                <h2>{profile.fullName}</h2>
                <p className="meta-line">{profile.email}</p>
              </div>
              <div className="profile-session-actions">
                <span className={`session-status ${isAuthenticated ? "signed-in" : ""}`}>
                  {isAuthenticated ? "Signed in" : "Browsing as guest"}
                </span>
                {isAuthenticated ? (
                  <button className="btn outline" type="button" onClick={onLogout}>
                    Log Out
                  </button>
                ) : (
                  <RouteButton className="btn primary" to="login">
                    Sign In
                  </RouteButton>
                )}
              </div>
            </div>

            <div className="profile-stats">
              <div>
                <strong>{totalCourses}</strong>
                <span>Courses</span>
              </div>
              <div>
                <strong>0</strong>
                <span>Completed</span>
              </div>
              <div>
                <strong>{currentCourses.length}</strong>
                <span>In Progress</span>
              </div>
            </div>
          </div>
        </article>

        <div className="section-heading-row">
          <h2 className="section-title" style={{ fontSize: 24 }}>
            <Icon name="courses" />
            Current Courses
          </h2>
          <RouteButton className="btn outline" to="courses">
            Browse Courses
          </RouteButton>
        </div>

        {currentCourses.length === 0 ? (
          <div className="card empty-profile-state">
            <p>No current courses yet.</p>
            <RouteButton className="btn primary" to="courses">
              Add Courses
            </RouteButton>
          </div>
        ) : (
          <div className="history-list">
            {currentCourses.map((course) => (
              <article className="card history-card current-course-card" key={course.id}>
                <div className="history-head">
                  <span className="history-code">{course.code}</span>
                  <span className="badge info">{course.status}</span>
                </div>

                <h3 className="history-name">{course.title}</h3>

                <div className="history-meta">
                  <div>
                    <span>Semester</span>
                    <strong>{course.semester}</strong>
                  </div>
                  <div>
                    <span>Professor</span>
                    <strong>{course.professor}</strong>
                  </div>
                  <div>
                    <span>Source</span>
                    <strong>{course.source}</strong>
                  </div>
                </div>

                <div className="course-profile-actions">
                  <span className="source-line">Saved in this browser</span>
                  <button className="btn outline" type="button" onClick={() => removeCourseFromProfile(course.id)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}


// Password recovery notice page
// This static demo intentionally does not store passwords.
function AuthPage() {

  return (
    <main className="auth-page">
      <section className="auth-container">
        <AuthHeader title="Password Reset Not Needed" subtitle="This static portfolio demo does not store passwords." />
        <div className="auth-card auth-notice-card">
          <div className="auth-stack">
            <p className="helper-note">
              Return to sign in and use any fictional email and password. No credentials leave your browser.
            </p>
            <RouteButton className="btn primary full" to="login">
              Back to Sign In
            </RouteButton>
          </div>
        </div>
        <DemoAccounts />
      </section>
      <QuickRoutes active="forgot" />
    </main>
  );
}

// Login page for existing users
// Handles browser-local demo sign in without transmitting credentials
function LoginPage({ setIsAuthenticated, setProfile }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState(() => window.localStorage.getItem("crs_login_notice") || "");

  useEffect(() => {
    if (notice) window.localStorage.removeItem("crs_login_notice");
  }, [notice]);

  async function handleLogin(event) {
    event.preventDefault();
    if (!email.trim()) {
      setMessage("Please enter a fictional email address for the demo.");
      return;
    }
    if (!password.trim()) {
      setMessage("Please enter a password.");
      return;
    }
    

  try {
      const response = await login({
        email: email,
        password: password
      });
      setProfile(() => ({
      id: response.data.id,
      fullName: response.data.fullName,
      email: email,
      phoneNumber:response.data.phoneNumber,
      location:response.data.location,
      bio:response.data.bio,
      role: "Student",
      photo:response.data.photo
    }));
      window.localStorage.setItem("crs_remember_me", JSON.stringify(remember));
      setIsAuthenticated(true);
      window.localStorage.setItem("crs_login_notice", "Signed in to the browser-local demo.");
      navigate("profile");
    } catch (error) {
      setMessage("Could not start the local demo session.");
      return
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-container">
        <AuthHeader title="Course Review System" subtitle="Sign in to your account" />
        <PortfolioDemoNotice />
        <form className="auth-card login-card" onSubmit={handleLogin}>
          <RouteButton className="btn ghost back-link" to="home">
            <Icon name="arrowLeft" />
            Back to Home
          </RouteButton>
          <div className="auth-stack">
            <label className="field">
              <span>Email Address</span>
              <span className="auth-field-row">
                <Icon name="mail" />
                <input placeholder="demo@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
              </span>
            </label>
            <div>
              <div className="label-line">
                <span>Password</span>
                <RouteButton className="btn ghost link" to="forgot">
                  Forgot password?
                </RouteButton>
              </div>
              <span className="auth-field-row">
                <Icon name="lock" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} />
                <button className="eye" type="button" aria-label="Show password" onClick={() => setShowPassword(!showPassword)}>
                  <Icon name="eye" />
                </button>
              </span>
            </div>
            <label className="remember-row">
              <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
              Remember me
            </label>
            {notice && <p className="status-note">{notice}</p>}
            {message && <p className="error-note">{message}</p>}
            <button className="btn primary full" type="submit">
              Sign In
            </button>
          </div>
          <p className="auth-footer">
            Don&apos;t have an account?
            <RouteButton className="signup-link" to="signup">
              Sign up
            </RouteButton>
          </p>
        </form>
        <p className="terms">
          By signing in, you agree to our
          <br />
          <a className="link" href="#/terms">
            Terms of Service
          </a>{" "}
          and{" "}
          <a className="link" href="#/privacy">
            Privacy Policy
          </a>
        </p>
      </section>
      <QuickRoutes active="login" />
    </main>
  );
}

// Sign up page
// Includes validation for name, email, and password strength
function SignUpPage({ setIsAuthenticated, setProfile }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSignUp(event) {
    event.preventDefault();

    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    // Validate full name first
    if (!trimmedFullName) {
      setFieldErrors({ fullName: true });
      setMessage("Please enter your full name.");
      return;
    }

    // Validate email address
    if (!trimmedEmail) {
      setFieldErrors({ email: true });
      setMessage("Please enter your email address.");
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setFieldErrors({ email: true });
      setMessage("Please enter a valid email address.");
      return;
    }

    // Validate password rules
    if (!password) {
      setFieldErrors({ password: true });
      setMessage("Please enter your password.");
      return;
    }

    if (!passwordPattern.test(password)) {
      setFieldErrors({ password: true });
      setMessage("Password must be at least 6 characters and include uppercase, lowercase, and a number.");
      return;
    }

    // Confirm password must match
    if (!confirmPassword) {
      setFieldErrors({ confirmPassword: true });
      setMessage("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: true });
      setMessage("Passwords do not match.");
      return;
    }

    setFieldErrors({});
    setMessage("");

    
    
    try {
      const response = await register({
        fullName: trimmedFullName,
        email: trimmedEmail,
        password: password
      });
      setProfile((currentProfile) => ({
      id: response.data.id,
      fullName: trimmedFullName,
      email: trimmedEmail,
      phoneNumber:'',
      location:'',
      bio:'',
      role: "Student"
    }));
      setIsAuthenticated(true);
      window.localStorage.setItem("crs_login_notice", "Account created successfully.");
      navigate("profile");
    } catch (error) {
      return
    }

    
  }

  return (
    <main className="auth-page">
      <section className="auth-container">
        <AuthHeader title="Course Review System" subtitle="Create your account" />
        <PortfolioDemoNotice />
        <form className="auth-card login-card" onSubmit={handleSignUp}>
          <RouteButton className="btn ghost back-link" to="login">
            <Icon name="arrowLeft" />
            Back to Sign In
          </RouteButton>
          <div className="auth-stack">
            <label className="field">
              <span>Full Name</span>
              <span className={`auth-field-row ${fieldErrors.fullName ? "is-error" : ""}`}>
                <Icon name="user" />
                <input
                  value={fullName}
                  placeholder="John Smith"
                  onChange={(event) => {
                    setFullName(event.target.value);
                    setFieldErrors((currentErrors) => ({ ...currentErrors, fullName: false }));
                  }}
                />
              </span>
            </label>
            <label className="field">
              <span>Email Address</span>
              <span className={`auth-field-row ${fieldErrors.email ? "is-error" : ""}`}>
                <Icon name="mail" />
                <input
                  type="email"
                  value={email}
                  placeholder="john@email.com"
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setFieldErrors((currentErrors) => ({ ...currentErrors, email: false }));
                  }}
                />
              </span>
            </label>
            <label className="field">
              <span>Password</span>
              <span className={`auth-field-row ${fieldErrors.password ? "is-error" : ""}`}>
                <Icon name="lock" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Create a password"
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setFieldErrors((currentErrors) => ({ ...currentErrors, password: false }));
                  }}
                />
                <button className="eye" type="button" aria-label="Show password" onClick={() => setShowPassword(!showPassword)}>
                  <Icon name="eye" />
                </button>
              </span>
              <small className="password-hint">
                Use at least 6 characters with uppercase, lowercase, and a number.
              </small>
            </label>
            <label className="field">
              <span>Confirm Password</span>
              <span className={`auth-field-row ${fieldErrors.confirmPassword ? "is-error" : ""}`}>
                <Icon name="lock" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  placeholder="Confirm your password"
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setFieldErrors((currentErrors) => ({ ...currentErrors, confirmPassword: false }));
                  }}
                />
              </span>
            </label>
            {message && <p className="error-note">{message}</p>}
            <button className="btn primary full" type="submit">
              Sign Up
            </button>
          </div>
          <p className="auth-footer">
            Already have an account?
            <RouteButton className="link" to="login">
              Sign in
            </RouteButton>
          </p>
        </form>
        <p className="terms">
          By signing up, you agree to our
          <br />
          <a className="link" href="#/terms">
            Terms of Service
          </a>{" "}
          and{" "}
          <a className="link" href="#/privacy">
            Privacy Policy
          </a>
        </p>
      </section>
      <QuickRoutes active="signup" />
    </main>
  );
}

// Terms of Service page data
// Content sections are passed into the shared PolicyPage layout
function TermsPage() {
  const sections = [
    {
      number: "01",
      title: "Use of the platform",
      text: "This platform is a student course review and discussion prototype. Users should use it respectfully and only share appropriate course-related information."
    },
    {
      number: "02",
      title: "User content",
      text: "Users are responsible for the reviews, posts, replies, and profile information they submit. Content should not include harmful, offensive, or private information about other people."
    },
    {
      number: "03",
      title: "Accuracy of information",
      text: "Course reviews and forum posts are based on student opinions. They may not always be complete or accurate, so users should check official university sources for final course information."
    },
    {
      number: "04",
      title: "Account access",
      text: "This public portfolio build is a browser-local demonstration. Use fictional account details only; no password is stored or sent to a server."
    }
  ];

  return <PolicyPage type="terms" title="Terms of Service" subtitle="Basic terms for using the Course Review System" badge="Student platform agreement" sections={sections} />;
}

// Privacy Policy page data
// Uses the same reusable policy layout component
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

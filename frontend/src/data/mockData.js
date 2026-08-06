export const courses = [
  {
    code: "CS 202",
    title: "Data Structures and Algorithms",
    professor: "Professor Zhang",
    difficulty: "Hard",
    credits: "4 Credits",
    rating: "4.8",
    reviews: "124",
    semester: "Fall 2025",
    description:
      "This course provides an in-depth exploration of fundamental data structures and algorithm design and analysis methods, including linear lists, trees, graphs, sorting, searching, and dynamic programming."
  },
  {
    code: "CS 301",
    title: "Computer Networks",
    professor: "Professor Li",
    difficulty: "Medium",
    credits: "3 Credits",
    rating: "4.6",
    reviews: "98",
    semester: "Fall 2025",
    description:
      "A systematic introduction to the basic principles, architecture, protocols, and applications of computer networks."
  },
  {
    code: "CS 330",
    title: "Operating Systems",
    professor: "Professor Wang",
    difficulty: "Hard",
    credits: "4 Credits",
    rating: "4.7",
    reviews: "156",
    semester: "Spring 2025",
    description:
      "Covers basic concepts, principles, and implementation techniques of operating systems including processes, memory, files, and scheduling."
  },
  {
    code: "WEB 210",
    title: "Web Development",
    professor: "Professor Chen",
    difficulty: "Medium",
    credits: "3 Credits",
    rating: "4.5",
    reviews: "87",
    semester: "Fall 2025",
    description:
      "A comprehensive introduction to modern web application development technologies, including HTML, CSS, JavaScript, React, backend development, and database design."
  },
  {
    code: "CS 450",
    title: "Introduction to Machine Learning",
    professor: "Professor Liu",
    difficulty: "Hard",
    credits: "4 Credits",
    rating: "4.9",
    reviews: "203",
    semester: "Spring 2025",
    description: "Introduces core concepts and common algorithms of machine learning, with practical projects using Python."
  },
  {
    code: "CS 310",
    title: "Software Engineering",
    professor: "Professor Zhao",
    difficulty: "Easy",
    credits: "3 Credits",
    rating: "4.3",
    reviews: "76",
    semester: "Fall 2025",
    description:
      "Explains the complete software development lifecycle, including requirements analysis, system design, coding, testing, and maintenance."
  }
];

export const posts = [
  {
    initials: "SJ",
    name: "Sarah Johnson",
    time: "2 hours ago",
    body: "Just finished my algorithm assignment. The dynamic programming section was challenging but so rewarding. Anyone else working on this?",
    tags: ["study", "algorithms", "computer-science"],
    counts: [45, 2],
    replies: [
      {
        initials: "AL",
        name: "Alex Lee",
        time: "1 hour ago",
        body: "I am on the same part. The recurrence table finally clicked after drawing the states first."
      },
      {
        initials: "EW",
        name: "Emily Wong",
        time: "35 minutes ago",
        body: "Happy to review solutions later today. The memoization examples from lecture helped a lot."
      }
    ]
  },
  {
    initials: "MC",
    name: "Mike Chen",
    time: "5 hours ago",
    body: "Discovered an amazing coffee shop near campus. Perfect for study sessions. The ambience is great and they have excellent Wi-Fi.",
    tags: ["campus-life", "study-spot", "coffee"],
    counts: [89, 1],
    replies: [
      {
        initials: "DK",
        name: "David Kim",
        time: "4 hours ago",
        body: "Is it quiet enough for online meetings? I need a new place between afternoon classes."
      }
    ]
  },
  {
    initials: "EW",
    name: "Emily Wong",
    time: "1 day ago",
    body: "Looking for study partners for the upcoming Machine Learning exam. Anyone interested in forming a study group? We can meet at the library this weekend.",
    tags: ["study-group", "machine-learning", "exam-prep"],
    counts: [23, 0],
    replies: []
  },
  {
    initials: "AR",
    name: "Alex Rivera",
    time: "1 day ago",
    body: "The campus spring festival is next week. There will be food trucks, live music, and club booths. Do not miss it.",
    tags: ["campus-events", "festival", "fun"],
    counts: [156, 0],
    replies: []
  },
  {
    initials: "JL",
    name: "Jessica Lee",
    time: "2 days ago",
    body: "Tips for managing stress during finals: sleep enough, take regular breaks, exercise, and stay hydrated.",
    tags: ["mental-health", "finals", "self-care"],
    counts: [124, 0],
    replies: []
  },
  {
    initials: "DK",
    name: "David Kim",
    time: "2 days ago",
    body: "Just landed my first internship. The interview process was intense but worth it. Happy to share my experience and tips.",
    tags: ["internship", "career", "interview-tips"],
    counts: [178, 0],
    replies: []
  },
  {
    initials: "LP",
    name: "Lisa Park",
    time: "3 days ago",
    body: "Found the best late-night study playlist. Really helps me focus during long coding sessions.",
    tags: ["productivity", "music", "coding"],
    counts: [67, 0],
    replies: []
  },
  {
    initials: "TA",
    name: "Tom Anderson",
    time: "3 days ago",
    body: "The new computer lab in Building C is amazing. Brand new equipment, comfortable chairs, and plenty of space.",
    tags: ["campus-facilities", "study-spots", "tech"],
    counts: [92, 0],
    replies: []
  }
];

export const defaultPostReplies = posts.reduce((lookup, post) => {
  lookup[post.body] = post.replies || [];
  return lookup;
}, {});

export const defaultCourseReviews = [
  {
    id: "review-1",
    initials: "J",
    name: "John Smith",
    term: "Fall 2024 - January 15, 2025",
    rating: 5,
    text:
      "Professor Zhang explains concepts very clearly and the course content progresses logically. The workload is reasonable and helps solidify the material. Weekly labs are challenging but extremely rewarding.",
    helpful: 12,
    createdAt: 1736899200000
  },
  {
    id: "review-2",
    initials: "E",
    name: "Emily Chen",
    term: "Fall 2024 - January 12, 2025",
    rating: 4,
    text:
      "Course is quite difficult and requires significant time investment. Recommend previewing material and reviewing promptly after class. Professor is very responsible and office hours are helpful.",
    helpful: 9,
    createdAt: 1736640000000
  },
  {
    id: "review-3",
    initials: "M",
    name: "Michael Johnson",
    term: "Fall 2024 - January 10, 2025",
    rating: 5,
    text: "This course gave me a deep understanding of algorithms. The final project was interesting with flexible topic selection. Only downside is the exam difficulty - prepare well.",
    helpful: 7,
    createdAt: 1736467200000
  }
];

export const defaultProfile = {
  fullName: "John Doe",
  email: "john@email.com",
  phone: "+1 (555) 123-4567",
  location: "New York, USA",
  bio: "Tell us about yourself...",
  role: "Student",
  photo: ""
};

export const demoAccounts = {
  "john@email.com": {
    question: "What was the name of your first pet?",
    answer: "fluffy"
  },
  "student@email.com": {
    question: "What city were you born in?",
    answer: "boston"
  }
};


const Course = require('../schema/course');
const DiscussionPost = require('../schema/discussionSchema');
const { connectDatabase, disconnectDatabase } = require('../config/db');

// EN: Initial course data mirrors the current frontend course cards.
const courses = [
  {
    code: 'CS 202',
    title: 'Data Structures and Algorithms',
    professor: 'Professor Zhang',
    difficulty: 'Hard',
    credits: '4 Credits',
    rating: '4.8',
    reviews: '124',
    semester: 'Fall 2025',
    description:
      'This course provides an in-depth exploration of fundamental data structures and algorithm design and analysis methods, including linear lists, trees, graphs, sorting, searching, and dynamic programming.',
    reviewList: [
      {
        initials: 'J',
        name: 'John Smith',
        term: 'Fall 2024 - January 15, 2025',
        rating: 5,
        text:
          'Professor Zhang explains concepts very clearly and the course content progresses logically. The workload is reasonable and helps solidify the material.',
        helpful: 12,
        createdAt: new Date(1736899200000)
      },
      {
        initials: 'E',
        name: 'Emily Chen',
        term: 'Fall 2024 - January 12, 2025',
        rating: 4,
        text: 'Course is quite difficult and requires significant time investment. Office hours are helpful.',
        helpful: 9,
        createdAt: new Date(1736640000000)
      }
    ]
  },
  {
    code: 'CS 301',
    title: 'Computer Networks',
    professor: 'Professor Li',
    difficulty: 'Medium',
    credits: '3 Credits',
    rating: '4.6',
    reviews: '98',
    semester: 'Fall 2025',
    description: 'A systematic introduction to the basic principles, architecture, protocols, and applications of computer networks.'
  },
  {
    code: 'CS 330',
    title: 'Operating Systems',
    professor: 'Professor Wang',
    difficulty: 'Hard',
    credits: '4 Credits',
    rating: '4.7',
    reviews: '156',
    semester: 'Spring 2025',
    description: 'Covers basic concepts, principles, and implementation techniques of operating systems including processes, memory, files, and scheduling.'
  },
  {
    code: 'WEB 210',
    title: 'Web Development',
    professor: 'Professor Chen',
    difficulty: 'Medium',
    credits: '3 Credits',
    rating: '4.5',
    reviews: '87',
    semester: 'Fall 2025',
    description:
      'A comprehensive introduction to modern web application development technologies, including HTML, CSS, JavaScript, React, backend development, and database design.'
  }
];

// EN: Initial discussion data mirrors the current frontend discussion feed.
const discussionPosts = [
  {
    initials: 'SJ',
    name: 'Sarah Johnson',
    time: '2 hours ago',
    body: 'Just finished my algorithm assignment. The dynamic programming section was challenging but so rewarding. Anyone else working on this?',
    tags: ['study', 'algorithms', 'computer-science'],
    counts: [45, 2],
    replies: [
      {
        initials: 'AL',
        name: 'Alex Lee',
        time: '1 hour ago',
        body: 'I am on the same part. The recurrence table finally clicked after drawing the states first.'
      },
      {
        initials: 'EW',
        name: 'Emily Wong',
        time: '35 minutes ago',
        body: 'Happy to review solutions later today. The memoization examples from lecture helped a lot.'
      }
    ]
  },
  {
    initials: 'MC',
    name: 'Mike Chen',
    time: '5 hours ago',
    body: 'Discovered an amazing coffee shop near campus. Perfect for study sessions.',
    tags: ['campus-life', 'study-spot', 'coffee'],
    counts: [89, 1],
    replies: [
      {
        initials: 'DK',
        name: 'David Kim',
        time: '4 hours ago',
        body: 'Is it quiet enough for online meetings? I need a new place between afternoon classes.'
      }
    ]
  }
];

// EN: Upsert by stable keys so running the seed twice does not duplicate default records.
async function seedCourses() {
  for (const course of courses) {
    await Course.updateOne({ code: course.code }, { $setOnInsert: course }, { upsert: true });
  }
}

// EN: Upsert discussion posts by body because the current frontend mock data has no post id.
async function seedDiscussionPosts() {
  for (const post of discussionPosts) {
    await DiscussionPost.updateOne({ body: post.body }, { $setOnInsert: post }, { upsert: true });
  }
}

async function runSeed() {
  try {
    await connectDatabase();
    await seedCourses();
    await seedDiscussionPosts();
    console.log('Seed completed: courses and discussion posts are ready.');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

runSeed();


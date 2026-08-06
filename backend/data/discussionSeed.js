const discussionSeed = [
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
  },
  {
    initials: 'AR',
    name: 'Ava Roberts',
    time: '1 day ago',
    body: 'Does anyone have tips for keeping up with weekly readings without falling behind after labs?',
    tags: ['study', 'reading', 'time-management', 'labs'],
    counts: [21, 1],
    replies: [
      {
        initials: 'SJ',
        name: 'Sarah Johnson',
        time: '22 hours ago',
        body: 'I block one hour right after each lecture while the material is still fresh.'
      }
    ]
  },
  {
    initials: 'JL',
    name: 'Jason Liu',
    time: '2 days ago',
    body: 'Our group project team is trying to choose between React state only or adding a small backend feature. What worked well for others?',
    tags: ['group-project', 'react', 'backend', 'teamwork'],
    counts: [54, 3],
    replies: [
      {
        initials: 'MC',
        name: 'Mike Chen',
        time: '2 days ago',
        body: 'Keep the first version simple, then add the backend once your flow is stable.'
      },
      {
        initials: 'EW',
        name: 'Emily Wong',
        time: '1 day ago',
        body: 'Write down responsibilities early. It saves a lot of merge confusion later.'
      },
      {
        initials: 'DK',
        name: 'David Kim',
        time: '1 day ago',
        body: 'We used issues to track tasks and it made meetings shorter.'
      }
    ]
  },
  {
    initials: 'NP',
    name: 'Nina Patel',
    time: '2 days ago',
    body: 'The database lecture finally made indexes make sense. Any good practice exercises for MongoDB queries?',
    tags: ['database', 'mongodb', 'practice', 'backend'],
    counts: [38, 1],
    replies: [
      {
        initials: 'AL',
        name: 'Alex Lee',
        time: '2 days ago',
        body: 'Try writing filters for your own course review data. It makes the examples less abstract.'
      }
    ]
  },
  {
    initials: 'DK',
    name: 'David Kim',
    time: '3 days ago',
    body: 'Reminder that the assignment rubric gives marks for clear testing notes. Do not leave them until the last minute.',
    tags: ['assignment', 'testing', 'rubric', 'deadline'],
    counts: [67, 0],
    replies: []
  },
  {
    initials: 'LT',
    name: 'Lily Thompson',
    time: '3 days ago',
    body: 'I am reviewing authentication flows tonight. Happy to compare notes on JWT login and register routes.',
    tags: ['authentication', 'jwt', 'backend', 'study'],
    counts: [29, 2],
    replies: [
      {
        initials: 'NP',
        name: 'Nina Patel',
        time: '3 days ago',
        body: 'I can join after 7pm. I want to check password hashing too.'
      },
      {
        initials: 'JL',
        name: 'Jason Liu',
        time: '2 days ago',
        body: 'Please share notes if you cover token expiry.'
      }
    ]
  },
  {
    initials: 'OM',
    name: 'Omar Malik',
    time: '4 days ago',
    body: 'Which campus spaces are open late during exam week? I need somewhere with reliable Wi-Fi.',
    tags: ['campus-life', 'wifi', 'exam', 'study-spot'],
    counts: [41, 1],
    replies: [
      {
        initials: 'MC',
        name: 'Mike Chen',
        time: '4 days ago',
        body: 'Library level 2 has been the most reliable for me.'
      }
    ]
  },
  {
    initials: 'HB',
    name: 'Hannah Brown',
    time: '5 days ago',
    body: 'For anyone preparing presentations, practicing with a timer helped our group cut five minutes without losing important points.',
    tags: ['presentation', 'group-project', 'communication', 'teamwork'],
    counts: [25, 0],
    replies: []
  },
  {
    initials: 'ZT',
    name: 'Zoe Taylor',
    time: '6 days ago',
    body: 'I made a checklist for final project demos: login, create post, filter tags, and explain one backend route clearly.',
    tags: ['demo', 'group-project', 'frontend', 'backend', 'checklist'],
    counts: [73, 2],
    replies: [
      {
        initials: 'AR',
        name: 'Ava Roberts',
        time: '6 days ago',
        body: 'Adding error cases to the checklist is a good idea too.'
      },
      {
        initials: 'LT',
        name: 'Lily Thompson',
        time: '5 days ago',
        body: 'This is exactly what our team needed. Thanks!'
      }
    ]
  },
  {
    initials: 'EC',
    name: 'Emily Carter',
    time: '1 week ago',
    body: 'We used MongoDB Atlas for our deployed backend. Checking collection names early saved us from debugging empty pages later.',
    tags: ['deployment', 'mongodb', 'backend', 'debugging'],
    counts: [58, 2],
    replies: [
      {
        initials: 'NP',
        name: 'Nina Patel',
        time: '1 week ago',
        body: 'This helped our team too. The database name in the connection string matters.'
      },
      {
        initials: 'ZT',
        name: 'Zoe Taylor',
        time: '1 week ago',
        body: 'Good reminder before the final demo.'
      }
    ]
  },
  {
    initials: 'RW',
    name: 'Ryan Walker',
    time: '1 week ago',
    body: 'Does anyone have a good workflow for reviewing pull requests before merging to main?',
    tags: ['git', 'pull-request', 'teamwork', 'code-review'],
    counts: [34, 1],
    replies: [
      {
        initials: 'HB',
        name: 'Hannah Brown',
        time: '1 week ago',
        body: 'Small commits and screenshots made our reviews much easier.'
      }
    ]
  },
  {
    initials: 'IS',
    name: 'Isabella Scott',
    time: '8 days ago',
    body: 'I am comparing course workload comments across reviews. It would be useful to tag heavy lab courses separately.',
    tags: ['course-review', 'workload', 'labs', 'planning'],
    counts: [27, 0],
    replies: []
  },
  {
    initials: 'TN',
    name: 'Tom Nguyen',
    time: '8 days ago',
    body: 'Our frontend build passed locally but failed after deployment because of an environment variable typo.',
    tags: ['frontend', 'deployment', 'environment', 'debugging'],
    counts: [49, 2],
    replies: [
      {
        initials: 'EC',
        name: 'Emily Carter',
        time: '8 days ago',
        body: 'Vite environment variables are easy to miss because they need the VITE_ prefix.'
      },
      {
        initials: 'JL',
        name: 'Jason Liu',
        time: '7 days ago',
        body: 'We added a short deployment checklist after hitting the same issue.'
      }
    ]
  },
  {
    initials: 'PS',
    name: 'Priya Singh',
    time: '9 days ago',
    body: 'What is the best way to explain automated backend tests in the project presentation?',
    tags: ['testing', 'backend', 'presentation', 'vitest'],
    counts: [44, 1],
    replies: [
      {
        initials: 'DK',
        name: 'David Kim',
        time: '9 days ago',
        body: 'Show one API test, then explain how the memory database keeps it isolated.'
      }
    ]
  },
  {
    initials: 'MR',
    name: 'Maya Roberts',
    time: '10 days ago',
    body: 'I found that writing down user tasks first made the interface decisions much easier.',
    tags: ['design-thinking', 'user-research', 'frontend', 'planning'],
    counts: [31, 0],
    replies: []
  },
  {
    initials: 'LC',
    name: 'Leo Chen',
    time: '10 days ago',
    body: 'The map feature is useful when course cards include real campus buildings instead of generic room names.',
    tags: ['map', 'campus', 'courses', 'location'],
    counts: [22, 1],
    replies: [
      {
        initials: 'OM',
        name: 'Omar Malik',
        time: '10 days ago',
        body: 'Especially helpful for first-year students trying to plan back-to-back lectures.'
      }
    ]
  },
  {
    initials: 'AK',
    name: 'Aisha Khan',
    time: '11 days ago',
    body: 'For exams, I group study notes by topic and then use tags to find related discussions quickly.',
    tags: ['exam', 'study', 'tags', 'time-management'],
    counts: [36, 1],
    replies: [
      {
        initials: 'AR',
        name: 'Ava Roberts',
        time: '11 days ago',
        body: 'This is a good use case for multi-tag filtering.'
      }
    ]
  }
];

module.exports = discussionSeed;


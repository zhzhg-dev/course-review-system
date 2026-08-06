const DEFAULT_LOCATION = {
  building: 'City Campus',
  room: 'Room not confirmed',
  description:
    'This course is listed in the University of Auckland MIT 2026 course selection advice. Specific room details should be checked in SSO or Canvas.'
};

function technicalAssignments() {
  return [
    { title: 'Technical coursework', due: 'Due date not confirmed', state: 'Upcoming' },
    { title: 'Project or applied task', due: 'Due date not confirmed', state: 'Upcoming' },
    { title: 'Test or final assessment', due: 'Due date not confirmed', state: 'Upcoming' }
  ];
}

function professionalAssignments() {
  return [
    { title: 'Case study or reflection', due: 'Due date not confirmed', state: 'Upcoming' },
    { title: 'Report or applied analysis', due: 'Due date not confirmed', state: 'Upcoming' },
    { title: 'Presentation or final task', due: 'Due date not confirmed', state: 'Upcoming' }
  ];
}

function makeCourse({
  code,
  title,
  semester,
  description,
  difficulty = 'Medium',
  professor = 'Instructor not confirmed',
  location = DEFAULT_LOCATION,
  passRates = [],
  assignments = technicalAssignments()
}) {
  return {
    code,
    title,
    professor,
    difficulty,
    credits: '15 Points',
    semester,
    description,
    location,
    passRates,
    assignments
  };
}

const courseSeed = [
  // Technical courses - Semester One
  makeCourse({
    code: 'COMPSCI 702',
    title: 'Security for Smart Devices',
    semester: 'Semester One 2026',
    difficulty: 'Hard',
    description:
      'Covers security features for smart device platforms, with a focus on Android and iOS security, reverse engineering, secure app development, and mobile security practice.',
    assignments: [
      { title: 'Smart device security coursework', due: 'Due date not confirmed', state: 'Upcoming' },
      { title: 'Android security project', due: 'Due date not confirmed', state: 'Upcoming' },
      { title: 'Security test or presentation', due: 'Due date not confirmed', state: 'Upcoming' }
    ]
  }),
  makeCourse({
    code: 'COMPSCI 703',
    title: 'Generalising Artificial Intelligence',
    semester: 'Semester One 2026',
    difficulty: 'Hard',
    description:
      'Explores Artificial General Intelligence concepts, including reasoning, planning, explanation, knowledge representation, natural language understanding, and research-oriented AI systems.',
    assignments: [
      { title: 'AGI reading and analysis', due: 'Due date not confirmed', state: 'Upcoming' },
      { title: 'Individual AI research project', due: 'Due date not confirmed', state: 'Upcoming' },
      { title: 'AI presentation or assessment', due: 'Due date not confirmed', state: 'Upcoming' }
    ]
  }),
  makeCourse({
    code: 'COMPSCI 704',
    title: 'Fundamentals in Human-Computer Interaction',
    semester: 'Semester One 2026',
    difficulty: 'Medium',
    description:
      'Introduces human behaviour, user expectations, interface design, user-centred design, usability evaluation, and the design and implementation of interactive systems.',
    assignments: [
      { title: 'Interface evaluation task', due: 'Due date not confirmed', state: 'Upcoming' },
      { title: 'User-centred design work', due: 'Due date not confirmed', state: 'Upcoming' },
      { title: 'HCI test or final assessment', due: 'Due date not confirmed', state: 'Upcoming' }
    ]
  }),
  makeCourse({
    code: 'COMPSCI 711',
    title: 'Parallel and Distributed Computing',
    semester: 'Semester One 2026',
    difficulty: 'Hard',
    description:
      'Covers concepts and techniques for parallel and distributed computing, including concurrency, communication, scalability, and performance in modern computing systems.'
  }),
  makeCourse({
    code: 'COMPSCI 720',
    title: 'Advanced Design and Analysis of Algorithms',
    semester: 'Semester One 2026',
    difficulty: 'Hard',
    description:
      'Studies advanced algorithm design and analysis, including correctness, efficiency, algorithmic paradigms, complexity, and techniques for solving difficult computational problems.'
  }),
  makeCourse({
    code: 'COMPSCI 721',
    title: 'Randomised Algorithms and Probabilistic Methods',
    semester: 'Semester One 2026',
    difficulty: 'Hard',
    description:
      'Introduces randomised algorithms and probabilistic methods for algorithm design and analysis, with attention to probability, performance, and correctness.'
  }),
  makeCourse({
    code: 'COMPSCI 727',
    title: 'Cryptographic Management',
    semester: 'Semester One 2026',
    difficulty: 'Hard',
    description:
      'Covers cryptographic concepts and management issues, including the use, deployment, and governance of cryptographic techniques in secure systems.'
  }),
  makeCourse({
    code: 'COMPSCI 732',
    title: 'Software Tools and Techniques',
    professor: 'Andrew Meads',
    semester: 'Semester One 2026',
    difficulty: 'Medium',
    description:
      'A practical software development course focused on tools and techniques for building modern web-based software systems. The course uses the MERN stack, including MongoDB, Express, React and Node.js, and also introduces development tools such as GitHub Actions and Docker.',
    location: {
      building: 'City Campus',
      room: 'Room not confirmed',
      description:
        'The official course outline lists this course as offered on City Campus in Semester One. Specific room details should be checked in SSO or Canvas.'
    },
    passRates: [
      { year: 2021, rate: 91 },
      { year: 2022, rate: 93 },
      { year: 2023, rate: 94 },
      { year: 2024, rate: 95 },
      { year: 2025, rate: 96 }
    ],
    assignments: [
      { title: 'Individual Technology Tutorial', due: 'Due date not confirmed', state: 'Completed' },
      { title: 'Team Full-stack Project', due: 'Due date not confirmed', state: 'In Progress' },
      { title: 'Course Test', due: 'Due date not confirmed', state: 'Upcoming' }
    ]
  }),
  makeCourse({
    code: 'COMPSCI 751',
    title: 'Advanced Topics in Database Systems',
    semester: 'Semester One 2026',
    difficulty: 'Medium',
    description:
      'Covers advanced database systems topics such as data modelling, relational databases, SQL, relational algebra, normalisation, transactions, storage, retrieval, and distributed data.'
  }),
  makeCourse({
    code: 'COMPSCI 752',
    title: 'Big Data Management',
    semester: 'Semester One 2026',
    difficulty: 'Hard',
    description:
      'Focuses on modelling, managing, querying, integrating, and analysing large-scale data in distributed and heterogeneous environments.'
  }),
  makeCourse({
    code: 'COMPSCI 760',
    title: 'Advanced Topics in Machine Learning',
    semester: 'Semester One and Semester Two 2026',
    difficulty: 'Hard',
    description:
      'Covers advanced machine learning topics, with attention to modern algorithms, model design, evaluation, and applications in data-rich environments.'
  }),
  makeCourse({
    code: 'COMPSCI 762',
    title: 'Foundations of Machine Learning',
    semester: 'Semester One 2026',
    difficulty: 'Hard',
    description:
      'Introduces foundations of machine learning, including learning models from data, supervised and unsupervised learning, model evaluation, and practical challenges in machine learning.'
  }),
  makeCourse({
    code: 'COMPSCI 765',
    title: 'Modelling Minds',
    semester: 'Semester One 2026',
    difficulty: 'Medium',
    description:
      'Explores computational and cognitive approaches to modelling minds, intelligence, behaviour, reasoning, learning, and related AI concepts.'
  }),
  makeCourse({
    code: 'COMPSCI 767',
    title: 'Intelligent Software Agents',
    semester: 'Semester One 2026',
    difficulty: 'Medium',
    description:
      'Studies intelligent software agents, including autonomous behaviour, agent architectures, decision-making, coordination, and agent-based systems.'
  }),
  makeCourse({
    code: 'COMPSCI 773',
    title: 'Intelligent Vision Systems',
    semester: 'Semester One 2026',
    difficulty: 'Hard',
    description:
      'Covers intelligent vision systems and computer vision techniques for analysing, interpreting, and using visual information in software systems.'
  }),
  makeCourse({
    code: 'COMPSYS 701',
    title: 'Advanced Digital Systems Design',
    semester: 'Semester One 2026',
    difficulty: 'Hard',
    description:
      'Covers advanced digital systems design, including hardware-oriented computing concepts, system design, implementation, and verification.'
  }),
  makeCourse({
    code: 'COMPSYS 723',
    title: 'Embedded Systems Design',
    semester: 'Semester One 2026',
    difficulty: 'Hard',
    description:
      'Focuses on embedded systems design, including hardware-software interaction, embedded architecture, real-time considerations, and system implementation.'
  }),
  makeCourse({
    code: 'ELECTENG 722',
    title: 'Modern Control Systems',
    semester: 'Semester One 2026',
    difficulty: 'Hard',
    description:
      'Covers modern control systems, including modelling, analysis, design, and implementation of control methods for engineering systems.'
  }),
  makeCourse({
    code: 'ELECTENG 733',
    title: 'Digital Signal Processing',
    semester: 'Semester One 2026',
    difficulty: 'Hard',
    description:
      'Introduces digital signal processing concepts and techniques, including signal analysis, filtering, frequency-domain methods, and DSP applications.'
  }),
  makeCourse({
    code: 'INFOSYS 727',
    title: 'Advanced Information Security',
    semester: 'Semester One 2026',
    difficulty: 'Medium',
    description:
      'Covers information security in modern information systems, including risk, governance, security controls, organisational security, and technical security concepts.'
  }),
  makeCourse({
    code: 'STATS 707',
    title: 'Computational Introduction to Statistics',
    semester: 'Semester One 2026',
    difficulty: 'Hard',
    description:
      'Introduces computational approaches to statistics, including statistical computing, simulation, data analysis, and practical quantitative methods.'
  }),
  makeCourse({
    code: 'STATS 762',
    title: 'Regression for Data Science',
    semester: 'Semester One 2026',
    difficulty: 'Hard',
    description:
      'Covers regression methods for data science, including statistical modelling, model interpretation, prediction, and applied analysis.'
  }),

  // Technical courses - Semester Two
  makeCourse({
    code: 'COMPSCI 701',
    title: 'Creating Maintainable Software',
    semester: 'Semester Two 2026',
    difficulty: 'Medium',
    description:
      'Explores principles and practices for creating maintainable software systems, including software quality, maintainability, design decisions, and long-term project evolution.'
  }),
  makeCourse({
    code: 'COMPSCI 705',
    title: 'Advanced Topics in Human Computer Interaction',
    semester: 'Semester Two 2026',
    difficulty: 'Medium',
    description:
      'Focuses on recent research in Human Computer Interaction, including advanced evaluation methods, research design, interaction techniques, and HCI research project work.'
  }),
  makeCourse({
    code: 'COMPSCI 725',
    title: 'Usable Security and Privacy Engineering',
    semester: 'Semester Two 2026',
    difficulty: 'Hard',
    description:
      'Examines usable security and privacy engineering, with a focus on designing security and privacy systems that people can understand and use effectively.'
  }),
  makeCourse({
    code: 'COMPSCI 726',
    title: 'Network Defence and Countermeasures',
    semester: 'Semester Two 2026',
    difficulty: 'Hard',
    description:
      'Covers network defence, countermeasures, attack detection, security monitoring, and practical approaches for protecting internal and external networks.'
  }),
  makeCourse({
    code: 'COMPSCI 734',
    title: 'Web, Mobile, and Enterprise Computing',
    semester: 'Semester Two 2026',
    difficulty: 'Medium',
    description:
      'Covers web, mobile, and enterprise computing, including modern application architecture, scalable systems, integration, and enterprise software development.'
  }),
  makeCourse({
    code: 'COMPSCI 742',
    title: 'Advanced Internet: Global Data Communications',
    semester: 'Semester Two 2026',
    difficulty: 'Hard',
    description:
      'Studies advanced internet technologies and global data communications, including network protocols, internet architecture, and large-scale communication systems.'
  }),
  makeCourse({
    code: 'COMPSCI 750',
    title: 'Computational Complexity',
    semester: 'Semester Two 2026',
    difficulty: 'Hard',
    description:
      'Introduces computational complexity theory, including complexity classes, reductions, hardness, tractability, and limits of efficient computation.'
  }),
  makeCourse({
    code: 'COMPSCI 753',
    title: 'Algorithms for Massive Data',
    semester: 'Semester Two 2026',
    difficulty: 'Hard',
    description:
      'Covers algorithms and data structures for massive datasets, including scalable methods for processing, storing, and analysing large data.'
  }),
  makeCourse({
    code: 'COMPSCI 761',
    title: 'Advanced Topics in Artificial Intelligence',
    semester: 'Semester Two 2026',
    difficulty: 'Hard',
    description:
      'Covers advanced topics in artificial intelligence, including knowledge representation, search, logic, planning, reasoning under uncertainty, and intelligent behaviour.'
  }),
  makeCourse({
    code: 'COMPSYS 704',
    title: 'Advanced Embedded Systems',
    semester: 'Semester Two 2026',
    difficulty: 'Hard',
    description:
      'Studies advanced embedded systems, including embedded architectures, real-time constraints, hardware-software design, and implementation techniques.'
  }),
  makeCourse({
    code: 'COMPSYS 705',
    title: 'Formal Methods for Safety Critical Software',
    semester: 'Semester Two 2026',
    difficulty: 'Hard',
    description:
      'Covers formal methods for safety-critical software, including specification, verification, validation, and rigorous software engineering techniques.'
  }),
  makeCourse({
    code: 'COMPSYS 726',
    title: 'Robotics and Intelligent Systems',
    semester: 'Semester Two 2026',
    difficulty: 'Hard',
    description:
      'Covers robotics and intelligent systems, including sensing, control, autonomy, planning, and intelligent behaviour in robotic platforms.'
  }),
  makeCourse({
    code: 'ELECTENG 726',
    title: 'Digital Communications',
    semester: 'Semester Two 2026',
    difficulty: 'Hard',
    description:
      'Covers digital communications, including signal transmission, modulation, channel effects, coding, and communication system design.'
  }),
  makeCourse({
    code: 'INFOSYS 722',
    title: 'Data Mining and Big Data',
    semester: 'Semester Two 2026',
    difficulty: 'Medium',
    description:
      'Covers big data, data mining, business intelligence, and analytics, with applied work in data analysis and prototype development.'
  }),
  makeCourse({
    code: 'INFOSYS 735',
    title: 'Cloud Computing Architecture',
    semester: 'Semester Two 2026',
    difficulty: 'Medium',
    description:
      'Develops technical understanding of cloud computing architecture, cloud solution design, hands-on cloud practice, and cloud-based system deployment.'
  }),
  makeCourse({
    code: 'STATS 705',
    title: 'Topics in Official Statistics',
    semester: 'Semester Two 2026',
    difficulty: 'Medium',
    description:
      'Covers selected topics in official statistics, including the production, interpretation, and use of statistics for public and organisational decision-making.'
  }),

  // Professional skill courses - Semester One
  makeCourse({
    code: 'DIGIHLTH 701',
    title: 'Principles of Digital Health',
    semester: 'Semester One 2026',
    difficulty: 'Medium',
    description:
      'Introduces information technology and information management concepts relevant to digital health, including data management, decision support, change management, privacy, and ethics.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'DIGIHLTH 702',
    title: 'Health Knowledge Management',
    semester: 'Semester One 2026',
    difficulty: 'Medium',
    description:
      'Covers health knowledge management and the use of information, collaboration tools, and knowledge processes in healthcare settings.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'DIGIHLTH 705',
    title: 'Digital Health Design and Evaluation',
    semester: 'Semester One 2026',
    difficulty: 'Medium',
    description:
      'Examines the design, development, evaluation, and implementation of digital health tools from health service, researcher, and end-user perspectives.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'INFOSYS 703',
    title: 'Managing with Artificial Intelligence',
    semester: 'Semester One 2026',
    difficulty: 'Easy',
    description:
      'Focuses on the management and organisational use of artificial intelligence, including AI tools, consultancy, technology management, governance, and business value.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'INFOSYS 750',
    title: 'Research Methods - Quantitative',
    semester: 'Semester One 2026',
    difficulty: 'Medium',
    description:
      'Introduces quantitative research methods for information systems and related areas, including research design, data collection, statistical analysis, and interpretation.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'INFOSYS 757',
    title: 'Project Management and Outsourcing',
    semester: 'Semester One 2026',
    difficulty: 'Medium',
    description:
      'Covers project management and outsourcing in information systems contexts, including planning, governance, risk, stakeholder management, and delivery.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'GLMI 701',
    title: 'Competing Internationally',
    semester: 'Semester One 2026',
    difficulty: 'Easy',
    description:
      'Explores how organisations compete internationally, including strategy, markets, global competition, and international business environments.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'GLMI 705',
    title: 'People, Performance and Well-being',
    semester: 'Semester One 2026',
    difficulty: 'Easy',
    description:
      'Examines people, performance, and well-being in organisations, including workplace behaviour, leadership, motivation, and sustainable performance.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'GLMI 708',
    title: 'Critical, Creative, and Strategic Thinking',
    semester: 'Semester One 2026',
    difficulty: 'Easy',
    description:
      'Develops critical, creative, and strategic thinking skills for complex business and organisational problems.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'GLMI 711',
    title: 'Strategic Entrepreneurship and Innovation',
    semester: 'Semester One 2026',
    difficulty: 'Easy',
    description:
      'Covers entrepreneurship and innovation from a strategic perspective, including opportunity recognition, venture development, and innovation management.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'GLMI 712',
    title: 'Contemporary Approaches to Innovation and Business Design',
    semester: 'Semester One 2026',
    difficulty: 'Easy',
    description:
      'Examines contemporary approaches to innovation and business design, including design thinking, innovation processes, and new business models.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'OPSMGT 741',
    title: 'System Dynamics and Complex Modelling',
    semester: 'Semester One 2026',
    difficulty: 'Medium',
    description:
      'Focuses on system dynamics and complex modelling, including feedback structures, causal loop thinking, behaviour over time, and modelling complex systems.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'SCIENT 701',
    title: 'Accounting and Finance for Scientists',
    semester: 'Semester One 2026',
    difficulty: 'Medium',
    description:
      'Introduces accounting and finance concepts for scientists, including financial information, budgeting, decision-making, and business communication.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'STATS 779',
    title: 'Professional Skills for Statisticians',
    semester: 'Semester One 2026',
    difficulty: 'Medium',
    description:
      'Develops professional skills for statisticians, including communication, consulting, project work, teamwork, and applied statistical practice.',
    assignments: professionalAssignments()
  }),

  // Professional skill courses - Semester Two
  makeCourse({
    code: 'DIGIHLTH 703',
    title: 'New Zealand Health Data Landscape',
    semester: 'Semester Two 2026',
    difficulty: 'Medium',
    description:
      'Explores routinely collected New Zealand health data, including opportunities, limitations, ethical use, and data-informed decision-making in health contexts.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'DIGIHLTH 704',
    title: 'Healthcare Decision Support Systems',
    semester: 'Semester Two 2026',
    difficulty: 'Medium',
    description:
      'Covers healthcare decision support systems, including the use of information systems and analytics to support clinical and health service decision-making.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'DIGIHLTH 706',
    title: 'Health Data Analytics',
    semester: 'Semester Two 2026',
    difficulty: 'Medium',
    description:
      'Develops skills in extracting meaning from health data, including quantitative summaries, figures, models, evidence interpretation, and analytics for healthcare practice.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'INFOSYS 704',
    title: 'IT Consultancy',
    semester: 'Semester Two 2026',
    difficulty: 'Easy',
    description:
      'Develops consultancy skills for IT and information systems contexts, including client engagement, problem definition, analysis, recommendations, and communication.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'INFOSYS 720',
    title: 'Information Systems Research',
    semester: 'Semester Two 2026',
    difficulty: 'Medium',
    description:
      'Introduces information systems research, including research questions, theory, methods, analysis, and academic communication.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'INFOSYS 751',
    title: 'Research Methods - Qualitative',
    semester: 'Semester Two 2026',
    difficulty: 'Medium',
    description:
      'Introduces qualitative research methods, including research design, interviews, observation, coding, analysis, interpretation, and reporting.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'GLMI 703',
    title: 'Global Strategy',
    semester: 'Semester Two 2026',
    difficulty: 'Easy',
    description:
      'Examines global strategy, including competitive positioning, international markets, strategic choices, and organisational responses to global challenges.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'GLMI 704',
    title: 'Global Sustainability',
    semester: 'Semester Two 2026',
    difficulty: 'Easy',
    description:
      'Explores global sustainability challenges and organisational responses, including environmental, social, and strategic dimensions of sustainability.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'GLMI 706',
    title: 'Working in an Age of Uncertainty',
    semester: 'Semester Two 2026',
    difficulty: 'Easy',
    description:
      'Explores work, leadership, and decision-making in uncertain environments, with attention to adaptation, resilience, and complex organisational change.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'GLMI 709',
    title: 'New Ventures and Global Connectivity',
    semester: 'Semester Two 2026',
    difficulty: 'Easy',
    description:
      'Examines new ventures and global connectivity, including entrepreneurship, international networks, venture growth, and global market opportunities.',
    assignments: professionalAssignments()
  }),
  makeCourse({
    code: 'OPSMGT 780',
    title: 'Sustainable Transformation',
    semester: 'Semester Two 2026',
    difficulty: 'Medium',
    description:
      'Covers sustainable transformation in organisations and systems, including change, sustainability strategy, operations, and long-term impact.',
    assignments: professionalAssignments()
  })
];

module.exports = courseSeed;

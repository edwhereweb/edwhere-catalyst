/**
 * Dev-only UI preview: set EXPO_PUBLIC_UI_PREVIEW=1 to skip sign-in and serve fixture data,
 * so every screen can be checked without Clerk or the LMS. Never set it in a real build.
 */
export const UI_PREVIEW = process.env.EXPO_PUBLIC_UI_PREVIEW === '1';

const ago = (hours: number) => new Date(Date.now() - hours * 3_600_000).toISOString();

const topic = (id: string, title: string, moduleTitle: string, done: boolean, minutes = 45) => ({
  id,
  title,
  moduleTitle,
  estMinutes: minutes,
  done,
  subtopicCount: 4,
  cardCount: 3,
  questionCount: 3,
});

const labs = [
  {
    id: 'lab1',
    title: 'Metasploit Basics',
    field: 'Pentesting',
    difficulty: 'easy',
    hours: 4,
    points: 500,
    description:
      'Learn the fundamentals of exploitation in a safe environment. Master the interface and common payloads.',
    tags: ['Linux', 'Exploit'],
    environment: 'Isolated Kali + vulnerable VM',
    objectives: ['Launch msfconsole', 'Pick an exploit and payload', 'Capture the flag'],
    targetVm: 'Metasploitable 2',
    tools: 'Metasploit, Nmap',
    network: 'Host-only 10.10.10.0/24',
    resourceUrl: 'https://tryhackme.com/room/metasploitintro',
    autoGraded: false,
  },
  {
    id: 'lab2',
    title: 'SQL Injection Mastery',
    field: 'Web Security',
    difficulty: 'medium',
    hours: 6,
    points: 750,
    description: 'Find and exploit SQL injection flaws, then fix them with parameterised queries.',
    tags: ['SQL', 'Web'],
  },
  {
    id: 'lab3',
    title: 'Network Forensics with Wireshark',
    field: 'Blue Team',
    difficulty: 'hard',
    hours: 8,
    points: 900,
    description: 'Reconstruct an intrusion from a packet capture and extract the indicators.',
    tags: ['Wireshark', 'DFIR'],
  },
];

const jobs = [
  {
    id: 'job1',
    title: 'Junior SOC Analyst',
    company: { name: 'SentinelOne' },
    location: 'Remote',
    locationType: 'remote',
    salary: '₹12-18 LPA',
    type: 'FULL_TIME',
    tags: [
      { label: 'Full-time', variant: 'primary' },
      { label: 'Remote', variant: 'primary' },
      { label: '₹12-18 LPA', variant: 'primary' },
    ],
    postedAt: ago(2),
    description:
      'Monitor security alerts, triage incidents and work with senior analysts to contain threats.',
    responsibilities: ['Triage SIEM alerts', 'Document incidents', 'Escalate confirmed threats'],
    requirements: [
      { label: 'SIEM basics', description: 'Splunk or Sentinel exposure', icon: 'shield-checkmark-outline' },
      { label: 'Networking', description: 'TCP/IP and common protocols', icon: 'git-network-outline' },
    ],
    careerMatchPercent: 92,
  },
  {
    id: 'job2',
    title: 'Cloud Security Intern',
    company: { name: 'Palo Alto Networks' },
    location: 'Bangalore',
    locationType: 'onsite',
    salary: '₹35k/mo',
    type: 'INTERNSHIP',
    tags: [
      { label: 'Internship', variant: 'secondary' },
      { label: 'Bangalore', variant: 'secondary' },
      { label: '₹35k/mo', variant: 'tertiary' },
    ],
    postedAt: ago(5),
    description: 'Help secure cloud workloads across AWS and Azure.',
    careerMatchPercent: 78,
  },
];

const fixtures: [RegExp, unknown][] = [
  [
    /^\/api\/mobile\/catalyst\/dashboard$/,
    {
      firstName: 'Aryan',
      streak: 12,
      rank: 14,
      weeklyApplications: { done: 6, target: 10 },
      skillHours: { done: 4.5, target: 10 },
      careerSetup: [
        { key: 'profile', label: 'Complete your profile', state: 'done' },
        { key: 'resume', label: 'Add your resume link', state: 'now' },
        { key: 'lab', label: 'Finish your first lab', state: 'pending' },
        { key: 'application', label: 'Log your first application', state: 'pending' },
      ],
      event: {
        title: 'Hack-the-Box Local Meetup: London',
        description: 'Join 40+ other Edwhere students this Saturday.',
      },
    },
  ],
  [
    /^\/api\/mobile\/catalyst\/progress$/,
    {
      lastUpdated: ago(2),
      remainingTasks: 3,
      draftLab: { id: 'lab2', title: 'SQL Injection Mastery' },
      activeApplication: { id: 'a1', title: 'Junior SOC Analyst at SentinelOne' },
      hoursInvested: 12.5,
      hoursChangePercent: 12,
      tasksCompleted: 8,
      tasksTarget: 12,
    },
  ],
  [
    /^\/api\/mobile\/catalyst\/leaderboard$/,
    {
      entries: [
        { rank: 1, userId: 'u1', name: 'Ishaan Verma', points: 3120, isCurrentUser: false },
        { rank: 2, userId: 'u2', name: 'Kiara Nair', points: 2980, isCurrentUser: false },
        { rank: 3, userId: 'u3', name: 'Rohan Das', points: 2740, isCurrentUser: false },
        { rank: 4, userId: 'u4', name: 'Aryan Sharma', points: 2450, isCurrentUser: true },
        { rank: 5, userId: 'u5', name: 'Meera Pillai', points: 2210, isCurrentUser: false },
      ],
      me: { rank: 4, userId: 'u4', name: 'Aryan Sharma', points: 2450, isCurrentUser: true, league: 'Explorer', streak: 12 },
    },
  ],
  [
    /^\/api\/mobile\/catalyst\/notifications$/,
    [
      { id: 'n1', category: 'alerts', title: 'Application update', body: 'SentinelOne viewed your application.', createdAt: ago(1), read: false, actionLabel: 'View', actionRoute: '/(protected)/placement/applications' },
      { id: 'n2', category: 'achievements', title: 'Lab completed', body: 'You earned 500 points for Metasploit Basics.', createdAt: ago(9), read: false },
      { id: 'n3', category: 'social', title: 'Study plan approved', body: 'You now have access to IT Fresher Placement.', createdAt: ago(30), read: true },
    ],
  ],
  [
    /^\/api\/mobile\/catalyst\/tasks\/weekly$/,
    {
      weekLabel: 'Nov 9 – Nov 15',
      completionPercent: 50,
      projectedPoints: 230,
      tasks: [
        { id: 'apply', title: 'Apply to 5 roles', category: 'Placement', dueLabel: 'Due Nov 15', points: 50, status: 'in_progress', priority: true, note: '3/5 so far' },
        { id: 'lab', title: 'Complete 1 lab', category: 'Labs', dueLabel: 'Due Nov 15', points: 100, status: 'completed', priority: false },
        { id: 'hours', title: 'Log 10 skill hours', category: 'Skills', dueLabel: 'Due Nov 15', points: 50, status: 'pending', priority: false, note: '0/10 so far' },
        { id: 'profile', title: 'Complete your profile', category: 'Profile', dueLabel: 'Due Nov 15', points: 30, status: 'completed', priority: false },
      ],
    },
  ],
  [
    /^\/api\/mobile\/catalyst\/rewards$/,
    {
      streak: 12,
      totalPoints: 1450,
      activeDays: [true, true, true, true, true, false, false],
      weeklyCompletionPercent: 85,
      badges: [
        { id: 'b1', name: 'Bug Hunter', unlocked: true },
        { id: 'b2', name: 'Script Kiddy', unlocked: true },
        { id: 'b3', name: 'Packet Sniffer', unlocked: false },
        { id: 'b4', name: 'Root Access', unlocked: false },
      ],
      history: [
        { id: 'h1', title: 'Network Forensics Submission', subtitle: 'Project: Advanced Packet Analysis', points: 250, occurredAt: ago(30) },
        { id: 'h2', title: 'Module Completion', subtitle: 'Bash Scripting for Automation', points: 100, occurredAt: ago(80) },
        { id: 'h3', title: 'Weekly Streak Bonus', subtitle: '7-day consistency award', points: 500, occurredAt: ago(130) },
      ],
    },
  ],
  [
    /^\/api\/mobile\/catalyst\/profile$/,
    {
      id: 'p1',
      name: 'Aryan Sharma',
      headline: 'Aspiring Security Analyst',
      bio: 'Final-year BCA student focused on blue-team operations.',
      points: 2450,
      streak: 15,
      badges: ['SOC Scout', 'Network Ninja', 'Bug Hunter'],
      skills: ['Python', 'Wireshark', 'SIEM', 'Linux', 'Nmap'],
      certifications: [{ name: 'CompTIA Security+', credentialId: 'SEC-12345678' }],
      targetRoles: ['SOC Analyst', 'Pentester'],
      workPreference: 'remote',
      resumeUrl: 'https://drive.google.com/file/d/1abc/view',
    },
  ],
  [/^\/api\/mobile\/catalyst\/labs$/, labs],
  [/^\/api\/mobile\/catalyst\/labs\/[^/]+$/, labs[0]],
  [
    /^\/api\/mobile\/catalyst\/study\/tracks$/,
    [
      { id: 't1', slug: 'it-fresher', title: 'IT Fresher Placement', description: 'Core computer science and interview preparation for IT placements.', topicCount: 17, totalMinutes: 1000 },
      { id: 't2', slug: 'soc-analyst', title: 'SOC Analyst', description: 'Monitor, detect, triage and respond to threats.', topicCount: 14, totalMinutes: 680 },
    ],
  ],
  [
    /^\/api\/mobile\/catalyst\/study\/plan$/,
    {
      plan: {
        track: { id: 't1', title: 'IT Fresher Placement' },
        totalDays: 90,
        dayNumber: 12,
        daysLeft: 79,
        topicsDone: 4,
        topicsTotal: 17,
        percentComplete: 24,
        today: [
          topic('s1', 'Linked Lists', 'Data Structures', true, 50),
          topic('s2', 'Stacks & Queues', 'Data Structures', false, 45),
        ],
        dayComplete: false,
        nextUp: topic('s3', 'Trees & Graphs', 'Data Structures', false, 75),
      },
      request: null,
    },
  ],
  [
    /^\/api\/mobile\/catalyst\/study\/roadmap$/,
    {
      track: { id: 't1', title: 'IT Fresher Placement' },
      modules: [
        {
          id: 'm1',
          title: 'Programming & OOP',
          description: '',
          topics: [
            { ...topic('s0', 'Programming Fundamentals', 'Programming & OOP', true, 60), subtopics: ['Data types', 'Loops', 'Recursion'] },
            { ...topic('s0b', 'Object-Oriented Programming', 'Programming & OOP', true, 60), subtopics: ['Pillars', 'Overloading vs overriding'] },
          ],
        },
        {
          id: 'm2',
          title: 'Data Structures',
          description: '',
          topics: [
            { ...topic('s1', 'Linked Lists', 'Data Structures', true, 50), subtopics: ['Singly and doubly', 'Cycle detection'] },
            { ...topic('s2', 'Stacks & Queues', 'Data Structures', false, 45), subtopics: ['LIFO and FIFO', 'Balanced parentheses'] },
          ],
        },
      ],
    },
  ],
  [
    /^\/api\/mobile\/catalyst\/study\/topics\/[^/]+$/,
    {
      id: 's2',
      title: 'Stacks & Queues',
      moduleTitle: 'Data Structures',
      estMinutes: 45,
      subtopics: ['LIFO and FIFO', 'Array and linked list implementations', 'Balanced parentheses', 'Priority queue basics'],
      cards: [
        { front: 'Stack vs queue?', back: 'A stack is last-in first-out. A queue is first-in first-out.' },
        { front: 'Which structure does BFS use?', back: 'A queue.' },
      ],
      questions: [
        { question: 'Which structure manages function calls?', options: ['Queue', 'Stack', 'Tree', 'Hash table'] },
        { question: 'Which structure does breadth-first search use?', options: ['Stack', 'Heap', 'Queue', 'Array'], company: undefined },
      ],
      done: false,
    },
  ],
  [
    /^\/api\/mobile\/catalyst\/applications$/,
    [
      { id: 'l1', jobId: '', jobTitle: 'QA Engineer', company: 'Infosys', status: 'applied', appliedAt: ago(48), updatedAt: ago(48) },
    ],
  ],
  [/^\/api\/mobile\/placement\/profile$/, { isActive: true }],
  [/^\/api\/mobile\/placement\/jobs$/, jobs],
  [/^\/api\/mobile\/placement\/jobs\/[^/]+$/, jobs[0]],
  [
    /^\/api\/mobile\/placement\/applications$/,
    [
      { id: 'a1', jobId: 'job1', job: { id: 'job1', title: 'Junior SOC Analyst', company: { name: 'SentinelOne' } }, status: 'INTERVIEWED', appliedAt: ago(72), updatedAt: ago(10) },
      { id: 'a2', jobId: 'job2', job: { id: 'job2', title: 'Cloud Security Intern', company: { name: 'Palo Alto Networks' } }, status: 'APPLIED', appliedAt: ago(30), updatedAt: ago(30) },
      { id: 'a3', jobId: 'job3', job: { id: 'job3', title: 'Security Engineer', company: { name: 'Acme Corp' } }, status: 'REJECTED', appliedAt: ago(200), updatedAt: ago(100) },
    ],
  ],
];

/** Returns the fixture for an API path, or undefined to fall through to the network. */
export function previewFixture(path: string): unknown {
  const clean = path.split('?')[0];
  const hit = fixtures.find(([pattern]) => pattern.test(clean));
  return hit ? { data: hit[1] } : undefined;
}

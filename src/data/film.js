// All of the site's copy lives here. Edit this file to change what the film says.

export const person = {
  name: 'Harishankar Kumar Harsh',
  nameLines: ['Harishankar', 'Kumar Harsh'],
  hindi: 'हरि',
  role: 'Full Stack .NET Developer',
  base: 'Noida, India',
  email: 'harshchauhan101202@gmail.com',
  github: 'https://github.com/Harishankar02',
  linkedin: 'https://www.linkedin.com/in/harishankar02/', // Shown in the finale and the script.
}

export const certificate = [
  ['Title', person.name],
  ['Category', 'U/A, Unrestricted Access'],
  ['Type', person.role],
  ['Language', 'C#, TypeScript, SQL'],
  ['Reels', '7'],
  ['Length', '3+ years, still running'],
]

export const title = {
  id: 'title',
  label: 'Title',
  studio: 'A .NET Production',
  tagline: 'A career in seven reels.',
  grade: { a: '#ffc15e', b: '#f26b3a', bg: '#0a0807' },
}

export const reels = [
  {
    id: 'origin',
    label: 'Origin',
    side: 'left',
    slug: 'EXT. GOPALPUR, BIHAR — 2017',
    title: 'Origin',
    lines: [
      'Every long take starts somewhere. This one starts in Gopalpur, Bihar.',
      'Matric in 2017. Intermediate at RPS College, Mahnar, in 2019.',
      'Then west, across the country, to Jalandhar and a B.Tech in Computer Science.',
    ],
    slate: [
      ['Degree', 'B.Tech, CSE'],
      ['School', 'I.K.G.P.T.U., Jalandhar'],
      ['Dates', '2020 — 2024'],
      ['Score', '8.52 CGPA'],
    ],
    stack: [],
    grade: { a: '#ffb347', b: '#e8553a', bg: '#0d0806' },
  },
  {
    id: 'first-take',
    label: 'First Take',
    side: 'right',
    slug: 'INT. REVOCEPT SOLUTIONS, MOHALI — 2023',
    title: 'First Take',
    lines: [
      'July 2023. First job, a year before the degree was finished.',
      'Atlas: a desktop app that helps studios track budgets, expenses, taxes and incentives.',
      'Online or offline, the numbers had to hold. SQLite kept them local, the APIs synced them back.',
    ],
    slate: [
      ['Studio', 'Revocept Solutions'],
      ['Role', 'Full Stack .NET Developer'],
      ['Dates', '07/2023 — 02/2025'],
      ['Set', 'Mohali, India'],
    ],
    stack: ['.NET Core', 'Angular', 'Electron', 'SQL Server', 'SQLite', 'ADO.NET', 'AWS', 'Nginx'],
    grade: { a: '#7fe0cf', b: '#f2c078', bg: '#060c0c' },
  },
  {
    id: 'chain',
    label: 'Chain of Command',
    side: 'left',
    slug: 'EXT. RETAIL FLOOR — FIELD OPERATIONS',
    title: 'Chain of Command',
    lines: [
      'RackStar: get a rack from head office into a retail outlet, then prove it got there.',
      'Six levels of people. One assignment, tracked from allocation through to inspection.',
      'Role-based tasks and real-time updates, hosted on IIS.',
    ],
    chain: ['Head Office', 'Branch Assistant', 'Area Executive', 'Regional Merch. Exec.', 'Regional Dist. Exec.', 'Merchandiser'],
    slate: [],
    stack: ['ASP.NET Core Web API', 'Dapper', 'ADO.NET', 'SQL Server', 'Razor Pages', 'IIS', 'Azure DevOps'],
    grade: { a: '#c2ea74', b: '#3fb27f', bg: '#070c07' },
  },
  {
    id: 'night-shift',
    label: 'The Night Shift',
    side: 'right',
    slug: 'INT. COMPANY DATA CENTRE — NIGHT',
    title: 'The Night Shift',
    lines: [
      'Hublix.ai CLS Celerity: drivers and deliveries for a client in the UK.',
      'Onboarding, DVLA licence checks, tracking, expenses, incentives, reports.',
      'Worker threads and background services kept the transactions moving, on servers run in-house.',
    ],
    slate: [
      ['Studio', 'Brucode Technologies'],
      ['Role', 'Full Stack .NET Developer'],
      ['Dates', '06/2025 — 11/2025'],
      ['Set', 'Mohali, India'],
    ],
    stack: ['.NET Core MVC', 'EF Code First', 'SQL Server', 'Swagger', 'Syncfusion', 'Linux', 'Nginx'],
    grade: { a: '#86aefc', b: '#ffc46b', bg: '#06080f' },
  },
  {
    id: 'the-turn',
    label: 'The Turn',
    side: 'left',
    slug: 'INT. ARIEL SOFTWARE SOLUTIONS — 2025',
    title: 'The Turn',
    lines: [
      'December 2025. Same craft, new cast: the models walk on set.',
      'LLMs on AWS Bedrock and Azure AI Foundry, wired into real backend services.',
      'n8n workflows chaining APIs, databases and multiple model steps into a single flow.',
    ],
    slate: [
      ['Studio', 'Ariel Software Solutions'],
      ['Role', 'Software Engineer'],
      ['Dates', '12/2025 — 2026'],
      ['Set', 'Mohali, India'],
    ],
    stack: ['ASP.NET Core', 'Angular', 'Blazor', 'AWS Bedrock', 'Azure AI Foundry', 'n8n', 'Redis', 'Docker'],
    grade: { a: '#ff4b38', b: '#ffa27a', bg: '#100504' },
  },
  {
    id: 'the-heist',
    label: 'The Heist',
    side: 'right',
    slug: 'EXT. JAMAICA — THE JOB',
    title: 'The Heist',
    lines: [
      'MIB, an insurance broker in Jamaica. The job: replace the whole platform, lose no broker, customer or insurer flow.',
      'Azure AI Foundry and Document Intelligence now read the paperwork.',
      'Azure DevOps builds it. ECS and Fargate run it on AWS.',
    ],
    swap: { from: '.NET Framework + AngularJS', to: '.NET Core 10 + Angular 20' },
    slate: [],
    stack: ['.NET Core 10', 'Angular 20', 'Azure AI Foundry', 'Document Intelligence', 'Azure DevOps', 'ECS', 'Fargate'],
    grade: { a: '#3fe5ca', b: '#ffe066', bg: '#040d0e' },
  },
  {
    id: 'now-showing',
    label: 'Now Showing',
    side: 'left',
    slug: 'INT. NOIDA — PRESENT DAY',
    title: 'Now Showing',
    lines: [
      'New city, new chapter: Noida.',
      'With ThoughtSol, on a vendor role at Jakson Group.',
      'Full stack on .NET and React, shipped on IIS.',
    ],
    slate: [
      ['Studio', 'ThoughtSol, Noida'],
      ['Client', 'Jakson Group (vendor)'],
      ['Role', '.NET Full Stack Developer'],
      ['Dates', '09/2026 — Present'],
    ],
    stack: ['.NET', 'React', 'IIS'],
    grade: { a: '#6ddcfb', b: '#f4f1e8', bg: '#050a0e' },
  },
]

export const credits = {
  id: 'credits',
  label: 'Credits',
  groups: [
    ['Starring', ['C#', '.NET', '.NET Core', 'ASP.NET Core']],
    ['Front of House', ['React.js', 'Angular', 'Blazor', 'TypeScript', 'JavaScript', 'jQuery']],
    ['Supporting Cast', ['C++', 'Python', 'SQL']],
    ['Archives', ['SQL Server', 'PostgreSQL', 'SQLite', 'PG Vector', 'Qdrant', 'NoSQL', 'Entity Framework', 'ADO.NET', 'Dapper']],
    ['Special Effects', ['LLM Integration', 'LLM Deployment', 'ML Model Integration', 'n8n', 'MCP', 'A2A', 'AWS Bedrock', 'Azure AI Foundry']],
    ['Rigging', ['AWS', 'Lambda', 'Docker', 'Nginx', 'Linux', 'IIS', 'Azure DevOps']],
    ['Script Supervision', ['Microservices', 'Distributed Systems', 'DDD', 'MVC', 'OOPS', 'Software Architecture']],
    ['Continuity', ['Git', 'GitHub', 'Jira', 'Redmine']],
    ['Filmed In', ['Gopalpur', 'Jalandhar', 'Mohali', 'Noida']],
    ['Released In', ['India', 'United Kingdom', 'Jamaica']],
  ],
  grade: { a: '#f3ead9', b: '#f2a33a', bg: '#0a0807' },
}

export const finale = {
  id: 'finale',
  label: 'Contact',
  kicker: 'Post-credits scene',
  title: 'To be continued.',
  line: 'The next reel is unwritten. It could be yours.',
  grade: { a: '#ffc15e', b: '#f26b3a', bg: '#0a0807' },
}

// Index into the scene order below: title 0, reels 1 to 7, credits 8, finale 9.
export const scenes = [title, ...reels, credits, finale]

export const places = [
  { name: 'Gopalpur', lat: 25.7, lon: 85.4, scene: 1 },
  { name: 'Jalandhar', lat: 31.33, lon: 75.58, scene: 1, flip: true },
  { name: 'Mohali', lat: 30.7, lon: 76.72, scene: 1 },
  { name: 'Noida', lat: 28.54, lon: 77.39, scene: 1 },
  { name: 'United Kingdom', lat: 52.5, lon: -1.5, scene: 4 },
  { name: 'Jamaica', lat: 18.1, lon: -77.3, scene: 6 },
]

// The plain, fast version behind the "Read the script" button.
export const resume = {
  summary:
    'Full stack .NET developer with 3+ years building enterprise systems across finance, logistics, insurance and retail, and integrating LLMs into production workflows.',
  experience: [
    {
      role: '.NET Full Stack Developer',
      company: 'ThoughtSol, Noida (vendor role at Jakson Group)',
      dates: '09/2026 — Present',
      points: ['Full stack development on .NET and React, deployed on IIS.'],
    },
    {
      role: 'Software Engineer',
      company: 'Ariel Software Solutions Pvt. Ltd., Mohali',
      dates: '12/2025 — 2026',
      points: [
        'Scalable applications with ASP.NET Core, Angular, Blazor, SQL Server and Entity Framework.',
        'LLM integration with AWS Bedrock and Azure AI Foundry, connected to backend services.',
        'n8n workflows connecting APIs, enterprise services, databases and multiple LLM steps.',
        'AWS EC2, Redis caching, Docker, Nginx, background services and SSH deployments.',
      ],
    },
    {
      role: 'Full Stack .NET Developer',
      company: 'Brucode Technologies Pvt. Ltd., Mohali',
      dates: '06/2025 — 11/2025',
      points: [
        'Backend services in .NET Core MVC with SQL Server, EF Code First and Swagger.',
        'Dashboards, reporting, forms and operational workflows with Syncfusion UI.',
        'Worker threads and background services for CLS, a UK driver and delivery system.',
        'Deployed on the company data center, managed over SSH with PuTTY and FileZilla.',
      ],
    },
    {
      role: 'Full Stack .NET Developer',
      company: 'Revocept Solutions, Mohali',
      dates: '07/2023 — 02/2025',
      points: [
        'RESTful .NET Core APIs for Angular and Electron frontends.',
        'Hybrid desktop app for studio budgets, expenses, taxes and incentives, online and offline.',
        'Real-time and offline data synchronization.',
        'AWS deployment and remote server management.',
      ],
    },
  ],
  projects: [
    {
      name: 'MIB, Insurance Broker Platform (Jamaica)',
      text: 'Led the migration from .NET Framework + AngularJS to .NET Core 10 + Angular 20. Azure AI Foundry and Document Intelligence for document automation, Azure DevOps CI/CD, AWS ECS and Fargate.',
    },
    {
      name: 'Hublix.ai, CLS Celerity Driver Management',
      text: 'Driver and delivery management for a UK client: DVLA licence verification, background workers, notifications and high-volume reporting. .NET Core, SQL Server, EF Code First, Syncfusion.',
    },
    {
      name: 'Atlas, Budget Tracking Desktop App',
      text: 'Expense, tax and incentive tracking, online and offline, with SQLite persistence and sync. .NET Core, SQL Server, ADO.NET, Angular, Electron, AWS, Nginx.',
    },
    {
      name: 'RackStar, Rack Installation and Tracking',
      text: 'Field operations across a six-level hierarchy, from rack assignment to inspection. ASP.NET Core Web API, ADO.NET, Dapper, SQL Server, Razor Pages, IIS, Azure DevOps.',
    },
  ],
  education: [
    ['B.Tech, Computer Science and Engineering', 'I.K.G.P.T.U., Jalandhar, 2020 — 2024, 8.52 CGPA'],
    ['Intermediate (12th)', 'RPS College, Mahnar, Bihar, 2019, 76.8%'],
    ['Matriculation (10th)', 'Utkarmit Madhya Vidyalaya, Gopalpur, Bihar, 2017, 76.4%'],
  ],
}

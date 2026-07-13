export interface Job {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  companyWebsite: string;
  location: string;
  workType: 'remote' | 'hybrid' | 'onsite';
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  salaryMin: number;
  salaryMax: number;
  currency: string;
  category: string;
  description: string;
  requirements: string[];
  skillsRequired: string[];
  createdAt: string;
  applicationsCount: number;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  seekerId: string;
  seekerName: string;
  coverLetter?: string;
  resumeUrl: string;
  status: 'applied' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted';
  createdAt: string;
}

export const MOCK_JOBS: Job[] = [
  {
    id: 'job_1',
    title: 'Senior Frontend Developer',
    companyName: 'TechCorp Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
    companyWebsite: 'https://techcorp.example.com',
    location: 'Dhaka',
    workType: 'remote',
    jobType: 'full-time',
    salaryMin: 80000,
    salaryMax: 120000,
    currency: 'BDT',
    category: 'Tech',
    description: `We are looking for a Senior Frontend Developer who is passionate about building user-facing web applications. You will collaborate closely with product managers, UX designers, and backend teams to deliver high-quality, scalable interfaces.
    
    ### What You Will Do
    * Architect and implement interactive web frontends using React and Next.js.
    * Optimize application performance, scalability, and load times.
    * Collaborate with UX/UI designers to convert visual designs into pixel-perfect responsive pages.
    * Mentor junior engineers and establish frontend coding standards.
    
    ### Requirements
    * 5+ years of experience with modern JS frameworks (React, Vue, or Angular).
    * Strong command over TypeScript, CSS Modules, and state management libraries.
    * Good understanding of Next.js App Router and SSR principles.
    * Excellent communication and leadership skills.`,
    requirements: [
      '5+ years of professional React experience',
      'Strong proficiency in TypeScript and responsive CSS layouts',
      'Familiarity with REST APIs, GraphQL, and modern web performance optimization techniques',
      'B.Sc in Computer Science or equivalent practical experience'
    ],
    skillsRequired: ['React', 'TypeScript', 'Next.js', 'CSS Modules', 'Web Performance'],
    createdAt: '2026-07-10T12:00:00Z',
    applicationsCount: 14
  },
  {
    id: 'job_2',
    title: 'Backend Engineer (Node.js & Go)',
    companyName: 'DevLabs Inc.',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100',
    companyWebsite: 'https://devlabs.example.com',
    location: 'Dhaka',
    workType: 'onsite',
    jobType: 'full-time',
    salaryMin: 90000,
    salaryMax: 140000,
    currency: 'BDT',
    category: 'Tech',
    description: `DevLabs is looking for a Backend Engineer to join our core systems team. You will build and scale reliable microservices, APIs, and real-time streaming architectures.
    
    ### What You Will Do
    * Develop highly concurrent, robust APIs using Node.js and Go.
    * Design schemas and manage relational/non-relational databases (PostgreSQL, MongoDB).
    * Integrate caching layers (Redis) and event streaming pipelines (Kafka/RabbitMQ).
    * Conduct code reviews and ensure testing coverage via unit/integration testing.
    
    ### Requirements
    * 3+ years backend development experience.
    * Production-level knowledge of Node.js (TypeScript) or Go.
    * Experience with database optimization, indexing, and clustering.
    * Proficiency in Docker and Kubernetes is a plus.`,
    requirements: [
      '3+ years of experience in backend development',
      'Strong hands-on experience with Node.js/Go and MongoDB/PostgreSQL',
      'Understanding of microservices, caching, and rate-limiting patterns',
      'Ability to design clear, versioned REST/gRPC API structures'
    ],
    skillsRequired: ['Node.js', 'Go', 'MongoDB', 'PostgreSQL', 'Redis', 'Docker'],
    createdAt: '2026-07-12T09:30:00Z',
    applicationsCount: 8
  },
  {
    id: 'job_3',
    title: 'Lead UI/UX Designer',
    companyName: 'CreativeFlow Studio',
    companyLogo: 'https://images.unsplash.com/photo-1561070791-26c113006238?w=100',
    companyWebsite: 'https://creativeflow.example.com',
    location: 'Dhaka',
    workType: 'hybrid',
    jobType: 'full-time',
    salaryMin: 70000,
    salaryMax: 100000,
    currency: 'BDT',
    category: 'Design',
    description: `CreativeFlow is a premium digital agency. We are searching for an innovative Lead UI/UX Designer who can design beautiful, user-centered websites, dashboards, and mobile app layouts.
    
    ### What You Will Do
    * Conduct user research, define user personas, and map user flows.
    * Create clean wireframes, high-fidelity UI prototypes, and detailed specification documents.
    * Formulate and maintain clean, scalable design systems.
    * Perform visual quality checks and collaborate closely with developers to implement interfaces.
    
    ### Requirements
    * 4+ years UI/UX design experience with a strong online portfolio.
    * Master level skill in Figma, Adobe CC, and prototyping tools.
    * Strong conceptual understanding of typography, space, grids, colors, and layout transitions.
    * Basic understanding of HTML/CSS to coordinate smoothly with dev teams.`,
    requirements: [
      '4+ years of UI/UX design experience',
      'Exceptional portfolio demonstrating visual style and problem-solving',
      'Figma expert with experience designing component-based libraries',
      'Strong understanding of design thinking and usability standards'
    ],
    skillsRequired: ['Figma', 'UI Design', 'Wireframing', 'User Research', 'Design Systems'],
    createdAt: '2026-07-11T16:45:00Z',
    applicationsCount: 22
  },
  {
    id: 'job_4',
    title: 'Product Marketing Manager',
    companyName: 'BrandGrowth Co.',
    companyLogo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100',
    companyWebsite: 'https://brandgrowth.example.com',
    location: 'Remote',
    workType: 'remote',
    jobType: 'part-time',
    salaryMin: 45000,
    salaryMax: 65000,
    currency: 'BDT',
    category: 'Marketing',
    description: `BrandGrowth is hiring a Product Marketing Manager to lead our positioning, launch campaigns, and user acquisition strategies.
    
    ### What You Will Do
    * Perform competitive intelligence and consumer sentiment analysis.
    * Develop messaging frameworks, go-to-market strategies, and content funnels.
    * Manage digital marketing channels including paid social, SEO, and email campaigns.
    * Monitor engagement analytics and optimize conversion ratios.
    
    ### Requirements
    * 2+ years of experience in SaaS/Tech marketing.
    * Excellent copywriting, narrative building, and presentation skills.
    * Analytical mind with experience using Google Analytics, SEMRush, etc.`,
    requirements: [
      '2+ years of SaaS or digital product marketing experience',
      'Proven track record running successful ad campaigns and content strategies',
      'Strong analytical capabilities to track and interpret user conversion data',
      'Excellent verbal and written communication'
    ],
    skillsRequired: ['Product Marketing', 'Copywriting', 'SEO', 'Ad Campaigns', 'Analytics'],
    createdAt: '2026-07-09T08:15:00Z',
    applicationsCount: 5
  },
  {
    id: 'job_5',
    title: 'Data Scientist / Machine Learning Engineer',
    companyName: 'AnalyticsCo',
    companyLogo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100',
    companyWebsite: 'https://analyticsco.example.com',
    location: 'Dhaka',
    workType: 'onsite',
    jobType: 'full-time',
    salaryMin: 110000,
    salaryMax: 160000,
    currency: 'BDT',
    category: 'Tech',
    description: `Join AnalyticsCo as a Data Scientist and build AI models that drive core business insights. You will train, optimize, and deploy models into production.
    
    ### What You Will Do
    * Mine massive datasets, perform feature engineering, and identify patterns.
    * Train machine learning/deep learning models for NLP and recommendation systems.
    * Deploy pipelines in AWS/GCP, managing data warehousing (Snowflake, BigQuery).
    * Interface with stakeholders to explain complex models in simple business metrics.
    
    ### Requirements
    * 3+ years experience as a Data Scientist or ML Engineer.
    * Strong command in Python (Pandas, Numpy, PyTorch, Scikit-Learn) and SQL.
    * Familiarity with containerization (Docker) and ML operations (MLflow).`,
    requirements: [
      'M.Sc. or Ph.D. in Data Science, Statistics, Mathematics, or CS',
      '3+ years of professional ML model training and deployment',
      'Strong command of Python, PyTorch, and relational databases',
      'Familiarity with cloud data pipelines'
    ],
    skillsRequired: ['Python', 'Machine Learning', 'SQL', 'PyTorch', 'Cloud Platforms'],
    createdAt: '2026-07-08T11:00:00Z',
    applicationsCount: 19
  },
  {
    id: 'job_6',
    title: 'QA Automation Engineer',
    companyName: 'DevLabs Inc.',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100',
    companyWebsite: 'https://devlabs.example.com',
    location: 'Chittagong',
    workType: 'hybrid',
    jobType: 'full-time',
    salaryMin: 55000,
    salaryMax: 80000,
    currency: 'BDT',
    category: 'Tech',
    description: `We are searching for a QA Automation Engineer to lead our testing infrastructure and ensure that our applications are completely bug-free.
    
    ### What You Will Do
    * Develop automated E2E and integration tests using Playwright/Cypress.
    * Integrate automated test suites with our CI/CD pipelines.
    * Document bug reports, perform regression testing, and sign off on production releases.
    * Collaborate with product teams to define test scenarios.
    
    ### Requirements
    * 2+ years of QA Automation testing experience.
    * Skilled in JavaScript/TypeScript for writing automation scripts.
    * Familiar with CI/CD tools (GitHub Actions, Jenkins).`,
    requirements: [
      '2+ years of professional software testing automation',
      'Proficiency in Playwright, Cypress, or Selenium',
      'Experience writing test plans and identifying edge cases',
      'Familiarity with agile workflows'
    ],
    skillsRequired: ['Automation Testing', 'Playwright', 'TypeScript', 'CI/CD', 'Jest'],
    createdAt: '2026-07-07T14:20:00Z',
    applicationsCount: 12
  }
];

// Helper methods utilizing localStorage for persistence
export const getJobs = (): Job[] => {
  if (typeof window === 'undefined') return MOCK_JOBS;
  const jobs = localStorage.getItem('nexthire_jobs');
  if (!jobs) {
    localStorage.setItem('nexthire_jobs', JSON.stringify(MOCK_JOBS));
    return MOCK_JOBS;
  }
  return JSON.parse(jobs);
};

export const getJobById = (id: string): Job | undefined => {
  const jobs = getJobs();
  return jobs.find((job) => job.id === id);
};

export const getApplications = (): Application[] => {
  if (typeof window === 'undefined') return [];
  const apps = localStorage.getItem('nexthire_applications');
  return apps ? JSON.parse(apps) : [];
};

export const applyForJob = (
  jobId: string,
  seekerId: string,
  seekerName: string,
  coverLetter: string,
  resumeUrl: string
): boolean => {
  const job = getJobById(jobId);
  if (!job) return false;

  const apps = getApplications();
  
  // Check duplicate application
  const alreadyApplied = apps.some((app) => app.jobId === jobId && app.seekerId === seekerId);
  if (alreadyApplied) return false;

  const newApp: Application = {
    id: `app_${Date.now()}`,
    jobId,
    jobTitle: job.title,
    companyName: job.companyName,
    seekerId,
    seekerName,
    coverLetter,
    resumeUrl,
    status: 'applied',
    createdAt: new Date().toISOString()
  };

  localStorage.setItem('nexthire_applications', JSON.stringify([...apps, newApp]));

  // Update applications count in jobs
  const jobs = getJobs();
  const index = jobs.findIndex((j) => j.id === jobId);
  if (index !== -1) {
    jobs[index].applicationsCount += 1;
    localStorage.setItem('nexthire_jobs', JSON.stringify(jobs));
  }

  return true;
};

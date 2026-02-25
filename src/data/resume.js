/**
 * Resume content for the portfolio.
 * PDPA: For phone/email, use .env (VITE_PUBLIC_PHONE, VITE_PUBLIC_EMAIL).
 * Leave them unset or empty to avoid exposing contact details; use the contact form instead.
 */
const contact = {
  name: 'Tan Caken',
  tagline: 'AWS Certified Cloud Developer',
  phone: import.meta.env.VITE_PUBLIC_PHONE ?? '', // e.g. (+65) 83992504 — leave empty to hide
  email: import.meta.env.VITE_PUBLIC_EMAIL ?? '', // leave empty to hide; contact form still works
}

export const resume = {
  contact,
  experience: [
    {
      company: 'Capital C Corporation Pte. Ltd.',
      role: 'Junior Software Developer',
      period: 'Aug 2024 – Present',
      location: 'Singapore',
      highlights: [
        'Led full development cycle of a Buy Now, Pay Later platform (Singpass login, application workflow, merchant dashboard) using Next.js, delivering the MVP in 3 months and generating significant revenue in the first year.',
        'Built a custom Lead Management System to automate acquisition workflows and improve lead tracking efficiency.',
        'Reduced annual infrastructure costs by replacing existing automation with a serverless AWS architecture (Lambda, EventBridge, CloudFormation).',
        'Liaised between technical teams and external vendors to gather requirements, document specifications, and coordinate implementation.',
        'Replaced Firebase in a legacy application with a cost-effective alternative while maintaining SLA and system performance.',
        'Managed IT hardware procurement, system installations, and internal IT support for organization-wide reliability.',
      ],
    },
    {
      company: 'ResMed, Singapore',
      role: 'Machine Learning Ops Intern',
      period: 'Jan 2023 – May 2023',
      location: 'Singapore',
      highlights: [
        'Developed an internal XAI (Explainable AI) dashboard to visualize model explainability.',
        'Integrated the solution into existing infrastructure in collaboration with Data Scientists, improving transparency in model outputs.',
      ],
    },
    {
      company: 'HomePal, Singapore',
      role: 'Machine Learning Intern',
      period: 'Sep 2021 – Apr 2022',
      location: 'Singapore',
      highlights: [
        'Developed a machine learning model achieving ~80% accuracy in human action prediction.',
        'Conducted live demos to nursing home partners and improved dataset precision through iterative data collection.',
      ],
    },
  ],
  education: [
    {
      school: 'Nanyang Technological University, Singapore',
      degree: 'Bachelor of Computer Science (Honours, Highest Distinction)',
      period: 'Aug 2020 – Jul 2024',
      details: [
        'CGPA: 4.74 / 5.0',
        'Relevant modules: Data Structures and Algorithms, Advanced Topics in Algorithms, Object-Oriented Design and Programming, Database System Principles, Machine Learning, Natural Language Processing.',
      ],
    },
  ],
  skills: {
    'Programming': ['Python', 'JavaScript (React, Node.js, Next.js)', 'C++'],
    'Web Development': ['React', 'Next.js', 'Express', 'Node.js', 'PostgreSQL', 'MongoDB'],
    'Cloud & DevOps': ['AWS (Lambda, CloudFormation, EventBridge, S3, Cognito)', 'IaC', 'CI/CD', 'GitHub Actions'],
    'Tools': ['Webpack / Vite', 'Git', 'Bitbucket', 'GitHub Actions', 'Node.js', 'npm / pnpm'],
    'Languages': ['Indonesian', 'English', 'Mandarin'],
  },
  certifications: [
    { name: 'AWS Certified SysOps Administrator – Associate', date: 'Dec 2023' },
    { name: 'AWS Certified Developer – Associate', date: 'Dec 2023' },
    { name: 'AWS Certified Solutions Architect – Associate', date: 'Jun 2023' },
    { name: 'AWS Certified Cloud Practitioner', date: 'Feb 2023' },
  ],
  awards: [
    {
      name: 'National Science Olympiad in Informatics 2019',
      detail: 'Bronze Medal — Represented Riau Islands Province, Manado, Indonesia.',
    },
  ],
}

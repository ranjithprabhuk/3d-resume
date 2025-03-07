// data.js - Structured resume data for the 3D interactive resume

const resumeData = {
  personal: {
    name: 'Ranjith Prabhu',
    title: 'Senior Lead Developer',
    location: 'Bangalore, Karnataka',
    about:
      'I am a seasoned professional with 8+ years of expertise in web application development. My proficiency spans both frontend and backend technologies, enabling me to deliver comprehensive solutions meeting quality benchmarks. Proven leader with a track record of excellence in team management, adept at seamlessly onboarding new members, and skilled in providing guidance and mentorship to foster individual and collective growth within the team.',
  },

  experience: [
    {
      title: 'Senior Lead Developer',
      company: 'AppKnit',
      location: 'Bangalore',
      timeline: 'Nov 2020 - Present',
      description: [
        "Integral team member since the project's inception and engaged in diverse responsibilities, from requirements gathering to design collaboration, development, and project management.",
        'Played a key role in onboarding and training young talents, facilitating their integration into project work and provided technical guidance, mentoring, and support to ensure efficient completion of work items.',
        'Maintained a commitment to delivering all aspects of the project with impeccable quality.',
      ],
      skills: [
        'React',
        'Next JS',
        'Nest JS',
        'Node JS',
        'TypeScript',
        'JavaScript',
        'Graph Database',
        'Mongo DB',
        'HTML5',
        'CSS3',
        'MobX',
        'Styled Components',
        'GraphQL',
        'Microservices',
        'Redis',
        'Kafka',
      ],
      projects: ['AppKnit'],
    },
    {
      title: 'Specialist Programmer',
      company: 'Infosys',
      location: 'Bangalore',
      timeline: 'Dec 2017 - Oct 2020',
      description: [
        'Joined as a consultant via Thought Disrupt company to work on the front-end application using Angular.',
        'Offered to join as permanent employee because of the performance and took additional responsibilities to engineer the solution end to end.',
      ],
      skills: [
        'Angular',
        'React',
        'TypeScript',
        'HTML5',
        'CSS3',
        'Redux',
        'Java',
        'C#',
        'Microservices',
        'Redis',
        'Kafka',
        'JavaScript',
        'SQL',
        'GIT',
        'Microsoft Azure',
        'Agile',
      ],
      projects: ['Club & Gym Management Platform', 'Field Logistics Module'],
    },
    {
      title: 'Software Engineer',
      company: 'Robert Bosch Engineering & Solutions',
      location: 'Bangalore',
      timeline: 'June 2016 - Aug 2017',
      description: [
        'Developed responsive web applications independently for various smart solutions using Angular and Bootstrap.',
        'Led an 8-member team to successfully develop the end-to-end Active Assist web application, including backend microservices.',
      ],
      skills: [
        'Angular',
        'HTML5',
        'CSS3',
        'TypeScript',
        'Bootstrap',
        'JavaScript',
        'Java',
        'Springboot',
        'Microservices',
        'SQL',
        'Rabbit MQ',
        'GIT',
        'Bosch Cloud',
      ],
      projects: [
        'Industry 4.0',
        'Active Assist',
        'IOT Projects',
        'Micro Climate Monitoring System',
        'Intelligent Traffic Management',
        'Intelligent Transport System',
        'Smart Parking System',
      ],
    },
    {
      title: 'Software Engineer',
      company: 'KMIT Solutions',
      location: 'Coimbatore',
      timeline: 'Apr 2015 - Apr 2016',
      description: [
        'Actively collaborated with team members in the development of the frontend application, demonstrating strong teamwork.',
      ],
      skills: ['HTML5', 'CSS3', 'Bootstrap', 'AngularJS', 'JavaScript', 'SQL'],
      projects: ['POS', 'E-Commerce Apps', 'KIOSK', 'Reporting Tools'],
    },
  ],

  education: [
    {
      degree: 'Master of Engineering',
      field: 'Computer Science & Engineering',
      university: 'Anna University',
      timeline: 'June 2013 - April 2015',
      cgpa: 8.2,
      achievements: [
        'First class with distinction',
        'No history of arrears',
        'Secured first prize more than 5 times in various inter-college events for web designing and paper presentation',
        'Published a research paper in IEEE',
      ],
    },
    {
      degree: 'Master of Science',
      field: 'Software Systems',
      university: 'Bharathiar University',
      timeline: 'Jun 2008 - May 2013',
      cgpa: 8.3,
      achievements: [
        'First class with distinction',
        'Class Topper',
        'Completed the program without any arrears, demonstrating a strong academic record',
        'Secured first prize more than 15 times in various inter-college events for web designing, paper presentation, and quiz',
      ],
    },
  ],

  skills: {
    programming_languages: {
      expert: ['TypeScript', 'JavaScript'],
      intermediate: ['Java'],
      beginner: ['Python', 'C#'],
    },
    frontend: {
      expert: ['React JS', 'Angular', 'HTML5', 'CSS3', 'Next JS', 'Redux', 'MobX', 'Storybook'],
      intermediate: ['Jest', 'Mocha', 'Protractor'],
    },
    backend: ['Node JS', 'Express', 'Nest JS', 'GraphQL', 'Redis', 'Neo4j', 'Graph Database', 'Spring'],
    databases: ['MySQL', 'Mongo DB', 'Neo4j'],
    cloud_computing: ['AWS', 'OCI'],
    others: [
      'GIT',
      'Debugging',
      'Problem Solving',
      'Communication',
      'Object Oriented Programming',
      'Team Management',
      'Mentoring',
    ],
  },

  projects: [
    {
      name: 'AppKnit',
      duration: '3 years',
      description: 'A no-code enterprise app development platform built for businesses.',
      url: 'https://www.appknit.com/solutions',
    },
    {
      name: 'Field Logistics Module',
      duration: '2.5 years',
      description: 'Web application to manage and plan the logistics for materials and equipment.',
      url: 'https://www.slb.com/',
    },
    {
      name: 'Active Assist',
      duration: '6 months',
      description: 'Web-based software that provides information to facilitate varied assembly tasks.',
      url: 'https://www.youtube.com/watch?v=EA4tZHxD6X0',
    },
    {
      name: 'Smart City Solutions',
      duration: '6 months',
      description:
        'Web applications for Intelligent Traffic Management, Intelligent Transport Systems, Smart Parking, etc.',
      url: 'https://www.bosch.in/',
    },
    {
      name: 'POS & E-Commerce',
      duration: '1 year',
      description: 'Web application enabling customers to make purchases over the counter or online.',
      url: 'https://www.wildrepublictech.com/amazepos.html',
    },
  ],

  interests: ['Hiking', 'Traveling', 'Chess', 'Badminton', 'Cricket'],
};

// export default resumeData;

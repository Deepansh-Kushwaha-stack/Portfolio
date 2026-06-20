export interface Education {
  degree: string;
  institution: string;
  location: string;
  score?: string;
  period: string;
}

export interface Experience {
  role: string;
  company: string;
  location?: string;
  period: string;
  bulletPoints: string[];
}

export interface Project {
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  highlights: string[];
  category: 'Full-Stack' | 'Frontend' | 'Java & DSA' | 'Python & AI';
}

export interface SkillCategory {
  title: string;
  skills: { name: string; level: number }[]; // level in percentage (e.g. 90)
}

export interface Achievement {
  title: string;
  description: string;
  iconName: string;
}

export interface CoCurricular {
  activity: string;
  role: string;
  period: string;
}

export const RESUME_DATA = {
  personalInfo: {
    name: "Deepansh Kushwaha",
    title: "Full-Stack Developer & Software Engineer",
    tagline: "MERN Stack & Java Developer",
    subTitle: "B.Tech Computer Science Student at GLA University",
    location: "Mathura, Uttar Pradesh, India",
    phone: "+91 9997502725",
    email: "deepanshthakur866@gmail.com",
    linkedin: "https://www.linkedin.com/in/deepansh-kushwaha-667b073a6/",
    github: "https://github.com/Deepansh-Kushwaha-stack",
    leetcode: "https://leetcode.com/u/Deepansh-Kushwaha-stack/", // estimated direct link
    summary: "As an aspiring Software Engineer and Full-Stack Developer specializing in the MERN Stack and Java/DSA, I love building robust, secure, and user-centric web platforms. With a proven track record of creating end-to-end applications like HireBridge and gaining hands-on internship experience in modern web development, I am eager to apply my technical and critical-thinking skills in solving complex engineering challenges and contributing value-added outcomes to dynamic development teams."
  },
  education: [
    {
      degree: "Bachelor of Technology in Computer Science",
      institution: "GLA University",
      location: "Mathura",
      period: "June 2023 – June 2027"
    },
    {
      degree: "Intermediate Education (Class XII)",
      institution: "Mothers Touch School",
      location: "Ram Ghat Road, Aligarh",
      period: "May 2023"
    },
    {
      degree: "High School Education (Class X)",
      institution: "Shri Ram Public School",
      location: "Tejpur, Aligarh",
      period: "May 2021"
    }
  ] as Education[],
  experiences: [
    {
      role: "Website Developer Intern",
      company: "COGNIFYZ PVT.LTD",
      period: "Aug 2025 – Sep 2025",
      bulletPoints: [
        "Developed clean, modern, and responsive sample website templates for the company's internal tools and portals using HTML5, CSS3, and modern layouts.",
        "Collaborated with cross-functional team members to participate in initial requirement gatherings, prototyping sessions, and system modeling flows.",
        "Acquired practical industry exposure regarding agile development cycles, code reviews, and software design standards."
      ]
    },
    {
      role: "Software Development Trainee",
      company: "Job Oriented Value-Added Course, GLA University",
      location: "Mathura",
      period: "June 2025 – July 2025",
      bulletPoints: [
        "Mastered core principles of HTML, CSS, JavaScript, and Document Object Model (DOM) manipulation during heavy hands-on training.",
        "Designed, coded, and demonstrated HireBridge, a collaborative web platform utilizing core JavaScript paradigms and asynchronous logic.",
        "Earned training assessment honors and successfully completed structured software engineering coursework as a value-added asset."
      ]
    }
  ] as Experience[],
  projects: [
    {
      title: "HireBridge",
      description: "A secure, robust full-stack professional networking and job recruitment platform that simplifies how candidates apply and how recruiters manage hiring pipelines.",
      techStack: ["Node.js", "Express.js", "MongoDB", "EJS", "JavaScript", "JWT", "Tailwind CSS"],
      liveUrl: "https://hirebridge.netlify.app",
      githubUrl: "https://github.com/Deepansh-Kushwaha-stack/Jovac-Project.git",
      category: "Full-Stack",
      highlights: [
        "Engineered secure JWT-based (JSON Web Token) authentication flow supporting modular role-based permission control (Recruiter vs. Applicant).",
        "Created custom endpoints allowing recruiters to instantly post, update, and manage job listings through an intuitive dashboard.",
        "Built responsive client portals where job seekers can create profiles, explore opportunities, and easily submit single-tap applications.",
        "Utilized EJS template rendering with Express backend controllers to serve content dynamically and provide smooth user transitions."
      ]
    },
    {
      title: "RapidKeys",
      description: "An interactive, high-speed typing assessment web application that tracks, evaluates, and trains typing analytics (WPM, Accuracy, Keystroke speed) in real time.",
      techStack: ["React.js", "Vite", "Tailwind CSS", "JavaScript", "LocalStorage", "Lucide React"],
      liveUrl: "https://rapidkeys21.netlify.app/",
      githubUrl: "https://github.com/Deepansh-Kushwaha-stack",
      category: "Frontend",
      highlights: [
        "Designed and built an interactive typing metric engine showing real-time feedback for Words Per Minute (WPM), typing accuracy, and total keystrokes.",
        "Engineered robust custom keyboard event listener systems handling dynamic key-matching, visual color highlighting for errors, and custom layout shifts.",
        "Integrated LocalStorage persistence layer to securely record personal best logs and typing history statistics.",
        "Optimized styling and rendering cycles using Vite & React hooks to achieve close to 0ms latency in active keyboard inputs."
      ]
    }
  ] as Project[],
  skills: [
    {
      title: "Programming Languages",
      skills: [
        { name: "Java", level: 90 },
        { name: "Python", level: 75 },
        { name: "JavaScript (ES6+)", level: 85 },
        { name: "C#.net", level: 70 },
        { name: "SQL", level: 80 }
      ]
    },
    {
      title: "MERN Stack & Web Technologies",
      skills: [
        { name: "Node.js", level: 85 },
        { name: "Express.js", level: 88 },
        { name: "MongoDB", level: 80 },
        { name: "React / Vite", level: 75 },
        { name: "HTML5 / CSS3", level: 90 },
        { name: "EJS Templates", level: 85 }
      ]
    },
    {
      title: "Core CS Fundamentals",
      skills: [
        { name: "Data Structures & Algorithms (DSA)", level: 85 },
        { name: "Database Management System (DBMS)", level: 80 },
        { name: "Operating Systems (OS)", level: 75 },
        { name: "Linux / Bash scripting", level: 70 }
      ]
    },
    {
      title: "Professional Skills",
      skills: [
        { name: "Problem Solving", level: 90 },
        { name: "Critical Thinking", level: 85 },
        { name: "Effective Communication", level: 80 },
        { name: "Teamwork & Collaboration", level: 85 },
        { name: "Leadership", level: 80 }
      ]
    }
  ] as SkillCategory[],
  achievements: [
    {
      title: "LeetCode 300+ Solved",
      description: "Demonstrated strong algorithmic and programmatic competency by solving 300+ problems on Leetcode, centering around Arrays, Trees, Dynamic Programming, and Graph Traversals.",
      iconName: "Code"
    },
    {
      title: "Google Cloud Legend Tier",
      description: "Earned the prestigious Legend Tier recognition in the Google Cloud Arcade by completing multiple advanced Google Cloud hands-on labs, sandbox challenges, and cloud deployments.",
      iconName: "Cloud"
    },
    {
      title: "Infosys Springboard Certified",
      description: "Earned Java, JavaScript Programming Certification from Infosys Springboard after successfully completing structured training and assessments.",
      iconName: "Award"
    },
    {
      title: "Oracle AI & Cloud Certified",
      description: "Earned multiple professional Oracle certifications in Artificial Intelligence (AI) and Cloud technologies.",
      iconName: "Cloud"
    },
    {
      title: "Java Workshop of Manish Bhatiya",
      description: "Participated and excelled in the professional hands-on workshop covering Java Enterprise paradigms, multi-threading, and backend systems integration.",
      iconName: "Laptop"
    }
  ] as Achievement[],
  coCurricular: [
    {
      activity: "SRIJAN - Cultural Fest",
      role: "Coordinator",
      period: "September 2024"
    },
    {
      activity: "MAITREE - Annual Sports Fest",
      role: "Competitor & Volunteer",
      period: "October 2024"
    }
  ] as CoCurricular[],
  terminal: {
    profile: [
      { key: "candidate", value: "Deepansh Kushwaha" },
      { key: "education", value: "B.Tech CS @ GLA University" },
      { key: "leetcode_rank", value: "300+ Solved" },
      { key: "google_cloud", value: "Legend Tier Badge" },
      { key: "springboard", value: "Java Certified" },
      { key: "availability", value: "Available for Internship or Full-time Jobs (Summer 2026/2027)" }
    ] as { key: string; value: string }[],
    skills: [
      { name: "JAVA & DSA", level: 90 },
      { name: "MERN Stack Backend", level: 85 },
      { name: "SQL & DBMS", level: 80 },
      { name: "Linux / Python", level: 75 }
    ] as { name: string; level: number }[],
    hirebridge: {
      url: "https://hirebridge.netlify.app",
      status: "200 OK",
      server: "Node Express & MongoDB",
      auth: "JWT Token validated",
      activeRoles: "Recruiter, Applicant",
      footer: "📢 HireBridge active status check: healthy and operational."
    },
    rapidkeys: {
      url: "https://rapidkeys21.netlify.app/",
      status: "200 OK",
      server: "React Vite & Tailwind CSS",
      features: "WPM calculator, Accuracy tracker, LocalStorage logs",
      latency: "Optimized & responsive (0ms latency)",
      footer: "⚡ RapidKeys typing practice: live and ready."
    }
  }
};

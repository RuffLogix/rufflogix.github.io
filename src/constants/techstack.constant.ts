import { events } from "./event.constant";

export interface TechStack {
  category: string;
  technologies: Technology[];
}

export interface Technology {
  name: string;
  icon: string;
  description?: string;
}

export const techStackData: TechStack[] = [
  {
    category: "Programming Languages",
    technologies: [
      {
        name: "Python",
        icon: "🐍",
        description: "Machine Learning, AI, Backend Development",
      },
      {
        name: "JavaScript/TypeScript",
        icon: "📜",
        description: "Full-stack Development, Frontend/Backend",
      },
      {
        name: "Go",
        icon: "🚀",
        description: "Backend Services, gRPC, Microservices",
      },
      {
        name: "Solidity",
        icon: "💎",
        description: "Smart Contracts, Blockchain Development",
      },
      {
        name: "SQL",
        icon: "🗃️",
        description: "Database Design and Optimization",
      },
      {
        name: "C/C++",
        icon: "💻",
        description: "Systems Programming, Performance-Critical Applications",
      },
      {
        name: "Rust",
        icon: "🦀",
        description: "Systems Programming, Memory Safety",
      },
      {
        name: "Java",
        icon: "☕",
        description: "Enterprise Applications, Android Development",
      },
    ],
  },
  {
    category: "Web Technologies",
    technologies: [
      {
        name: "React/Next.js",
        icon: "⚛️",
        description: "Frontend Development, SSR/SSG",
      },
      {
        name: "Astro",
        icon: "🚀",
        description: "Static Site Generation, Performance",
      },
      {
        name: "Express.js",
        icon: "🌐",
        description: "REST APIs, Backend Services",
      },
      {
        name: "TailwindCSS",
        icon: "🎨",
        description: "Responsive Design, Utility-first CSS",
      },
      {
        name: "GSAP",
        icon: "✨",
        description: "Web Animations, Interactive UI",
      },
      {
        name: "Nest.js",
        icon: "🛠️",
        description: "Scalable Backend Applications",
      },
      {
        name: "Gin",
        icon: "🍸",
        description: "Web Framework for Go",
      },
      {
        name: "gRPC",
        icon: "🔗",
        description: "High-performance RPC Framework",
      },
      {
        name: "Ntex",
        icon: "🌿",
        description: "Web Framework for Rust",
      },
      {
        name: "Elysia",
        icon: "🦊",
        description: "Scalable Backend Applications",
      },
    ],
  },
  {
    category: "Machine Learning & AI",
    technologies: [
      {
        name: "PyTorch",
        icon: "🔥",
        description: "Deep Learning, Neural Networks",
      },
      {
        name: "TensorFlow",
        icon: "🧠",
        description: "Machine Learning Models",
      },
      {
        name: "Scikit-learn",
        icon: "📊",
        description: "Classical ML, Data Analysis",
      },
      {
        name: "Hugging Face",
        icon: "🤗",
        description: "NLP, Pre-trained Models",
      },
      {
        name: "OpenCV",
        icon: "👁️",
        description: "Computer Vision, Image Processing",
      },
      {
        name: "Monai",
        icon: "🧬",
        description: "Medical Imaging AI",
      },
      {
        name: "Flower (FL)",
        icon: "🌸",
        description: "Federated Learning Framework",
      },
    ],
  },
  {
    category: "Cloud & DevOps",
    technologies: [
      {
        name: "Docker",
        icon: "🐳",
        description: "Containerization, Deployment",
      },
      {
        name: "AWS",
        icon: "☁️",
        description: "Cloud Services, Deployment",
      },
      {
        name: "Apache Airflow",
        icon: "🌪️",
        description: "Workflow Orchestration, DAGs",
      },
      {
        name: "Google GCP",
        icon: "☁️",
        description: "Cloud Infrastructure, Deployment, Managed Services",
      },
      {
        name: "Git/GitHub",
        icon: "📝",
        description: "Version Control, Collaboration",
      },
      {
        name: "CI/CD",
        icon: "🔄",
        description: "Continuous Integration and Deployment",
      },
    ],
  },
  {
    category: "Mobile Development",
    technologies: [
      {
        name: "React Native",
        icon: "📱",
        description: "Cross-platform Mobile Apps",
      },
      {
        name: "Flutter",
        icon: "🐦",
        description: "Mobile App Development",
      },
      {
        name: "Expo",
        icon: "📦",
        description: "React Native Tooling, Rapid App Development",
      },
    ],
  },
  {
    category: "Databases & Tools",
    technologies: [
      {
        name: "PostgreSQL",
        icon: "🐘",
        description: "Relational Database Management",
      },
      {
        name: "MongoDB",
        icon: "🍃",
        description: "NoSQL Database",
      },
      {
        name: "Redis",
        icon: "🔴",
        description: "Caching, Session Storage",
      },
      {
        name: "Gradio",
        icon: "📊",
        description: "ML Model Deployment, UI",
      },
      {
        name: "Tauri",
        icon: "🦀",
        description: "Lightweight Desktop Apps with Rust",
      },
    ],
  },
];

export interface Achievement {
  emoji: string;
  title: string;
  description: string;
  link?: string;
  year?: string;
}

// Derived from the events list (single source of truth in event.constant.ts)
// for backward compatibility with the CV export and legacy components.
export const achievements: Achievement[] = events.map((event) => ({
  emoji: event.emoji,
  title: event.award ? `${event.title} — ${event.award}` : event.title,
  description: event.description,
  link: event.link,
  year: event.year,
}));

// Keep the old certifications for backward compatibility
export const certifications = achievements.slice(0, 3).map((achievement) => ({
  name: achievement.title,
  badge: achievement.emoji,
  description: achievement.description,
}));

// Flatten all technologies for marquee display
const allTechnologies: Technology[] = techStackData.flatMap(
  (category) => category.technologies,
);

// Organize technologies into 3 rows for marquee display
export const marqueeRows: Technology[][] = [
  // Row 1: Programming Languages + Some Web Tech (moving left)
  [
    ...(techStackData.find((cat) => cat.category === "Programming Languages")
      ?.technologies || []),
    ...(techStackData
      .find((cat) => cat.category === "Web Technologies")
      ?.technologies.slice(0, 3) || []),
    ...(techStackData
      .find((cat) => cat.category === "Databases & Tools")
      ?.technologies.slice(0, 2) || []),
  ],
  // Row 2: ML/AI + Cloud & DevOps + Remaining Web Tech (moving right)
  [
    ...(techStackData.find((cat) => cat.category === "Machine Learning & AI")
      ?.technologies || []),
    ...(techStackData.find((cat) => cat.category === "Cloud & DevOps")
      ?.technologies || []),
    ...(techStackData
      .find((cat) => cat.category === "Web Technologies")
      ?.technologies.slice(3) || []),
  ],
  // Row 3: Mobile Development + Remaining Databases & Tools (moving left)
  [
    ...(techStackData.find((cat) => cat.category === "Mobile Development")
      ?.technologies || []),
    ...(techStackData
      .find((cat) => cat.category === "Databases & Tools")
      ?.technologies.slice(2) || []),
    // Add some programming languages again for balance
    ...(techStackData
      .find((cat) => cat.category === "Programming Languages")
      ?.technologies.slice(0, 2) || []),
  ],
];

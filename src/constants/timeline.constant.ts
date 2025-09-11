import type {
  EducationalInformation,
  ExperienceInformation,
} from "../types/timeline.d.ts";

export const educationalInformation: EducationalInformation[] = [
  {
    image: "/images/education/chula-logo.png",
    instituteName: "Chulalongkorn University",
    program: "Computer Engineering Faculty (CP)",
    location: "Bangkok, Thailand",
    duration: "2023 - Present",
    description:
      "Currently pursuing a Bachelor's degree in Computer Engineering. Developing expertise in software development, artificial intelligence, and algorithm design while maintaining strong academic performance.",
  },
  {
    image: "/images/education/benjama-logo.jpg",
    instituteName: "Benjamarachutit School",
    program:
      "Development and Promotion of Science and Technology Excellence (DPSTE)",
    location: "Nakhon Si Thammarat, Thailand",
    duration: "2017 - 2023",
    description:
      "Completed high school with a focus on science and technology development. Gained foundational knowledge in mathematics, physics, and computer science that sparked my interest in engineering.",
  },
];

export const experienceInformation: ExperienceInformation[] = [
  // {
  //   image: "/images/experience/kbtg-logo.png",
  //   instituteName: "Kasikorn Business-Technology Group (KBTG)",
  //   program: "AI Engineer (Internship)",
  //   location: "Bangkok, Thailand",
  //   duration: "Sep 2025 - Present",
  //   description: "",
  // },
  {
    image: "/images/experience/khuiai-logo.jpg",
    instituteName: "Khui AI",
    link: "https://www.khuiai.com/",
    program: "Software Engineer Pro Max (Part-time)",
    location: "Bangkok, Thailand",
    duration: "Aug 2025 - Present",
    description:
      "I worked across frontend, backend, and AI engineering, developing a customizable layout system and building a mechanism for dynamically switching LLM model strategies to reduce hallucination and context loss, along with other features planned for future development.",
  },
  {
    image: "/images/experience/lmwn-logo.jpg",
    instituteName: "LINE MAN Wongnai",
    link: "https://lmwn.com/",
    program: "Back End Developer (Internship)",
    location: "Bangkok, Thailand",
    duration: "May 2025 - Jul 2025",
    description:
      "I developed a gRPC service in Go to retrieve data for feeding into DAGs and implemented the DAGs to automate report generation and email delivery to merchants. During this process, I also gained a strong understanding of encryption algorithms to ensure secure data handling throughout the pipeline.",
  },
  {
    image: "/images/experience/aimet-logo.png",
    instituteName: "AIMET",
    program: "Software Developer (Part-time)",
    location: "Bangkok, Thailand",
    duration: "Jan 2025 - May 2025",
    description:
      "I developed mobile and web platforms for the MDCU Wellness Center, supporting medical students at Chulalongkorn University, as well as mobile platforms for the CPIRD Wellness Center serving students in the CPIRD program. These applications were successfully deployed on both the App Store and Play Store, providing accessible wellness resources to medical students across programs.",
  },
  {
    image: "/images/experience/looloo-logo.png",
    instituteName: "Looloo Technology",
    link: "https://aimet.tech",
    program: "Machine Learning Engineer (Internship & Part-time)",
    location: "Bangkok, Thailand",
    duration: "Jun 2024 - Dec 2024",
    description:
      "I experimented with voice activity detection and speaker diarization models, integrating them into an automatic speech recognition (ASR) pipeline. I deployed AI services using the Gradio framework and Docker, ensuring scalable and user-friendly interfaces. Additionally, I scraped and preprocessed audio data and implemented audio enhancement modules to improve input quality for downstream tasks.",
  },
  {
    image: "/images/experience/kbtg-logo.png",
    instituteName: "Kasikorn Business-Technology Group (KBTG)",
    link: "https://www.kbtg.tech/",
    program: "Research Engineer (Apprenticeship)",
    location: "Bangkok, Thailand",
    duration: "Jan 2024 - Jun 2024",
    description:
      "I developed Federated Learning models for fraud detection tasks, enabling collaborative training across decentralized data sources. To ensure data confidentiality, I applied privacy-preserving techniques and policies to enhance the privacy of sensitive datasets throughout the learning process.",
  },
  {
    image: "/images/experience/kbtg-logo.png",
    instituteName: "Kasikorn Business-Technology Group (KBTG)",
    link: "https://www.kbtg.tech/",
    program: "Blockchain Developer (Internship)",
    location: "Bangkok, Thailand",
    duration: "Apr 2023 - Jun 2023",
    description:
      "I developed an E-learning platform using Next.js for the frontend and Express.js for the backend, featuring a course recommendation model that processes user input to suggest suitable courses. Additionally, I designed and implemented smart contracts for learning tokens and NFT-based course completion certificates, integrating blockchain technology into the educational experience.",
  },
];

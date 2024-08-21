export type CardProps = {
  name: string;
  description: string;
  link: string;
  image: string;
  tags: string[];
};

const GITHUB_URL: string = "https://github.com/rufflogix";
const RUFFLOGIX_IMAGE_256: string = "/images/rufflogix256.png";
const RUFFLOGIX_IMAGE_512: string = "/images/rufflogix512.png";
const RUFFLOGIX_IMAGE_1024: string = "/images/rufflogix1024.png";

const PROJECT_CARDS: CardProps[] = [
  {
    name: "RuffLogix",
    description:
      "RuffLogix is a blockchain-based platform for the development of decentralized applications.",
    link: GITHUB_URL,
    image: RUFFLOGIX_IMAGE_256,
    tags: ["blockchain", "decentralized", "applications"],
  },
  {
    name: "RuffLogix",
    description:
      "RuffLogix is a blockchain-based platform for the development of decentralized applications.",
    link: GITHUB_URL,
    image: RUFFLOGIX_IMAGE_256,
    tags: ["blockchain", "decentralized", "applications"],
  },
  {
    name: "RuffLogix",
    description:
      "RuffLogix is a blockchain-based platform for the development of decentralized applications.",
    link: GITHUB_URL,
    image: RUFFLOGIX_IMAGE_256,
    tags: ["blockchain", "decentralized", "applications"],
  },
  {
    name: "RuffLogix",
    description:
      "RuffLogix is a blockchain-based platform for the development of decentralized applications.",
    link: GITHUB_URL,
    image: RUFFLOGIX_IMAGE_256,
    tags: ["blockchain", "decentralized", "applications"],
  },
];

const ACTIVITY_CARDS: CardProps[] = [
  {
    name: "RuffLogix",
    description:
      "RuffLogix is a blockchain-based platform for the development of decentralized applications.",
    link: GITHUB_URL,
    image: RUFFLOGIX_IMAGE_256,
    tags: ["blockchain", "decentralized", "applications"],
  },
  {
    name: "RuffLogix",
    description:
      "RuffLogix is a blockchain-based platform for the development of decentralized applications.",
    link: GITHUB_URL,
    image: RUFFLOGIX_IMAGE_256,
    tags: ["blockchain", "decentralized", "applications"],
  },
  {
    name: "RuffLogix",
    description:
      "RuffLogix is a blockchain-based platform for the development of decentralized applications.",
    link: GITHUB_URL,
    image: RUFFLOGIX_IMAGE_256,
    tags: ["blockchain", "decentralized", "applications"],
  },
  {
    name: "RuffLogix",
    description:
      "RuffLogix is a blockchain-based platform for the development of decentralized applications.",
    link: GITHUB_URL,
    image: RUFFLOGIX_IMAGE_256,
    tags: ["blockchain", "decentralized", "applications"],
  },
];

export {
  GITHUB_URL,
  RUFFLOGIX_IMAGE_256,
  RUFFLOGIX_IMAGE_512,
  RUFFLOGIX_IMAGE_1024,
  PROJECT_CARDS,
  ACTIVITY_CARDS,
};

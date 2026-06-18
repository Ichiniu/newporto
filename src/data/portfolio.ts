export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  image: string;
  githubLink?: string;
  liveLink?: string;
}

export interface Skill {
  name: string;
  icon?: string;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface TimelineItem {
  id: string;
  period: string;
  role: string;
  company: string;
  description: string;
  tags?: string[];
}

export interface PortfolioData {
  personalInfo: {
    name: string;
    fullName: string;
    role: string;
    subRole: string;
    bio: string;
    email: string;
    location: string;
    github: string;
    linkedin: string;
    instagram?: string;
    splineEmbedUrl: string;
  };
  skillCategories: SkillCategory[];
  projects: Project[];
  timeline: TimelineItem[];
}

export const portfolioData: PortfolioData = {
  personalInfo: {
    name: "Ichsan",
    fullName: "Ichsan",
    role: "Fullstack Web Developer",
    subRole: "Membangun Aplikasi Web Kios & Kustom dengan PHP, Next.js & PostgreSQL",
    bio: "Saya adalah seorang Fullstack Developer yang berfokus pada pembangunan aplikasi web interaktif, berkinerja tinggi, dan responsif. Berpengalaman dalam merancang aplikasi kios interaktif, dashboard admin dinamis, serta integrasi sistem modern.",
    email: "contact@iichsan.my.id",
    location: "Indonesia",
    github: "https://github.com/Ichiniu",
    linkedin: "https://linkedin.com",
    splineEmbedUrl: "https://my.spline.design/desksetup-7855e8face4844719546578a4feb0649/"
  },
  skillCategories: [
    {
      category: "Frontend",
      skills: [
        { name: "HTML5 & CSS3" },
        { name: "JavaScript (ES6+)" },
        { name: "TypeScript" },
        { name: "React.js" },
        { name: "Next.js" },
        { name: "Tailwind CSS" }
      ]
    },
    {
      category: "Backend",
      skills: [
        { name: "PHP" },
        { name: "CodeIgniter 4" },
        { name: "Laravel" },
        { name: "Node.js" }
      ]
    },
    {
      category: "Database",
      skills: [
        { name: "PostgreSQL" },
        { name: "MySQL" },
        { name: "SQLite" }
      ]
    },
    {
      category: "Tools & Lainnya",
      skills: [
        { name: "Git & GitHub" },
        { name: "Docker" },
        { name: "Composer" },
        { name: "FlyEnv" },
        { name: "CWP (CentOS Web Panel)" }
      ]
    }
  ],
  projects: [
    {
      id: "photobox",
      title: "Chzan Photobox 📸",
      description: "Aplikasi Photobooth Kios premium berbasis web. Mendukung live filter real-time, crop & position adjustment, serta Live Photo generator (WebM Video Strip).",
      techStack: ["CodeIgniter 4", "Vanilla CSS", "JavaScript", "PostgreSQL"],
      image: "/assets/projects/photobox.png",
      githubLink: "https://github.com/Ichiniu/photobox"
    },
    {
      id: "developer-portfolio",
      title: "3D Developer Portfolio ✨",
      description: "Portofolio modern premium dengan integrasi visual 3D Spline, Glassmorphic UI, dan animasi mikro responsif.",
      techStack: ["Next.js (Static)", "Tailwind CSS", "Framer Motion", "Spline"],
      image: "/assets/projects/portfolio.png",
      githubLink: "https://github.com/Ichiniu",
      liveLink: "https://iichsan.my.id"
    }
  ],
  timeline: [
    {
      id: "exp-1",
      period: "2024 - Sekarang",
      role: "Freelance Fullstack Developer",
      company: "Mandiri",
      description: "Mengembangkan aplikasi web kustom untuk klien, merancang database PostgreSQL/MySQL, serta mengelola deployment hosting mandiri (CWP/FlyEnv).",
      tags: ["CI 4", "PostgreSQL", "Next.js", "Hosting Management"]
    },
    {
      id: "exp-2",
      period: "2023 - 2024",
      role: "Junior Web Developer",
      company: "Software House / Klien Lokal",
      description: "Membangun sistem informasi berbasis web, integrasi API pihak ketiga, dan merancang antarmuka pengguna yang ramah seluler.",
      tags: ["PHP Laravel", "MySQL", "CSS Grid/Flexbox", "Bootstrap"]
    }
  ]
};

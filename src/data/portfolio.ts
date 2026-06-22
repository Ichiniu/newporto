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
  descriptions: string[];
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
    subRole: "Sebagai alumni Web Fullstack Programmer MagangHub,  saya memiliki ketertarikan besar pada problem-solving",
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
        { name: "Node.js" },
        { name: "Prisma ORM " }
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
      period: "November 2025 - Mei 2026",
      role: "Web Fullstack Programmer PHP (MagangHub)",
      company: "PT. Tiga Serangkai",
      descriptions: [
        "Mengembangkan website reservasi ruangan berbasis web menggunakan PHP, Framework CodeIgniter, dan database MySQL.",
        "Membangun fitur utama sistem, meliputi reservasi ruangan, manajemen catering, manajemen profil pengguna, dashboard admin, rekap data, serta export laporan dalam format PDF.",
        "Merancang dan mengelola struktur database relasional MySQL untuk mendukung penyimpanan data reservasi, pengguna, transaksi catering, dan laporan secara terstruktur.",
        "Menyusun skenario pengujian, melakukan manual testing, serta mengimplementasikan automated testing menggunakan Cypress untuk memvalidasi alur reservasi secara End-to-End (E2E).",
        "Mengintegrasikan fitur notifikasi transaksi otomatis melalui email Gmail/SMTP agar pengguna mendapatkan informasi terkait status reservasi dan transaksi secara real-time."
      ],
      tags: ["PHP", "CodeIgniter", "MySQL", "Cypress", "Gmail SMTP"]
    },
    {
      id: "exp-2",
      period: "Jan 2025 - Sep 2025",
      role: "Supervisor Outlet",
      company: "PT. DRR Sejahtera Bersama",
      descriptions: [
        "Memastikan operasional restoran berjalan lancar sesuai standar operasional prosedur (SOP).",
        "Mengelola jadwal karyawan, rotasi shift, dan pencatatan kehadiran.",
        "Menangani keluhan pelanggan dan permintaan khusus secara profesional.",
        "Mengajukan permintaan inventaris dan pengadaan barang.",
        "Mendampingi tim audit saat inspeksi bulanan."
      ],
      tags: ["Operasional", "SOP", "Manajemen Tim"]
    },
    {
      id: "exp-3",
      period: "Jul 2024",
      role: "Staff Service",
      company: "Event ASEAN U-16 Boys Championship 2024",
      descriptions: [
        "Mengelola tata letak (layout) area layanan konsumsi secara efisien dan bersiaga untuk kebutuhan mendadak.",
        "Melakukan manajemen stok makanan secara real-time untuk memastikan ketersediaan logistik selama jam pelayanan operasional.",
        "Menangani berbagai permintaan khusus dari tamu dan delegasi internasional."
      ],
      tags: ["Event Management", "Logistik", "Internasional"]
    },
    {
      id: "exp-4",
      period: "Mar 2024 - Jul 2024",
      role: "IT Support",
      company: "PT. Ayo Menebar Kebaikan",
      descriptions: [
        "Mengembangkan website company profile perusahaan menggunakan CMS WordPress.",
        "Melakukan verifikasi dan pengecekan silang terhadap data invoice untuk mencegah terjadinya duplikasi.",
        "Membantu operasional logistik pada proses pemeriksaan fisik dan validasi paket di area Gudang."
      ],
      tags: ["WordPress", "IT Support", "Logistik"]
    }
  ]
};

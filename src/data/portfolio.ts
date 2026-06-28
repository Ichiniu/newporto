export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  image: string;
  images?: string[];
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
    whatsapp?: string;
    splineEmbedUrl: string;
  };
  skillCategories: SkillCategory[];
  projects: Project[];
  timeline: TimelineItem[];
}

export const portfolioData: Record<"id" | "en", PortfolioData> = {
  id: {
    personalInfo: {
      name: "Ichsan",
      fullName: "Ichsan",
      role: "Fullstack Web Developer",
      subRole: "Sebagai alumni Web Fullstack Programmer MagangHub, saya memiliki ketertarikan besar pada problem-solving",
      bio: "Saya fokus pada pembuatan aplikasi web berkualitas, interaktif, dengan performa terbaik, serta pengalaman pengguna yang mulus.",
      email: "ikhsanwahyu04@gmail.com",
      location: "Indonesia",
      github: "https://github.com/Ichiniu",
      linkedin: "https://www.linkedin.com/in/ikhsan-wahyu-utomo-3586701b9/",
      instagram: "https://instagram.com/iich.in",
      whatsapp: "https://wa.me/6289649261851",
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
          { name: "Prisma ORM" }
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
        id: "kasir",
        title: "Kasir App - Modern POS",
        description: "Aplikasi Point of Sale (POS) / Kasir modern yang dibangun dengan Next.js 15, Prisma ORM, MySQL, dan shadcn/ui. Dilengkapi manajemen produk, dashboard penjualan interaktif, riwayat transaksi lengkap, laporan keuangan, multi-role (Admin/Kasir).",
        techStack: ["Next.js 15", "Prisma ORM", "MySQL", "NextAuth.js", "Tailwind CSS", "shadcn/ui", "Midtrans"],
        image: "/assets/projects/project/kasir.png",
        images: ["/assets/projects/project/kasir.png", "/assets/projects/project/kasir2.png"],
        githubLink: "https://github.com/Ichiniu/kasir-app"
      },
      {
        id: "wbot",
        title: "Personal WhatsApp Assistant",
        description: "Asisten pribadi berbasis AI yang terintegrasi langsung dengan WhatsApp menggunakan library Baileys. Didukung pemrosesan bahasa alami (Llama 3.3 via Groq API), memori jangka panjang berbasis PostgreSQL, sistem pengingat otomatis (reminder) berbasis waktu alami & Cron, daily planner, serta dashboard web real-time untuk memantau status server dan database.",
        techStack: ["Node.js", "PostgreSQL", "Groq API (Llama 3.3)", "Baileys WhatsApp", "Express.js", "Tailwind CSS"],
        image: "/assets/projects/project/chatbot.png",
        images: ["/assets/projects/project/chatbot.png"],
        githubLink: "https://github.com/Ichiniu/wbot"
      },
      {
        id: "photobox",
        title: "Chzan Photobox",
        description: "Aplikasi Photobooth berbasis web. Mendukung live filter real-time, crop & position adjustment, serta Live Photo generator (WebM Video Strip).",
        techStack: ["CodeIgniter 4", "Vanilla CSS", "JavaScript", "PostgreSQL"],
        image: "/assets/projects/photobox.png",
        images: ["/assets/projects/photobox.png", "/assets/projects/photobox2.png"],
        githubLink: "https://github.com/Ichiniu/photobox"
      },
      {
        id: "reservasi",
        title: "Reservasi TSSO",
        description: "Website Reservasi ruangan yang digunakan untuk perekapan kegiatan PT. Tiga Serangkai maupun pihak eksternal.",
        techStack: ["Codeigniter", "Tailwind CSS", "Integrasi Gmail", "Oauth"],
        image: "/assets/projects/reservasi.png",
        images: ["/assets/projects/reservasi.png", "/assets/projects/reservasi2.png"],
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
  },
  en: {
    personalInfo: {
      name: "Ichsan",
      fullName: "Ichsan",
      role: "Fullstack Web Developer",
      subRole: "As an alumnus of the MagangHub Web Fullstack Programmer program, I have a strong passion for problem-solving",
      bio: "I focus on developing high-quality, interactive web applications with optimal performance and seamless user experiences.",
      email: "ikhsanwahyu04@gmail.com",
      location: "Indonesia",
      github: "https://github.com/Ichiniu",
      linkedin: "https://www.linkedin.com/in/ikhsan-wahyu-utomo-3586701b9/",
      instagram: "https://instagram.com/iich.in",
      whatsapp: "https://wa.me/6289649261851",
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
          { name: "Prisma ORM" }
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
        category: "Tools & Others",
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
        id: "kasir",
        title: "Kasir App - Modern POS",
        description: "A modern Point of Sale (POS) / Cashier application built with Next.js 15, Prisma ORM, MySQL, and shadcn/ui. Features product management, interactive sales dashboards, comprehensive transaction history, financial reporting, and role-based access control (Admin/Cashier).",
        techStack: ["Next.js 15", "Prisma ORM", "MySQL", "NextAuth.js", "Tailwind CSS", "shadcn/ui", "Midtrans"],
        image: "/assets/projects/project/kasir.png",
        images: ["/assets/projects/project/kasir.png", "/assets/projects/project/kasir2.png"],
        githubLink: "https://github.com/Ichiniu/kasir-app"
      },
      {
        id: "wbot",
        title: "Personal WhatsApp Assistant",
        description: "An AI-powered personal assistant integrated directly with WhatsApp using the Baileys library. Powered by natural language processing (Llama 3.3 via Groq API), long-term memory with PostgreSQL, automated reminders utilizing natural language & Cron, a daily planner, and a real-time web dashboard for monitoring server and database status.",
        techStack: ["Node.js", "PostgreSQL", "Groq API (Llama 3.3)", "Baileys WhatsApp", "Express.js", "Tailwind CSS"],
        image: "/assets/projects/project/chatbot.png",
        images: ["/assets/projects/project/chatbot.png"],
        githubLink: "https://github.com/Ichiniu/wbot"
      },
      {
        id: "photobox",
        title: "Chzan Photobox",
        description: "A web-based photobooth application. Supports real-time live filters, crop & position adjustments, and a Live Photo generator (WebM Video Strip).",
        techStack: ["CodeIgniter 4", "Vanilla CSS", "JavaScript", "PostgreSQL"],
        image: "/assets/projects/photobox.png",
        images: ["/assets/projects/photobox.png", "/assets/projects/photobox2.png"],
        githubLink: "https://github.com/Ichiniu/photobox"
      },
      {
        id: "reservasi",
        title: "Reservasi TSSO",
        description: "A room reservation website utilized for logging and managing events for PT. Tiga Serangkai as well as external organizations.",
        techStack: ["Codeigniter", "Tailwind CSS", "Integrasi Gmail", "Oauth"],
        image: "/assets/projects/reservasi.png",
        images: ["/assets/projects/reservasi.png", "/assets/projects/reservasi2.png"],
        githubLink: "https://github.com/Ichiniu",
        liveLink: "https://iichsan.my.id"
      }
    ],
    timeline: [
      {
        id: "exp-1",
        period: "November 2025 - May 2026",
        role: "PHP Web Fullstack Programmer (MagangHub)",
        company: "PT. Tiga Serangkai",
        descriptions: [
          "Developed a web-based room reservation platform using PHP, the CodeIgniter framework, and a MySQL database.",
          "Built core system functionalities, including room booking, catering management, user profile administration, an admin dashboard, data aggregation, and PDF report exporting.",
          "Designed and managed the relational MySQL database schema to ensure structured storage for reservations, users, catering transactions, and reports.",
          "Authored test scenarios, conducted manual testing, and implemented automated End-to-End (E2E) testing with Cypress to validate the reservation workflow.",
          "Integrated automated transaction notifications via Gmail/SMTP to provide users with real-time updates regarding reservation and transaction statuses."
        ],
        tags: ["PHP", "CodeIgniter", "MySQL", "Cypress", "Gmail SMTP"]
      },
      {
        id: "exp-2",
        period: "Jan 2025 - Sep 2025",
        role: "Outlet Supervisor",
        company: "PT. DRR Sejahtera Bersama",
        descriptions: [
          "Ensured restaurant operations ran smoothly in accordance with Standard Operating Procedures (SOP).",
          "Managed employee scheduling, shift rotations, and attendance tracking.",
          "Resolved customer complaints and handled special requests in a professional manner.",
          "Managed inventory requests and the procurement of supplies.",
          "Assisted the audit team during monthly compliance inspections."
        ],
        tags: ["Operations", "SOP", "Team Management"]
      },
      {
        id: "exp-3",
        period: "Jul 2024",
        role: "Service Staff",
        company: "Event ASEAN U-16 Boys Championship 2024",
        descriptions: [
          "Efficiently managed the layout of the catering service area and remained on standby for urgent requirements.",
          "Performed real-time food stock management to guarantee logistics availability during operational service hours.",
          "Handled various special requests from international guests and delegates."
        ],
        tags: ["Event Management", "Logistics", "International"]
      },
      {
        id: "exp-4",
        period: "Mar 2024 - Jul 2024",
        role: "IT Support",
        company: "PT. Ayo Menebar Kebaikan",
        descriptions: [
          "Developed the company profile website using WordPress CMS.",
          "Verified and cross-checked invoice data to prevent duplication and billing errors.",
          "Supported logistics operations in physical inspection and package validation within the warehouse."
        ],
        tags: ["WordPress", "IT Support", "Logistics"]
      }
    ]
  }
};

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "id" | "en";

interface LanguageContextProps {
  lang: Language;
  toggleLanguage: () => void;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  id: {
    // Header & Navigation
    menu: "Menu",
    contact: "Hubungi",
    home: "Home",
    about: "About",
    skills: "Skills",
    projects: "Projects",
    experience: "Experience",
    
    // Hero
    freelanceReady: "Ready for Freelance & Projects",
    heroGreeting: "Halo, Saya",
    viewProjects: "Lihat Proyek",
    contactMe: "Hubungi Saya",
    scrollDown: "SCROLL DOWN",
    
    // About
    aboutTitle: "Tentang Saya",
    aboutSubtitle: "Branding & Filosofi Kerja",
    aboutBio2: "Perjalanan saya di dunia pemrograman lahir dari rasa ingin tahu yang tak pernah padam. Sebagai lulusan S1 Teknik Informatika dan Alumni sertifikat Web Fullstack Programmer (Kemnaker), saya telah membangun fondasi teknis yang kuat di atas tech stack komprehensif. Saya bersyukur mendapat kesempatan merancang solusi end-to-end yang berdampak nyata mulai dari sistem reservasi ruangan (reservasi.tigaserangkai.com) lengkap dengan notifikasi email otomatis dan E2E testing via Cypress, otomasi WhatsApp Bot berbasis Node.js dengan arsitektur Long-Term Memory, hingga aplikasi POS fullstack dengan sistem RBAC dan audit log transaksi. Bagi saya, kepuasan tertinggi seorang developer bukan sekadar ketika kode berjalan tanpa error, melainkan saat aplikasi yang dibangun benar-benar mengubah cara orang bekerja menjadi lebih mudah dan efisien. Saat ini, saya aktif mendalami administrasi Linux (Ubuntu Server), karena saya percaya aplikasi yang hebat hanya akan bersinar jika ditopang infrastruktur yang stabil, aman, dan andal. Saya menempatkan diri sebagai seorang lifelong learner, adaptif, kolaboratif, dan selalu terbuka terhadap teknologi baru — dengan satu tujuan: memberikan dampak positif yang nyata di setiap proyek yang saya kerjakan.",
    highPerformance: "Performa Tinggi",
    highPerformanceDesc: "Website cepat & responsif",
    securityFirst: "Keamanan Utama",
    securityFirstDesc: "Standar coding yang aman",
    experienceYears: "1 Tahun",
    keepLearning: "& TERUS BELAJAR",
    experienceLabel: "PENGALAMAN",
    completedProjects: "Proyek",
    liveLabel: "LIVE",
    deployedLabel: "SELESAI DIDEPLOY",
    serverReliability: "KEANDALAN SERVER",
    uptimeLabel: "UPTIME",
    
    // Skills
    skillsTitle: "Keahlian Teknis",
    skillsSubtitle: "Teknologi yang Digunakan",
    
    // Projects
    projectsTitle: "Showcase",
    projectsSubtitle: "Project",
    allFilter: "Semua",
    codeLabel: "Code",
    liveDemoLabel: "Live Demo",
    
    // Experience
    timelineTitle: "Riwayat Karir",
    timelineSubtitle: "Pengalaman & Perjalanan",
    
    // Contact
    contactTitle: "Hubungi",
    contactSubtitle: "Hubungi Saya",
    collaborate: "Mari Berkolaborasi!",
    collaborateDesc: "Butuh bantuan untuk menyelesaikan proyek, membangun aplikasi kios, atau berkonsultasi? Jangan ragu menghubungi saya kapan saja.",
    locationLabel: "Lokasi",
    yourName: "Nama Anda",
    enterName: "Masukkan nama Anda...",
    emailAddress: "Alamat Email",
    enterEmail: "Masukkan email Anda...",
    messageLabel: "Pesan",
    typeMessage: "Ketik pesan Anda di sini...",
    sending: "Mengirim...",
    sendMessage: "Kirim Pesan",
    messageSent: "Pesan Terkirim!",
    messageSentDesc: "Terima kasih telah menghubungi saya, Mas Ichsan. Saya akan segera membalas email Anda secepatnya.",
    sendAnother: "Kirim Pesan Lain",
    
    // Certificates
    certificatesTitle: "Sertifikasi & Lisensi",
    certificatesSubtitle: "Kredensial & Pencapaian Profesional",
    certificatesBadge: "Terus Bergeser",
    certificateZoom: "Klik untuk melihat pratinjau sertifikat",
    closeCertificate: "Tutup Pratinjau",

    // Footer
    createdBy: "",
    backToTop: "Kembali ke atas",
  },
  en: {
    // Header & Navigation
    menu: "Menu",
    contact: "Contact",
    home: "Home",
    about: "About",
    skills: "Skills",
    projects: "Projects",
    experience: "Experience",
    
    // Hero
    freelanceReady: "Ready for Freelance & Projects",
    heroGreeting: "Hello, I am",
    viewProjects: "View Projects",
    contactMe: "Contact Me",
    scrollDown: "SCROLL DOWN",
    
    // About
    aboutTitle: "About Me",
    aboutSubtitle: "Professional Profile & Work Philosophy",
    aboutBio2: "My journey in software engineering is driven by an enduring passion for problem-solving and innovation. Holding a Bachelor's degree in Informatics and certified as a Web Fullstack Programmer by Kemnaker, I have built a solid technical foundation across a modern, comprehensive tech stack. I have architected and deployed impactful end-to-end solutions, including an enterprise room reservation platform (reservasi.tigaserangkai.com) featuring automated email workflows and Cypress E2E testing, a Node.js-powered WhatsApp automation agent with Long-Term Memory architecture, and a fullstack POS application with granular RBAC and audit logging. To me, engineering excellence extends beyond bug-free code—it lies in building intuitive software that enhances productivity and solves real-world challenges. Currently expanding my expertise in Linux server administration (Ubuntu Server) and containerization, I continuously strive to deliver robust, scalable, and secure digital experiences.",
    highPerformance: "High Performance",
    highPerformanceDesc: "Fast, accessible & responsive web applications",
    securityFirst: "Security First",
    securityFirstDesc: "Adherence to secure coding standards & best practices",
    experienceYears: "1 Year",
    keepLearning: "& KEEP LEARNING",
    experienceLabel: "EXPERIENCE",
    completedProjects: "Projects",
    liveLabel: "LIVE",
    deployedLabel: "DEPLOYED",
    serverReliability: "SERVER RELIABILITY",
    uptimeLabel: "UPTIME",
    
    // Skills
    skillsTitle: "Technical Skills",
    skillsSubtitle: "Technologies Used",
    
    // Projects
    projectsTitle: "Showcase",
    projectsSubtitle: "Projects",
    allFilter: "All",
    codeLabel: "Code",
    liveDemoLabel: "Live Demo",
    
    // Experience
    timelineTitle: "Career History",
    timelineSubtitle: "Experience & Journey",
    
    // Contact
    contactTitle: "Contact",
    contactSubtitle: "Contact Me",
    collaborate: "Let's Collaborate!",
    collaborateDesc: "Looking for a developer to bring your project to life, build scalable web solutions, or discuss technical challenges? Let's connect.",
    locationLabel: "Location",
    yourName: "Your Name",
    enterName: "Enter your name...",
    emailAddress: "Email Address",
    enterEmail: "Enter your email...",
    messageLabel: "Message",
    typeMessage: "Type your message here...",
    sending: "Sending...",
    sendMessage: "Send Message",
    messageSent: "Message Sent!",
    messageSentDesc: "Thank you for reaching out. I have received your message and will get back to you shortly.",
    sendAnother: "Send Another Message",

    // Certificates
    certificatesTitle: "Certifications & Credentials",
    certificatesSubtitle: "Professional Credentials & Achievements",
    certificatesBadge: "Continuous Learning",
    certificateZoom: "Click to preview certificate",
    closeCertificate: "Close Preview",
    
    // Footer
    createdBy: "Made with Next.js Static Export & Tailwind CSS.",
    backToTop: "Back to top",
  }
};
  
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    // Clean up dark mode and theme settings
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("theme");

    // Bersihkan legacy storage "lang" agar tidak memaksa default ke "id"
    localStorage.removeItem("lang");

    // Sinkronkan preferensi bahasa jika user pernah memilih secara manual
    const savedLang = localStorage.getItem("portfolio_lang_v2") as Language | null;
    if (savedLang === "id" || savedLang === "en") {
      queueMicrotask(() => {
        setLangState(savedLang);
      });
      document.documentElement.lang = savedLang;
    } else {
      document.documentElement.lang = "en";
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("portfolio_lang_v2", newLang);
    document.documentElement.lang = newLang;
  };

  const toggleLanguage = () => {
    const nextLang = lang === "id" ? "en" : "id";
    setLang(nextLang);
  };

  const t = (key: string) => {
    return translations[lang]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

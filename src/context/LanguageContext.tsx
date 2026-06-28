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
    collaborateDesc: "Apakah Anda sedang mencari developer untuk menyelesaikan project Anda, membuat aplikasi kios, atau ingin berdiskusi? Silakan hubungi saya kapan saja!",
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
    
    // Footer
    createdBy: "Dibuat dengan Next.js Static Export & Tailwind CSS. Hosted on CWP.",
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
    aboutSubtitle: "Branding & Work Philosophy",
    aboutBio2: "My journey in the programming world was born from an unquenchable curiosity. As an IT Bachelor graduate and a certified Web Fullstack Programmer alumnus (Kemnaker), I have built a strong technical foundation on a comprehensive tech stack. I am grateful for the opportunity to design impactful end-to-end solutions, ranging from a room reservation system (reservasi.tigaserangkai.com) complete with automated email notifications and E2E testing via Cypress, a Node.js-based WhatsApp Bot automation with Long-Term Memory architecture, to a fullstack POS application with RBAC and transaction audit logs. For me, a developer's ultimate satisfaction is not just when the code runs without errors, but when the built application truly transforms how people work, making it easier and more efficient. Currently, I am actively diving into Linux administration (Ubuntu Server), believing that great applications can only shine if supported by a stable, secure, and reliable infrastructure. I position myself as a lifelong learner, adaptive, collaborative, and always open to new technologies — with one single goal: to deliver a real positive impact in every project I work on.",
    highPerformance: "High Performance",
    highPerformanceDesc: "Fast & responsive website",
    securityFirst: "Security First",
    securityFirstDesc: "Secure coding standards",
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
    collaborateDesc: "Are you looking for a developer to complete your project, build a kiosk application, or want to discuss? Please contact me anytime!",
    yourName: "Your Name",
    enterName: "Enter your name...",
    emailAddress: "Email Address",
    enterEmail: "Enter your email...",
    messageLabel: "Message",
    typeMessage: "Type your message here...",
    sending: "Sending...",
    sendMessage: "Send Message",
    messageSent: "Message Sent!",
    messageSentDesc: "Thank you for contacting me. I will get back to you as soon as possible.",
    sendAnother: "Send Another Message",
    
    // Footer
    createdBy: "Made with Next.js Static Export & Tailwind CSS. Hosted on CWP.",
    backToTop: "Back to top",
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>("id");

  useEffect(() => {
    // Clean up dark mode and theme settings
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("theme");

    const savedLang = localStorage.getItem("lang") as Language;
    if (savedLang === "id" || savedLang === "en") {
      setLangState(savedLang);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
  };

  const toggleLanguage = () => {
    setLang(lang === "id" ? "en" : "id");
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

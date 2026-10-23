"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Award, ZoomIn, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface CertificateItem {
  id: string;
  title: {
    id: string;
    en: string;
  };
  issuer: {
    id: string;
    en: string;
  };
  image: string;
  badge: string;
}

const certificates: CertificateItem[] = [
  {
    id: "cert-maganghub",
    title: {
      id: "Web Fullstack Programmer (PHP)",
      en: "Web Fullstack Programmer (PHP)"
    },
    issuer: {
      id: "Kemnaker RI & PT. Tiga Serangkai Pustaka Mandiri",
      en: "Ministry of Manpower RI & PT. Tiga Serangkai"
    },
    image: "/assets/certificate/sertif-maganghub.png",
    badge: "Fullstack"
  },
  {
    id: "cert-rekomendasi",
    title: {
      id: "Surat Rekomendasi Kerja Profesional",
      en: "Professional Recommendation Letter"
    },
    issuer: {
      id: "PT. Tiga Serangkai Inti Corpora",
      en: "PT. Tiga Serangkai Inti Corpora"
    },
    image: "/assets/certificate/surat-rekomendasi.png",
    badge: "Reference"
  },
  {
    id: "cert-komdigi",
    title: {
      id: "Intermediate Assistant Web Developer",
      en: "Intermediate Assistant Web Developer"
    },
    issuer: {
      id: "KOMDIGI - Digital Talent Scholarship 2026",
      en: "KOMDIGI - Digital Talent Scholarship 2026"
    },
    image: "/assets/certificate/komdigi.png",
    badge: "Web Dev"
  },
  {
    id: "cert-dicoding",
    title: {
      id: "Productivity with AI Bootcamp",
      en: "Productivity with AI Bootcamp"
    },
    issuer: {
      id: "Dicoding Indonesia & Badan Ekraf Digital Talent 2026",
      en: "Dicoding Indonesia & Badan Ekraf Digital Talent 2026"
    },
    image: "/assets/certificate/dicoding.png",
    badge: "AI / ML"
  },
  {
    id: "cert-dat",
    title: {
      id: "Data Analytics & Technology (DAT)",
      en: "Data Analytics & Technology (DAT)"
    },
    issuer: {
      id: "Desktop Application Training - eBiz Microsoft Partner",
      en: "Desktop Application Training - eBiz Microsoft Partner"
    },
    image: "/assets/certificate/DAT.png",
    badge: "Analytics"
  },
  {
    id: "cert-toefl",
    title: {
      id: "English Proficiency Test (TOEFL)",
      en: "English Proficiency Test (TOEFL)"
    },
    issuer: {
      id: "LPIA Surakarta - Skor 539",
      en: "LPIA Surakarta - Score 539"
    },
    image: "/assets/certificate/TOELF.png",
    badge: "Language"
  },
  {
    id: "cert-wmk",
    title: {
      id: "Wirausaha Merdeka (WMK)",
      en: "Wirausaha Merdeka (WMK)"
    },
    issuer: {
      id: "Kemendikbudristek & Univ. Muhammadiyah Surakarta",
      en: "Ministry of Education & Culture RI"
    },
    image: "/assets/certificate/wmk.jpg",
    badge: "National"
  },
  {
    id: "cert-amk",
    title: {
      id: "IT Support & Logistik Operasional",
      en: "IT Support & Operations Logistics"
    },
    issuer: {
      id: "PT. Ayo Menebar Kebaikan",
      en: "PT. Ayo Menebar Kebaikan"
    },
    image: "/assets/certificate/amk.jpg",
    badge: "Professional"
  },
  {
    id: "cert-masmba",
    title: {
      id: "Finalis Mas & Mbak Duta Wisata",
      en: "Tourism Ambassador Finalist"
    },
    issuer: {
      id: "Dinas Pendidikan dan Kebudayaan Kab. Sukoharjo",
      en: "Department of Education & Culture Sukoharjo"
    },
    image: "/assets/certificate/masmba.jpg",
    badge: "Honors"
  },
  {
    id: "cert-dies",
    title: {
      id: "Penghargaan Prestasi Dies Natalis",
      en: "Dies Natalis Achievement Award"
    },
    issuer: {
      id: "Forum Maharani of Aspiration",
      en: "Forum Maharani of Aspiration"
    },
    image: "/assets/certificate/dies.png",
    badge: "Achievement"
  },
  {
    id: "cert-dies1",
    title: {
      id: "Piagam Apresiasi Dies Natalis",
      en: "Dies Natalis Certificate of Appreciation"
    },
    issuer: {
      id: "Forum Maharani of Aspiration",
      en: "Forum Maharani of Aspiration"
    },
    image: "/assets/certificate/dies1.png",
    badge: "Recognition"
  },
  {
    id: "cert-aai",
    title: {
      id: "Asistensi Agama Islam (AAI)",
      en: "Islamic Religious Assistance (AAI)"
    },
    issuer: {
      id: "LDK Liwa'ul Islam - STMIK Sinar Nusantara",
      en: "STMIK Sinar Nusantara"
    },
    image: "/assets/certificate/AAI.png",
    badge: "Organization"
  }
];

export const Certificates: React.FC = () => {
  const { lang, t } = useLanguage();
  const [activeCert, setActiveCert] = useState<CertificateItem | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation & body scroll lock when modal open
  useEffect(() => {
    if (!activeCert) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveCert(null);
      } else if (e.key === "ArrowRight") {
        const currentIndex = certificates.findIndex((c) => c.id === activeCert.id);
        const nextIndex = (currentIndex + 1) % certificates.length;
        setActiveCert(certificates[nextIndex]);
      } else if (e.key === "ArrowLeft") {
        const currentIndex = certificates.findIndex((c) => c.id === activeCert.id);
        const prevIndex = (currentIndex - 1 + certificates.length) % certificates.length;
        setActiveCert(certificates[prevIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeCert]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeCert) return;
    const currentIndex = certificates.findIndex((c) => c.id === activeCert.id);
    const nextIndex = (currentIndex + 1) % certificates.length;
    setActiveCert(certificates[nextIndex]);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeCert) return;
    const currentIndex = certificates.findIndex((c) => c.id === activeCert.id);
    const prevIndex = (currentIndex - 1 + certificates.length) % certificates.length;
    setActiveCert(certificates[prevIndex]);
  };

  return (
    <section
      id="certificates"
      className="py-14 md:py-24 relative overflow-hidden bg-bg border-t border-[var(--color-surface-soft)]/50"
      aria-label="Certificates and Credentials"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 xl:px-24 mb-8 md:mb-12">
        <div className="flex flex-col gap-2 items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-soft/60 border border-[var(--color-surface-soft)] text-text text-xs font-mono font-medium mb-1">
            <Award className="w-3.5 h-3.5 text-primary" />
            <span>{t("certificatesBadge")}</span>
            <Sparkles className="w-3 h-3 text-primary animate-pulse" />
          </div>
          <span className="text-xs md:text-sm font-semibold tracking-wider text-text font-mono uppercase">
            {t("certificatesTitle")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text">
            {t("certificatesSubtitle")}
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mt-1" />
        </div>
      </div>

      {/* Infinite Marquee Track (Bergerak Terus ke Arah KANAN) */}
      <div className="relative w-full overflow-hidden py-4 select-none">
        {/* Left & Right Soft Blur Gradients */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 md:w-36 bg-gradient-to-r from-[var(--color-bg)] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 md:w-36 bg-gradient-to-l from-[var(--color-bg)] to-transparent z-10" />

        {/* Marquee Runner: Bergerak ke kanan dengan seamless duplicate loop */}
        <div className="animate-marquee-right flex gap-5 sm:gap-6 px-4">
          {[...certificates, ...certificates].map((item, index) => {
            const currentTitle = item.title[lang];
            const currentIssuer = item.issuer[lang];

            return (
              <div
                key={`${item.id}-${index}`}
                onClick={() => setActiveCert(item)}
                className="group relative w-[250px] sm:w-[310px] md:w-[350px] h-[170px] sm:h-[210px] md:h-[235px] shrink-0 cursor-pointer select-none transition-transform duration-300 hover:scale-105"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveCert(item);
                  }
                }}
                aria-label={`${t("certificateZoom")}: ${currentTitle}`}
              >
                <Image
                  src={item.image}
                  alt={currentTitle}
                  fill
                  unoptimized
                  loading="eager"
                  sizes="(max-width: 768px) 310px, 350px"
                  data-certificate-img="true"
                  className="object-contain select-none transition-transform duration-300 group-hover:scale-102"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal Pratinjau Sertifikat */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveCert(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-text/80 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-modal-title"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[var(--color-bg)] rounded-2xl md:rounded-3xl border border-[var(--color-surface-soft)] shadow-2xl overflow-hidden"
            >
              {/* Modal Topbar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--color-surface-soft)] bg-[var(--color-bg)] z-10">
                <div className="flex items-center gap-2.5 pr-4 overflow-hidden">
                  <Award className="w-5 h-5 text-primary shrink-0" />
                  <div className="overflow-hidden">
                    <h3 id="cert-modal-title" className="text-sm sm:text-base font-bold text-text truncate">
                      {activeCert.title[lang]}
                    </h3>
                    <p className="text-xs text-text/70 truncate">
                      {activeCert.issuer[lang]}
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setActiveCert(null)}
                  className="p-2 rounded-xl border border-[var(--color-surface-soft)] bg-surface-soft/40 hover:bg-surface-soft text-text transition-colors cursor-pointer shrink-0"
                  aria-label={t("closeCertificate")}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Image Area with Navigation Buttons */}
              <div className="relative flex-1 min-h-[300px] sm:min-h-[460px] max-h-[72vh] p-3 sm:p-6 bg-surface-soft/10 flex items-center justify-center overflow-hidden">
                <Image
                  src={activeCert.image}
                  alt={activeCert.title[lang]}
                  fill
                  unoptimized
                  sizes="100vw"
                  data-certificate-img="true"
                  className="object-contain p-2 select-none"
                  priority
                />

                {/* Prev Navigation Button */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-[var(--color-bg)]/90 hover:bg-[var(--color-bg)] text-text border border-[var(--color-surface-soft)] shadow-lg transition-transform hover:scale-110 cursor-pointer z-20"
                  aria-label="Previous Certificate"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Next Navigation Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-[var(--color-bg)]/90 hover:bg-[var(--color-bg)] text-text border border-[var(--color-surface-soft)] shadow-lg transition-transform hover:scale-110 cursor-pointer z-20"
                  aria-label="Next Certificate"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Footer */}
              <div className="px-5 py-3 border-t border-[var(--color-surface-soft)]/60 bg-[var(--color-bg)] flex items-center justify-between text-xs font-mono text-text/70">
                <span>{activeCert.badge} • Verified Credential</span>
                <span className="hidden sm:inline">Tekan Esc untuk menutup / Gunakan panah keyboard</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, MessageCircle, Terminal } from "lucide-react";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/Icons";
import { Button } from "./ui/Button";
import { SpotlightBackground } from "./SpotlightBackground";
import { portfolioData } from "@/data/portfolio";
import { useLanguage } from "@/context/LanguageContext";

export const Hero = () => {
  const { lang, t } = useLanguage();
  const {
    name,
    fullName,
    role,
    subRole,
    bio,
    email,
    location,
    github,
    linkedin,
    instagram,
    whatsapp
  } = portfolioData[lang].personalInfo;

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-12 xl:px-24 pt-24 pb-20 md:py-0 overflow-hidden bg-bg"
    >
      {/* Interactive Spotlight Light Beam + Content Reveal */}
      <SpotlightBackground targetContentId="hero-left-content" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center z-10">

        {/* Left Side: Professional Identity */}
        <div id="hero-left-content" className="lg:col-span-7 flex flex-col gap-5 md:gap-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary border border-surface-soft text-text text-xs md:text-sm font-medium w-fit"
          >
            <Terminal className="w-4 h-4" />
            <span>{t("freelanceReady")}</span>
          </motion.div>

          <div className="flex flex-col gap-2">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-[var(--color-text)] font-sans"
            >
              {t("heroGreeting")} <span className="text-text font-extrabold">{name}</span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl sm:text-2xl md:text-3xl font-semibold text-text"
            >
              {role}
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-[var(--color-text)] text-sm sm:text-base md:text-lg max-w-xl leading-relaxed font-sans"
          >
            {subRole}. {bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs md:text-sm text-[var(--color-text)] font-mono"
          >
            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-surface-soft)]">
              <Terminal data-tone="secondary" className="w-4 h-4 text-text " />
              {fullName}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-surface-soft)]">
              <MapPin data-tone="secondary" className="w-4 h-4 text-text " />
              {location}
            </span>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-surface-soft)] hover:border-primary-hover hover:text-text transition-all max-w-full"
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span className="break-all">{email}</span>
            </a>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 sm:mt-4"
          >
            <Button
              id="btn-view-projects"
              variant="primary"
              className="min-h-[44px]"
              onClick={() => {
                const element = document.getElementById("projects");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {t("viewProjects")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              id="btn-contact-hero"
              variant="secondary"
              className="min-h-[44px]"
              onClick={() => {
                const element = document.getElementById("contact");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {t("contactMe")}
            </Button>

            <div className="flex items-center gap-2">
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-3 min-w-[44px] min-h-[44px] rounded-xl border border-[var(--color-surface-soft)] hover:border-primary-hover bg-[var(--color-bg)] text-[var(--color-text)] hover:text-text transition-all"
                title="GitHub Profile"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-3 min-w-[44px] min-h-[44px] rounded-xl border border-[var(--color-surface-soft)] hover:border-primary-hover bg-[var(--color-bg)] text-[var(--color-text)] hover:text-text transition-all"
                title="LinkedIn Profile"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-3 min-w-[44px] min-h-[44px] rounded-xl border border-[var(--color-surface-soft)] hover:border-primary-hover bg-[var(--color-bg)] text-[var(--color-text)] hover:text-text transition-all"
                  title="Instagram Profile"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              )}
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-3 min-w-[44px] min-h-[44px] rounded-xl border border-[var(--color-surface-soft)] hover:border-primary-hover bg-[var(--color-bg)] text-[var(--color-text)] hover:text-text transition-all"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Side: Professional Photo Profile */}
        <div className="lg:col-span-5 flex justify-center items-center w-full relative">
          {/* Subtle radial glow sage di belakang foto profil */}
          <div
            aria-hidden="true"
            className="absolute -inset-6 sm:-inset-10 rounded-full bg-[radial-gradient(circle,rgba(143,158,139,0.22)_0%,rgba(204,213,174,0.12)_45%,transparent_70%)] blur-2xl pointer-events-none -z-10"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="relative w-[260px] h-[320px] sm:w-[320px] sm:h-[400px] lg:w-[350px] lg:h-[450px] rounded-3xl border border-[var(--color-surface-soft)] bg-[var(--color-bg)] backdrop-blur-[4px] p-3 shadow-2xl group overflow-hidden"
          >
            {/* Inner border line decorative */}
            <div className="absolute inset-0 border border-surface-soft rounded-3xl pointer-events-none" />

            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[var(--color-bg)]">
              <Image
                src="/assets/projects/project/foto-ikhsan.jpeg"
                alt="Foto Profil Ikhsan Wahyu Utomo"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              {/* Premium dark/light gradient overlays */}
              <div className="absolute inset-0 ring-1 ring-surface-soft rounded-2xl pointer-events-none" />
            </div>

            {/* Glowing accents */}
          </motion.div>
        </div>

      </div>

      {/* Scroll Down Indicator (hidden on mobile to prevent collision with bottom nav) */}
      <div className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1 opacity-100 transition-opacity z-10">
        <span className="text-[10px] tracking-widest font-mono text-[var(--color-text)]">{t("scrollDown")}</span>
        <div className="w-[1.5px] h-6 bg-primary animate-bounce" />
      </div>
    </section>
  );
};

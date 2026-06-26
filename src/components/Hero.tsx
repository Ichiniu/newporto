"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { Button } from "./ui/Button";
import { portfolioData } from "@/data/portfolio";

export const Hero = () => {
  const { name, role, subRole, bio, github } = portfolioData.personalInfo;

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-center px-6 md:px-12 xl:px-24 pt-20 overflow-hidden bg-grid-pattern"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-cyan-500/10 blur-[80px] md:blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-purple-500/10 blur-[80px] md:blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">

        {/* Left Side: Professional Identity */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs md:text-sm font-medium w-fit"
          >
            <Terminal className="w-4 h-4" />
            <span>Ready for Freelance & Projects</span>
          </motion.div>

          <div className="flex flex-col gap-2">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--foreground)] font-sans"
            >
              Halo, Saya <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-500 text-glow-cyan font-extrabold">{name}</span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl md:text-3xl font-semibold text-[var(--foreground)]/80"
            >
              {role}
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-[var(--text-muted)] text-base md:text-lg max-w-xl leading-relaxed font-sans"
          >
            {subRole}. {bio}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 mt-4"
          >
            <Button
              id="btn-view-projects"
              variant="primary"
              onClick={() => {
                const element = document.getElementById("projects");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Lihat Proyek
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              id="btn-contact-hero"
              variant="secondary"
              onClick={() => {
                const element = document.getElementById("contact");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Hubungi Saya
            </Button>

            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-3 rounded-xl border border-[var(--card-border)] hover:border-cyan-500/30 bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-cyan-500 transition-all"
              title="GitHub Profile"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
          </motion.div>
        </div>

        {/* Right Side: Professional Photo Profile */}
        <div className="lg:col-span-5 flex justify-center items-center w-full relative">
          {/* Background decorative glowing circles */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 to-purple-600 opacity-20 blur-2xl pointer-events-none -z-10" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="relative w-[280px] h-[350px] sm:w-[320px] sm:h-[400px] lg:w-[350px] lg:h-[450px] rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-[4px] p-3 shadow-2xl group overflow-hidden"
          >
            {/* Inner border line decorative */}
            <div className="absolute inset-0 border border-cyan-500/10 rounded-3xl pointer-events-none" />

            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[var(--background)]">
              <Image
                src="/assets/projects/project/foto-ikhsan.jpeg"
                alt="Foto Profil Ikhsan Wahyu Utomo"
                fill
                sizes="(max-w-768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              {/* Premium dark/light gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/30 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 ring-1 ring-white/10 rounded-2xl pointer-events-none" />
            </div>

            {/* Glowing accents */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-purple-500/10 blur-[30px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-cyan-500/10 blur-[30px] rounded-full pointer-events-none" />
          </motion.div>
        </div>

      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
        <span className="text-[10px] tracking-widest font-mono text-[var(--text-muted)]">SCROLL DOWN</span>
        <div className="w-[1.5px] h-6 bg-gradient-to-b from-[var(--text-muted)] to-transparent animate-bounce" />
      </div>
    </section>
  );
};

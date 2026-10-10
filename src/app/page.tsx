"use client";

import React, { useCallback, useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Timeline } from "@/components/Timeline";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(
  () => import("@/components/LoadingScreen").then((mod) => mod.LoadingScreen),
  { ssr: false, loading: () => <div className="fixed inset-0 z-[9999] bg-bg" aria-busy="true" /> }
);

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const completeIntro = useCallback(() => setLoaded(true), []);

  return (
    <LanguageProvider>
      {!loaded && <LoadingScreen onComplete={completeIntro} />}

      <div id="portfolio-content" className="contents">
      {/* Navigation Header */}
      <Header />

      {/* Page Sections */}
      <main className="flex-grow flex flex-col">
        {/* Hero Section */}
        <Hero />

        {/* About Section */}
        <About />

        {/* Skills Section */}
        <Skills />

        {/* Projects Section */}
        <Projects />

        {/* Experience Section */}
        <Timeline />

        {/* Contact Section */}
        <Contact />
      </main>

      {/* Page Footer */}
      <Footer />
      </div>
    </LanguageProvider>
  );
}


"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Timeline } from "@/components/Timeline";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Modul 4: Loading screen — hilang otomatis setelah animasi selesai */}
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

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
    </>
  );
}


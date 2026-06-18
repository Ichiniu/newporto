"use client";

import React from "react";
import { Card } from "./ui/Card";
import { portfolioData } from "@/data/portfolio";
import { Award, Zap, Code, ShieldCheck } from "lucide-react";

export const About = () => {
  const { bio } = portfolioData.personalInfo;

  return (
    <section id="about" className="py-20 px-6 md:px-12 xl:px-24 relative overflow-hidden bg-[var(--background)]">
      {/* Glow effect */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full">
        {/* Title */}
        <div className="flex flex-col gap-2 mb-12">
          <span className="text-xs md:text-sm font-semibold tracking-wider text-cyan-500 dark:text-cyan-400 font-mono uppercase">Tentang Saya</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">Branding & Filosofi Kerja</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-1" />
        </div>

        {/* Grid content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left bio details */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <Card className="h-full flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-semibold text-[var(--foreground)]">Menjembatani Ide dan Kode</h3>
                <p className="text-[var(--text-muted)] leading-relaxed text-sm md:text-base">
                  {bio}
                </p>
                <p className="text-[var(--text-muted)] leading-relaxed text-sm md:text-base">
                  Saya memiliki komitmen tinggi untuk menulis kode yang bersih, mudah dipelihara, dan ramah pengguna. 
                  Dengan latar belakang pengembangan *full-stack*, saya menyukai tantangan dari arsitektur backend 
                  yang kuat hingga antarmuka frontend yang modern.
                </p>
              </div>

              {/* Core Values grid inside card */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[var(--border-subtle)]">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mt-1">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--foreground)]">Performa Tinggi</h4>
                    <p className="text-xs text-[var(--text-muted)]">Website cepat & responsif</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 mt-1">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--foreground)]">Keamanan Utama</h4>
                    <p className="text-xs text-[var(--text-muted)]">Standar coding yang aman</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Highlights Statistics */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-6">
            
            {/* Stat 1 */}
            <Card className="flex items-center gap-5 glass-panel-hover" delay={0.1}>
              <div className="p-4 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[var(--foreground)]">2+ Tahun</h3>
                <p className="text-sm text-[var(--text-muted)] font-mono">PENGALAMAN CODING</p>
              </div>
            </Card>

            {/* Stat 2 */}
            <Card className="flex items-center gap-5 glass-panel-hover" delay={0.2}>
              <div className="p-4 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Code className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[var(--foreground)]">10+ Proyek</h3>
                <p className="text-sm text-[var(--text-muted)] font-mono">SELESAI DIDEPLOY</p>
              </div>
            </Card>

            {/* Stat 3 */}
            <Card className="flex items-center gap-5 glass-panel-hover" delay={0.3}>
              <div className="p-4 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <div className="w-8 h-8 flex items-center justify-center font-bold text-xl font-mono">99%</div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[var(--foreground)]">Keandalan Server</h3>
                <p className="text-sm text-[var(--text-muted)] font-mono">DIDEPLOY DI CWP/VPS</p>
              </div>
            </Card>

          </div>

        </div>
      </div>
    </section>
  );
};

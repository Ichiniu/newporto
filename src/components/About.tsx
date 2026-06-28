"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "./ui/Card";
import { portfolioData } from "@/data/portfolio";
import { Award, Zap, Code, ShieldCheck, ExternalLink, Server } from "lucide-react";

/* ── hook counter generik ── */
function useCounter(target: number, duration: number) {
  const [val, setVal] = useState(target);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = () => {
    let cur = 0;
    setVal(0);
    const steps = 20;
    const inc = target / steps;
    const interval = duration / steps;
    const tick = () => {
      cur = Math.min(cur + inc, target);
      setVal(Math.round(cur));
      if (cur < target) timer.current = setTimeout(tick, interval);
    };
    timer.current = setTimeout(tick, interval);
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    setVal(target);
  };

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return { val, start, reset };
}

import { useLanguage } from "@/context/LanguageContext";

export const About = () => {
  const { lang, t } = useLanguage();
  const { bio } = portfolioData[lang].personalInfo;

  /* Stat 1 — Award */
  const [hov1, setHov1] = useState(false);

  /* Stat 2 — Code */
  const [hov2, setHov2] = useState(false);
  const { val: count2, start: start2, reset: reset2 } = useCounter(5, 700);

  /* Stat 3 — Uptime */
  const [hov3, setHov3] = useState(false);
  const { val: count3, start: start3, reset: reset3 } = useCounter(99, 900);

  return (
    <section id="about" className="py-20 px-6 md:px-12 xl:px-24 relative overflow-hidden bg-[var(--background)]">
      {/* Glow effect */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full">
        {/* Title */}
        <div className="flex flex-col gap-2 mb-12">
          <span className="text-xs md:text-sm font-semibold tracking-wider text-cyan-500 dark:text-cyan-400 font-mono uppercase">{t("aboutTitle")}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">{t("aboutSubtitle")}</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-1" />
        </div>

        {/* Grid content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left bio details */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <Card className="h-full flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <p className="text-[var(--text-muted)] leading-relaxed text-sm md:text-base">
                  {bio}
                </p>
                <p className="text-[var(--text-muted)] leading-relaxed text-sm md:text-base">
                  {t("aboutBio2")}
                </p>
              </div>

              {/* Core Values grid inside card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[var(--border-subtle)]">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mt-1">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--foreground)]">{t("highPerformance")}</h4>
                    <p className="text-xs text-[var(--text-muted)]">{t("highPerformanceDesc")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 mt-1">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--foreground)]">{t("securityFirst")}</h4>
                    <p className="text-xs text-[var(--text-muted)]">{t("securityFirstDesc")}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Highlights Statistics */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-6">

            {/* ── Stat 1 — Award (bounce + shine) ── */}
            <Card
              className="cursor-pointer select-none glass-panel-hover"
              delay={0.1}
            >
              <div
                className="w-full flex items-center gap-5"
                onMouseEnter={() => setHov1(true)}
                onMouseLeave={() => setHov1(false)}
              >
                {/* Icon */}
                <div className={`relative p-4 rounded-xl overflow-hidden transition-all duration-300 ${hov1
                  ? "bg-cyan-500/25 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.45)] scale-110"
                  : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                  }`}>
                  <Award className={`w-8 h-8 transition-transform duration-300 ${hov1 ? "-translate-y-1" : "translate-y-0"}`} />
                  {/* Shine sweep */}
                  <span className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transition-all duration-500 ${hov1 ? "translate-x-full" : "-translate-x-full"
                    }`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-[var(--foreground)]">{t("experienceYears")}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all duration-300 ${hov1 ? "opacity-100 bg-cyan-500/20 text-cyan-400" : "opacity-0"
                      }`}>
                      {t("keepLearning")}
                    </span>
                  </div>
                  <p className={`text-sm font-mono transition-colors duration-300 ${hov1 ? "text-cyan-400" : "text-[var(--text-muted)]"}`}>
                    {t("experienceLabel")}
                  </p>
                  {/* Progress bar */}
                  <div className="mt-2 h-1 w-full rounded-full bg-cyan-500/10 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-700 ${hov1 ? "w-full" : "w-0"
                      }`} />
                  </div>
                </div>
              </div>
            </Card>

            {/* ── Stat 2 — Code (spin + counter) ── */}
            <Card
              className="cursor-pointer select-none glass-panel-hover"
              delay={0.2}
            >
              <div
                className="w-full flex items-center gap-5"
                onMouseEnter={() => { setHov2(true); start2(); }}
                onMouseLeave={() => { setHov2(false); reset2(); }}
              >
                {/* Icon */}
                <div className={`relative p-4 rounded-xl transition-all duration-300 ${hov2
                  ? "bg-purple-500/25 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-110"
                  : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                  }`}>
                  <Code className={`w-8 h-8 transition-transform duration-500 ${hov2 ? "rotate-180" : "rotate-0"}`} />
                  {hov2 && <span className="absolute inset-0 rounded-xl animate-ping bg-purple-500/20 pointer-events-none" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-[var(--foreground)]">{count2}+ {t("completedProjects")}</h3>
                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full transition-all duration-300 ${hov2 ? "opacity-100 translate-x-0 bg-purple-500/20 text-purple-400" : "opacity-0 -translate-x-2"
                      }`}>
                      <ExternalLink className="w-2.5 h-2.5" /> {t("liveLabel")}
                    </span>
                  </div>
                  <p className={`text-sm font-mono transition-colors duration-300 ${hov2 ? "text-purple-400" : "text-[var(--text-muted)]"}`}>
                    {t("deployedLabel")}
                  </p>
                  {/* Progress bar */}
                  <div className="mt-2 h-1 w-full rounded-full bg-purple-500/10 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-300 transition-all duration-700 ${hov2 ? "w-full" : "w-0"
                      }`} />
                  </div>
                </div>
              </div>
            </Card>

            {/* ── Stat 3 — Uptime 99% (count-up + bar) ── */}
            <Card
              className="cursor-pointer select-none glass-panel-hover"
              delay={0.3}
            >
              <div
                className="w-full flex items-center gap-5"
                onMouseEnter={() => { setHov3(true); start3(); }}
                onMouseLeave={() => { setHov3(false); reset3(); }}
              >
                {/* Icon — angka % */}
                <div className={`relative p-4 rounded-xl transition-all duration-300 ${hov3
                  ? "bg-teal-500/25 text-teal-300 shadow-[0_0_20px_rgba(20,184,166,0.45)] scale-110"
                  : "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                  }`}>
                  <Server className={`w-8 h-8 transition-transform duration-300 ${hov3 ? "scale-110" : "scale-100"}`} />
                  {/* Dot indicator */}
                  <span className={`absolute top-1 right-1 w-2 h-2 rounded-full transition-all duration-300 ${hov3 ? "bg-teal-400 animate-ping" : "bg-teal-600/40"
                    }`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-[var(--foreground)]">{count3}%</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all duration-300 ${hov3 ? "opacity-100 bg-teal-500/20 text-teal-400" : "opacity-0"
                      }`}>
                      {t("uptimeLabel")}
                    </span>
                  </div>
                  <p className={`text-sm font-mono transition-colors duration-300 ${hov3 ? "text-teal-400" : "text-[var(--text-muted)]"}`}>
                    {t("serverReliability")}
                  </p>
                  {/* Uptime bar */}
                  <div className="mt-2 h-1 w-full rounded-full bg-teal-500/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-300 transition-all duration-700"
                      style={{ width: hov3 ? `${count3}%` : "0%" }}
                    />
                  </div>
                </div>
              </div>
            </Card>

          </div>

        </div>
      </div>
    </section>
  );
};

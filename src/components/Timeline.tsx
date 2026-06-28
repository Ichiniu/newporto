"use client";

import React from "react";
import { Card } from "./ui/Card";
import { portfolioData } from "@/data/portfolio";
import { Calendar, Briefcase, ChevronRight } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export const Timeline = () => {
  const { lang, t } = useLanguage();
  const { timeline } = portfolioData[lang];

  return (
    <section id="experience" className="py-20 px-6 md:px-12 xl:px-24 relative overflow-hidden bg-[var(--background)]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto w-full">
        {/* Title */}
        <div className="flex flex-col gap-2 mb-16 text-center items-center">
          <span className="text-xs md:text-sm font-semibold tracking-wider text-cyan-500 dark:text-cyan-400 font-mono uppercase">{t("timelineTitle")}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">{t("timelineSubtitle")}</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-1" />
        </div>

        {/* Timeline Line & Items */}
        <div className="relative border-l border-[var(--card-border)] ml-4 md:ml-6 flex flex-col gap-10">
          
          {timeline.map((item, idx) => (
            <div key={item.id} className="relative pl-8 md:pl-10 group">
              
              {/* Bullet node on the timeline line */}
              <div className="absolute -left-[9.5px] top-1.5 w-[18px] h-[18px] rounded-full bg-[var(--background)] border-2 border-[var(--card-border)] group-hover:border-cyan-500 group-hover:bg-cyan-500/20 transition-all duration-300 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] group-hover:bg-cyan-500 transition-colors" />
              </div>

              {/* Card Container */}
              <Card className="group/card glass-panel-hover" delay={idx * 0.15}>
                
                {/* Header Info */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--foreground)] transition-colors text-base md:text-lg">
                        {item.role}
                      </h3>
                      <span className="text-xs text-[var(--text-muted)] font-medium">{item.company}</span>
                    </div>
                  </div>
                  
                  {/* Period badge */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-muted)] text-xs font-mono">
                    <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400/80" />
                    {item.period}
                  </span>
                </div>

                {/* Body — Bullet List */}
                <ul className="flex flex-col gap-2 mb-4">
                  {item.descriptions.map((desc, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm md:text-base text-[var(--text-muted)] leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500/70 shrink-0" />
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>

                {/* Sub tags */}
                {item.tags && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center text-[10px] md:text-xs font-mono text-[var(--text-muted)] bg-[var(--card-bg)] px-2.5 py-1 rounded border border-[var(--card-border)]"
                      >
                        <ChevronRight className="w-3 h-3 text-cyan-500/60 mr-0.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

              </Card>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

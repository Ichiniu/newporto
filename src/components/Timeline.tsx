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
    <section id="experience" className="py-20 px-6 md:px-12 xl:px-24 relative overflow-hidden bg-bg">
      {/* Background Glow */}

      <div className="max-w-4xl mx-auto w-full">
        {/* Title */}
        <div className="flex flex-col gap-2 mb-16 text-center items-center">
          <span className="text-xs md:text-sm font-semibold tracking-wider text-text  font-mono uppercase">{t("timelineTitle")}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)]">{t("timelineSubtitle")}</h2>
          <div className="w-12 h-1 bg-primary rounded-full mt-1" />
        </div>

        {/* Timeline Line & Items */}
        <div className="relative border-l border-[var(--color-surface-soft)] ml-4 md:ml-6 flex flex-col gap-10">
          
          {timeline.map((item, idx) => (
            <div key={item.id} className="relative pl-8 md:pl-10 group">
              
              {/* Bullet node on the timeline line */}
              <div className="absolute -left-[9.5px] top-1.5 w-[18px] h-[18px] rounded-full bg-[var(--color-bg)] border-2 border-[var(--color-surface-soft)] group-hover:border-primary group-hover:bg-surface-soft transition-all duration-300 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary group-hover:bg-primary-hover transition-colors" />
              </div>

              {/* Card Container */}
              <Card className="group/card glass-panel-hover" delay={idx * 0.15}>
                
                {/* Header Info */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-[var(--color-surface-soft)]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-surface-soft text-text ">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--color-text)] transition-colors text-base md:text-lg">
                        {item.role}
                      </h3>
                      <span className="text-xs text-[var(--color-text)] font-medium">{item.company}</span>
                    </div>
                  </div>
                  
                  {/* Period badge */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-bg)] border border-[var(--color-surface-soft)] text-[var(--color-text)] text-xs font-mono">
                    <Calendar data-tone="secondary" className="w-3.5 h-3.5 text-text " />
                    {item.period}
                  </span>
                </div>

                {/* Body — Bullet List */}
                <ul className="flex flex-col gap-2 mb-4">
                  {item.descriptions.map((desc, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm md:text-base text-[var(--color-text)] leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-surface-soft shrink-0" />
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
                        className="inline-flex items-center text-[10px] md:text-xs font-mono text-[var(--color-text)] bg-[var(--color-bg)] px-2.5 py-1 rounded border border-[var(--color-surface-soft)]"
                      >
                        <ChevronRight data-tone="secondary" className="w-3 h-3 text-text mr-0.5" />
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

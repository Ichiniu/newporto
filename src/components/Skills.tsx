"use client";

import React, { useRef, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Card } from "./ui/Card";
import { portfolioData, type SkillCategory } from "@/data/portfolio";
import { Server, Layout, Database, Wrench } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

const timelineDuration = 3;
const motionQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia(motionQuery).matches;
}

// SSR and the first hydration render must share the same static markup.
function getServerReducedMotion() {
  return true;
}

function SkillTag({ name, index, start, end, time, reduced }: {
  name: string; index: number; start: number; end: number; time: MotionValue<number>; reduced: boolean;
}) {
  const progress = useTransform(time, [start, end], [0, 1]);
  const x = useTransform(progress, [0, 1], [index % 2 ? 5 : -5, 0]);
  const y = useTransform(progress, [0, 1], [-12, 0]);
  const rotate = useTransform(progress, [0, 1], [index % 2 ? 4 : -4, 0]);
  const opacity = useTransform(progress, [0, 1], [0.5, 1]);
  const decoded = useTransform(progress, value => {
    if (value >= 1) return name;
    const tick = Math.floor(value * 7);
    const symbols = "X#9@kT%01";
    return Array.from(name, (char, position) =>
      position < Math.floor(name.length * value) || /\s/.test(char)
        ? char : symbols[(position + tick) % symbols.length]
    ).join("");
  });

  return (
    <motion.span
      style={reduced ? undefined : { x, y, rotate, opacity }}
      className="relative inline-block px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs md:text-sm bg-[var(--color-bg)] hover:bg-surface-soft border border-[var(--color-surface-soft)] text-[var(--color-text)] hover:text-text transition-colors font-mono leading-tight"
    >
      <span style={{ opacity: reduced ? 1 : 0 }}>{name}</span>
      {!reduced && <motion.span aria-hidden="true" className="absolute inset-0 overflow-hidden" style={{ padding: "inherit" }}>{decoded}</motion.span>}
    </motion.span>
  );
}

function SkillCard({ category, index, count, icon }: { category: SkillCategory; index: number; count: number; icon: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getServerReducedMotion);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "start 25%"] });
  // Three seconds of choreography, scrubbed directly by scroll in either direction.
  const time = useTransform(scrollYProgress, [0, 1], [0, timelineDuration]);
  const delay = index * 0.12;
  const landing = timelineDuration - 0.3 - (count - index - 1) * 0.12;
  const opacity = useTransform(time, [delay, delay + 0.45], [0.4, 1]);
  const y = useTransform(time, [delay, delay + 0.45], [12, 0]);
  const x = useTransform(time, [0, landing, landing + 0.075, landing + 0.15, landing + 0.225, landing + 0.3], [0, 0, -1.5, 1.5, -0.75, 0]);

  return (
    <div ref={ref} className="h-full min-w-0">
      <motion.div className="h-full" style={reduced ? undefined : { opacity, y, x }}>
        <Card animateEntrance={false} className="flex flex-col gap-3 sm:gap-5 hover:shadow-lg group h-full overflow-hidden !p-3.5 sm:!p-6">
          <div className="flex items-center gap-2 sm:gap-3 pb-2.5 sm:pb-3 border-b border-[var(--color-surface-soft)]">
            <div className="p-1.5 sm:p-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-surface-soft)] group-hover:border-primary-hover group-hover:bg-surface-soft transition-colors shrink-0">
              {icon}
            </div>
            <h3 className="text-xs sm:text-base md:text-lg font-bold text-[var(--color-text)] leading-tight">{category.category}</h3>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2.5">
            {category.skills.map((skill, tagIndex) => {
              const stagger = tagIndex / Math.max(1, category.skills.length - 1) * 0.6;
              return <SkillTag key={skill.name} name={skill.name} index={tagIndex} start={0.2 + delay + stagger} end={landing - 0.6 + stagger} time={time} reduced={reduced} />;
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}


export const Skills = () => {
  const { lang, t } = useLanguage();
  const categories = portfolioData[lang].skillCategories;

  // Map icons to categories
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "frontend":
        return <Layout className="w-5 h-5 text-text " />;
      case "backend":
        return <Server className="w-5 h-5 text-text " />;
      case "database":
        return <Database className="w-5 h-5 text-text " />;
      default:
        return <Wrench className="w-5 h-5 text-text " />;
    }
  };

  return (
    <section id="skills" className="py-12 md:py-20 px-4 sm:px-6 md:px-12 xl:px-24 relative overflow-hidden bg-[var(--color-bg)]">

      <div className="max-w-7xl mx-auto w-full">
        {/* Title */}
        <div className="flex flex-col gap-2 mb-8 md:mb-12">
          <span className="text-xs md:text-sm font-semibold tracking-wider text-text  font-mono uppercase">{t("skillsTitle")}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)]">{t("skillsSubtitle")}</h2>
          <div className="w-12 h-1 bg-primary rounded-full mt-1" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {categories.map((cat, idx) => (
            <SkillCard key={idx} category={cat} index={idx} count={categories.length} icon={getCategoryIcon(cat.category)} />
          ))}
        </div>
      </div>
    </section>
  );
};

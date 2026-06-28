"use client";

import React from "react";
import { Card } from "./ui/Card";
import { portfolioData } from "@/data/portfolio";
import { Server, Layout, Database, Wrench } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export const Skills = () => {
  const { lang, t } = useLanguage();
  const categories = portfolioData[lang].skillCategories;

  // Map icons to categories
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "frontend":
        return <Layout className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
      case "backend":
        return <Server className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case "database":
        return <Database className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      default:
        return <Wrench className="w-5 h-5 text-pink-600 dark:text-pink-400" />;
    }
  };

  return (
    <section id="skills" className="py-20 px-6 md:px-12 xl:px-24 relative overflow-hidden bg-[var(--background)]">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full">
        {/* Title */}
        <div className="flex flex-col gap-2 mb-12">
          <span className="text-xs md:text-sm font-semibold tracking-wider text-cyan-500 dark:text-cyan-400 font-mono uppercase">{t("skillsTitle")}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">{t("skillsSubtitle")}</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-1" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Card 
              key={cat.category} 
              className="flex flex-col gap-5 hover:shadow-lg hover:shadow-cyan-500/5 group glass-panel-hover h-full"
              delay={idx * 0.1}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-[var(--border-subtle)]">
                <div className="p-2 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] group-hover:border-cyan-500/25 group-hover:bg-cyan-500/5 transition-all">
                  {getCategoryIcon(cat.category)}
                </div>
                <h3 className="text-lg font-bold text-[var(--foreground)] transition-colors">{cat.category}</h3>
              </div>

              {/* Skills Pills */}
              <div className="flex flex-wrap gap-2.5">
                {cat.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className="px-3 py-1.5 rounded-lg text-xs md:text-sm bg-[var(--card-bg)] hover:bg-slate-100 dark:hover:bg-slate-900 border border-[var(--card-border)] text-[var(--text-muted)] hover:text-cyan-600 dark:hover:text-cyan-400 transition-all font-mono"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

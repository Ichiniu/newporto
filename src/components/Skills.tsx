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
      {/* Background Glow */}

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
            <Card 
              key={cat.category} 
              className="flex flex-col gap-3 sm:gap-5 hover:shadow-lg group glass-panel-hover h-full !p-3.5 sm:!p-6"
              delay={idx * 0.1}
            >
              {/* Category Header */}
              <div className="flex items-center gap-2 sm:gap-3 pb-2.5 sm:pb-3 border-b border-[var(--color-surface-soft)]">
                <div className="p-1.5 sm:p-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-surface-soft)] group-hover:border-primary-hover group-hover:bg-surface-soft transition-all shrink-0">
                  {getCategoryIcon(cat.category)}
                </div>
                <h3 className="text-xs sm:text-base md:text-lg font-bold text-[var(--color-text)] transition-colors leading-tight">{cat.category}</h3>
              </div>

              {/* Skills Pills */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2.5">
                {cat.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs md:text-sm bg-[var(--color-bg)] hover:bg-surface-soft border border-[var(--color-surface-soft)] text-[var(--color-text)] hover:text-text transition-all font-mono leading-tight"
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

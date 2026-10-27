"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { portfolioData, Project } from "@/data/portfolio";
import { ExternalLink, ChevronLeft, ChevronRight, X, ZoomIn, Eye } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const projectHeadlines: Record<string, { id: { before: string; after: string }; en: { before: string; after: string } }> = {
  kasir: {
    id: { before: "Mengoptimalkan transaksi retail bersama", after: "analitik kasir modern & cerdas." },
    en: { before: "Crafting seamless retail flow with", after: "intelligent point of sale analytics." }
  },
  wbot: {
    id: { before: "Komunikasi cerdas tanpa batas ditenagai", after: "asisten AI memori jangka panjang." },
    en: { before: "Autonomous AI conversation driven by", after: "deep persistent long-term memory." }
  },
  photobox: {
    id: { before: "Mengabadikan setiap momen interaktif dalam", after: "frame photobox beresolusi tinggi." },
    en: { before: "Capturing authentic live moments in", after: "interactive custom studio frames." }
  },
  reservasi: {
    id: { before: "Efisiensi alur operasional terpadu melalui", after: "manajemen reservasi ruangan otomatis." },
    en: { before: "Streamlining organizational workflow with", after: "automated room booking." }
  },
  "userguide-fingerspot": {
    id: { before: "Menjembatani panduan pengguna global dengan", after: "dokumentasi multibahasa berbasis AI." },
    en: { before: "Empowering users worldwide with", after: "automated AI multilingual guides." }
  }
};

interface EditorialProjectItemProps {
  project: Project;
  index: number;
  onPreviewClick: (projectId: string, imageIdx: number) => void;
}

const EditorialProjectItem: React.FC<EditorialProjectItemProps> = ({
  project,
  index,
  onPreviewClick
}) => {
  const { lang, t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const headline = projectHeadlines[project.id]?.[lang] || {
    id: { before: "Membangun solusi digital unggulan bersama", after: "arsitektur web interaktif modern." },
    en: { before: "Building distinguished digital solutions with", after: "interactive modern web architecture." }
  }[lang];

  const hasImages = project.images && project.images.length > 0;
  const imageList = hasImages ? project.images! : [project.image];
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const itemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "end start"]
  });

  // Use a fixed-height scroll target so growing media does not change its own progress.
  const pillWidth = useTransform(scrollYProgress, [0.15, 0.65], ["1.4em", "4.2em"]);
  const pillHeight = useTransform(scrollYProgress, [0.15, 0.65], ["0.8em", "2.6em"]);
  const pillBorderRadius = useTransform(scrollYProgress, [0.15, 0.65], ["0.7em", "0.25em"]);
  const secondaryScale = useTransform(scrollYProgress, [0.2, 0.7], [0.5, 1]);
  const headlineY = useTransform(scrollYProgress, [0.1, 0.9], [24, -24]);
  const detailsY = useTransform(scrollYProgress, [0.1, 0.9], [12, -12]);

  const layoutVariant = index % 3;

  return (
    <motion.article
      className="relative min-h-[80svh] flex flex-col justify-between py-16 md:py-28 border-b border-[var(--color-surface-soft)]/40 last:border-b-0"
    >
      <div ref={itemRef} aria-hidden="true" className="absolute top-0 left-0 h-screen w-px pointer-events-none" />
      <div className={`flex items-center gap-3 mb-8 md:mb-12 font-mono text-xs uppercase tracking-widest text-[var(--color-text)] opacity-70 ${
        layoutVariant === 1 ? "justify-center" : layoutVariant === 2 ? "justify-end" : "justify-start"
      }`}>
        <span className="w-2.5 h-2.5 rounded-full bg-primary" />
        <span className="font-bold tracking-widest">— PROJECT {String(index + 1).padStart(2, "0")}</span>
        <span className="opacity-40">/</span>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-surface-soft bg-surface-soft/60">
          {project.techStack[0]}
        </span>
      </div>
      <motion.div
        style={{ y: reduceMotion ? 0 : headlineY }}
        className={`w-full mb-12 md:mb-16 ${
          layoutVariant === 1 ? "text-center max-w-3xl mx-auto" : layoutVariant === 2 ? "text-right ml-auto max-w-3xl" : "text-left max-w-3xl"
        }`}
      >
        <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-normal tracking-tight text-[var(--color-text)] leading-[1.15]">
          <span>{headline.before}</span>{" "}
          <button
            type="button"
            onClick={() => onPreviewClick(project.id, activeImageIdx)}
            className="inline-flex items-center align-middle mx-1.5 sm:mx-3 cursor-zoom-in group/pill relative"
            aria-label={`${lang === "id" ? "Pratinjau" : "Preview"} ${project.title}`}
          >
            <motion.span
              style={{
                width: reduceMotion ? "3em" : pillWidth,
                height: reduceMotion ? "1.85em" : pillHeight,
                borderRadius: reduceMotion ? "0.25em" : pillBorderRadius
              }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              className="inline-block relative overflow-hidden border-2 border-[var(--color-surface-soft)]/90 align-middle bg-[var(--color-bg)] transition-shadow duration-500 group-hover/pill:shadow-primary/30 group-hover/pill:border-primary shrink-0"
            >
              <Image
                src={imageList[activeImageIdx]}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 240px, 340px"
                className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover/pill:scale-105"
                priority={index < 2}
              />
              <div className="absolute inset-0 bg-text/15 group-hover/pill:bg-transparent transition-colors" />

              {/* Floating Pill Zoom Badge */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/pill:opacity-100 transition-opacity bg-text/40 backdrop-blur-xs">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-bg/20 text-bg text-xs font-mono font-medium backdrop-blur-md border border-bg/30">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>{lang === "id" ? "LIHAT" : "VIEW"}</span>
                </span>
              </div>
            </motion.span>
          </button>{" "}
          {hasImages && imageList.length > 1 && (
            <motion.button
              type="button"
              aria-label={`${lang === "id" ? "Pratinjau" : "Preview"} ${project.title}, 2`}
              style={{ scale: reduceMotion ? 1 : secondaryScale }}
              onClick={() => onPreviewClick(project.id, 1)}
              className="inline-flex relative w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-primary/50 shadow-xl align-middle mx-1 sm:mx-2 cursor-zoom-in group/sec shrink-0"
            >
              <Image
                src={imageList[1]}
                alt={`${project.title} secondary`}
                fill
                sizes="80px"
                className="object-cover transition-transform duration-500 motion-safe:group-hover/sec:scale-105"
              />
            </motion.button>
          )}{" "}

          <span className="font-serif italic font-normal text-primary-hover">{headline.after}</span>
        </h3>
      </motion.div>

      {/* Structured Details Card (Parallax Drift) */}
      <motion.div
        style={{ y: reduceMotion ? 0 : detailsY }}
        className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-end w-full ${
          layoutVariant === 2 ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Description & Narrative Block (Positioned asymmetrically like in recording) */}
        <div className={`space-y-5 ${
          layoutVariant === 1
            ? "md:col-span-8 md:col-start-3 text-center"
            : layoutVariant === 2
            ? "md:col-span-6 md:col-start-1 text-left"
            : "md:col-span-6 md:col-start-7 text-left"
        }`}>
          {/* Project Title & Category */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text)]">
                {project.title}
              </h4>
            </div>
            <p className="text-sm sm:text-base text-[var(--color-text)] leading-relaxed text-pretty opacity-85">
              {project.description}
            </p>
          </div>

          {/* Tech Stack Pills */}
          <div className={`flex flex-wrap gap-2 ${layoutVariant === 1 ? "justify-center" : "justify-start"}`}>
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg text-xs bg-surface-soft border border-surface-soft text-[var(--color-text)] font-mono font-medium"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Links & Preview Button */}
          <div className={`flex items-center gap-3 pt-3 flex-wrap ${layoutVariant === 1 ? "justify-center" : "justify-start"}`}>
            {project.githubLink && (
              <motion.a
                whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="button-secondary px-4 py-2 min-h-[44px] rounded-xl text-xs sm:text-sm font-mono flex items-center gap-2 cursor-pointer shadow-xs"
                id={`link-github-${project.id}`}
              >
                <GithubIcon className="w-4 h-4 shrink-0" />
                <span>{t("codeLabel")}</span>
              </motion.a>
            )}

            {project.liveLink && (
              <motion.a
                whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="button-primary px-4 py-2 min-h-[44px] rounded-xl text-xs sm:text-sm font-mono flex items-center gap-2 cursor-pointer shadow-md"
                id={`link-live-${project.id}`}
              >
                <ExternalLink className="w-4 h-4 shrink-0" />
                <span>{t("liveDemoLabel")}</span>
              </motion.a>
            )}

            <motion.button
              whileHover={reduceMotion ? undefined : { scale: 1.04 }}
              whileTap={reduceMotion ? undefined : { scale: 0.96 }}
              onClick={() => onPreviewClick(project.id, activeImageIdx)}
              className="button-secondary px-4 py-2 min-h-[44px] rounded-xl text-xs sm:text-sm font-mono flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 shrink-0" />
              <span>{lang === "id" ? "Pratinjau" : "Full Preview"}</span>
            </motion.button>

            {/* If project has multiple images, provide quick thumbnail switchers */}
            {hasImages && imageList.length > 1 && (
              <div className="flex items-center gap-1.5 ml-2 p-1 rounded-full bg-surface-soft/60 border border-surface-soft">
                {imageList.map((_, imgIdx) => (
                  <button
                    key={imgIdx}
                    onClick={() => setActiveImageIdx(imgIdx)}
                    aria-pressed={imgIdx === activeImageIdx}
                    className={`w-6 h-6 rounded-full transition-colors ${
                      imgIdx === activeImageIdx ? "bg-primary-hover" : "bg-surface-soft hover:bg-primary/50"
                    }`}
                    aria-label={`Select image ${imgIdx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
};

export const Projects = () => {
  const { lang, t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const { projects } = portfolioData[lang];
  const [filter, setFilter] = useState("all");
  const [activePreview, setActivePreview] = useState<{ projectId: string; imageIdx: number } | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const previewOpen = activePreview !== null;

  useEffect(() => {
    if (!previewOpen) return;
    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = previewRef.current;
    panel?.querySelector<HTMLButtonElement>("button")?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const buttons = panel?.querySelectorAll<HTMLButtonElement>("button");
      if (!buttons?.length) return;
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    panel?.addEventListener("keydown", trapFocus);
    return () => {
      document.body.style.overflow = previousOverflow;
      panel?.removeEventListener("keydown", trapFocus);
      trigger?.focus();
    };
  }, [previewOpen]);

  // Get active project and images for preview slider inside modal
  const activeProject = activePreview ? projects.find(p => p.id === activePreview.projectId) : null;
  const previewImages = activeProject ? (activeProject.images && activeProject.images.length > 0 ? activeProject.images : [activeProject.image]) : [];
  const currentPreviewImage = activePreview && previewImages[activePreview.imageIdx] ? previewImages[activePreview.imageIdx] : null;

  // Keyboard navigation for modal
  useEffect(() => {
    if (!activePreview) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActivePreview(null);
      } else if (e.key === "ArrowRight") {
        setActivePreview(prev => {
          if (!prev) return null;
          const activeProj = projects.find(p => p.id === prev.projectId);
          const imgs = activeProj ? (activeProj.images && activeProj.images.length > 0 ? activeProj.images : [activeProj.image]) : [];
          return { ...prev, imageIdx: (prev.imageIdx + 1) % imgs.length };
        });
      } else if (e.key === "ArrowLeft") {
        setActivePreview(prev => {
          if (!prev) return null;
          const activeProj = projects.find(p => p.id === prev.projectId);
          const imgs = activeProj ? (activeProj.images && activeProj.images.length > 0 ? activeProj.images : [activeProj.image]) : [];
          return { ...prev, imageIdx: (prev.imageIdx - 1 + imgs.length) % imgs.length };
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePreview, projects]);

  // Filter options based on projects' tech stack
  const filterOptions = [
    { label: t("allFilter"), value: "all" },
    { label: "PHP / Laravel / CI3", value: "php" },
    { label: "JS / React / Node.js", value: "next" }
  ];

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    if (filter === "php" || filter === "ci") return project.techStack.some(tech => tech.toLowerCase().includes("codeigniter") || tech.toLowerCase().includes("laravel") || tech.toLowerCase().includes("php"));
    if (filter === "next") return project.techStack.some(tech => tech.toLowerCase().includes("next.js") || tech.toLowerCase().includes("react") || tech.toLowerCase().includes("node.js"));
    return true;
  });

  return (
    <section id="projects" className="py-16 md:py-28 px-4 sm:px-6 md:px-12 xl:px-24 relative overflow-hidden bg-[var(--color-bg)]">

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="flex flex-col gap-2">
            <span className="text-xs md:text-sm font-semibold tracking-wider text-[var(--color-text)] font-mono uppercase">{t("projectsTitle")}</span>
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-text)] tracking-tight">{t("projectsSubtitle")}</h2>
            <div className="w-14 h-1 bg-primary rounded-full mt-2" />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                aria-pressed={filter === opt.value}
                className={`px-4 py-2 min-h-[44px] rounded-xl text-xs md:text-sm font-mono cursor-pointer transition-all duration-300 ${
                  filter === opt.value
                    ? "button-primary shadow-md"
                    : "button-secondary opacity-80 hover:opacity-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-surface-soft bg-surface-soft/20 p-4 sm:p-8 md:p-12 relative">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <EditorialProjectItem
                key={project.id}
                project={project}
                index={projects.indexOf(project)}
                onPreviewClick={(projId, imgIdx) => setActivePreview({ projectId: projId, imageIdx: imgIdx })}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {activePreview && currentPreviewImage && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            ref={previewRef}
            role="dialog"
            aria-modal="true"
            aria-label="Preview project"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-text/75 md:bg-text/80 backdrop-blur-md p-4 md:p-10"
            onClick={() => setActivePreview(null)}
          >
            <motion.div
              initial={{ scale: reduceMotion ? 1 : 0.88, opacity: 0, y: reduceMotion ? 0 : 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: reduceMotion ? 1 : 0.9, opacity: 0, y: reduceMotion ? 0 : 20 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center rounded-3xl overflow-hidden border border-bg/15 shadow-2xl bg-text/95 p-3 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button with rotate on hover */}
              <motion.button
                whileHover={reduceMotion ? undefined : { scale: 1.1 }}
                whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                onClick={() => setActivePreview(null)}
                className="absolute top-4 right-4 z-30 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full button-secondary flex items-center justify-center backdrop-blur-md transition-colors border border-surface-soft cursor-pointer shadow-xl"
                aria-label="Close preview"
              >
                <X className="w-5 h-5 text-bg" />
              </motion.button>

              {/* Slider Controls Inside Modal */}
              {previewImages.length > 1 && (
                <>
                  <motion.button
                    whileHover={reduceMotion ? undefined : { scale: 1.1 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePreview(prev => prev ? { ...prev, imageIdx: (prev.imageIdx - 1 + previewImages.length) % previewImages.length } : null);
                    }}
                    className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 min-w-[44px] min-h-[44px] md:w-12 md:h-12 rounded-full button-secondary flex items-center justify-center backdrop-blur-md transition-colors border border-surface-soft cursor-pointer shadow-xl"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-bg" />
                  </motion.button>
                  <motion.button
                    whileHover={reduceMotion ? undefined : { scale: 1.1 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePreview(prev => prev ? { ...prev, imageIdx: (prev.imageIdx + 1) % previewImages.length } : null);
                    }}
                    className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 min-w-[44px] min-h-[44px] md:w-12 md:h-12 rounded-full button-secondary flex items-center justify-center backdrop-blur-md transition-colors border border-surface-soft cursor-pointer shadow-xl"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-bg" />
                  </motion.button>

                  {/* Dots Indicator in Modal */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 p-1.5 rounded-full bg-text/60 backdrop-blur-md border border-bg/10 shadow-lg">
                    {previewImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePreview(prev => prev ? { ...prev, imageIdx: idx } : null);
                        }}
                        className="p-1.5 flex items-center justify-center cursor-pointer"
                        aria-label={`Go to slide ${idx + 1}`}
                      >
                        <motion.span
                          layout
                          className={`block h-2 rounded-full transition-all duration-300 ${
                            idx === activePreview.imageIdx
                              ? "bg-primary w-5 shadow-xs"
                              : "bg-bg/40 hover:bg-bg/80 w-2"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Preview Image with Smooth Crossfade */}
              <div className="relative w-full h-full select-none flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePreview.imageIdx}
                    initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.03 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={currentPreviewImage}
                      alt="Preview Project"
                      fill
                      className="object-contain rounded-2xl"
                      data-project-img="true"
                      sizes="100vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

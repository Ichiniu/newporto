"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "./ui/Card";
import { portfolioData, Project } from "@/data/portfolio";
import { ExternalLink, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const ProjectCard = ({ 
  project, 
  onImageClick 
}: { 
  project: Project; 
  onImageClick: (imageIdx: number) => void;
}) => {
  const { t } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const hasImages = project.images && project.images.length > 0;
  const imageList = hasImages ? project.images! : [project.image];

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % imageList.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  return (
    <Card className="h-full flex flex-col justify-between overflow-hidden p-0 hover:shadow-2xl group">
      {/* Project Image Wrapper with Slider option */}
      <div 
        onClick={() => onImageClick(currentIdx)}
        className="relative aspect-[16/10] w-full bg-[var(--color-bg)] overflow-hidden border-b border-[var(--color-surface-soft)] cursor-zoom-in"
      >
        <Image
          src={imageList[currentIdx]}
          alt={`${project.title} - Gambar ${currentIdx + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          priority
        />

        {/* Hover Zoom Overlay */}
        <div className="absolute inset-0 bg-transparent flex items-center justify-center transition-colors duration-300 pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-bg text-text opacity-0 group-hover:opacity-100 flex items-center justify-center backdrop-blur-sm transition-all duration-300 border border-surface-soft scale-90 group-hover:scale-100 shadow-lg">
            <ZoomIn className="w-5 h-5" />
          </div>
        </div>

        {/* Navigation Arrows for Slider */}
        {hasImages && imageList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 md:w-8 md:h-8 rounded-full button-secondary flex items-center justify-center backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto cursor-pointer border border-surface-soft shadow-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 md:w-8 md:h-8 rounded-full button-secondary flex items-center justify-center backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto cursor-pointer border border-surface-soft shadow-sm"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slider Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 p-1 rounded-full bg-bg/60 backdrop-blur-xs">
              {imageList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIdx(idx);
                  }}
                  className={`p-1.5 flex items-center justify-center cursor-pointer`}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIdx
                        ? "bg-primary-hover w-3.5"
                        : "bg-primary hover:bg-primary-hover w-1.5"
                    }`}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Project Details */}
      <div className="p-5 sm:p-7 md:p-8 flex flex-col gap-4 sm:gap-5 flex-grow">
        <div className="space-y-2.5">
          <h3 className="text-xl sm:text-2xl font-bold text-text tracking-tight">
            {project.title}
          </h3>
          <p className="text-sm sm:text-base text-text leading-relaxed text-pretty">
            {project.description}
          </p>
        </div>

        {/* Tech Stack tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-lg text-xs bg-surface-soft border border-surface-soft text-text font-mono font-medium"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-surface-soft)] mt-auto flex-wrap">
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="button-secondary px-4 py-2 min-h-[44px] rounded-xl text-xs sm:text-sm font-mono flex items-center gap-2 cursor-pointer"
              id={`link-github-${project.id}`}
            >
              <GithubIcon className="w-4 h-4 shrink-0" />
              <span>{t("codeLabel")}</span>
            </a>
          )}

          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="button-primary px-4 py-2 min-h-[44px] rounded-xl text-xs sm:text-sm font-mono flex items-center gap-2 sm:ml-auto cursor-pointer"
              id={`link-live-${project.id}`}
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              <span>{t("liveDemoLabel")}</span>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};

export const Projects = () => {
  const { lang, t } = useLanguage();
  const { projects } = portfolioData[lang];
  const [filter, setFilter] = useState("all");
  const [activePreview, setActivePreview] = useState<{ projectId: string; imageIdx: number } | null>(null);

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
    { label: "PHP / CI4", value: "ci" },
    { label: "JS / React / Node.js", value: "next" }
  ];

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    if (filter === "ci") return project.techStack.some(tech => tech.toLowerCase().includes("codeigniter"));
    if (filter === "next") return project.techStack.some(tech => tech.toLowerCase().includes("next.js") || tech.toLowerCase().includes("react") || tech.toLowerCase().includes("node.js"));
    return true;
  });

  return (
    <section id="projects" className="py-12 md:py-20 px-4 sm:px-6 md:px-12 xl:px-24 relative overflow-hidden bg-[var(--color-bg)]">
      {/* Background Glow */}

      <div className="max-w-4xl mx-auto w-full">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
          <div className="flex flex-col gap-2">
            <span className="text-xs md:text-sm font-semibold tracking-wider text-text font-mono uppercase">{t("projectsTitle")}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)]">{t("projectsSubtitle")}</h2>
            <div className="w-12 h-1 bg-primary rounded-full mt-1" />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                aria-pressed={filter === opt.value}
                className="button-primary px-4 py-2 min-h-[44px] rounded-xl text-xs md:text-sm font-mono cursor-pointer"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <ProjectCard project={project} onImageClick={(idx) => setActivePreview({ projectId: project.id, imageIdx: idx })} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {activePreview && currentPreviewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Preview project"
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg backdrop-blur-md p-4 md:p-10"
            onClick={() => setActivePreview(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActivePreview(null)}
                className="absolute top-2 right-2 md:-top-12 md:-right-4 z-10 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full button-secondary flex items-center justify-center backdrop-blur-sm transition-colors border border-surface-soft cursor-pointer shadow-lg"
                aria-label="Close preview"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Slider Controls Inside Modal */}
              {previewImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePreview(prev => prev ? { ...prev, imageIdx: (prev.imageIdx - 1 + previewImages.length) % previewImages.length } : null);
                    }}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 min-w-[44px] min-h-[44px] md:w-12 md:h-12 rounded-full button-secondary flex items-center justify-center backdrop-blur-sm transition-colors border border-surface-soft cursor-pointer shadow-lg"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePreview(prev => prev ? { ...prev, imageIdx: (prev.imageIdx + 1) % previewImages.length } : null);
                    }}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 min-w-[44px] min-h-[44px] md:w-12 md:h-12 rounded-full button-secondary flex items-center justify-center backdrop-blur-sm transition-colors border border-surface-soft cursor-pointer shadow-lg"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  {/* Dots Indicator in Modal */}
                  <div className="absolute -bottom-10 md:-bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                    {previewImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePreview(prev => prev ? { ...prev, imageIdx: idx } : null);
                        }}
                        className="p-2 flex items-center justify-center cursor-pointer"
                        aria-label={`Go to slide ${idx + 1}`}
                      >
                        <span
                          className={`block h-2 rounded-full transition-all duration-300 ${
                            idx === activePreview.imageIdx
                              ? "bg-primary-hover w-4"
                              : "bg-primary hover:bg-primary-hover w-2"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Preview Image */}
              <div className="relative w-full h-full select-none">
                <Image
                  src={currentPreviewImage}
                  alt="Preview Project"
                  fill
                  className="object-contain rounded-lg"
                  sizes="100vw"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

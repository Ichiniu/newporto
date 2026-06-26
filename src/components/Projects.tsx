"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "./ui/Card";
import { portfolioData, Project } from "@/data/portfolio";
import { ExternalLink, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { motion, AnimatePresence } from "framer-motion";

const ProjectCard = ({ 
  project, 
  onImageClick 
}: { 
  project: Project; 
  onImageClick: (imageIdx: number) => void;
}) => {
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
    <Card className="h-full flex flex-col justify-between overflow-hidden p-0 hover:shadow-2xl hover:shadow-cyan-500/5 group">
      {/* Project Image Wrapper with Slider option */}
      <div 
        onClick={() => onImageClick(currentIdx)}
        className="relative aspect-[16/10] w-full bg-[var(--background)] overflow-hidden border-b border-[var(--card-border)] cursor-zoom-in"
      >
        <Image
          src={imageList[currentIdx]}
          alt={`${project.title} - Gambar ${currentIdx + 1}`}
          fill
          sizes="(max-w-768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Hover Zoom Overlay */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/25 flex items-center justify-center transition-colors duration-300 pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center backdrop-blur-sm transition-all duration-300 border border-white/10 scale-90 group-hover:scale-100 shadow-lg">
            <ZoomIn className="w-5 h-5" />
          </div>
        </div>

        {/* Navigation Arrows for Slider */}
        {hasImages && imageList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto cursor-pointer border border-white/10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto cursor-pointer border border-white/10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slider Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {imageList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIdx(idx);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIdx
                      ? "bg-cyan-400 w-3"
                      : "bg-white/50 hover:bg-white"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Project Details */}
      <div className="p-6 md:p-8 flex flex-col gap-6 flex-grow">
        <div className="space-y-3">
          <h3 className="text-xl md:text-2xl font-bold text-[var(--foreground)] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-[var(--text-muted)] text-sm md:text-base leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack tags */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-md text-xs bg-cyan-500/5 border border-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-4 pt-4 border-t border-[var(--border-subtle)] mt-auto">
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs md:text-sm font-mono text-[var(--text-muted)] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              id={`link-github-${project.id}`}
            >
              <GithubIcon className="w-4 h-4" />
              <span>Code</span>
            </a>
          )}

          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs md:text-sm font-mono text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors ml-auto"
              id={`link-live-${project.id}`}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};

export const Projects = () => {
  const { projects } = portfolioData;
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
    { label: "Semua", value: "all" },
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
    <section id="projects" className="py-20 px-6 md:px-12 xl:px-24 relative overflow-hidden bg-[var(--background)]">
      {/* Background Glow */}
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-2">
            <span className="text-xs md:text-sm font-semibold tracking-wider text-cyan-500 dark:text-cyan-400 font-mono uppercase">Showcase</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">Project</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-1" />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-mono border transition-all duration-300 cursor-pointer ${filter === opt.value
                    ? "bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400 shadow-md"
                    : "bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--foreground)] hover:border-cyan-500/30"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-10"
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
                className="absolute -top-12 right-0 md:-top-12 md:-right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-colors border border-white/10 cursor-pointer shadow-lg"
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
                    className="absolute -bottom-16 left-1/4 -translate-x-1/2 md:bottom-auto md:left-4 md:top-1/2 md:-translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-colors border border-white/10 cursor-pointer shadow-lg"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePreview(prev => prev ? { ...prev, imageIdx: (prev.imageIdx + 1) % previewImages.length } : null);
                    }}
                    className="absolute -bottom-16 right-1/4 translate-x-1/2 md:bottom-auto md:right-4 md:top-1/2 md:-translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-colors border border-white/10 cursor-pointer shadow-lg"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Dots Indicator in Modal */}
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                    {previewImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePreview(prev => prev ? { ...prev, imageIdx: idx } : null);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === activePreview.imageIdx
                            ? "bg-cyan-400 w-4"
                            : "bg-white/50 hover:bg-white"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
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

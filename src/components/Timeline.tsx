"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Calendar, Briefcase, ArrowDown } from "lucide-react";
import { portfolioData, type TimelineItem } from "@/data/portfolio";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./Timeline.module.css";

function CareerScene({ item, index, count, progress, animated, lang }: {
  item: TimelineItem;
  index: number;
  count: number;
  progress: MotionValue<number>;
  animated: boolean;
  lang: "id" | "en";
}) {
  const start = (index - 0.35) / count;
  const end = index / count;
  const clipPath = useTransform(progress, [start, end], ["inset(0% 50% 0% 50%)", "inset(0% 0% 0% 0%)"]);
  const scale = useTransform(progress, [start, end], [0.92, 1]);
  const curtain = useTransform(progress, [start, start + (end - start) * 0.45, end], [1, 1, 0]);
  const entering = animated && index > 0;

  return (
    <motion.article
      className={styles.scene}
      aria-labelledby={`career-${item.id}`}
      style={entering ? { clipPath, scale } : undefined}
    >
      <div className={styles.identity}>
        <span className={styles.chapter}>
          <Briefcase size={16} aria-hidden="true" />
          {lang === "id" ? "Pengalaman" : "Experience"} {String(index + 1).padStart(2, "0")}
        </span>
        <span className={styles.period}><Calendar size={16} aria-hidden="true" />{item.period}</span>
        <h3 id={`career-${item.id}`} className={styles.role}>{item.role}</h3>
        <p className={styles.company}>{item.company}</p>
      </div>

      <div className={styles.details}>
        <ul className={styles.descriptions}>
          {item.descriptions.map((description) => <li key={description}>{description}</li>)}
        </ul>
        {item.tags && <ul className={styles.tags} aria-label={lang === "id" ? "Keahlian" : "Skills"}>
          {item.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>}
      </div>

      <div className={styles.footer}>
        <span>{String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
        <div className={styles.steps} aria-hidden="true">
          {Array.from({ length: count }, (_, step) => <span key={step} data-complete={step <= index} />)}
        </div>
        {animated && <span className={styles.hint}>
          {lang === "id" ? (index === count - 1 ? "Lanjutkan perjalanan" : "Gulir untuk melanjutkan") : (index === count - 1 ? "Continue the journey" : "Scroll to continue")}
          <ArrowDown size={14} aria-hidden="true" />
        </span>}
      </div>
      {entering && <motion.div aria-hidden="true" className={styles.curtain} style={{ opacity: curtain }} />}
    </motion.article>
  );
}

export const Timeline = () => {
  const { lang, t } = useLanguage();
  const { timeline } = portfolioData[lang];
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [fits, setFits] = useState(false);
  const animated = fits && reducedMotion === false && timeline.length > 1;
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 96px", "end end"] });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const scenes = Array.from(stage.querySelectorAll("article"));
    // Pin only when every complete description fits; zoom and translations can increase content height.
    const measure = () => setFits(window.innerWidth >= 1024 && scenes.every(scene => scene.offsetHeight <= window.innerHeight - 144));
    const observer = new ResizeObserver(measure);
    scenes.forEach(scene => observer.observe(scene));
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [lang]);

  return (
    <section id="experience" className="py-12 md:py-20 px-4 sm:px-6 md:px-12 xl:px-24 relative bg-bg" aria-labelledby="career-title">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-2 mb-10 md:mb-16 text-center items-center">
          <span className="text-xs md:text-sm font-semibold tracking-wider text-text font-mono uppercase">{t("timelineTitle")}</span>
          <h2 id="career-title" className="text-3xl md:text-4xl font-bold text-text">{t("timelineSubtitle")}</h2>
          <div className="w-12 h-1 bg-primary rounded-full mt-1" />
        </div>
        <div ref={trackRef} className={styles.track} data-pinned={animated} style={animated ? { height: `${(timeline.length + 1) * 100}svh` } : undefined}>
          <div ref={stageRef} className={styles.stage}>
            {timeline.map((item, index) => <CareerScene key={item.id} item={item} index={index} count={timeline.length} progress={scrollYProgress} animated={animated} lang={lang} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

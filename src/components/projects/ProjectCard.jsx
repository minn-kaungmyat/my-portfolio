import React, { memo, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ProjectCollage from "./ProjectCollage";
import { resolveImages, resolveThumbnails } from "../../utils/assets";

/**
 * Lives outside ProjectsGrid on purpose: a component defined inside another
 * component is a brand-new type on every render, which made React tear down
 * and rebuild every card (and reload its images) whenever the modal opened.
 *
 * The spotlight follows the mouse through CSS variables instead of React state,
 * so moving the mouse never re-renders anything.
 */
const ProjectCard = ({ project, onOpen }) => {
  const cardRef = useRef(null);

  const images = useMemo(() => {
    const thumbs = resolveThumbnails(project);
    return thumbs.length > 0 ? thumbs : resolveImages(project);
  }, [project]);

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const open = () => onOpen(project);

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-3"
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`Open ${project.title}`}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open();
          }
        }}
        className="project-card group block cursor-pointer rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70"
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          className="spotlight-card relative aspect-4/3 overflow-hidden rounded-xl border border-white/10 bg-white/5"
        >
          <ProjectCollage images={images} />

          {/* Info overlay — only with a real mouse, revealed on hover / focus */}
          <div className="card-overlay pointer-events-none absolute inset-0 z-30 flex-col justify-end bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 sm:p-6 transition-opacity duration-500 ease-out">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-blue-400 drop-shadow">
                {project.productType}
              </p>
              <span className="text-xs text-white/25">·</span>
              <span className="rounded border border-white/5 bg-black/30 px-2 py-0.5 text-xs font-medium text-white/70">
                {project.year}
              </span>
              {project.platforms?.map((platform) => (
                <span
                  key={platform}
                  className="rounded border border-white/5 bg-black/30 px-1.5 py-0.5 text-[10px] font-medium text-white/70"
                >
                  {platform}
                </span>
              ))}
            </div>
            <h3
              className="glitch-text mb-2 text-lg font-bold text-white sm:mb-3 sm:text-xl"
              data-text={project.title}
            >
              {project.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>View Project</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>

        {/* Caption under the image on touch screens, so the screenshot stays uncovered */}
        <div className="card-caption items-start justify-between gap-3 px-1 pt-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-white">
              {project.title}
            </h3>
            <p className="mt-0.5 truncate text-xs text-white/50">
              <span className="text-blue-400">{project.productType}</span>
              {" · "}
              {project.year}
              {project.platforms?.length > 0 &&
                ` · ${project.platforms.join(" / ")}`}
            </p>
          </div>
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-white/70" />
          </span>
        </div>
      </div>

      {project.techs?.length > 0 && (
        <div className="tech-badges-container">
          {project.techs.map((tech) => (
            <span key={tech} className="tech-badge">
              {tech}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default memo(ProjectCard);

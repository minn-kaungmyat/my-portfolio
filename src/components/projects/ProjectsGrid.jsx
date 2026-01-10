import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  X,
  Github,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { projects } from "../../data/projects.mock";
import ProjectCollage from "./ProjectCollage";
import { resolveImages, resolveThumbnails } from "../../utils/assets";

const ProjectsGrid = ({ onModalChange }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [contextFilter, setContextFilter] = useState("All");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const contextOptions = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.context))),
  ];

  // Reset expansion when changing filters so the list feels intentional
  useEffect(() => {
    setShowAll(false);
  }, [contextFilter]);

  // Notify parent when modal closes
  useEffect(() => {
    if (!selectedProject) {
      onModalChange?.(false);
    }
  }, [selectedProject, onModalChange]);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
    onModalChange?.(true);
  };

  // Resolve images for selected project
  const resolvedImages = selectedProject ? resolveImages(selectedProject) : [];

  const nextImage = (e) => {
    e?.stopPropagation();
    if (selectedProject) {
      setCurrentImageIndex((prev) => (prev + 1) % resolvedImages.length);
    }
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    if (selectedProject) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + resolvedImages.length) % resolvedImages.length
      );
    }
  };

  const SpotlightCard = ({ children, className = "", onClick }) => {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
      if (!divRef.current) return;
      const rect = divRef.current.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
      setOpacity(1);
    };

    const handleBlur = () => {
      setOpacity(0);
    };

    const handleMouseEnter = () => {
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    return (
      <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        className={`relative overflow-hidden rounded-xl border border-white/10 bg-white/5 ${className}`}
      >
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-10"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 40%)`,
          }}
        />
        {children}
      </div>
    );
  };

  const GlitchImage = ({ src, alt, className }) => {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover relative z-10"
        />

        {/* Glitch Layers */}
        <div className="absolute inset-0 mix-blend-screen opacity-0 group-hover:opacity-50 transition-opacity duration-300 translate-x-[2px] z-0">
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover filter sepia saturate-200 hue-rotate-[-50deg]"
          />
        </div>
        <div className="absolute inset-0 mix-blend-screen opacity-0 group-hover:opacity-50 transition-opacity duration-300 -translate-x-[2px] z-0">
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover filter sepia saturate-200 hue-rotate-[50deg]"
          />
        </div>

        {/* Noise Overlay on Hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none z-20 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
    );
  };

  const filteredProjects = projects.filter(
    (p) => contextFilter === "All" || p.context === contextFilter
  );

  const displayedProjects = showAll
    ? filteredProjects
    : filteredProjects.slice(0, 6);

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto" id="projects">
      <div className="mb-12 space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-grain glitch-text"
          data-text="Selected Works"
        >
          Selected Works
        </motion.h2>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Temporarily hide 'Personal' context pill — re-enable by removing the filter below */}
            {contextOptions
              .filter((opt) => opt !== "Personal")
              .map((opt, idx) => (
                <motion.button
                  key={opt}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setContextFilter(opt)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 relative overflow-hidden ${
                    contextFilter === opt
                      ? "bg-white text-black font-medium"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {contextFilter !== opt && (
                    <span
                      className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
                        mixBlendMode: "overlay",
                        opacity: 0.1,
                      }}
                    />
                  )}
                  {opt}
                </motion.button>
              ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {displayedProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="cursor-pointer"
            >
              <div className="space-y-3">
                <SpotlightCard
                  onClick={() => handleProjectClick(project)}
                  className="aspect-4/3 group overflow-hidden relative"
                >
                  {/* Collage view - always visible */}
                  <ProjectCollage
                    images={
                      resolveThumbnails(project).length > 0
                        ? resolveThumbnails(project)
                        : resolveImages(project)
                    }
                    isHovered={false}
                  />

                  {/* Desktop: show on hover, Mobile: always show with reduced opacity */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 ease-out p-6 flex flex-col justify-end z-30 pointer-events-none">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <p className="text-blue-400 text-sm font-medium drop-shadow">
                        {project.productType}
                      </p>
                      <span className="text-white/25 text-xs">·</span>
                      <span className="px-2 py-0.5 rounded bg-black/25 border border-white/5 text-white/70 text-xs font-medium">
                        {project.year}
                      </span>

                      {project.platforms && project.platforms.length > 0 && (
                        <>
                          <span className="text-white/25 text-xs">·</span>
                          <div className="flex items-center gap-1">
                            {project.platforms.map((platform) => (
                              <span
                                key={platform}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-black/25 border border-white/5 text-white/70 font-medium"
                              >
                                {platform}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <h3
                      className="text-xl font-bold text-white mb-3 glitch-text"
                      data-text={project.title}
                    >
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <span>View Project</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </SpotlightCard>

                {/* Tech Stack Badges */}
                {project.techs && project.techs.length > 0 && (
                  <div className="tech-badges-container">
                    {project.techs.map((tech) => (
                      <span key={tech} className="tech-badge">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProjects.length > 6 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="px-5 py-2 rounded-full border border-white/15 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/30 transition-colors duration-200"
          >
            {showAll ? "Show less" : `Show all (${filteredProjects.length})`}
          </button>
        </div>
      )}

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-[#111] w-full max-w-5xl rounded-2xl overflow-hidden border border-white/10 max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedProject.title}
                  </h3>
                  <p className="text-white/50 text-sm">
                    {selectedProject.productType}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-8">
                  {/* Image Carousel */}
                  <div className="lg:col-span-2 bg-black relative group">
                    <div className="aspect-video relative overflow-hidden bg-white/5">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentImageIndex}
                          src={resolvedImages[currentImageIndex]}
                          alt={`${selectedProject.title} screenshot ${
                            currentImageIndex + 1
                          }`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="w-full h-full object-contain"
                        />
                      </AnimatePresence>

                      {/* Navigation Arrows */}
                      {resolvedImages.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnails */}
                    {resolvedImages.length > 1 && (
                      <div className="flex gap-2 p-4 overflow-x-auto">
                        {resolvedImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`relative w-20 h-14 rounded-md overflow-hidden flex-shrink-0 transition-all ${
                              currentImageIndex === idx
                                ? "ring-2 ring-blue-500 opacity-100"
                                : "opacity-50 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={img}
                              alt=""
                              className="w-full h-full object-contain"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Project Details */}
                  <div className="p-6 lg:p-8 lg:border-l border-white/10">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
                          About
                        </h4>
                        <p className="text-white/80 leading-relaxed">
                          {selectedProject.description}
                        </p>
                      </div>

                      {selectedProject.role &&
                        selectedProject.role.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
                              My Role{" "}
                              {selectedProject.roleType && (
                                <span className="ml-2 text-xs font-normal normal-case text-blue-400">
                                  — {selectedProject.roleType} Development
                                </span>
                              )}
                            </h4>
                            <ul className="space-y-2">
                              {selectedProject.role.map((item, idx) => (
                                <li
                                  key={idx}
                                  className="text-white/80 text-sm leading-relaxed flex items-start gap-2"
                                >
                                  <span className="text-blue-400 mt-1 flex-shrink-0">
                                    •
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      {selectedProject.platforms &&
                        selectedProject.platforms.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
                              Platforms
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.platforms.map((platform) => (
                                <span
                                  key={platform}
                                  className="px-3 py-1 text-sm rounded-full bg-green-500/10 text-green-400/90 border border-green-500/20"
                                >
                                  {platform}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      <div>
                        <h4 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
                          Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.techs.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 text-sm rounded-full bg-white/5 text-white/80 border border-white/10"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {(selectedProject.liveLink ||
                        selectedProject.sourceLink) && (
                        <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
                          {selectedProject.liveLink && (
                            <a
                              href={selectedProject.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 w-full py-3 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View Live Site
                            </a>
                          )}
                          {selectedProject.sourceLink && (
                            <a
                              href={selectedProject.sourceLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
                            >
                              <Github className="w-4 h-4" />
                              View Source Code
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProjectsGrid;

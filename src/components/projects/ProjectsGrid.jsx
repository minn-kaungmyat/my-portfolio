import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { projects } from "../../data/projects.mock";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")";

const contextOptions = [
  "All",
  ...Array.from(new Set(projects.map((p) => p.context))),
];

const categoryOptions = [
  "All",
  ...Array.from(new Set(projects.map((p) => p.productType))).sort(),
];

const FilterChip = ({ label, active, delay, onClick }) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    onClick={onClick}
    aria-pressed={active}
    className={`relative shrink-0 overflow-hidden whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
      active
        ? "bg-white font-medium text-black"
        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
    }`}
  >
    {!active && (
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity hover:opacity-100"
        style={{ backgroundImage: NOISE_BG, mixBlendMode: "overlay", opacity: 0.1 }}
      />
    )}
    {label}
  </motion.button>
);

const ProjectsGrid = ({ onModalChange }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [contextFilter, setContextFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const categoryScrollRef = useRef(null);

  // Check scroll position for category carousel
  const checkScroll = () => {
    const container = categoryScrollRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  const scrollCategory = (direction) => {
    const container = categoryScrollRef.current;
    if (!container) return;

    const scrollAmount = 250;
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Reset expansion when changing filters so the list feels intentional
  useEffect(() => {
    setShowAll(false);
  }, [contextFilter, categoryFilter]);

  // Check scroll position on mount and after categories render
  useEffect(() => {
    const timer = setTimeout(() => checkScroll(), 100);
    window.addEventListener("resize", checkScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const openProject = useCallback(
    (project) => {
      setSelectedProject(project);
      onModalChange?.(true);
    },
    [onModalChange]
  );

  const closeProject = useCallback(() => {
    setSelectedProject(null);
    onModalChange?.(false);
  }, [onModalChange]);

  const filteredProjects = projects.filter(
    (p) =>
      (contextFilter === "All" || p.context === contextFilter) &&
      (categoryFilter === "All" || p.productType === categoryFilter)
  );

  const displayedProjects = showAll
    ? filteredProjects
    : filteredProjects.slice(0, 6);

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20"
      id="projects"
    >
      <div className="mb-10 space-y-5 md:mb-12 md:space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-grain glitch-text"
          data-text="Selected Works"
        >
          Selected Works
        </motion.h2>

        <div className="space-y-3">
          {/* Context Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {contextOptions.map((opt, idx) => (
              <FilterChip
                key={opt}
                label={opt}
                active={contextFilter === opt}
                delay={idx * 0.05}
                onClick={() => setContextFilter(opt)}
              />
            ))}
          </div>

          {/* Category Filter — swipe on touch, arrows with a mouse */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollCategory("left")}
              className={`hidden shrink-0 rounded-full bg-white/5 p-2 text-white/60 transition-all duration-300 hover:bg-white/10 hover:text-white md:block ${
                canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              aria-label="Scroll categories left"
              tabIndex={canScrollLeft ? 0 : -1}
            >
              <ChevronLeft size={20} />
            </button>

            <div
              ref={categoryScrollRef}
              onScroll={checkScroll}
              className={`scrollbar-hide -mx-4 flex-1 overflow-x-auto overflow-y-hidden scroll-smooth px-4 md:mx-0 md:px-0 ${
                canScrollLeft && canScrollRight
                  ? "fade-x-both"
                  : canScrollRight
                  ? "fade-x-right"
                  : canScrollLeft
                  ? "fade-x-left"
                  : ""
              }`}
            >
              <div className="flex w-max items-center gap-2 pr-4 md:pr-0">
                {categoryOptions.map((opt, idx) => (
                  <FilterChip
                    key={opt}
                    label={opt}
                    active={categoryFilter === opt}
                    delay={(contextOptions.length + idx) * 0.05}
                    onClick={() => setCategoryFilter(opt)}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => scrollCategory("right")}
              className={`hidden shrink-0 rounded-full bg-white/5 p-2 text-white/60 transition-all duration-300 hover:bg-white/10 hover:text-white md:block ${
                canScrollRight ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              aria-label="Scroll categories right"
              tabIndex={canScrollRight ? 0 : -1}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {displayedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={openProject}
            />
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
          <ProjectModal
            key={selectedProject.id}
            project={selectedProject}
            onClose={closeProject}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProjectsGrid;

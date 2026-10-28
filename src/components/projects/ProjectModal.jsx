import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Github,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Lock,
} from "lucide-react";
import { resolveImages } from "../../utils/assets";
import useScrollLock from "../../hooks/useScrollLock";
import useMediaQuery from "../../hooks/useMediaQuery";

const EASE = [0.22, 1, 0.36, 1];

const STATUS_STYLES = {
  Live: "bg-emerald-400",
  "In Development": "bg-amber-400",
  Concept: "bg-violet-400",
};

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : dir < 0 ? -60 : 0, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -60 : dir < 0 ? 60 : 0, opacity: 0 }),
};

const SectionTitle = ({ children, aside }) => (
  <h4 className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
    {children}
    {aside}
  </h4>
);

const ProjectModal = ({ project, onClose }) => {
  const images = useMemo(() => resolveImages(project), [project]);
  const [[index, direction], setSlide] = useState([0, 0]);
  const [loaded, setLoaded] = useState({});
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const dialogRef = useRef(null);
  const thumbsRef = useRef(null);
  const titleId = `project-modal-title-${project.id}`;
  const hasMany = images.length > 1;

  useScrollLock(true);

  const paginate = useCallback(
    (dir) => {
      if (!hasMany) return;
      setSlide(([i]) => [(i + dir + images.length) % images.length, dir]);
    },
    [hasMany, images.length]
  );

  const goTo = (i) => setSlide(([cur]) => [i, i > cur ? 1 : -1]);

  // Preload every screenshot so switching is instant
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  // Focus management + keyboard (Esc / arrows / focus trap)
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    dialogRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        paginate(1);
      } else if (e.key === "ArrowLeft") {
        paginate(-1);
      } else if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [onClose, paginate]);

  // Keep the active thumbnail in view (scrolls only the strip, never the page)
  useEffect(() => {
    const strip = thumbsRef.current;
    const active = strip?.children[index];
    if (!strip || !active) return;
    strip.scrollTo({
      left: active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2,
      behavior: "smooth",
    });
  }, [index]);

  // Vertical wheel / two-finger scroll over the thumbnail strip moves it sideways
  const onThumbsWheel = (e) => {
    const strip = thumbsRef.current;
    if (strip && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      strip.scrollLeft += e.deltaY;
    }
  };

  const panelMotion = isDesktop
    ? {
        initial: { opacity: 0, y: 24, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 16, scale: 0.98 },
        transition: { duration: 0.35, ease: EASE },
      }
    : {
        initial: { y: "100%" },
        animate: { y: 0 },
        exit: { y: "100%" },
        transition: { duration: 0.42, ease: EASE },
      };

  const hasLinks = Boolean(project.liveLink || project.sourceLink);

  const facts = [
    { label: "Year", value: project.year },
    { label: "Context", value: project.context },
    project.roleType && { label: "Role", value: project.roleType },
    project.platforms?.length && {
      label: "Platforms",
      value: project.platforms.join(" · "),
    },
  ].filter(Boolean);

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[100] hide-native-cursor flex items-end justify-center bg-black/80 backdrop-blur-md lg:items-center lg:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      data-lenis-prevent
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        {...panelMotion}
        onClick={(e) => e.stopPropagation()}
        className="modal-scroll relative flex h-[94dvh] w-full flex-col overflow-y-auto overscroll-contain rounded-t-3xl border-t border-white/10 bg-[#0b0b0b] shadow-2xl outline-none lg:grid lg:grid-rows-[minmax(0,1fr)] lg:h-[min(88vh,820px)] lg:max-w-[1200px] lg:grid-cols-[minmax(0,1fr)_400px] lg:overflow-hidden lg:rounded-2xl lg:border xl:grid-cols-[minmax(0,1fr)_440px]"
      >
        {/* ───────────── Media ───────────── */}
        <div className="relative flex shrink-0 flex-col bg-black lg:min-h-0 lg:border-r lg:border-white/10">
          {/* Mobile grab handle */}
          <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-1 w-10 -translate-x-1/2 rounded-full bg-white/30 lg:hidden" />

          <div className="modal-stage relative aspect-[4/3] w-full overflow-hidden sm:aspect-video lg:aspect-auto lg:min-h-0 lg:flex-1">
            {!loaded[index] && (
              <div className="absolute inset-0 animate-pulse bg-white/[0.03]" />
            )}

            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={index}
                src={images[index]}
                alt={`${project.title} screenshot ${index + 1} of ${images.length}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE }}
                onLoad={() => setLoaded((l) => ({ ...l, [index]: true }))}
                draggable={false}
                drag={hasMany ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, { offset, velocity }) => {
                  const swipe = offset.x + velocity.x * 0.2;
                  if (swipe < -60) paginate(1);
                  else if (swipe > 60) paginate(-1);
                }}
                className="absolute inset-0 h-full w-full select-none object-contain p-3 sm:p-4 lg:p-6"
              />
            </AnimatePresence>

            {hasMany && (
              <>
                <button
                  type="button"
                  onClick={() => paginate(-1)}
                  aria-label="Previous screenshot"
                  className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/10 bg-black/60 p-2.5 text-white/80 backdrop-blur transition hover:bg-white hover:text-black sm:flex"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => paginate(1)}
                  aria-label="Next screenshot"
                  className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/10 bg-black/60 p-2.5 text-white/80 backdrop-blur transition hover:bg-white hover:text-black sm:flex"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <span className="absolute bottom-3 left-3 z-10 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-xs font-medium tabular-nums text-white/80 backdrop-blur">
                  {index + 1} / {images.length}
                </span>
              </>
            )}

            {/* Mobile close button floats over the image */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 rounded-full border border-white/10 bg-black/60 p-2 text-white backdrop-blur lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile: dots · Tablet+: thumbnails */}
          {hasMany && (
            <>
              <div className="flex justify-center gap-1.5 py-3 sm:hidden">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to screenshot ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === index ? "w-5 bg-white" : "w-1.5 bg-white/25"
                    }`}
                  />
                ))}
              </div>

              <div
                ref={thumbsRef}
                onWheel={onThumbsWheel}
                className="scrollbar-hide relative hidden shrink-0 gap-2 overflow-x-auto border-t border-white/10 px-4 py-3 sm:flex"
              >
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Show screenshot ${i + 1}`}
                    aria-current={i === index}
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md border bg-white/5 transition-all duration-200 ${
                      i === index
                        ? "border-blue-500 opacity-100 ring-2 ring-blue-500/40"
                        : "border-white/10 opacity-45 hover:opacity-90"
                    }`}
                  >
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="h-full w-full object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ───────────── Details ───────────── */}
        <div className="flex flex-1 flex-col lg:min-h-0">
          {/* Header */}
          <header className="flex shrink-0 items-start justify-between gap-4 px-5 pb-5 pt-5 sm:px-7 lg:border-b lg:border-white/10 lg:pt-6">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                <span className="font-medium text-blue-400">
                  {project.productType}
                </span>
                {project.status && (
                  <>
                    <span className="text-white/20">·</span>
                    <span className="inline-flex items-center gap-1.5 text-white/60">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          STATUS_STYLES[project.status] || "bg-white/50"
                        }`}
                      />
                      {project.status}
                    </span>
                  </>
                )}
              </div>
              <h3
                id={titleId}
                className="text-2xl font-bold leading-tight text-white sm:text-[1.75rem]"
              >
                {project.title}
              </h3>
              {project.tagline && (
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {project.tagline}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 hidden shrink-0 rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white lg:flex"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          {/* Scrollable body (desktop) — on mobile the whole sheet scrolls */}
          <div className="modal-scroll flex-1 space-y-8 px-5 pb-8 sm:px-7 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:pt-6">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
              {facts.map((f) => (
                <div key={f.label} className="bg-[#0b0b0b] px-4 py-3">
                  <dt className="text-[11px] uppercase tracking-wider text-white/40">
                    {f.label}
                  </dt>
                  <dd className="mt-0.5 text-sm font-medium text-white/90">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>

            <section>
              <SectionTitle>Overview</SectionTitle>
              <p className="text-[15px] leading-relaxed text-white/75">
                {project.description}
              </p>
            </section>

            {project.role?.length > 0 && (
              <section>
                <SectionTitle>What I did</SectionTitle>
                <ul className="space-y-2.5">
                  {project.role.map((item, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm leading-relaxed text-white/75"
                    >
                      <span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {project.techs?.length > 0 && (
              <section>
                <SectionTitle>Tech stack</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {project.techs.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Actions — always visible (sticky on mobile, pinned on desktop) */}
          <footer className="sticky bottom-0 z-10 mt-auto shrink-0 border-t border-white/10 bg-[#0b0b0b]/95 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur sm:px-7 lg:static">
            {hasLinks ? (
              <div className="flex gap-3">
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-[0.98]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live site
                  </a>
                )}
                {project.sourceLink && (
                  <a
                    href={project.sourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.98]"
                  >
                    <Github className="h-4 w-4" />
                    Source code
                  </a>
                )}
              </div>
            ) : (
              <p className="flex items-center justify-center gap-2 py-3 text-sm text-white/45">
                <Lock className="h-4 w-4" />
                No public link available
              </p>
            )}
          </footer>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default ProjectModal;

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import heroBg from "../../assets/hero-geometric.jpg";
import profileImg from "../../assets/profile.jpg";
import Starfield from "../ui/Starfield";
import HackerNumber from "../HackerNumber";

const HeroScroll = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Enhanced Parallax Transforms with more dramatic effects
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "60%"]);
  const bgScale = useTransform(smoothProgress, [0, 1], [1, 1.3]);
  const bgBlur = useTransform(smoothProgress, [0, 0.5, 1], [0, 2, 8]);
  const bgOpacity = useTransform(smoothProgress, [0, 0.7, 1], [1, 0.8, 0.3]);

  // Text layers with staggered parallax for immersive depth effect
  // Subtitle: slower scroll (moves less)
  const subtitleY = useTransform(smoothProgress, [0, 1], ["0%", "8%"]);
  const subtitleOpacity = useTransform(
    smoothProgress,
    [0, 0.6, 1],
    [1, 0.9, 0.6]
  );
  const subtitleScale = useTransform(smoothProgress, [0, 1], [1, 1.02]);

  // Name/Heading: medium speed scroll
  const headingY = useTransform(smoothProgress, [0, 1], ["0%", "25%"]);
  const headingOpacity = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [1, 0.85, 0.5]
  );
  const headingScale = useTransform(smoothProgress, [0, 1], [1, 0.95]);
  const headingRotate = useTransform(smoothProgress, [0, 1], [0, -2]);

  // Description: faster scroll (moves more - creates parallax depth)
  const descriptionY = useTransform(smoothProgress, [0, 1], ["0%", "40%"]);
  const descriptionOpacity = useTransform(
    smoothProgress,
    [0, 0.4, 1],
    [1, 0.7, 0.3]
  );
  const descriptionScale = useTransform(smoothProgress, [0, 1], [1, 0.92]);

  const textY = useTransform(smoothProgress, [0, 1], ["0%", "20%"]);
  const textOpacity = useTransform(smoothProgress, [0, 0.6, 1], [1, 0.8, 0.5]);
  const textScale = useTransform(smoothProgress, [0, 1], [1, 0.98]);

  // Stats: very subtle movement (feels grounded)
  const statsOpacity = useTransform(
    smoothProgress,
    [0, 0.25, 0.5],
    [1, 0.6, 0]
  );
  const statsY = useTransform(smoothProgress, [0, 0.5], ["0%", "6%"]);

  const profileY = useTransform(smoothProgress, [0, 1], ["0%", "-50%"]);
  const profileScale = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [1, 1.15, 0.9]
  );
  const profileRotate = useTransform(smoothProgress, [0, 1], [0, -15]);
  const profileOpacity = useTransform(
    smoothProgress,
    [0, 0.6, 1],
    [1, 0.8, 0.2]
  );
  const profileBlur = useTransform(smoothProgress, [0, 0.6, 1], [0, 0, 3]);

  return (
    <div ref={containerRef} className="relative h-[200vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Background Layer */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            y: bgY,
            scale: bgScale,
            filter: bgBlur.get() ? `blur(${bgBlur.get()}px)` : "none",
            opacity: bgOpacity,
          }}
        >
          <div className="absolute inset-0 bg-black/60 z-[1]" />{" "}
          {/* Darker Overlay */}
          <Starfield />
          <motion.img
            src={heroBg}
            alt="Abstract Geometric Background"
            className="h-full w-full object-cover opacity-40"
            style={{
              filter: bgBlur,
            }}
          />
        </motion.div>

        {/* Content Layer */}
        <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center lg:px-32 pb-24 sm:pb-0">
          <motion.div
            style={{
              y: textY,
              opacity: textOpacity,
              scale: textScale,
            }}
            className="flex flex-col items-center max-w-4xl"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                y: subtitleY,
                opacity: subtitleOpacity,
                scale: subtitleScale,
              }}
              className="mb-4 text-sm font-medium tracking-[0.2em] text-neutral-400 uppercase"
            >
              Frontend Developer (Web & Mobile)
            </motion.span>

            <h1
              style={{
                y: headingY,
                opacity: headingOpacity,
                scale: headingScale,
                rotate: headingRotate,
              }}
              className="text-5xl font-bold tracking-tighter text-white md:text-7xl lg:text-8xl mb-6"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="glitch-text"
                data-text="MIN KAUNG MYAT"
              >
                MIN KAUNG MYAT
              </motion.span>
              <br />
              {/* <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="text-grain glitch-text"
                data-text="MYAT"
              >
                MYAT
              </motion.span> */}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                y: descriptionY,
                opacity: descriptionOpacity,
                scale: descriptionScale,
              }}
              className="text-lg text-neutral-300 max-w-3xl leading-relaxed"
            >
              Frontend-focused developer with full-stack experience, primarily
              using React and Flutter. I build web and mobile applications for
              business, internal tools, and academic projects, with a strong
              focus on clean UI architecture, responsive design, and
              maintainable code.
            </motion.p>
          </motion.div>
          {/* <div className="mt-6 flex gap-4">
            <a
              href="#contact"
              className="px-4 py-1.5 rounded-full border border-white/20 text-sm text-white/80 hover:border-white/40 hover:text-white transition"
            >
              Contact
            </a>

            <a
              href="/resume.pdf"
              target="_blank"
              className="px-4 py-1.5 rounded-full border border-white/20 text-sm text-white/80 hover:border-white/40 hover:text-white transition"
            >
              Resume
            </a>
          </div> */}

          <motion.div
            style={{
              opacity: statsOpacity,
              y: statsY,
              pointerEvents: "none",
            }}
            className="mt-10 flex flex-wrap justify-center gap-y-4 gap-x-6 text-sm text-neutral-400 sm:gap-6"
          >
            <div className="flex items-center gap-2">
              <HackerNumber value="2+" delay={600} />

              <span>Years Experience</span>
            </div>

            <div className="h-4 w-px bg-white/20 hidden sm:block" />

            <div className="flex items-center gap-2">
              <HackerNumber value="10+" delay={700} />

              <span>Projects Delivered</span>
            </div>

            <div className="h-4 w-px bg-white/20 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">Web & Mobile</span>
              <span>Applications</span>
            </div>
          </motion.div>

          {/* Profile Image — Commented out temporarily */}
          {/* 
          <motion.div
            style={{
              y: profileY,
              scale: profileScale,
              rotate: profileRotate,
              opacity: profileOpacity,
              filter: profileBlur,
            }}
            className="mt-12 md:mt-0 relative z-10"
          >
            <div className="relative h-64 w-64 md:h-96 md:w-96 overflow-hidden rounded-2xl grayscale hover:grayscale-0 transition-all duration-700 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent z-10" />
              <img
                src={profileImg}
                alt="Profile"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  mixBlendMode: "overlay",
                  opacity: 0.15,
                }}
              />
            </div>
            <div className="absolute -bottom-4 -right-4 h-24 w-24 border-r-2 border-b-2 border-white/20 rounded-br-2xl" />
            <div className="absolute -top-4 -left-4 h-24 w-24 border-l-2 border-t-2 border-white/20 rounded-tl-2xl" />
          </motion.div>
          */}
        </div>
      </div>
    </div>
  );
};

export default HeroScroll;

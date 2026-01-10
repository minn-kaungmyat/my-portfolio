import React from "react";
import { motion } from "framer-motion";
import { Code2, Palette, Database, Globe, Terminal, Cpu } from "lucide-react";

const skills = [
  {
    name: "Frontend",
    icon: Code2,
    items: [
      "React",
      "JavaScript",
      "Next.js",
      "Flutter",
      "Dart",
      "Tailwind CSS",
      "HTML5",
      "CSS3",
    ],
  },

  {
    name: "Backend",
    icon: Database,
    items: [
      "ASP.NET Core",
      "ASP.NET MVC",
      "C#",
      "Entity Framework Core",
      "SQL",
      "GraphQL",
      "Java",
      "Rest APIs",
    ],
  },
  {
    name: "Tools",
    icon: Terminal,
    items: [
      "Git",
      "Vite",
      "Figma",
      "VS Code",
      "Postman",
      "Jira",
      "Visual Studio",
    ],
  },
];

const MarqueeRow = ({ items, direction = "left", speed = 20 }) => {
  return (
    <div className="flex overflow-hidden py-4 relative z-10">
      <motion.div
        initial={{ x: direction === "left" ? 0 : "-50%" }}
        animate={{ x: direction === "left" ? "-50%" : 0 }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
        className="flex gap-8 shrink-0 px-4"
      >
        {[...items, ...items].map((item, idx) => (
          <div
            key={`${item}-${idx}`}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white/80 whitespace-nowrap hover:bg-white/10 hover:border-white/20 transition-colors cursor-default relative overflow-hidden group tech-glitch"
          >
            <span className="relative z-10">{item}</span>
            {/* Subtle noise overlay on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
                mixBlendMode: "overlay",
                opacity: 0.1,
              }}
            />
            {/* Cyan/Magenta glitch borders */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-50 border border-cyan-400 rounded-full pointer-events-none transition-opacity duration-200"
              style={{ transform: "translate(-1px, 1px)" }}
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-50 border border-pink-500 rounded-full pointer-events-none transition-opacity duration-200"
              style={{ transform: "translate(1px, -1px)" }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const Skills = () => {
  // Safely build two marquee rows from the available skill groups
  const allItems = skills.flatMap((s) => s.items);
  const half = Math.ceil(allItems.length / 2);
  const row1 = allItems.slice(0, half);
  const row2 = allItems.slice(half);

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-4 text-grain glitch-text"
          data-text="Skills"
        >
          Skills
        </motion.h2>
        <p className="text-neutral-400">
          Frontend, backend, and tools I use to ship real products.
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

        <div className="space-y-8 -rotate-1 scale-105">
          <MarqueeRow items={row1} direction="left" speed={30} />
          <MarqueeRow items={row2} direction="right" speed={30} />
        </div>
      </div>
    </section>
  );
};

export default Skills;

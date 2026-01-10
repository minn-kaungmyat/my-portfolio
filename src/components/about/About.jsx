import React from "react";
import { motion } from "framer-motion";

const About = () => {
  const timeline = [
    {
      year: "2020",
      title: "Started Learning",
      description:
        "Began my journey into web development with HTML, CSS, and JavaScript fundamentals.",
    },
    {
      year: "2021",
      title: "First Projects",
      description:
        "Built my first full-stack applications and discovered a passion for creative coding.",
    },
    {
      year: "2022",
      title: "Design & Animation",
      description:
        "Deepened expertise in UI/UX design, Framer Motion, and interactive web experiences.",
    },
    {
      year: "2023",
      title: "Professional Growth",
      description:
        "Collaborated on multiple enterprise projects, mastering complex web architectures.",
    },
    {
      year: "2024",
      title: "Creative Innovation",
      description:
        "Pioneered immersive experiences combining cutting-edge tech with artistic vision.",
    },
    {
      year: "2025",
      title: "Present & Future",
      description:
        "Focused on building transformative digital products and mentoring emerging developers.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      id="about"
      className="py-24 px-4 md:px-8 lg:px-16 max-w-6xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2
          className="text-4xl md:text-5xl font-bold mb-4 text-grain glitch-text"
          data-text="My Journey"
        >
          My Journey
        </h2>
        <p className="text-neutral-400 text-lg max-w-2xl">
          A timeline of growth, learning, and creative innovation in web
          development.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative"
      >
        {/* Vertical line */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-white/20 via-white/10 to-transparent transform md:-translate-x-1/2" />

        {/* Timeline items */}
        <div className="space-y-12">
          {timeline.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative pl-8 md:pl-0 ${
                index % 2 === 0 ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"
              } md:w-1/2`}
            >
              {/* Dot on line */}
              <div
                className={`absolute w-7 h-7 bg-black border-2 border-white/30 rounded-full flex items-center justify-center top-2 md:top-6 -left-3.5 ${
                  index % 2 === 0
                    ? "md:left-auto md:right-0 md:translate-x-1/2"
                    : "md:left-0 md:-translate-x-1/2"
                }`}
              >
                <div className="w-3 h-3 bg-white/60 rounded-full" />
              </div>

              {/* Content card */}
              <motion.div
                whileHover={{ x: index % 2 === 0 ? -10 : 10 }}
                className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm hover:border-white/20 transition-colors"
              >
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-2xl font-bold text-white">
                    {item.year}
                  </span>
                  <span className="text-sm text-white/40">|</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default About;

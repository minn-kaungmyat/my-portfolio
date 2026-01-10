import React from "react";
import HeroScroll from "../components/hero/HeroScroll";
import ProjectsGrid from "../components/projects/ProjectsGrid";
import CustomCursor from "../components/ui/CustomCursor";
import SocialLinks from "../components/ui/SocialLinks";
import Navbar from "../components/ui/Navbar";
import About from "../components/about/About";
import Skills from "../components/skills/Skills";
import { motion } from "framer-motion";
import Magnetic from "../components/ui/Magnetic";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <main className="bg-black min-h-screen text-white cursor-none selection:bg-white/30">
      <CustomCursor />
      <Navbar isHidden={isModalOpen} />

      <HeroScroll />

      <div className="relative z-10 bg-black">
        {/* <About /> */}
        <Skills />
        <ProjectsGrid onModalChange={setIsModalOpen} />

        <section
          id="contact"
          className="py-24 px-4 md:px-8 lg:px-16 border-t border-neutral-900"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold mb-8 text-grain glitch-text"
              data-text="Let’s Connect"
            >
              Let’s Connect
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-neutral-400 text-lg mb-12 max-w-2xl mx-auto"
            >
              Feel free to reach out for opportunities, projects, or
              collaborations.
            </motion.p>
            <div className="flex flex-col items-center gap-8">
              <Magnetic strength={0.3}>
                <motion.a
                  href="mailto:minnkaungmyat00@gmail.com"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-neutral-200 transition-colors"
                  data-cursor="hover"
                >
                  Get in Touch
                </motion.a>
              </Magnetic>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <SocialLinks />
              </motion.div>
            </div>
          </div>
        </section>

        <footer className="py-8 px-4 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4 text-neutral-500 text-sm max-w-7xl mx-auto mb-20 md:mb-0">
          <p>
            © {new Date().getFullYear()} Min Kaung Myat. All rights reserved.
          </p>
          <SocialLinks className="scale-75" />
        </footer>
      </div>
    </main>
  );
};

export default Home;

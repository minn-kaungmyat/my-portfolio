import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, Cpu, Briefcase, Mail } from "lucide-react";
import { getLenis } from "../../utils/lenis";

const navItems = [
  { name: "Home", icon: Home, id: "home" },
  // { name: "About", icon: User, id: "about" },
  { name: "Skills", icon: Cpu, id: "skills" },
  { name: "Projects", icon: Briefcase, id: "projects" },
  { name: "Contact", icon: Mail, id: "contact" },
];

// Tracks which section sits under the middle of the viewport so the nav can
// show where you are (the only orientation cue on touch, where tooltips can't
// appear).
const useActiveSection = (ids) => {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    let raf = null;

    const update = () => {
      raf = null;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      let current = ids[0];
      if (atBottom) {
        current = ids[ids.length - 1];
      } else {
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= window.innerHeight / 2) {
            current = id;
          }
        }
      }
      setActive(current);
    };

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return active;
};

const sectionIds = navItems.map((item) => item.id);

const Navbar = ({ isHidden }) => {
  const activeId = useActiveSection(sectionIds);

  const scrollToSection = (id) => {
    const lenis = getLenis();
    const element = id === "home" ? null : document.getElementById(id);
    const target = element ?? 0;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "auto"
      : "smooth";

    // Let Lenis drive anchor scrolling so it doesn't fight native smooth scroll
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.2 });
    } else if (element) {
      element.scrollIntoView({ behavior });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
  };

  return (
    <nav
      aria-label="Main"
      inert={isHidden}
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 md:bottom-8 ${
        isHidden ? "pointer-events-none" : ""
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <motion.ul
        initial={{ y: 100, opacity: 0 }}
        animate={{
          y: isHidden ? 100 : 0,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{
          delay: isHidden ? 0 : 0.5,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white/10 backdrop-blur-lg border border-white/10 rounded-full shadow-2xl"
      >
        {navItems.map((item) => (
          <li key={item.name}>
            <NavIcon
              item={item}
              isActive={activeId === item.id}
              onClick={() => scrollToSection(item.id)}
            />
          </li>
        ))}
      </motion.ul>
    </nav>
  );
};

const NavIcon = ({ item, isActive, onClick }) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={item.name}
      aria-current={isActive ? "location" : undefined}
      className="relative p-3 rounded-full group hover:bg-white/20 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      whileHover={{ scale: 1.2, y: -5 }}
      whileTap={{ scale: 0.9 }}
    >
      {isActive && (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-0 rounded-full bg-white/15"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <item.icon
        aria-hidden="true"
        className={`relative w-5 h-5 transition-colors group-hover:text-white ${
          isActive ? "text-white" : "text-white/60"
        }`}
      />
      <span
        aria-hidden="true"
        className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-black text-xs font-bold rounded opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
      >
        {item.name}
      </span>
    </motion.button>
  );
};

export default Navbar;

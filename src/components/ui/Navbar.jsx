import React from "react";
import { motion } from "framer-motion";
import { Home, User, Cpu, Briefcase, Mail } from "lucide-react";

const navItems = [
  { name: "Home", icon: Home, id: "home" },
  // { name: "About", icon: User, id: "about" },
  { name: "Skills", icon: Cpu, id: "skills" },
  { name: "Projects", icon: Briefcase, id: "projects" },
  { name: "Contact", icon: Mail, id: "contact" },
];

const Navbar = ({ isHidden }) => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <motion.div
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
        className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/10 rounded-full shadow-2xl"
      >
        {navItems.map((item) => (
          <NavIcon
            key={item.name}
            item={item}
            onClick={() => scrollToSection(item.id)}
          />
        ))}
      </motion.div>
    </div>
  );
};

const NavIcon = ({ item, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="relative p-3 rounded-full group hover:bg-white/20 transition-colors"
      whileHover={{ scale: 1.2, y: -5 }}
      whileTap={{ scale: 0.9 }}
    >
      <item.icon className="w-5 h-5 text-white/80 group-hover:text-white" />
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-black text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {item.name}
      </span>
    </motion.button>
  );
};

export default Navbar;

import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Facebook, Mail } from "lucide-react";
import Magnetic from "./Magnetic";

const socialLinks = [
  { name: "GitHub", icon: Github, url: "https://github.com/minn-kaungmyat" },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://www.linkedin.com/in/min-kaung-myat-a18783299/",
  },
  {
    name: "Facebook",
    icon: Facebook,
    url: "https://www.facebook.com/minnkaungmyatt/",
  },
  { name: "Email", icon: Mail, url: "mailto:minnkaungmyat00@gmail.com" },
];

const SocialLinks = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {socialLinks.map((link, index) => (
        <Magnetic key={link.name} strength={0.5}>
          <motion.a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group p-3 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="absolute inset-0 bg-white/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
            <link.icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors relative z-10" />
            <span className="sr-only">{link.name}</span>
          </motion.a>
        </Magnetic>
      ))}
    </div>
  );
};

export default SocialLinks;

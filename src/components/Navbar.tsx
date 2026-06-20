import React, { useState, useEffect } from "react";
import { Menu, X, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { RESUME_DATA } from "../types";

interface NavbarProps {
  onContactClick: () => void;
}

export default function Navbar({ onContactClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Simple active section highlights
      const sections = ["hero", "about", "skills", "experience", "projects", "education", "achievements", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Hero", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Education", href: "#education" },
    { label: "Achievements", href: "#achievements" },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#090d16]/90 backdrop-blur-md border-b border-emerald-500/10 py-3 shadow-lg shadow-emerald-950/20"
          : "bg-transparent py-5"
      }`}
      id="main-navbar"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo/Icon */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#hero");
          }}
          className="flex items-center space-x-2 group"
          id="nav-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all duration-300">
            <span className="font-mono font-bold text-white text-lg">DK</span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-slate-100 text-sm tracking-wide group-hover:text-emerald-400 transition-colors duration-300">
              {RESUME_DATA.personalInfo.name}
            </span>
            <span className="font-mono text-[10px] text-emerald-400/80 leading-none flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> Full Stack Developer
            </span>
          </div>
        </a>

        {/* Desktop Directory */}
        <div className="hidden lg:flex items-center space-x-1 bg-slate-900/50 p-1 rounded-full border border-slate-800 backdrop-blur">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium font-sans tracking-wide transition-colors duration-300 z-10 ${
                  isActive ? "text-emerald-400 font-semibold" : "text-slate-400 hover:text-slate-100"
                }`}
                id={`nav-item-${item.label.toLowerCase()}`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavbarSection"
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-600/10 border border-emerald-500/20 rounded-full z-[-1]"
                    transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Action Button & Social links (Desktop) */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex items-center space-x-2.5 border-r border-slate-800 pr-4">
            <a
              href={RESUME_DATA.personalInfo.github}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-100 transition-colors duration-300"
              title="GitHub Profile"
              id="nav-social-github"
            >
              <Github className="w-4.5 h-4.5" />
            </a>
            <a
              href={RESUME_DATA.personalInfo.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-emerald-400 transition-colors duration-300"
              title="LinkedIn Profile"
              id="nav-social-linkedin"
            >
              <Linkedin className="w-4.5 h-4.5" />
            </a>
          </div>
          <button
            onClick={onContactClick}
            className="relative px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform active:scale-[0.98] group overflow-hidden"
            id="nav-cta-hire"
          >
            <div className="absolute inset-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:animate-shine" />
            Get In Touch
          </button>
        </div>

        {/* Mobile menu trigger button */}
        <div className="flex items-center lg:hidden space-x-3">
          <button
            onClick={onContactClick}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-md transform active:scale-95 transition-all"
            id="nav-mobile-cta"
          >
            Contact
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-slate-800 transition-all focus:outline-none"
            aria-label="Toggle menu"
            id="nav-mobile-toggle"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div
          className="lg:hidden absolute top-full left-0 w-full bg-[#0a0f1d] border-b border-slate-800 py-6 px-6 shadow-2xl transition-all duration-300 animate-fadeIn"
          id="nav-mobile-drawer"
        >
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative py-3 px-4 rounded-xl text-sm font-semibold text-left transition-colors z-10 ${
                    isActive ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-slate-200"
                  }`}
                  id={`nav-mobile-item-${item.label.toLowerCase()}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeMobileNavbarSection"
                      className="absolute inset-0 bg-slate-800/80 border border-emerald-500/10 rounded-xl z-[-1]"
                      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  {item.label}
                </button>
              );
            })}
            <div className="pt-4 mt-2 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">SOCIAL CONNECTIONS</span>
              <div className="flex items-center space-x-4">
                <a
                  href={RESUME_DATA.personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-slate-200"
                  id="nav-mobile-social-github"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={RESUME_DATA.personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-emerald-400"
                  id="nav-mobile-social-linkedin"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${RESUME_DATA.personalInfo.email}`}
                  className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-emerald-400"
                  id="nav-mobile-social-email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

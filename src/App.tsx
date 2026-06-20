import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Achievements from "./components/Achievements";
import Contact from "./components/Contact";
import ResumeModal from "./components/ResumeModal";
import Footer from "./components/Footer";
import FirestoreAdmin from "./components/FirestoreAdmin";
import { dbSync } from "./lib/dbSync";

export default function App() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [, setTick] = useState(0);

  // Subscribe to Firestore loaded data updates and load resume data on boot
  useEffect(() => {
    const unsubscribe = dbSync.subscribe(() => {
      setTick((t) => t + 1);
    });

    dbSync.loadResume();

    return () => unsubscribe();
  }, []);

  const handleContactClick = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleResumeOpen = () => {
    setIsResumeOpen(true);
  };

  const handleResumeClose = () => {
    setIsResumeOpen(false);
  };

  return (
    <div className="bg-[#0a0f1d] min-h-screen text-slate-300 font-sans selection:bg-emerald-500/20 selection:text-emerald-400 antialiased overflow-x-hidden relative">
      
      {/* Universal Background Ambiance Nodes */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#0e172a]/40 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[800px] right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[110px] pointer-events-none z-0" />
      <div className="absolute top-[1800px] left-0 w-[450px] h-[450px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Global Navbar */}
      <Navbar onContactClick={handleContactClick} />

      {/* Core Portfolio Sections */}
      <main className="relative z-10">
        <Hero onContactClick={handleContactClick} onResumeClick={handleResumeOpen} />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Achievements />
        <Contact />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Printable Resume Dialog Modal */}
      <AnimatePresence>
        {isResumeOpen && (
          <ResumeModal isOpen={isResumeOpen} onClose={handleResumeClose} />
        )}
      </AnimatePresence>

      {/* Real-time Firestore Live Editor & Visitor Inbox Monitor */}
      <FirestoreAdmin />

    </div>
  );
}

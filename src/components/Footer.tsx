import React from "react";
import { ArrowUp, Github, Linkedin, Mail, Heart, Sparkles, Terminal } from "lucide-react";
import { RESUME_DATA } from "../types";

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#060a13] border-t border-slate-900 text-slate-400 py-12 px-6 relative overflow-hidden">
      {/* Decorative grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0f1d_1px,transparent_1px),linear-gradient(to_bottom,#0a0f1d_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        
        {/* Left segment brand logo */}
        <div className="space-y-3.5 max-w-sm">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white text-sm font-mono shadow-md">
              DK
            </div>
            <span className="font-sans font-bold text-slate-250 text-sm tracking-wide">
              {RESUME_DATA.personalInfo.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            Crafting secure architectures, optimized data models, and recruiters-friendly professional directories using modern web ecosystems and optimal algorithms routines.
          </p>
        </div>

        {/* Middle quick navigation */}
        <div className="flex flex-col space-y-2.5">
          <span className="font-mono text-[9px] text-slate-600 uppercase tracking-widest font-bold">CORE TECH INDEX</span>
          <div className="flex flex-wrap gap-2 text-[10px] font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-900/60">JAVA &amp; DSA</span>
            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-900/60">REACT / VITE</span>
            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-900/60">NODE / EXPRESS</span>
            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-900/60">MONGODB</span>
            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-900/60">SQL &amp; DBMS</span>
          </div>
        </div>

        {/* Right segment action buttons */}
        <div className="flex flex-col space-y-4 md:items-end shrink-0">
          {/* Back to top scroll button */}
          <button
            onClick={handleScrollToTop}
            className="flex items-center justify-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 font-sans font-semibold text-xs px-4 py-2 rounded-xl transition-all self-start md:self-auto group"
            id="footer-back-to-top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-emerald-400 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          {/* Copyright signature */}
          <div className="text-right space-y-1">
            <p className="text-[10px] font-mono text-slate-500">
              &copy; {new Date().getFullYear()} DEEPANSH KUSHWAHA. ALL RIGHTS RESERVED.
            </p>
            <p className="text-[10px] text-slate-600 flex items-center md:justify-end gap-1 font-sans">
              Designed with <Heart className="w-3 h-3 text-emerald-500/85 animate-pulse" /> for tech recruiters and tech managers alike.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}

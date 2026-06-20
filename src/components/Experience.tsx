import React from "react";
import { Briefcase, Calendar, MapPin, Sparkles, Plus, FolderGit2 } from "lucide-react";
import { motion } from "motion/react";
import { RESUME_DATA } from "../types";
import ThreeDCard from "./ThreeDCard";

export default function Experience() {
  return (
    <section className="py-24 px-6 bg-[#080d19] relative" id="experience">
      {/* Blurred decorative glowing background */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-[110px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto relative z-10"
      >
        
        {/* Section Heading */}
        <div className="flex flex-col mb-16 text-left" id="experience-heading-wrapper">
          <span className="font-mono text-xs text-emerald-400 font-bold tracking-widest uppercase flex items-center gap-1.5 mb-2">
            <Briefcase className="w-3.5 h-3.5" /> 03 // PROFESSIONAL CHRONICLE
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
            Internship &amp; Training Experience
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mt-3" />
        </div>

        {/* Timeline Layout */}
        <div className="relative max-w-4xl mx-auto pl-6 sm:pl-10 space-y-12 before:absolute before:top-2 before:bottom-2 before:left-2 sm:before:left-4 before:w-0.5 before:bg-slate-800" id="experience-timeline">
          {RESUME_DATA.experiences.map((exp, idx) => (
            <div
              key={idx}
              className="relative group transition-all"
              id={`experience-timeline-node-${idx}`}
            >
              {/* Timeline outer ring indicator */}
              <div className="absolute -left-6 sm:-left-10 top-2 -translate-x-[5px] sm:-translate-x-[4px] w-5 h-5 rounded-full bg-[#080d19] border-2 border-emerald-500/60 flex items-center justify-center group-hover:scale-110 transition-all shadow-md">
                <div className="w-2 h-2 bg-emerald-400 rounded-full group-hover:animate-pulse" />
              </div>

              {/* Core Job Details Card */}
              <ThreeDCard
                className="bg-gradient-to-br from-[#0d1527] to-[#0a0f1b] border border-slate-800 p-6 md:p-8 rounded-2xl transition-all duration-300 shadow-[neon-light] hover:shadow-[cyber-emerald]"
                id={`experience-card-${idx}`}
                glowColor="rgba(16, 185, 129, 0.12)"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                  <div className="space-y-1.5">
                    {/* Role Title */}
                    <h3 className="text-lg md:text-xl font-bold font-sans text-slate-100 tracking-tight group-hover:text-emerald-400 transition-colors">
                      {exp.role}
                    </h3>
                    
                    {/* Company name and Location */}
                    <div className="flex items-center space-x-1.5 text-xs text-slate-350">
                      <span className="font-semibold text-slate-300">{exp.company}</span>
                      {exp.location && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-emerald-500/85" />
                            {exp.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Period Block */}
                  <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/50 px-3.5 py-1.5 rounded-full border border-emerald-500/10 self-start md:self-auto shrink-0 shadow-sm">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{exp.period}</span>
                  </div>
                </div>

                {/* Bullets List */}
                <ul className="space-y-3.5 text-slate-400 text-xs md:text-sm leading-relaxed" id={`experience-bullets-${idx}`}>
                  {exp.bulletPoints.map((bullet, bulletIdx) => (
                    <li key={bulletIdx} className="flex items-start space-x-2.5">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-emerald-500/80 rounded-full shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Extracted Core Tech terms used in this Experience */}
                <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-slate-800/65" id={`experience-tags-${idx}`}>
                  <span className="text-[10px] font-mono text-slate-500 font-bold flex items-center pr-1 uppercase">
                    Core Technologies:
                  </span>
                  {idx === 0 ? (
                    <>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/10">HTML5</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/10">CSS3</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/10">Requirements gathering</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/10">A/B Prototyping</span>
                    </>
                  ) : (
                    <>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/10">HTML5</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/10">CSS3</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/10">JavaScript (ES6)</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/10">DOM manipulation</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/10">Asynchronous scripting</span>
                    </>
                  )}
                </div>
              </ThreeDCard>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

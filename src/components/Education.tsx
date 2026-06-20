import React from "react";
import { GraduationCap, Award, BookOpen, Calendar, MapPin, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { RESUME_DATA } from "../types";
import ThreeDCard from "./ThreeDCard";

export default function Education() {
  return (
    <section className="py-24 px-6 bg-[#080d19] relative" id="education">
      {/* Decorative blurred backdrops */}
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
        <div className="flex flex-col mb-16 text-left" id="education-heading-group">
          <span className="font-mono text-xs text-emerald-400 font-bold tracking-widest uppercase flex items-center gap-1.5 mb-2">
            <GraduationCap className="w-4 h-4" /> 05 // EDUCATIONAL LANDMARKS
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
            Academic Background
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mt-3" />
        </div>

        {/* Education lists structured into beautifully crafted Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="education-milestones-grid">
          {RESUME_DATA.education.map((edu, idx) => (
            <ThreeDCard
              key={idx}
              className="bg-[#0c1426] border border-slate-800/80 p-6 rounded-2xl transition-all duration-300 shadow-[neon-light] hover:shadow-[cyber-emerald] group relative overflow-hidden flex flex-col justify-between h-auto"
              id={`education-card-${idx}`}
              glowColor="rgba(20, 184, 166, 0.12)"
            >
              {/* Highlight ribbon for college */}
              {idx === 0 && (
                <div className="absolute -top-1 -right-1 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none" />
              )}

              <div className="space-y-4">
                {/* Header Icon & Score Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-950/40 group-hover:border-emerald-500/20 transition-all">
                    {idx === 0 ? (
                      <GraduationCap className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-teal-400" />
                    )}
                  </div>
                  
                  {/* Academic Score */}
                  {edu.score && (
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/10 px-3 py-1 rounded-full shadow-sm">
                      {edu.score}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-sans font-bold text-slate-100 group-hover:text-emerald-300 text-base md:text-lg leading-snug tracking-tight">
                    {edu.degree}
                  </h3>
                  
                  <p className="font-sans text-xs text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{edu.institution}, {edu.location}</span>
                  </p>
                </div>
              </div>

              {/* Timing info */}
              <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-mono mt-6 pt-4 border-t border-slate-800/60 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-500/80" />
                <span>{edu.period}</span>
                {idx === 0 && (
                  <span className="ml-auto text-[9px] text-emerald-400 font-bold bg-emerald-950/20 px-2 py-0.5 rounded uppercase">
                    ACTIVE
                  </span>
                )}
              </div>

            </ThreeDCard>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

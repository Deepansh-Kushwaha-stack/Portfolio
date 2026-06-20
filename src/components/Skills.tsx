import React, { useState } from "react";
import { Sliders, CheckCircle2, Award, Zap, Code, Database, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { RESUME_DATA } from "../types";
import ThreeDCard from "./ThreeDCard";

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...RESUME_DATA.skills.map(cat => cat.title)];

  const filteredSkills = activeCategory === "All"
    ? RESUME_DATA.skills
    : RESUME_DATA.skills.filter(cat => cat.title === activeCategory);

  return (
    <section className="py-24 px-6 bg-[#0a0f1d] relative" id="skills">
      {/* Background visual indicators */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto relative z-10"
      >
        
        {/* Section Header */}
        <div className="flex flex-col mb-16 text-left" id="skills-heading-container">
          <span className="font-mono text-xs text-emerald-400 font-bold tracking-widest uppercase flex items-center gap-1.5 mb-2">
            <Sliders className="w-3.5 h-3.5" /> 02 // TECHNICAL &amp; PROFESSIONAL MATRIX
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
            Classified Core Competencies
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mt-3" />
        </div>

        {/* Categories Tab Selectors */}
        <div className="flex flex-wrap gap-2.5 mb-12" id="skills-category-tabs">
          {categories.map((catName) => (
            <button
              key={catName}
              onClick={() => setActiveCategory(catName)}
              className={`px-5 py-2 rounded-xl text-xs font-semibold font-sans tracking-wide transition-all duration-300 border ${
                activeCategory === catName
                  ? "bg-slate-800 text-emerald-400 border-emerald-500/30 shadow-md shadow-emerald-950/20"
                  : "bg-slate-900/40 text-slate-400 hover:text-slate-100 border-slate-800/80 hover:bg-slate-800/60"
              }`}
              id={`skills-tab-${catName.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {catName}
            </button>
          ))}
        </div>

        {/* Dynamic Skills Grid grouped by Category */}
        <div className="space-y-12" id="skills-grid-wrapper">
          {filteredSkills.map((category, catIdx) => (
            <div key={catIdx} className="space-y-6" id={`skills-cat-block-${catIdx}`}>
              {/* Category Subheading */}
              <div className="flex items-center space-x-3">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                <h3 className="text-base font-bold text-slate-200 tracking-wide font-sans uppercase">
                  {category.title}
                </h3>
                <span className="text-[10px] text-slate-500 font-mono font-bold bg-slate-900 px-2 py-0.5 rounded">
                  {category.skills.length} skills listed
                </span>
              </div>

              {/* Skill cards inside category */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {category.skills.map((skill, skillIdx) => (
                  <ThreeDCard
                    key={skillIdx}
                    className="p-5 bg-gradient-to-br from-[#0d1527] to-[#0a0f1b] border border-slate-800/60 rounded-2xl shadow-[neon-light] hover:shadow-[cyber-emerald] group relative overflow-hidden"
                    id={`skill-card-${category.title.toLowerCase().replace(/\s+/g, "-")}-${skillIdx}`}
                    glowColor="rgba(20, 184, 166, 0.12)"
                  >
                    {/* Tiny visual highlight */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />

                    <div className="flex justify-between items-center mb-3 relative z-10">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:scale-125 transition-all" />
                        <span className="font-sans font-bold text-slate-200 text-sm group-hover:text-emerald-300 transition-colors">
                          {skill.name}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-400 bg-slate-900/60 px-2.5 py-0.5 rounded-full border border-slate-800/80 group-hover:border-emerald-500/20 group-hover:text-emerald-400 transition-all">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress Indicator Slider bar */}
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden relative z-10">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000 ease-out group-hover:from-emerald-400 group-hover:to-teal-400"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 font-mono relative z-10">
                      <span>LEVEL</span>
                      <span className="group-hover:text-emerald-400/80 transition-colors uppercase">
                        {skill.level >= 88 ? "Advanced" : skill.level >= 80 ? "Proficient" : "Intermediate"}
                      </span>
                    </div>

                  </ThreeDCard>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Professional Certifications & Key Badges panel */}
        <div className="mt-16 p-6 bg-gradient-to-r from-[#0d162a]/80 to-[#0c0f1d] border border-slate-800/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6" id="skills-achievements-panel">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-slate-200 text-sm">Want to look at certified proof?</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                I am an officially certified <strong className="text-slate-300 font-medium">Java Programming professional</strong> from Infosys Springboard and a Google Cloud Legend Tier achiever. Scroll down to look at my credentials in details.
              </p>
            </div>
          </div>
          <a
            href="#achievements"
            className="flex items-center justify-center space-x-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl px-5 py-2.5 text-xs font-semibold transition-all hover:bg-slate-800/60 shrink-0"
            id="skills-goto-certifications"
          >
            <span>View Certifications</span>
            <ChevronRight className="w-4 h-4 text-emerald-500" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}

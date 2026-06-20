import React from "react";
import { User, Award, Activity, Heart, ArrowRight, Notebook, Flame, Calendar, Trophy, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { RESUME_DATA } from "../types";
import ThreeDCard from "./ThreeDCard";

export default function About() {
  return (
    <section className="py-24 px-6 bg-[#080d19] relative" id="about">
      {/* Absolute floating blurred background circles */}
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-teal-500/5 rounded-full blur-[90px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto relative z-10"
      >
        
        {/* Section Heading */}
        <div className="flex flex-col mb-16 text-left" id="about-heading-group">
          <span className="font-mono text-xs text-emerald-400 font-bold tracking-widest uppercase flex items-center gap-1.5 mb-2">
            <User className="w-3.5 h-3.5" /> 01 // OVERVIEW &amp; STORY
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
            About My Developer Journey
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mt-3" />
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Summary and Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6" id="about-left-story">
            <h3 className="text-xl font-bold font-sans text-slate-200">
              Transforming specifications into interactive, responsive architectures.
            </h3>
            
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              {RESUME_DATA.personalInfo.summary}
            </p>

            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Based in <span className="text-slate-200 font-medium">Mathura, Uttar Pradesh</span>, my academic paths at GLA University teach me how to combine logical rigor with scalable structures. I love coding in <strong className="text-emerald-400">Java</strong> for algorithms and crafting full-stack websites utilizing the <strong className="text-emerald-400">MERN Stack</strong> &amp; clean JS.
            </p>

            {/* Visual core values list */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4" id="about-core-values">
              <ThreeDCard
                className="bg-[#0d1425] border border-slate-800/60 p-4 rounded-xl shadow-[neon-light] hover:shadow-[cyber-emerald]"
                glowColor="rgba(16, 185, 129, 0.12)"
                id="about-value-1"
              >
                <div className="flex space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400 shrink-0">
                    <Flame className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 font-sans tracking-wide">ALGORITHMIC THINKING</h4>
                    <p className="text-[11px] text-slate-400 leading-normal mt-1">300+ solved queries on LeetCode focusing on performance and memory.</p>
                  </div>
                </div>
              </ThreeDCard>

              <ThreeDCard
                className="bg-[#0d1425] border border-slate-800/60 p-4 rounded-xl shadow-[neon-light] hover:shadow-[cyber-emerald]"
                glowColor="rgba(20, 184, 166, 0.12)"
                id="about-value-2"
              >
                <div className="flex space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-950 flex items-center justify-center text-teal-400 shrink-0">
                    <Trophy className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 font-sans tracking-wide">LEGENDARY ENDURANCE</h4>
                    <p className="text-[11px] text-slate-400 leading-normal mt-1">Google Cloud Arcade Legend Tier recognition through extensive hands-on labs.</p>
                  </div>
                </div>
              </ThreeDCard>
            </div>
          </div>

          {/* Right Column: Cultural Fest & Campus Co-curricular Highlights */}
          <div className="lg:col-span-5 space-y-6" id="about-right-campus">
            <ThreeDCard
              className="p-6 bg-gradient-to-br from-[#0d1527] to-[#0a0f1b] border border-slate-800 rounded-2xl shadow-[neon-light] hover:shadow-[cyber-emerald] w-full"
              glowColor="rgba(20, 184, 166, 0.15)"
              id="about-engagement-card"
            >
              <span className="font-mono text-[10px] text-teal-400 font-semibold tracking-wider block mb-4">
                CAMPUS ENGAGEMENTS &amp; INVOLVEMENTS
              </span>
              
              <h3 className="text-lg font-bold font-sans text-slate-200 mb-4 flex items-center gap-1.5">
                <Award className="w-5 h-5 text-emerald-400" />
                Co-Curricular Contributions
              </h3>

              <div className="space-y-4" id="about-cocurricular-list">
                {RESUME_DATA.coCurricular.map((item, idx) => (
                  <div key={idx} className="relative pl-5 border-l-2 border-emerald-500/30 py-1 transition-all hover:bg-slate-900/30 pr-3 rounded-r-lg">
                    {/* Ring Indicator */}
                    <div className="absolute left-0 top-3 -translate-x-[5px] w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-[#0d1527]" />
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-200">{item.activity}</h4>
                      <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded-full">{item.period}</span>
                    </div>
                    <p className="font-sans text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      Role: <strong className="text-slate-300 font-medium">{item.role}</strong> at GLA University
                    </p>
                  </div>
                ))}
              </div>

              {/* Declaration block */}
              <div className="mt-6 pt-5 border-t border-slate-800/80">
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block mb-2">PROFESSIONAL DECLARATION</span>
                <p className="font-sans text-[11px] text-slate-400 leading-relaxed italic">
                  &quot;I hereby declare that all the information mentioned is true and correct to the best of my knowledge.&quot;
                </p>
                <div className="flex items-center space-x-2 mt-4">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Activity className="w-3 h-3 animate-pulse" />
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 font-bold">Deepansh Kushwaha // Mathura</span>
                </div>
              </div>
            </ThreeDCard>
          </div>

        </div>
      </motion.div>
    </section>
  );
}

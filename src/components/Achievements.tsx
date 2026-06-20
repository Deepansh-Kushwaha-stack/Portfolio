import React from "react";
import { Award, BookOpen, Code, Cloud, Laptop, ExternalLink, Sparkles, Check } from "lucide-react";
import { motion } from "motion/react";
import { RESUME_DATA } from "../types";
import ThreeDCard from "./ThreeDCard";

export default function Achievements() {
  return (
    <section className="py-24 px-6 bg-[#0a0f1d] relative" id="achievements">
      {/* Immersive background radial highlights */}
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[200px] h-[200px] bg-teal-500/5 rounded-full blur-[90px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto relative z-10"
      >
        
        {/* Section Heading */}
        <div className="flex flex-col mb-16 text-left" id="achievements-heading-group">
          <span className="font-mono text-xs text-emerald-400 font-bold tracking-widest uppercase flex items-center gap-1.5 mb-2">
            <Award className="w-4 h-4" /> 06 // PROFESSIONAL BADGES &amp; WORKSHOPS
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
            Certifications &amp; Achievements
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mt-3" />
        </div>

        {/* Credentials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="credentials-grid-container">
          {RESUME_DATA.achievements.map((item, idx) => {
            // Check icon type based on names in types data
            let IconComponent = Award;
            if (item.iconName === "Code") IconComponent = Code;
            if (item.iconName === "Cloud") IconComponent = Cloud;
            if (item.iconName === "Award") IconComponent = Award;
            if (item.iconName === "Laptop") IconComponent = Laptop;

            return (
              <ThreeDCard
                key={idx}
                className="bg-[#0c1426] border border-slate-800/80 p-6 md:p-8 rounded-2xl transition-all duration-300 shadow-[neon-light] hover:shadow-[cyber-emerald] group flex items-start space-x-5 relative overflow-hidden"
                id={`achievement-card-${idx}`}
                glowColor="rgba(16, 185, 129, 0.12)"
              >
                {/* Embedded decorative glowing lines */}
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-tr from-emerald-500/5 to-transparent rounded-full pointer-events-none" />

                {/* Left floating icon */}
                <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0 group-hover:bg-emerald-950/30 group-hover:border-emerald-500/20 group-hover:scale-105 transition-all duration-300">
                  <IconComponent className="w-5.5 h-5.5 text-emerald-400" />
                </div>

                {/* Right text payloads */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-sans font-bold text-slate-100 text-base md:text-lg tracking-tight group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h3>
                    
                    <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/10">
                      VERIFIED
                    </span>
                  </div>

                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-sans">
                    {item.description}
                  </p>

                  {/* Highlights checklist inside some credentials to make them rich */}
                  {item.title.includes("LeetCode") && (
                    <div className="flex items-center space-x-4 pt-1 text-[11px] font-mono text-slate-500">
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> Arrays
                      </span>
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> Trees &amp; BST
                      </span>
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> Dynamic Programming
                      </span>
                    </div>
                  )}

                  {item.title.includes("Google Cloud") && (
                    <div className="flex items-center space-x-4 pt-1 text-[11px] font-mono text-slate-500">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-teal-400" /> hands-on cloud labs
                      </span>
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Legend Arcade Badge
                      </span>
                    </div>
                  )}

                </div>
              </ThreeDCard>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

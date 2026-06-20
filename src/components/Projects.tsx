import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FolderGit2, ExternalLink, Github, Sparkles, Check, ChevronRight, Layers, Code, Award } from "lucide-react";
import { RESUME_DATA } from "../types";
import ThreeDCard from "./ThreeDCard";

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Full-Stack", "Frontend"];

  const filteredProjects = selectedCategory === "All"
    ? RESUME_DATA.projects
    : RESUME_DATA.projects.filter(p => p.category === selectedCategory);

  return (
    <section className="py-24 px-6 bg-[#0a0f1d] relative" id="projects">
      {/* Decorative blurred spots */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[110px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto relative z-10"
      >
        
        {/* Section Heading */}
        <div className="flex flex-col mb-16 text-left" id="projects-heading-group">
          <span className="font-mono text-xs text-emerald-400 font-bold tracking-widest uppercase flex items-center gap-1.5 mb-2">
            <FolderGit2 className="w-3.5 h-3.5" /> 04 // PROJECT ARCHIVE
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
            Flagship Product &amp; Projects
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-2 max-w-xl">
            A selective collection of complex full-stack web platforms, native algorithms systems, and operational automation routines.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mt-3" />
        </div>

        {/* Categories Tab selector */}
        <div className="flex flex-wrap gap-2 mb-12" id="projects-category-filter">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4.5 py-2 rounded-xl text-xs font-semibold font-sans tracking-wide transition-all duration-300 border ${
                selectedCategory === cat
                  ? "bg-slate-800 text-emerald-400 border-emerald-500/30 shadow-md"
                  : "bg-slate-900/40 text-slate-400 hover:text-slate-100 border-slate-800/80 hover:bg-slate-800/50"
              }`}
              id={`projects-filter-${cat.toLowerCase().replace(/\s+&amp;\s+/g, "-").replace(/\s+/g, "-")}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="projects-cards-container">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={project.title}
                className="w-full"
              >
                <ThreeDCard
                  className="bg-[#0c1426] border border-slate-800/80 p-6 md:p-8 rounded-2xl transition-all duration-300 shadow-[neon-light] hover:shadow-[cyber-emerald] group relative flex flex-col justify-between"
                  id={`project-card-${project.title.toLowerCase().replace(/\s+/g, "-")}`}
                  glowColor="rgba(16, 185, 129, 0.16)"
                >
                  {/* Tiny banner flag for Flagship MERN Project */}
                  {project.title === "HireBridge" && (
                    <div className="absolute top-4 right-4 bg-emerald-950/80 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 z-20">
                      <Sparkles className="w-3 h-3 text-emerald-400 animate-spin-slow" />
                      <span>FLAGSHIP CASE STUDY</span>
                    </div>
                  )}

                  <div className="relative">
                    {/* Title and category tag */}
                    <div className="flex items-center space-x-2.5 mb-2.5">
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
                        {project.category}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-slate-100 font-sans tracking-tight mb-3 group-hover:text-emerald-400 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-6 font-sans">
                      {project.description}
                    </p>

                    <div className="space-y-3 mb-6" id={`project-highlights-${idx}`}>
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">KEY DELIVERABLES:</span>
                      {project.highlights.map((highlight, itemIdx) => (
                        <div key={itemIdx} className="flex items-start space-x-2.5 text-xs text-slate-350 leading-relaxed">
                          <div className="w-4 h-4 rounded-full bg-emerald-950/45 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-emerald-400" />
                          </div>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6 pt-5 border-t border-slate-800/60 mt-auto relative">
                    {/* Tech stack badges */}
                    <div className="flex flex-wrap gap-1.5" id={`project-stack-${idx}`}>
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 rounded text-[10px] font-mono text-slate-300 bg-slate-900 border border-slate-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* External CTA links */}
                    <div className="flex items-center flex-wrap gap-3" id={`project-cta-${idx}`}>
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold px-4.5 py-2.5 rounded-xl transition-all"
                          id={`project-link-github-${idx}`}
                        >
                          <Github className="w-4 h-4" />
                          <span>Source Code</span>
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/15 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl transition-all"
                          id={`project-link-live-${idx}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Launch App Live</span>
                        </a>
                      )}
                    </div>
                  </div>
                </ThreeDCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}

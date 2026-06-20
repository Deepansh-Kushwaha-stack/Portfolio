import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Download, FileText, Send, Sparkles, CheckCircle, Code, Github, Linkedin, Shield } from "lucide-react";
import { RESUME_DATA } from "../types";
import ThreeDCard from "./ThreeDCard";

interface HeroProps {
  onContactClick: () => void;
  onResumeClick: () => void;
}

export default function Hero({ onContactClick, onResumeClick }: HeroProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "skills" | "hirebridge" | "rapidkeys">("profile");
  const [isConsoleTyping, setIsConsoleTyping] = useState(false);
  const [consoleCommand, setConsoleCommand] = useState("./run --deepansh");

  const runCommand = (tabName: "profile" | "skills" | "hirebridge" | "rapidkeys") => {
    setIsConsoleTyping(true);
    let cmd = "./run --deepansh";
    const term = (RESUME_DATA as any).terminal || {};
    if (tabName === "skills") cmd = "cat ~/skills.env";
    if (tabName === "hirebridge") {
      const url = term.hirebridge?.url || "https://hirebridge.netlify.app";
      cmd = `curl ${url}/api/status`;
    }
    if (tabName === "rapidkeys") {
      const url = term.rapidkeys?.url || "https://rapidkeys21.netlify.app/";
      cmd = `curl ${url}/api/status`;
    }
    
    setConsoleCommand(cmd);
    setTimeout(() => {
      setActiveTab(tabName);
      setIsConsoleTyping(false);
    }, 450);
  };

  return (
    <section
      className="relative min-h-screen pt-28 pb-16 px-6 overflow-hidden bg-[#0a0f1d] flex flex-col justify-center"
      id="hero"
    >
      {/* Immersive radial background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid lines overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Bio and Core Credentials */}
        <div className="lg:col-span-7 flex flex-col space-y-6" id="hero-left-content">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2 bg-emerald-950/45 text-emerald-400 border border-emerald-500/20 px-3.5 py-1.5 rounded-full w-fit font-mono text-xs font-semibold tracking-wide"
            id="hero-badge"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Open For Internship Or Full-Time Job Opportunities</span>
          </motion.div>

          {/* Heading */}
          <div className="space-y-3">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-mono text-sm tracking-wider text-slate-400 block"
            >
              Hi, my name is
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-100 tracking-tight select-none"
              style={{ lineHeight: 1.15 }}
              id="hero-name"
            >
              <span className="inline-flex flex-wrap text-slate-100">
                {RESUME_DATA.personalInfo.name.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    className="inline-block cursor-default origin-bottom hover:text-emerald-300 transition-colors duration-150 font-extrabold"
                    whileHover={{ 
                      y: -8, 
                      scale: 1.15, 
                      filter: "drop-shadow(0 0 12px rgba(52, 211, 153, 0.6))"
                    }}
                    transition={{ type: "spring", stiffness: 450, damping: 12 }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-600 bg-clip-text text-transparent">
                {(RESUME_DATA.personalInfo as any).tagline || "MERN Stack & Java Developer"}
              </span>
            </motion.h1>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl"
            id="hero-description"
          >
            I&apos;m a B.Tech Computer Science student at <strong className="text-emerald-400 font-medium">GLA University, Mathura</strong>. I specialize in full-stack engineering using the <strong className="text-slate-200">MERN Stack, Java, and Python</strong>, dedicated to writing high-performance, algorithmically clean code and engineering reliable backend services.
          </motion.p>

          {/* Rapid Metrics Showcase */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1 pb-3"
            id="hero-metrics"
          >
            <ThreeDCard
              className="bg-slate-900/45 border border-slate-800/80 p-3.5 rounded-2xl backdrop-blur-sm transition-all shadow-[neon-light]"
              glowColor="rgba(16, 185, 129, 0.12)"
              id="metric-leetcode"
            >
              <div className="flex flex-col justify-between h-full">
                <span className="font-mono text-lg font-bold text-emerald-400 text-cyber-glow">300+</span>
                <p className="font-sans text-[11px] text-slate-400 leading-tight mt-0.5">LeetCode Solved</p>
              </div>
            </ThreeDCard>
            
            <ThreeDCard
              className="bg-slate-900/45 border border-slate-800/80 p-3.5 rounded-2xl backdrop-blur-sm transition-all shadow-[neon-light]"
              glowColor="rgba(20, 184, 166, 0.12)"
              id="metric-grad"
            >
              <div className="flex flex-col justify-between h-full">
                <span className="font-mono text-lg font-bold text-emerald-400">June 2027</span>
                <p className="font-sans text-[11px] text-slate-400 leading-tight mt-0.5">B.Tech CS Graduation</p>
              </div>
            </ThreeDCard>

            <ThreeDCard
              className="bg-slate-900/45 border border-slate-800/80 p-3.5 rounded-2xl backdrop-blur-sm transition-all shadow-[neon-light]"
              glowColor="rgba(16, 185, 129, 0.12)"
              id="metric-gcp"
            >
              <div className="flex flex-col justify-between h-full">
                <span className="font-mono text-lg font-bold text-emerald-400">Legend</span>
                <p className="font-sans text-[11px] text-slate-400 leading-tight mt-0.5">Google Cloud Tier</p>
              </div>
            </ThreeDCard>

            <ThreeDCard
              className="bg-slate-900/45 border border-slate-800/80 p-3.5 rounded-2xl backdrop-blur-sm transition-all shadow-[neon-light]"
              glowColor="rgba(20, 184, 166, 0.12)"
              id="metric-infosys"
            >
              <div className="flex flex-col justify-between h-full">
                <span className="font-mono text-lg font-bold text-emerald-400">Certified</span>
                <p className="font-sans text-[11px] text-slate-400 leading-tight mt-0.5">Infosys Springboard</p>
              </div>
            </ThreeDCard>
          </motion.div>

          {/* Call-to-actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 pt-2"
            id="hero-cta-group"
          >
            <button
              onClick={onContactClick}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-sans text-xs font-semibold tracking-wide px-7 py-3 py-3.5 rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
              id="hero-cta-hire"
            >
              <Send className="w-4 h-4" />
              <span>Hire Me / Connect</span>
            </button>
            <button
              onClick={onResumeClick}
              className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-sans text-xs font-semibold tracking-wide px-7 py-3 rounded-xl transition-all duration-300 transform active:scale-[0.98]"
              id="hero-cta-resume"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Download &amp; Print Resume</span>
            </button>
            <a
              href="#projects"
              className="flex items-center justify-center space-x-2 bg-transparent hover:bg-slate-900/30 border border-transparent text-slate-400 hover:text-slate-200 font-sans text-xs font-semibold tracking-wide px-5 py-3 rounded-xl transition-all duration-300"
              id="hero-cta-projects"
            >
              <Code className="w-4 h-4 text-teal-400" />
              <span>Explore Projects</span>
            </a>
          </motion.div>
        </div>

        {/* Right Side: Floating Interactive 3D Dev Console */}
        <div className="lg:col-span-5 flex justify-center" id="hero-right-visual">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full max-w-md"
          >
            <ThreeDCard
              className="w-full bg-[#0d1527] border border-slate-800/80 rounded-2xl shadow-2xl relative"
              glowColor="rgba(20, 184, 166, 0.14)"
              id="interactive-terminal-card"
            >
              {/* Glossy top controller bar */}
              <div className="bg-[#0b101e] border-b border-slate-800/80 px-4 py-3 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 bg-rose-500/80 rounded-full" />
                  <span className="w-3 h-3 bg-amber-500/80 rounded-full" />
                  <span className="w-3 h-3 bg-emerald-500/80 rounded-full" />
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-slate-400/90 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>active_terminal.ts</span>
                </div>
                <div className="w-12 h-1 bg-slate-800 rounded-full" />
              </div>

              {/* Simulated file navigator tabs */}
              <div className="flex bg-[#0b0f1a] px-2 pt-2 border-b border-slate-800/60 font-mono text-[11px]">
                <button
                  onClick={() => runCommand("profile")}
                  disabled={isConsoleTyping}
                  className={`px-3 py-1.5 rounded-t-lg flex items-center space-x-1 transition-all ${
                    activeTab === "profile"
                      ? "bg-[#0d1527] border-t border-x border-slate-800/80 text-emerald-400 font-medium"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                  id="hero-tab-profile"
                >
                  <span>🚀 profile.json</span>
                </button>
                <button
                  onClick={() => runCommand("skills")}
                  disabled={isConsoleTyping}
                  className={`px-3 py-1.5 rounded-t-lg flex items-center space-x-1 transition-all ${
                    activeTab === "skills"
                      ? "bg-[#0d1527] border-t border-x border-slate-800/80 text-emerald-400 font-medium"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                  id="hero-tab-skills"
                >
                  <span>⚙️ skills.env</span>
                </button>
                <button
                  onClick={() => runCommand("hirebridge")}
                  disabled={isConsoleTyping}
                  className={`px-3 py-1.5 rounded-t-lg flex items-center space-x-1 transition-all ${
                    activeTab === "hirebridge"
                      ? "bg-[#0d1527] border-t border-x border-slate-800/80 text-emerald-400 font-medium"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                  id="hero-tab-hirebridge"
                >
                  <span>🌐 hirebridge.api</span>
                </button>
                <button
                  onClick={() => runCommand("rapidkeys")}
                  disabled={isConsoleTyping}
                  className={`px-3 py-1.5 rounded-t-lg flex items-center space-x-1 transition-all ${
                    activeTab === "rapidkeys"
                      ? "bg-[#0d1527] border-t border-x border-slate-800/80 text-emerald-400 font-medium"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                  id="hero-tab-rapidkeys"
                >
                  <span>⌨️ rapidkeys.api</span>
                </button>
              </div>

              {/* Active Content Terminal Screen */}
              <div className="p-5 font-mono text-xs text-slate-300 min-h-[290px] flex flex-col justify-between overflow-x-auto relative">
                <div className="space-y-4">
                  {/* Simulated command loading status line */}
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-500 font-bold">~</span>
                    <div className="flex-1">
                      <span className="text-slate-400">{consoleCommand}</span>
                      {isConsoleTyping && (
                        <span className="inline-block ml-1 w-2 h-4 bg-emerald-400 animate-blink" />
                      )}
                    </div>
                  </div>

                  {/* Main terminal screen payloads */}
                  <AnimatePresence mode="wait">
                    {!isConsoleTyping && activeTab === "profile" && (
                      <motion.div
                        key="profile"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-1.5 font-mono"
                      >
                        <p className="text-amber-300/90">// Extracting candidate properties...</p>
                        <p className="text-slate-400">
                          &#123;
                          <br />
                          {(((RESUME_DATA as any).terminal?.profile) || [
                            { key: "candidate", value: "Deepansh Kushwaha" },
                            { key: "education", value: "B.Tech CS @ GLA University" },
                            { key: "leetcode_rank", value: "300+ Solved" },
                            { key: "google_cloud", value: "Legend Tier Badge" },
                            { key: "springboard", value: "Java Certified" },
                            { key: "availability", value: "Available for Internship or Full-time Jobs (Summer 2026/2027)" }
                          ]).map((item: any, idx: number, arr: any[]) => (
                            <React.Fragment key={idx}>
                              <span className="pl-4 text-teal-400">&quot;{item.key}&quot;</span>: &quot;{item.value}&quot;
                              {idx < arr.length - 1 ? "," : ""}
                              <br />
                            </React.Fragment>
                          ))}
                          &#125;
                        </p>
                        <p className="text-emerald-400/90 text-[10px] flex items-center gap-1 mt-3">
                          <CheckCircle className="w-3.5 h-3.5" /> Payload parsed successfully.
                        </p>
                      </motion.div>
                    )}

                    {!isConsoleTyping && activeTab === "skills" && (
                      <motion.div
                        key="skills"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2 text-slate-400"
                      >
                        <p className="text-amber-300/90">// Querying core env variables...</p>
                        <div className="space-y-2 pt-1 font-mono text-xs">
                          {(((RESUME_DATA as any).terminal?.skills) || [
                            { name: "JAVA & DSA", level: 90 },
                            { name: "MERN Stack Backend", level: 85 },
                            { name: "SQL & DBMS", level: 80 },
                            { name: "Linux / Python", level: 75 }
                          ]).map((sk: any, idx: number) => (
                            <div key={idx}>
                              <div className="flex justify-between text-[11px] mb-0.5">
                                <span className="text-emerald-300">{sk.name}</span>
                                <span className="text-slate-500">{sk.level}%</span>
                              </div>
                              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${sk.level}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {!isConsoleTyping && activeTab === "hirebridge" && (
                      <motion.div
                        key="hirebridge"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2 font-mono"
                      >
                        <p className="text-indigo-400">CONNECTING TO NETLIFY APPLICATION...</p>
                        <p className="text-slate-400 text-xs">
                          Endpoint: <a href={((RESUME_DATA as any).terminal?.hirebridge?.url) || "https://hirebridge.netlify.app"} target="_blank" rel="noopener noreferrer" className="text-cyan-450 hover:underline hover:text-cyan-300 transition-colors bg-teal-950/20 px-1 py-0.5 rounded">{((RESUME_DATA as any).terminal?.hirebridge?.url) || "https://hirebridge.netlify.app"}</a>
                        </p>
                        <div className="bg-[#060a13] p-2.5 rounded-lg border border-slate-800/80 text-[11px] space-y-1 mt-1">
                          <p className="text-emerald-400">&gt; HTTP/1.1 {((RESUME_DATA as any).terminal?.hirebridge?.status) || "200 OK"}</p>
                          <p className="text-slate-400">&gt; Server: {((RESUME_DATA as any).terminal?.hirebridge?.server) || "Node Express & MongoDB"}</p>
                          <p className="text-slate-400">&gt; Authentication: {((RESUME_DATA as any).terminal?.hirebridge?.auth) || "JWT Token validated"}</p>
                          <p className="text-slate-500">&gt; Active roles: {((RESUME_DATA as any).terminal?.hirebridge?.activeRoles) || "Recruiter, Applicant"}</p>
                        </div>
                        <p className="text-teal-400 text-[10px] mt-2 leading-tight">
                          {((RESUME_DATA as any).terminal?.hirebridge?.footer) || "📢 HireBridge active status check: healthy and operational."}
                        </p>
                      </motion.div>
                    )}

                    {!isConsoleTyping && activeTab === "rapidkeys" && (
                      <motion.div
                        key="rapidkeys"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2 font-mono"
                      >
                        <p className="text-indigo-400">CONNECTING TO NETLIFY APPLICATION...</p>
                        <p className="text-slate-400 text-xs">
                          Endpoint: <a href={((RESUME_DATA as any).terminal?.rapidkeys?.url) || "https://rapidkeys21.netlify.app/"} target="_blank" rel="noopener noreferrer" className="text-cyan-450 hover:underline hover:text-cyan-300 transition-colors bg-teal-950/20 px-1 py-0.5 rounded">{((RESUME_DATA as any).terminal?.rapidkeys?.url) || "https://rapidkeys21.netlify.app/"}</a>
                        </p>
                        <div className="bg-[#060a13] p-2.5 rounded-lg border border-slate-800/80 text-[11px] space-y-1 mt-1">
                          <p className="text-emerald-400">&gt; HTTP/1.1 {((RESUME_DATA as any).terminal?.rapidkeys?.status) || "200 OK"}</p>
                          <p className="text-slate-400">&gt; Server: {((RESUME_DATA as any).terminal?.rapidkeys?.server) || "React Vite & Tailwind CSS"}</p>
                          <p className="text-slate-400">&gt; Features: {((RESUME_DATA as any).terminal?.rapidkeys?.features) || "WPM calculator, Accuracy tracker, LocalStorage logs"}</p>
                          <p className="text-teal-550">&gt; Status: {((RESUME_DATA as any).terminal?.rapidkeys?.latency) || "Optimized & responsive (0ms latency)"}</p>
                        </div>
                        <p className="text-teal-400 text-[10px] mt-2 leading-tight">
                          {((RESUME_DATA as any).terminal?.rapidkeys?.footer) || "⚡ RapidKeys typing practice: live and ready."}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Status bar footer */}
                <div className="pt-4 border-t border-slate-800/60 mt-4 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span>ONLINE (Live metrics)</span>
                  </span>
                  <span>CTRL + C to break</span>
                </div>
              </div>
            </ThreeDCard>
          </motion.div>
          
          {/* Subtle floating background helper card for interactive depth */}
          <div className="absolute top-1/2 -right-4 bg-gradient-to-br from-[#121f37] to-[#0e1628] border border-slate-800 text-slate-200 px-3 py-2 rounded-xl text-[10px] font-mono shadow-xl hidden sm:flex items-center space-x-2 pointer-events-none transform -translate-y-12 animate-float">
            <span className="p-1 rounded-lg bg-emerald-950 text-emerald-400 font-bold">120 FPS</span>
            <span>Smooth CSS interactions</span>
          </div>
        </div>

      </div>
    </section>
  );
}

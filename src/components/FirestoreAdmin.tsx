import React, { useState, useEffect } from "react";
import { 
  Database, X, ShieldAlert, Check, RefreshCw, Send, Mail, Trash2, 
  Edit3, MessageSquare, AlertCircle, Lock, Unlock, Key, Plus, ChevronDown, ChevronUp, Link as LinkIcon,
  GraduationCap, Briefcase, Award, Trophy, Terminal
} from "lucide-react";
import { dbSync } from "../lib/dbSync";
import { RESUME_DATA } from "../types";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";

interface InboxMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  timestamp: string;
}

export default function FirestoreAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "projects" | "skills" | "experiences" | "achievements" | "resume" | "inbox" | "terminal" | "settings">("info");
  
  // Real-time inbox messages stored in Firestore
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [isInboxLoading, setIsInboxLoading] = useState(false);

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Admin Config settings states
  const [adminPasswordSetting, setAdminPasswordSetting] = useState(dbSync.adminPassword || "deepAnsh2134");
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSaveStatus, setConfigSaveStatus] = useState<"idle" | "success" | "error">("idle");

  // Resume editing fields
  const [name, setName] = useState(RESUME_DATA.personalInfo.name);
  const [title, setTitle] = useState(RESUME_DATA.personalInfo.title);
  const [tagline, setTagline] = useState((RESUME_DATA.personalInfo as any).tagline || "MERN Stack & Java Developer");
  const [subTitle, setSubTitle] = useState(RESUME_DATA.personalInfo.subTitle);
  const [email, setEmail] = useState(RESUME_DATA.personalInfo.email);
  const [phone, setPhone] = useState(RESUME_DATA.personalInfo.phone);
  const [location, setLocation] = useState(RESUME_DATA.personalInfo.location);
  const [summary, setSummary] = useState(RESUME_DATA.personalInfo.summary);
  const [github, setGithub] = useState(RESUME_DATA.personalInfo.github || "");
  const [linkedin, setLinkedin] = useState(RESUME_DATA.personalInfo.linkedin || "");

  // Projects local editable list
  const [localProjects, setLocalProjects] = useState<any[]>(() => [...RESUME_DATA.projects]);
  const [expandedProjectIndex, setExpandedProjectIndex] = useState<number | null>(null);

  // Skills local editable list
  const [localSkills, setLocalSkills] = useState<any[]>(() => [...RESUME_DATA.skills]);
  const [expandedSkillIndex, setExpandedSkillIndex] = useState<number | null>(null);

  // Resume sub-sections local editable lists
  const [localEducation, setLocalEducation] = useState<any[]>(() => [...RESUME_DATA.education]);
  const [expandedEduIndex, setExpandedEduIndex] = useState<number | null>(null);

  const [localExperiences, setLocalExperiences] = useState<any[]>(() => [...RESUME_DATA.experiences]);
  const [expandedExpIndex, setExpandedExpIndex] = useState<number | null>(null);

  const [localAchievements, setLocalAchievements] = useState<any[]>(() => [...RESUME_DATA.achievements]);
  const [expandedAchIndex, setExpandedAchIndex] = useState<number | null>(null);

  const [localCoCurricular, setLocalCoCurricular] = useState<any[]>(() => [...RESUME_DATA.coCurricular]);
  const [expandedCcIndex, setExpandedCcIndex] = useState<number | null>(null);

  // Terminal mock section editor states
  const [localTerminal, setLocalTerminal] = useState<any>(() => {
    return JSON.parse(JSON.stringify((RESUME_DATA as any).terminal || {
      profile: [
        { key: "candidate", value: "Deepansh Kushwaha" },
        { key: "education", value: "B.Tech CS @ GLA University" },
        { key: "leetcode_rank", value: "300+ Solved" },
        { key: "google_cloud", value: "Legend Tier Badge" },
        { key: "springboard", value: "Java Certified" },
        { key: "availability", value: "Available for Internship or Full-time Jobs (Summer 2026/2027)" }
      ],
      skills: [
        { name: "JAVA & DSA", level: 90 },
        { name: "MERN Stack Backend", level: 85 },
        { name: "SQL & DBMS", level: 80 },
        { name: "Linux / Python", level: 75 }
      ],
      hirebridge: {
        url: "https://hirebridge.netlify.app",
        status: "200 OK",
        server: "Node Express & MongoDB",
        auth: "JWT Token validated",
        activeRoles: "Recruiter, Applicant",
        footer: "📢 HireBridge active status check: healthy and operational."
      },
      rapidkeys: {
        url: "https://rapidkeys21.netlify.app/",
        status: "200 OK",
        server: "React Vite & Tailwind CSS",
        features: "WPM calculator, Accuracy tracker, LocalStorage logs",
        latency: "Optimized & responsive (0ms latency)",
        footer: "⚡ RapidKeys typing practice: live and ready."
      }
    }));
  });

  // Status indicators
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Confirmation States for safe sandbox iframe operations
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const [deletingProjectIdx, setDeletingProjectIdx] = useState<number | null>(null);
  const [deletingSkillCatIdx, setDeletingSkillCatIdx] = useState<number | null>(null);
  const [deletingEduIdx, setDeletingEduIdx] = useState<number | null>(null);
  const [deletingExpIdx, setDeletingExpIdx] = useState<number | null>(null);
  const [deletingAchIdx, setDeletingAchIdx] = useState<number | null>(null);
  const [deletingCcIdx, setDeletingCcIdx] = useState<number | null>(null);
  const [resetConfirmState, setResetConfirmState] = useState<"idle" | "clicked">("idle");

  // Sync edits when Firestore loads state
  useEffect(() => {
    if (dbSync.isLoaded) {
      setName(RESUME_DATA.personalInfo.name);
      setTitle(RESUME_DATA.personalInfo.title);
      setTagline((RESUME_DATA.personalInfo as any).tagline || "MERN Stack & Java Developer");
      setSubTitle(RESUME_DATA.personalInfo.subTitle);
      setEmail(RESUME_DATA.personalInfo.email);
      setPhone(RESUME_DATA.personalInfo.phone);
      setLocation(RESUME_DATA.personalInfo.location);
      setSummary(RESUME_DATA.personalInfo.summary);
      setGithub(RESUME_DATA.personalInfo.github || "");
      setLinkedin(RESUME_DATA.personalInfo.linkedin || "");
      setLocalProjects([...RESUME_DATA.projects]);
      setLocalSkills([...RESUME_DATA.skills]);
      setLocalEducation([...RESUME_DATA.education]);
      setLocalExperiences([...RESUME_DATA.experiences]);
      setLocalAchievements([...RESUME_DATA.achievements]);
      setLocalCoCurricular([...RESUME_DATA.coCurricular]);
      setAdminPasswordSetting(dbSync.adminPassword || "deepAnsh2134");
      if ((RESUME_DATA as any).terminal) {
        setLocalTerminal(JSON.parse(JSON.stringify((RESUME_DATA as any).terminal)));
      }
    }
  }, [dbSync.isLoaded]);

  // Read message inbox from Firestore in real-time
  useEffect(() => {
    if (!isOpen || !isAuthenticated || activeTab !== "inbox") return;

    setIsInboxLoading(true);
    const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgsData: InboxMessage[] = [];
      snapshot.forEach((doc) => {
        msgsData.push({ id: doc.id, ...doc.data() } as InboxMessage);
      });
      setMessages(msgsData);
      setIsInboxLoading(false);
    }, (error) => {
      console.error("Failed to stream messages:", error);
      setIsInboxLoading(false);
    });

    return () => unsubscribe();
  }, [isOpen, isAuthenticated, activeTab]);

  // Handle password submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPasscode = dbSync.adminPassword || "deepAnsh2134";
    if (passwordInput === correctPasscode) {
      setIsAuthenticated(true);
      setAuthError("");
      setPasswordInput("");
    } else {
      setAuthError("Incorrect system passcode. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Save new admin configuration settings to Firestore
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPasswordSetting.trim()) {
      setConfigSaveStatus("error");
      return;
    }
    setIsSavingConfig(true);
    setConfigSaveStatus("idle");
    try {
      await dbSync.saveAdminPassword(adminPasswordSetting.trim());
      setConfigSaveStatus("success");
      setTimeout(() => setConfigSaveStatus("idle"), 3000);
    } catch (err: any) {
      console.error("Failed to save admin password:", err);
      setConfigSaveStatus("error");
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Centralised sync & save to Firestore
  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      // Build updated resume structure
      const updatedResume = {
        ...RESUME_DATA,
        personalInfo: {
          ...RESUME_DATA.personalInfo,
          name,
          title,
          tagline,
          subTitle,
          email,
          phone,
          location,
          summary,
          github,
          linkedin
        },
        projects: localProjects,
        skills: localSkills,
        education: localEducation,
        experiences: localExperiences,
        achievements: localAchievements,
        coCurricular: localCoCurricular,
        terminal: localTerminal
      };

      // Sync and save to Firestore
      await dbSync.saveResume(updatedResume);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err: any) {
      setSaveStatus("error");
      setErrorMessage(err.message || "Failed to sync changes with Firestore.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMessage = (msgId: string) => {
    // Set ID to show inline confirmation overlay on specific message card
    setDeletingMessageId(msgId);
  };

  const executeDeleteMessage = async (msgId: string) => {
    try {
      // 1. Delete from Firestore messages collection
      await deleteDoc(doc(db, "messages", msgId));
      
      // 2. Also clean from localStorage if it's stored there
      const saved = localStorage.getItem("inbox_messages");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const updated = parsed.filter((m: any) => m.id !== msgId);
            localStorage.setItem("inbox_messages", JSON.stringify(updated));
          }
        } catch (e) {
          console.error("Error clearing deleted message from localStorage:", e);
        }
      }
    } catch (err) {
      console.error("Error deleting message from Firestore:", err);
    } finally {
      setDeletingMessageId(null);
    }
  };

  // Set local state back to initial values in RESUME_DATA
  const handleResetToDefault = () => {
    if (resetConfirmState === "idle") {
      setResetConfirmState("clicked");
      // Resets confirm label back to normal if not clicked twice within 3 seconds
      setTimeout(() => {
        setResetConfirmState("idle");
      }, 3000);
      return;
    }

    setName("Deepansh Kushwaha");
    setTitle("Full-Stack Developer & Software Engineer");
    setTagline("MERN Stack & Java Developer");
    setSubTitle("B.Tech Computer Science Student at GLA University");
    setEmail("deepanshthakur866@gmail.com");
    setPhone("+91 9997502725");
    setLocation("Mathura, Uttar Pradesh, India");
    setSummary("As an aspiring Software Engineer and Full-Stack Developer specializing in the MERN Stack and Java/DSA, I love building robust, secure, and user-centric web platforms. With a proven track record of creating end-to-end applications like HireBridge and gaining hands-on internship experience in modern web development, I am eager to apply my technical and critical-thinking skills in solving complex engineering challenges and contributing value-added outcomes to dynamic development teams.");
    setGithub("https://github.com/Deepansh-Kushwaha-stack");
    setLinkedin("https://www.linkedin.com/in/deepansh-kushwaha-667b073a6/");
    setLocalProjects([...RESUME_DATA.projects]);
    setLocalSkills([...RESUME_DATA.skills]);
    setLocalEducation([...RESUME_DATA.education]);
    setLocalExperiences([...RESUME_DATA.experiences]);
    setLocalAchievements([...RESUME_DATA.achievements]);
    setLocalCoCurricular([...RESUME_DATA.coCurricular]);
    setLocalTerminal(JSON.parse(JSON.stringify((RESUME_DATA as any).terminal || {})));
    
    setResetConfirmState("idle");
  };

  // Handlers for dynamic education editing
  const handleAddEducation = () => {
    const newEdu = {
      degree: "Qualification / Degree Name",
      institution: "Institution",
      location: "",
      period: "Year or Period",
      score: ""
    };
    setLocalEducation([newEdu, ...localEducation]);
    setExpandedEduIndex(0);
  };

  const handleDeleteEducation = (index: number) => {
    setLocalEducation(localEducation.filter((_, idx) => idx !== index));
    if (expandedEduIndex === index) setExpandedEduIndex(null);
    setDeletingEduIdx(null);
  };

  const handleUpdateEduField = (index: number, key: string, value: any) => {
    setLocalEducation(localEducation.map((edu, idx) => idx === index ? { ...edu, [key]: value } : edu));
  };

  // Handlers for dynamic experience editing
  const handleAddExperience = () => {
    const newExp = {
      role: "Job Title",
      company: "Company Name",
      location: "",
      period: "Period (e.g. June 2025 – July 2025)",
      bulletPoints: ["Highlights of tasks built and technologies mastered."]
    };
    setLocalExperiences([newExp, ...localExperiences]);
    setExpandedExpIndex(0);
  };

  const handleDeleteExperience = (index: number) => {
    setLocalExperiences(localExperiences.filter((_, idx) => idx !== index));
    if (expandedExpIndex === index) setExpandedExpIndex(null);
    setDeletingExpIdx(null);
  };

  const handleUpdateExpField = (index: number, key: string, value: any) => {
    setLocalExperiences(localExperiences.map((exp, idx) => idx === index ? { ...exp, [key]: value } : exp));
  };

  const handleUpdateExpBullet = (expIdx: number, bulletIdx: number, val: string) => {
    setLocalExperiences(localExperiences.map((exp, idx) => {
      if (idx === expIdx) {
        const bps = [...(exp.bulletPoints || [])];
        bps[bulletIdx] = val;
        return { ...exp, bulletPoints: bps };
      }
      return exp;
    }));
  };

  const handleAddExpBullet = (expIdx: number) => {
    setLocalExperiences(localExperiences.map((exp, idx) => {
      if (idx === expIdx) {
        return { ...exp, bulletPoints: [...(exp.bulletPoints || []), ""] };
      }
      return exp;
    }));
  };

  const handleDeleteExpBullet = (expIdx: number, bulletIdx: number) => {
    setLocalExperiences(localExperiences.map((exp, idx) => {
      if (idx === expIdx) {
        return { ...exp, bulletPoints: (exp.bulletPoints || []).filter((_: any, i: number) => i !== bulletIdx) };
      }
      return exp;
    }));
  };

  // Handlers for dynamic achievements editing
  const handleAddAchievement = () => {
    const newAch = {
      title: "Achievement Title",
      description: "Detailed description of achievements and certificates.",
      iconName: "Award"
    };
    setLocalAchievements([newAch, ...localAchievements]);
    setExpandedAchIndex(0);
  };

  const handleDeleteAchievement = (index: number) => {
    setLocalAchievements(localAchievements.filter((_, idx) => idx !== index));
    if (expandedAchIndex === index) setExpandedAchIndex(null);
    setDeletingAchIdx(null);
  };

  const handleUpdateAchField = (index: number, key: string, value: any) => {
    setLocalAchievements(localAchievements.map((ach, idx) => idx === index ? { ...ach, [key]: value } : ach));
  };

  // Handlers for dynamic co-curricular editing
  const handleAddCoCurricular = () => {
    const newCc = {
      activity: "Activity / Sport / Fest",
      role: "Role",
      period: ""
    };
    setLocalCoCurricular([newCc, ...localCoCurricular]);
    setExpandedCcIndex(0);
  };

  const handleDeleteCoCurricular = (index: number) => {
    setLocalCoCurricular(localCoCurricular.filter((_, idx) => idx !== index));
    if (expandedCcIndex === index) setExpandedCcIndex(null);
    setDeletingCcIdx(null);
  };

  const handleUpdateCcField = (index: number, key: string, value: any) => {
    setLocalCoCurricular(localCoCurricular.map((cc, idx) => idx === index ? { ...cc, [key]: value } : cc));
  };

  // Add/Remove project functions
  const handleAddProject = () => {
    const newProj = {
      title: "New Project Title",
      description: "Brief description of the project, features, and tech stack.",
      category: "Full Stack",
      tags: ["React", "TypeScript", "Tailwind"],
      liveUrl: "",
      githubUrl: ""
    };
    setLocalProjects([newProj, ...localProjects]);
    setExpandedProjectIndex(0);
  };

  const handleDeleteProject = (index: number) => {
    const updated = localProjects.filter((_, idx) => idx !== index);
    setLocalProjects(updated);
    if (expandedProjectIndex === index) {
      setExpandedProjectIndex(null);
    }
    setDeletingProjectIdx(null);
  };

  const handleUpdateProjectField = (index: number, key: string, value: any) => {
    const updated = localProjects.map((item, idx) => {
      if (idx === index) {
        return { ...item, [key]: value };
      }
      return item;
    });
    setLocalProjects(updated);
  };

  const handleUpdateProjectTags = (index: number, rawTags: string) => {
    const tagsArr = rawTags.split(",").map(t => t.trim()).filter(Boolean);
    handleUpdateProjectField(index, "tags", tagsArr);
  };

  // Add/Remove skills functions
  const handleAddSkillCategory = () => {
    const newCat = {
      title: "New Category Name",
      skills: [
        { name: "Sample Skill", level: 85 }
      ]
    };
    setLocalSkills([newCat, ...localSkills]);
    setExpandedSkillIndex(0);
  };

  const handleDeleteSkillCategory = (index: number) => {
    const updated = localSkills.filter((_, idx) => idx !== index);
    setLocalSkills(updated);
    if (expandedSkillIndex === index) {
      setExpandedSkillIndex(null);
    }
    setDeletingSkillCatIdx(null);
  };

  const handleUpdateSkillCategoryTitle = (index: number, newTitle: string) => {
    const updated = localSkills.map((cat, idx) => {
      if (idx === index) {
        return { ...cat, title: newTitle };
      }
      return cat;
    });
    setLocalSkills(updated);
  };

  const handleAddSkillItem = (catIdx: number) => {
    const updated = localSkills.map((cat, idx) => {
      if (idx === catIdx) {
        return {
          ...cat,
          skills: [...(cat.skills || cat.items || []), { name: "New Skill", level: 80 }]
        };
      }
      return cat;
    });
    setLocalSkills(updated);
  };

  const handleDeleteSkillItem = (catIdx: number, itemIdx: number) => {
    const updated = localSkills.map((cat, idx) => {
      if (idx === catIdx) {
        return {
          ...cat,
          skills: (cat.skills || cat.items || []).filter((_: any, i: number) => i !== itemIdx)
        };
      }
      return cat;
    });
    setLocalSkills(updated);
  };

  const handleUpdateSkillItemField = (catIdx: number, itemIdx: number, fieldKey: "name" | "level", value: any) => {
    const updated = localSkills.map((cat, idx) => {
      if (idx === catIdx) {
        return {
          ...cat,
          skills: (cat.skills || cat.items || []).map((it: any, i: number) => {
            if (i === itemIdx) {
              return { ...it, [fieldKey]: value };
            }
            return it;
          })
        };
      }
      return cat;
    });
    setLocalSkills(updated);
  };

  return (
    <>
      {/* Floating Sparkling Firestore Icon Controller */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white px-4 py-3 rounded-full shadow-lg shadow-emerald-950/40 hover:shadow-emerald-500/10 border border-emerald-500/10 transition-all group scale-100 hover:scale-105 active:scale-95 cursor-pointer"
        id="firestore-admin-widget-trigger"
        title="Open Firestore Database Controller"
      >
        <Database className="w-5 h-5 text-emerald-300 animate-pulse group-hover:rotate-12 transition-transform" />
        <span className="font-mono text-xs font-semibold tracking-wide uppercase">Admin Panel</span>
        {!isAuthenticated && (
          <span className="bg-amber-500 text-slate-950 text-[9px] px-1 font-bold rounded-md flex items-center">
            <Lock className="w-2.5 h-2.5 mr-0.5" /> LOCK
          </span>
        )}
        {messages.length > 0 && isAuthenticated && (
          <span className="bg-red-500 text-white text-[10px] w-4.5 h-4.5 flex items-center justify-center font-bold rounded-full border border-slate-900 absolute -top-1 -right-1">
            {messages.length}
          </span>
        )}
      </button>

      {/* Slide Out Panel Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop wrapper */}
          <div 
            className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#0a0f1d] border-l border-slate-800 shadow-2xl flex flex-col h-full relative">
              
              {/* Header section with database details */}
              <div className="p-6 bg-[#0c1426] border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 font-mono tracking-wide">ADMIN PANEL</h3>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[10px] text-slate-400 font-mono">Live Sync Active</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isAuthenticated && (
                    <button 
                      onClick={handleLogout}
                      className="text-[10px] font-mono border border-slate-700 hover:border-red-500/50 text-slate-400 hover:text-red-400 px-2 py-1 rounded bg-[#070b13] transition-colors"
                      title="Clear session lock"
                    >
                      Logout
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
                    id="dashboard-close-btn"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* LOCK STATE SHIELD (PASSWORD FORM GATE) */}
              {!isAuthenticated ? (
                <div className="flex-1 flex flex-col justify-center p-6 space-y-6">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-dashed border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 scale-100 hover:scale-110 duration-200">
                      <Lock className="w-7 h-7 animate-pulse text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-slate-100 font-bold font-mono text-sm tracking-wide">SECURITY LOCK LAYER DETECTED</h4>
                      <p className="text-slate-400 text-xs mt-1 font-sans">
                        Please authorize to make direct real-time database edits across the entire application interface.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4 max-w-xs mx-auto w-full">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-widest text-center">Enter Access Passcode</label>
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full bg-[#070b14] border border-slate-800 focus:border-emerald-500/50 rounded-xl p-3 text-emerald-400 text-center font-mono text-sm uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-500/10 placeholder-slate-700"
                        placeholder="••••••••"
                        required
                        autoFocus
                      />
                    </div>

                    {authError && (
                      <div className="flex items-center justify-center space-x-1.5 text-red-400 text-[11px] font-mono text-center">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{authError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold font-mono text-xs rounded-xl tracking-wider uppercase transition-all shadow-lg shadow-emerald-900/10 hover:shadow-emerald-500/10 cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <Key className="w-4 h-4 text-emerald-300" />
                      <span>Unlock Panel</span>
                    </button>
                  </form>
                </div>
              ) : (
                /* AUTHENTICATED SYSTEM VIEW */
                <>
                  {/* Tabs selector */}
                  <div className="flex border-b border-slate-800 bg-[#080d19] font-mono text-[11px] shrink-0 overflow-x-auto">
                    <button
                      onClick={() => setActiveTab("info")}
                      className={`flex-1 py-3 text-center transition-all flex items-center justify-center space-x-1 border-b-2 whitespace-nowrap px-3 ${
                        activeTab === "info"
                          ? "border-emerald-500 text-emerald-400 bg-emerald-950/5 font-semibold"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Info</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("projects")}
                      className={`flex-1 py-3 text-center transition-all flex items-center justify-center space-x-1 border-b-2 whitespace-nowrap px-3 ${
                        activeTab === "projects"
                          ? "border-emerald-500 text-emerald-400 bg-emerald-950/5 font-semibold"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Projects</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("skills")}
                      className={`flex-1 py-3 text-center transition-all flex items-center justify-center space-x-1 border-b-2 whitespace-nowrap px-3 ${
                        activeTab === "skills"
                          ? "border-emerald-500 text-emerald-400 bg-emerald-950/5 font-semibold"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>Skills</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("experiences")}
                      className={`flex-1 py-3 text-center transition-all flex items-center justify-center space-x-1 border-b-2 whitespace-nowrap px-3 ${
                        activeTab === "experiences"
                          ? "border-emerald-500 text-emerald-400 bg-emerald-950/5 font-semibold"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Experience</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("achievements")}
                      className={`flex-1 py-3 text-center transition-all flex items-center justify-center space-x-1 border-b-2 whitespace-nowrap px-3 ${
                        activeTab === "achievements"
                          ? "border-emerald-500 text-emerald-400 bg-emerald-950/5 font-semibold"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Achievements</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("resume")}
                      className={`flex-1 py-3 text-center transition-all flex items-center justify-center space-x-1 border-b-2 whitespace-nowrap px-3 ${
                        activeTab === "resume"
                          ? "border-emerald-500 text-emerald-400 bg-emerald-950/5 font-semibold"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Resume Details</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("inbox")}
                      className={`flex-1 py-3 text-center transition-all flex items-center justify-center space-x-1 border-b-2 relative whitespace-nowrap px-3 ${
                        activeTab === "inbox"
                          ? "border-emerald-500 text-emerald-400 bg-emerald-950/5 font-semibold"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Messages</span>
                      {messages.length > 0 && (
                        <span className="bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded-full text-[9px] font-bold ml-1">
                          {messages.length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("terminal")}
                      className={`flex-1 py-3 text-center transition-all flex items-center justify-center space-x-1 border-b-2 whitespace-nowrap px-3 ${
                        activeTab === "terminal"
                          ? "border-emerald-500 text-emerald-400 bg-emerald-950/5 font-semibold"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Terminal Consoles</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("settings")}
                      className={`flex-1 py-3 text-center transition-all flex items-center justify-center space-x-1 border-b-2 whitespace-nowrap px-3 ${
                        activeTab === "settings"
                          ? "border-emerald-500 text-emerald-400 bg-emerald-950/5 font-semibold"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Settings</span>
                    </button>
                  </div>

                  {/* Panel body with scrollable content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* INFO TAB */}
                    {activeTab === "info" && (
                      <form onSubmit={handleSaveAll} className="space-y-4 text-xs font-sans">
                        <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl">
                          <p className="font-mono text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">Branding &amp; Contact Details</p>
                          <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                            Control basic contact tags, summary story, and social hyperlinks globally displayed across all sections.
                          </p>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[11px] text-slate-400 font-mono font-medium">NAME</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded-lg p-2.5 text-slate-100 font-sans outline-none focus:ring-1 focus:ring-emerald-500/20"
                            placeholder="Your full name"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[11px] text-slate-400 font-mono font-medium">TITLE &amp; ROLE</label>
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded-lg p-2.5 text-slate-100 outline-none focus:ring-1 focus:ring-emerald-500/20"
                            placeholder="Job Title"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[11px] text-slate-400 font-mono font-medium">HERO TAGLINE</label>
                          <input
                            type="text"
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded-lg p-2.5 text-slate-100 outline-none focus:ring-1 focus:ring-emerald-500/20"
                            placeholder="e.g. MERN Stack &amp; Java Developer"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[11px] text-slate-400 font-mono font-medium">ACADEMIC LINE</label>
                          <input
                            type="text"
                            value={subTitle}
                            onChange={(e) => setSubTitle(e.target.value)}
                            className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded-lg p-2.5 text-slate-100 outline-none focus:ring-1 focus:ring-emerald-500/20"
                            placeholder="College description"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[11px] text-slate-400 font-mono font-medium">EMAIL</label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded-lg p-2.5 text-slate-100 outline-none"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[11px] text-slate-400 font-mono font-medium">PHONE</label>
                            <input
                              type="text"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded-lg p-2.5 text-slate-100 outline-none"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[11px] text-slate-400 font-mono font-medium">LOCATION</label>
                          <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded-lg p-2.5 text-slate-100 outline-none"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[11px] text-slate-400 font-mono font-medium">GITHUB URL</label>
                            <input
                              type="url"
                              value={github}
                              onChange={(e) => setGithub(e.target.value)}
                              className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded-lg p-2 text-slate-100 font-mono outline-none text-[11px]"
                              placeholder="https://github.com..."
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[11px] text-slate-400 font-mono font-medium">LINKEDIN URL</label>
                            <input
                              type="url"
                              value={linkedin}
                              onChange={(e) => setLinkedin(e.target.value)}
                              className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded-lg p-2 text-slate-100 font-mono outline-none text-[11px]"
                              placeholder="https://linkedin.com/in/..."
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[11px] text-slate-400 font-mono font-medium">SUMMARY BIO</label>
                          <textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            rows={5}
                            className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded-lg p-2.5 text-slate-100 outline-none leading-relaxed"
                            placeholder="Who you are..."
                            required
                          />
                        </div>

                        {/* Sync actions block */}
                        {renderSyncStatus()}
                        {renderFooterActionButtons()}
                      </form>
                    )}

                    {/* PROJECTS TAB */}
                    {activeTab === "projects" && (
                      <div className="space-y-4 text-xs">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-mono text-emerald-400 uppercase text-[11px] font-semibold tracking-wider">PROJECTS SYSTEM EDITOR</h4>
                            <p className="text-slate-500 text-[10px]">Add, order, and adjust portfolio cards.</p>
                          </div>
                          <button
                            onClick={handleAddProject}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold font-mono text-[10px] rounded-lg tracking-wider uppercase transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Projects</span>
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {localProjects.map((project, idx) => {
                            const isExpanded = expandedProjectIndex === idx;
                            return (
                              <div key={idx} className="bg-[#0b1425] border border-slate-800 rounded-xl overflow-hidden">
                                <div 
                                  onClick={() => setExpandedProjectIndex(isExpanded ? null : idx)}
                                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/20 select-none"
                                >
                                  <div className="flex items-center space-x-2">
                                    <span className="font-mono text-[10px] text-slate-500">#{idx + 1}</span>
                                    <strong className="text-slate-200">{project.title || "Untitled Project"}</strong>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[9.5px] font-mono text-cyan-400">{project.category}</span>
                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                  </div>
                                </div>

                                {isExpanded && (
                                  <div className="p-4 border-t border-slate-900/60 bg-black/10 space-y-3 animate-fade-in text-[11px]">
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-slate-400 font-mono font-medium">PROJECT TITLE</label>
                                        <input
                                          type="text"
                                          value={project.title}
                                          onChange={(e) => handleUpdateProjectField(idx, "title", e.target.value)}
                                          className="w-full bg-[#080d19] border border-slate-800/80 rounded-lg p-2 text-slate-100 outline-none"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-slate-400 font-mono font-medium">CATEGORY</label>
                                        <input
                                          type="text"
                                          value={project.category}
                                          onChange={(e) => handleUpdateProjectField(idx, "category", e.target.value)}
                                          className="w-full bg-[#080d19] border border-slate-800/80 rounded-lg p-2 text-slate-100 outline-none"
                                        />
                                      </div>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-[10px] text-slate-400 font-mono font-medium font-bold text-slate-350">TAGS (COMMA SEPARATED)</label>
                                      <input
                                        type="text"
                                        value={project.tags ? project.tags.join(", ") : ""}
                                        onChange={(e) => handleUpdateProjectTags(idx, e.target.value)}
                                        className="w-full bg-[#080d19] border border-slate-800/80 rounded-lg p-2 text-slate-100 font-mono text-[10.5px] outline-none"
                                        placeholder="React, TypeScript, Node.js"
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-slate-400 font-mono font-medium">LIVE PREVIEW URL</label>
                                        <input
                                          type="url"
                                          value={project.liveUrl || ""}
                                          onChange={(e) => handleUpdateProjectField(idx, "liveUrl", e.target.value)}
                                          className="w-full bg-[#080d19] border border-slate-800/80 rounded-lg p-2 text-slate-100 font-mono outline-none"
                                          placeholder="https://..."
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-slate-400 font-mono font-medium">GITHUB LINK</label>
                                        <input
                                          type="url"
                                          value={project.githubUrl || ""}
                                          onChange={(e) => handleUpdateProjectField(idx, "githubUrl", e.target.value)}
                                          className="w-full bg-[#080d19] border border-slate-800/80 rounded-lg p-2 text-slate-100 font-mono outline-none"
                                          placeholder="https://..."
                                        />
                                      </div>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-[10px] text-slate-400 font-mono font-medium">DESCRIPTION</label>
                                      <textarea
                                        value={project.description}
                                        onChange={(e) => handleUpdateProjectField(idx, "description", e.target.value)}
                                        rows={3}
                                        className="w-full bg-[#080d19] border border-slate-800/80 rounded-lg p-2 text-slate-100 outline-none leading-relaxed"
                                      />
                                    </div>

                                    <div className="flex justify-end pt-1">
                                      {deletingProjectIdx === idx ? (
                                        <div className="flex items-center space-x-2 bg-red-950/30 p-1.5 rounded-lg border border-red-500/35">
                                          <span className="text-[10px] text-red-400 font-mono font-medium">Delete project?</span>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteProject(idx)}
                                            className="text-[9.5px] font-bold font-mono bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded cursor-pointer transition-all"
                                          >
                                            YES
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setDeletingProjectIdx(null)}
                                            className="text-[9.5px] font-mono bg-slate-800 hover:bg-slate-755 text-slate-300 px-2.5 py-1 rounded cursor-pointer transition-all"
                                          >
                                            NO
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => setDeletingProjectIdx(idx)}
                                          className="text-[9.5px] font-mono flex items-center space-x-1 border border-red-950 hover:border-red-500/50 text-slate-400 hover:text-red-400 bg-red-950/10 px-2.5 py-1.5 rounded-lg transition-all"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                          <span>Trash Project</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {renderSyncStatus()}
                        {renderFooterActionButtons()}
                      </div>
                    )}

                    {/* SKILLS TAB */}
                    {activeTab === "skills" && (
                      <div className="space-y-4 text-xs">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-mono text-emerald-400 uppercase text-[11px] font-semibold tracking-wider">SKILLS MATRIX CONFIG</h4>
                            <p className="text-slate-500 text-[10px]">Alter skill values and proficiency levels.</p>
                          </div>
                          <button
                            onClick={handleAddSkillCategory}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold font-mono text-[10px] rounded-lg tracking-wider uppercase transition-all cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Category</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {localSkills.map((category, catIdx) => {
                            const isExpanded = expandedSkillIndex === catIdx;
                            return (
                              <div key={catIdx} className="bg-[#0b1425] border border-slate-800 rounded-xl overflow-hidden">
                                <div 
                                  onClick={() => setExpandedSkillIndex(isExpanded ? null : catIdx)}
                                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/20 select-none"
                                >
                                  <div className="flex items-center space-x-2">
                                    <span className="font-mono text-[10px] text-slate-500">Group #{catIdx + 1}</span>
                                    <strong className="text-slate-200">{category.title || "Category Title"}</strong>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="bg-[#050911] px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono border border-slate-800/80">{(category.skills || category.items || []).length} items</span>
                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                  </div>
                                </div>

                                {isExpanded && (
                                  <div className="p-4 border-t border-slate-900/60 bg-black/10 space-y-4 animate-fade-in">
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-slate-500 font-mono tracking-wide uppercase">CATEGORY TITLE</label>
                                      <input
                                        type="text"
                                        value={category.title}
                                        onChange={(e) => handleUpdateSkillCategoryTitle(catIdx, e.target.value)}
                                        className="w-full bg-[#080d19] border border-slate-800/80 rounded-lg p-2 text-slate-100 font-semibold text-xs outline-none"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-b border-slate-900/80 pb-1.5 uppercase">
                                        <span>SKILL DOMAIN NAME</span>
                                        <span>Profe %</span>
                                      </div>

                                      {(category.skills || category.items || []).map((skillItem: any, itemIdx: number) => (
                                        <div key={itemIdx} className="flex items-center space-x-2">
                                          <input
                                            type="text"
                                            value={skillItem.name}
                                            onChange={(e) => handleUpdateSkillItemField(catIdx, itemIdx, "name", e.target.value)}
                                            className="flex-1 bg-[#080d19] border border-slate-850 p-1.5 rounded-lg text-slate-100 outline-none text-[11px]"
                                            placeholder="Skill e.g., Node.js"
                                          />
                                          <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={skillItem.level}
                                            onChange={(e) => handleUpdateSkillItemField(catIdx, itemIdx, "level", parseInt(e.target.value) || 80)}
                                            className="w-16 bg-[#080d19] border border-slate-850 p-1.5 rounded-lg text-emerald-400 text-center font-mono font-bold outline-none text-[11px]"
                                          />
                                          <button
                                            onClick={() => handleDeleteSkillItem(catIdx, itemIdx)}
                                            className="p-1.5 border border-transparent hover:border-red-950 text-slate-500 hover:text-red-400 hover:bg-red-950/25 transition-colors rounded-lg cursor-pointer"
                                            title="Remove skill row"
                                          >
                                            <X className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t border-slate-900/40">
                                      {deletingSkillCatIdx === catIdx ? (
                                        <div className="flex items-center space-x-2 bg-red-950/30 p-1.5 rounded-lg border border-red-500/35">
                                          <span className="text-[10px] text-red-400 font-mono font-medium">Delete block?</span>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteSkillCategory(catIdx)}
                                            className="text-[9.5px] font-bold font-mono bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded cursor-pointer transition-all"
                                          >
                                            YES
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setDeletingSkillCatIdx(null)}
                                            className="text-[9.5px] font-mono bg-slate-800 hover:bg-slate-755 text-slate-300 px-2.5 py-1 rounded cursor-pointer transition-all"
                                          >
                                            NO
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => setDeletingSkillCatIdx(catIdx)}
                                          className="text-[9.5px] font-mono flex items-center space-x-1 border border-red-950/40 text-slate-500 hover:text-red-400 hover:bg-red-950/10 px-2.5 py-1.5 rounded-lg transition-colors"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                          <span>Trash Category</span>
                                        </button>
                                      )}

                                      <button
                                        onClick={() => handleAddSkillItem(catIdx)}
                                        className="text-[9.5px] font-mono flex items-center space-x-1 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/20 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer bg-slate-900/60"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add Skill Row</span>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {renderSyncStatus()}
                        {renderFooterActionButtons()}
                      </div>
                    )}

                    {/* EXPERIENCES TAB */}
                    {activeTab === "experiences" && (
                      <div className="space-y-4 font-sans text-xs">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-mono text-emerald-400 uppercase text-[11px] font-semibold tracking-wider">Internship &amp; Training Experience</h4>
                            <p className="text-slate-500 text-[10px]">Add, edit, or remove professional career history entries.</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddExperience}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold font-mono text-[10px] rounded-lg tracking-wider uppercase transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Experience</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {localExperiences.map((exp, idx) => (
                            <div key={idx} className="bg-[#0b1425] border border-slate-850 rounded-lg p-3 space-y-2.5 relative">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-200 text-[11px] max-w-[80%] truncate">
                                  {exp.company || "New Company"} {exp.role ? `(${exp.role})` : ""}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedExpIndex(expandedExpIndex === idx ? null : idx)}
                                    className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-850 cursor-pointer"
                                  >
                                    {expandedExpIndex === idx ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletingExpIdx(idx)}
                                    className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-red-950/20 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {deletingExpIdx === idx && (
                                <div className="absolute inset-0 bg-[#070c16]/95 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center p-3 text-center z-10">
                                  <span className="font-bold text-slate-200 text-[10px] mb-1.5">Delete this Experience entry?</span>
                                  <div className="flex space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteExperience(idx)}
                                      className="px-2.5 py-1 bg-red-600 text-white rounded text-[9.5px] font-mono font-semibold cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeletingExpIdx(null)}
                                      className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded text-[9.5px] font-mono cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}

                              {expandedExpIndex === idx && (
                                <div className="space-y-3 pt-2 border-t border-slate-900/60 animate-fade-in">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-slate-500 font-mono uppercase">Company / Organization</label>
                                      <input
                                        type="text"
                                        value={exp.company || ""}
                                        onChange={(e) => handleUpdateExpField(idx, "company", e.target.value)}
                                        className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded p-2 text-slate-250 text-[11px] outline-none"
                                        placeholder="Cognifyz Pvt. Ltd"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-slate-500 font-mono uppercase">Role / Job Title</label>
                                      <input
                                        type="text"
                                        value={exp.role || ""}
                                        onChange={(e) => handleUpdateExpField(idx, "role", e.target.value)}
                                        className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded p-2 text-slate-250 text-[11px] outline-none"
                                        placeholder="Web Developer Intern"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-slate-500 font-mono uppercase">Location</label>
                                      <input
                                        type="text"
                                        value={exp.location || ""}
                                        onChange={(e) => handleUpdateExpField(idx, "location", e.target.value)}
                                        className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded p-2 text-slate-250 text-[11px] outline-none"
                                        placeholder="Mathura or Remote"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-slate-500 font-mono uppercase">Duration / Period</label>
                                      <input
                                        type="text"
                                        value={exp.period || ""}
                                        onChange={(e) => handleUpdateExpField(idx, "period", e.target.value)}
                                        className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded p-2 text-slate-250 text-[11px] outline-none"
                                        placeholder="Aug 2025 - Sep 2025"
                                      />
                                    </div>
                                  </div>

                                  {/* Bullet points sub-editor */}
                                  <div className="space-y-2 bg-black/30 p-2.5 rounded-lg border border-slate-900/60 font-sans">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Bullet Highlights</span>
                                      <button
                                        type="button"
                                        onClick={() => handleAddExpBullet(idx)}
                                        className="text-[9px] font-mono text-teal-400 hover:text-teal-300 flex items-center space-x-0.5 cursor-pointer"
                                      >
                                        <Plus className="w-3 h-3" />
                                        <span>Add Bullet</span>
                                      </button>
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                      {(exp.bulletPoints || []).map((bp: string, bpIdx: number) => (
                                        <div key={bpIdx} className="flex items-start space-x-2">
                                          <span className="text-slate-600 mt-2.5 font-mono text-[9px]">•</span>
                                          <textarea
                                            value={bp || ""}
                                            onChange={(e) => handleUpdateExpBullet(idx, bpIdx, e.target.value)}
                                            rows={2}
                                            className="flex-1 bg-[#080d19] border border-slate-850 focus:border-emerald-500/50 rounded p-1.5 text-slate-200 text-[10.5px] outline-none resize-none font-sans"
                                            placeholder="Task highlight description..."
                                          />
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteExpBullet(idx, bpIdx)}
                                            className="text-slate-500 hover:text-red-400 p-1 rounded mt-1.5 hover:bg-red-950/20 cursor-pointer"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {renderSyncStatus()}
                        {renderFooterActionButtons()}
                      </div>
                    )}

                    {/* ACHIEVEMENTS TAB */}
                    {activeTab === "achievements" && (
                      <div className="space-y-4 font-sans text-xs">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-mono text-emerald-400 uppercase text-[11px] font-semibold tracking-wider">Certifications &amp; Achievements</h4>
                            <p className="text-slate-500 text-[10px]">Add, edit, or remove accolades, credentials, and achievements.</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddAchievement}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold font-mono text-[10px] rounded-lg tracking-wider uppercase transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Achievement</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {localAchievements.map((ach, idx) => (
                            <div key={idx} className="bg-[#0b1425] border border-slate-850 rounded-lg p-3 space-y-2.5 relative">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-200 text-[11px] max-w-[80%] truncate">
                                  {ach.title || "New Recognition Title"}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedAchIndex(expandedAchIndex === idx ? null : idx)}
                                    className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-850 cursor-pointer"
                                  >
                                    {expandedAchIndex === idx ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletingAchIdx(idx)}
                                    className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-red-950/20 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {deletingAchIdx === idx && (
                                <div className="absolute inset-0 bg-[#070c16]/95 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center p-3 text-center z-10">
                                  <span className="font-bold text-slate-200 text-[10px] mb-1.5">Delete this achievement?</span>
                                  <div className="flex space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteAchievement(idx)}
                                      className="px-2.5 py-1 bg-red-600 text-white rounded text-[9.5px] font-mono font-semibold cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeletingAchIdx(null)}
                                      className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded text-[9.5px] font-mono cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}

                              {expandedAchIndex === idx && (
                                <div className="space-y-2 pt-2 border-t border-slate-900/60 animate-fade-in">
                                  <div className="space-y-1">
                                    <label className="text-[10px] text-slate-500 font-mono uppercase">Achievement Title / Platform</label>
                                    <input
                                      type="text"
                                      value={ach.title || ""}
                                      onChange={(e) => handleUpdateAchField(idx, "title", e.target.value)}
                                      className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded p-2 text-slate-250 text-[11px] outline-none"
                                      placeholder="Leetcode / Google Cloud arcade..."
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] text-slate-500 font-mono uppercase">Accolade / Description Detail</label>
                                    <textarea
                                      value={ach.description || ""}
                                      onChange={(e) => handleUpdateAchField(idx, "description", e.target.value)}
                                      rows={3}
                                      className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded p-2 text-slate-250 text-[11px] outline-none resize-none"
                                      placeholder="Completing multiple cloud tracks, 300+ questions..."
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {renderSyncStatus()}
                        {renderFooterActionButtons()}
                      </div>
                    )}

                    {/* EDIT RESUME TAB */}
                    {activeTab === "resume" && (
                      <div className="space-y-6 font-sans text-xs">
                        <div className="p-3 bg-teal-950/20 border border-teal-500/20 rounded-xl">
                          <p className="font-mono text-[10px] text-teal-400 font-semibold uppercase tracking-wider">Configure Resume Sections</p>
                          <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                            Fine-tune Education, Internship/Experiences, Achievements, and Co-curricular items rendered in your dynamic downloadable PDF.
                          </p>
                        </div>

                        {/* SECTION A: EDUCATION */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 border-dashed">
                            <span className="font-mono text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                              <span>1. Education History</span>
                            </span>
                            <button
                              type="button"
                              onClick={handleAddEducation}
                              className="text-[9px] font-semibold text-emerald-400 hover:text-emerald-300 font-mono flex items-center space-x-0.5 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add College/School</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {localEducation.map((edu, idx) => (
                              <div key={idx} className="bg-[#0b1425] border border-slate-850 rounded-lg p-3 space-y-2.5 relative">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-200 text-[11px]">
                                    {edu.degree || "New Degree"}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => setExpandedEduIndex(expandedEduIndex === idx ? null : idx)}
                                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
                                    >
                                      {expandedEduIndex === idx ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeletingEduIdx(idx)}
                                      className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-red-950/20 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {deletingEduIdx === idx && (
                                  <div className="absolute inset-0 bg-[#070c16]/95 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center p-3 text-center z-10">
                                    <span className="font-bold text-slate-200 text-[10px] mb-1.5">Delete this Education entry?</span>
                                    <div className="flex space-x-2">
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteEducation(idx)}
                                        className="px-2.5 py-1 bg-red-600 text-white rounded text-[9.5px] font-mono font-semibold cursor-pointer"
                                      >
                                        Delete
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setDeletingEduIdx(null)}
                                        className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded text-[9.5px] font-mono cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {expandedEduIndex === idx && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-900/60 animate-fade-in space-y-2 md:space-y-0">
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-slate-500 font-mono uppercase">Degree / Qualification</label>
                                      <input
                                        type="text"
                                        value={edu.degree || ""}
                                        onChange={(e) => handleUpdateEduField(idx, "degree", e.target.value)}
                                        className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded p-2 text-slate-250 text-[11px] outline-none"
                                        placeholder="Bachelor of Technology in Computer Science"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-slate-500 font-mono uppercase">University / Institution</label>
                                      <input
                                        type="text"
                                        value={edu.institution || ""}
                                        onChange={(e) => handleUpdateEduField(idx, "institution", e.target.value)}
                                        className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded p-2 text-slate-250 text-[11px] outline-none"
                                        placeholder="GLA University"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-slate-500 font-mono uppercase">Location / City</label>
                                      <input
                                        type="text"
                                        value={edu.location || ""}
                                        onChange={(e) => handleUpdateEduField(idx, "location", e.target.value)}
                                        className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded p-2 text-slate-250 text-[11px] outline-none"
                                        placeholder="Mathura"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-slate-500 font-mono uppercase">Time period / Year</label>
                                      <input
                                        type="text"
                                        value={edu.period || ""}
                                        onChange={(e) => handleUpdateEduField(idx, "period", e.target.value)}
                                        className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded p-2 text-slate-250 text-[11px] outline-none"
                                        placeholder="June 2027"
                                      />
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                      <label className="text-[10px] text-slate-500 font-mono uppercase">Score / GPA / Grades</label>
                                      <input
                                        type="text"
                                        value={edu.score || ""}
                                        onChange={(e) => handleUpdateEduField(idx, "score", e.target.value)}
                                        className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded p-2 text-slate-250 text-[11px] outline-none"
                                        placeholder="e.g. 8.5 CGPA or 85%"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* SECTION B: EXPERIENCE & INTERNSHIPS */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 border-dashed">
                            <span className="font-mono text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                              <span>2. Work / Internship Experience</span>
                            </span>
                            <button
                              type="button"
                              onClick={handleAddExperience}
                              className="text-[9px] font-semibold text-emerald-400 hover:text-emerald-300 font-mono flex items-center space-x-0.5 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Internship</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {localExperiences.map((exp, idx) => (
                              <div key={idx} className="bg-[#0b1425] border border-slate-850 rounded-lg p-3 space-y-2.5 relative">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-200 text-[11px]">
                                    {exp.company || "New Company"} {exp.role ? `(${exp.role})` : ""}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => setExpandedExpIndex(expandedExpIndex === idx ? null : idx)}
                                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-850 cursor-pointer"
                                    >
                                      {expandedExpIndex === idx ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeletingExpIdx(idx)}
                                      className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-red-950/20 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {deletingExpIdx === idx && (
                                  <div className="absolute inset-0 bg-[#070c16]/95 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center p-3 text-center z-10">
                                    <span className="font-bold text-slate-200 text-[10px] mb-1.5">Delete this Experience entry?</span>
                                    <div className="flex space-x-2">
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteExperience(idx)}
                                        className="px-2.5 py-1 bg-red-600 text-white rounded text-[9.5px] font-mono font-semibold cursor-pointer"
                                      >
                                        Delete
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setDeletingExpIdx(null)}
                                        className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded text-[9.5px] font-mono cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {expandedExpIndex === idx && (
                                  <div className="space-y-3 pt-2 border-t border-slate-900/60 animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 font-mono uppercase">Company / Organization</label>
                                        <input
                                          type="text"
                                          value={exp.company || ""}
                                          onChange={(e) => handleUpdateExpField(idx, "company", e.target.value)}
                                          className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded p-2 text-slate-250 text-[11px] outline-none"
                                          placeholder="Cognifyz Pvt. Ltd"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 font-mono uppercase">Role / Job Title</label>
                                        <input
                                          type="text"
                                          value={exp.role || ""}
                                          onChange={(e) => handleUpdateExpField(idx, "role", e.target.value)}
                                          className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded p-2 text-slate-250 text-[11px] outline-none"
                                          placeholder="Web Developer Intern"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 font-mono uppercase">Location</label>
                                        <input
                                          type="text"
                                          value={exp.location || ""}
                                          onChange={(e) => handleUpdateExpField(idx, "location", e.target.value)}
                                          className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded p-2 text-slate-250 text-[11px] outline-none"
                                          placeholder="Mathura or Remote"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 font-mono uppercase">Duration / Period</label>
                                        <input
                                          type="text"
                                          value={exp.period || ""}
                                          onChange={(e) => handleUpdateExpField(idx, "period", e.target.value)}
                                          className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded p-2 text-slate-250 text-[11px] outline-none"
                                          placeholder="Aug 2025 - Sep 2025"
                                        />
                                      </div>
                                    </div>

                                    {/* Bullet points sub-editor */}
                                    <div className="space-y-2 bg-black/30 p-2.5 rounded-lg border border-slate-900/60 font-sans">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Bullet Highlights</span>
                                        <button
                                          type="button"
                                          onClick={() => handleAddExpBullet(idx)}
                                          className="text-[9px] font-mono text-teal-400 hover:text-teal-300 flex items-center space-x-0.5 cursor-pointer"
                                        >
                                          <Plus className="w-3 h-3" />
                                          <span>Add Bullet</span>
                                        </button>
                                      </div>
                                      
                                      <div className="space-y-1.5">
                                        {(exp.bulletPoints || []).map((bp: string, bpIdx: number) => (
                                          <div key={bpIdx} className="flex items-start space-x-2">
                                            <span className="text-slate-600 mt-2.5 font-mono text-[9px]">•</span>
                                            <textarea
                                              value={bp || ""}
                                              onChange={(e) => handleUpdateExpBullet(idx, bpIdx, e.target.value)}
                                              rows={2}
                                              className="flex-1 bg-[#080d19] border border-slate-850 focus:border-emerald-500/50 rounded p-1.5 text-slate-200 text-[10.5px] outline-none resize-none font-sans"
                                              placeholder="Task highlight description..."
                                            />
                                            <button
                                              type="button"
                                              onClick={() => handleDeleteExpBullet(idx, bpIdx)}
                                              className="text-slate-500 hover:text-red-400 p-1 rounded mt-1.5 hover:bg-red-950/20 cursor-pointer"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* SECTION C: PROFESSIONAL ACHIEVEMENTS */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 border-dashed">
                            <span className="font-mono text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                              <Award className="w-3.5 h-3.5 text-slate-400" />
                              <span>3. Professional Achievements / Insights</span>
                            </span>
                            <button
                              type="button"
                              onClick={handleAddAchievement}
                              className="text-[9px] font-semibold text-emerald-400 hover:text-emerald-300 font-mono flex items-center space-x-0.5 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Accomplishment</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {localAchievements.map((ach, idx) => (
                              <div key={idx} className="bg-[#0b1425] border border-slate-850 rounded-lg p-3 space-y-2.5 relative">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-200 text-[11px]">
                                    {ach.title || "New Recognition Title"}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => setExpandedAchIndex(expandedAchIndex === idx ? null : idx)}
                                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
                                    >
                                      {expandedAchIndex === idx ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeletingAchIdx(idx)}
                                      className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-red-950/20 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {deletingAchIdx === idx && (
                                  <div className="absolute inset-0 bg-[#070c16]/95 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center p-3 text-center z-10">
                                    <span className="font-bold text-slate-200 text-[10px] mb-1.5">Delete this achievement?</span>
                                    <div className="flex space-x-2">
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteAchievement(idx)}
                                        className="px-2.5 py-1 bg-red-600 text-white rounded text-[9.5px] font-mono font-semibold cursor-pointer"
                                      >
                                        Delete
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setDeletingAchIdx(null)}
                                        className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded text-[9.5px] font-mono cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {expandedAchIndex === idx && (
                                  <div className="space-y-2 pt-2 border-t border-slate-900/60 animate-fade-in">
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-slate-500 font-mono uppercase">Achievement Title / Platform</label>
                                      <input
                                        type="text"
                                        value={ach.title || ""}
                                        onChange={(e) => handleUpdateAchField(idx, "title", e.target.value)}
                                        className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded p-2 text-slate-250 text-[11px] outline-none"
                                        placeholder="Leetcode / Google Cloud arcade..."
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-slate-500 font-mono uppercase">Accolade / Description Detail</label>
                                      <textarea
                                        value={ach.description || ""}
                                        onChange={(e) => handleUpdateAchField(idx, "description", e.target.value)}
                                        rows={3}
                                        className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded p-2 text-slate-250 text-[11px] outline-none resize-none"
                                        placeholder="Completing multiple cloud tracks, 300+ questions..."
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* SECTION D: CO-CURRICULAR ACTIVITIES */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 border-dashed">
                            <span className="font-mono text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                              <Trophy className="w-3.5 h-3.5 text-slate-400" />
                              <span>4. Co-Curricular Activities</span>
                            </span>
                            <button
                              type="button"
                              onClick={handleAddCoCurricular}
                              className="text-[9px] font-semibold text-emerald-400 hover:text-emerald-300 font-mono flex items-center space-x-0.5 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Extra Co-curricular</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {localCoCurricular.map((cc, idx) => (
                              <div key={idx} className="bg-[#0b1425] border border-slate-850 rounded-lg p-3 space-y-2.5 relative">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-200 text-[11px]">
                                    {cc.activity || "New Activity"} {cc.role ? `(${cc.role})` : ""}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => setExpandedCcIndex(expandedCcIndex === idx ? null : idx)}
                                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
                                    >
                                      {expandedCcIndex === idx ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeletingCcIdx(idx)}
                                      className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-red-950/20 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {deletingCcIdx === idx && (
                                  <div className="absolute inset-0 bg-[#070c16]/95 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center p-3 text-center z-10">
                                    <span className="font-bold text-slate-200 text-[10px] mb-1.5">Delete this activity entry?</span>
                                    <div className="flex space-x-2">
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteCoCurricular(idx)}
                                        className="px-2.5 py-1 bg-red-600 text-white rounded text-[9.5px] font-mono font-semibold cursor-pointer"
                                      >
                                        Delete
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setDeletingCcIdx(null)}
                                        className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded text-[9.5px] font-mono cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {expandedCcIndex === idx && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-900/60 animate-fade-in space-y-2 md:space-y-0">
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-slate-500 font-mono uppercase">Activity / Event Name</label>
                                      <input
                                        type="text"
                                        value={cc.activity || ""}
                                        onChange={(e) => handleUpdateCcField(idx, "activity", e.target.value)}
                                        className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded p-2 text-slate-250 text-[11px] outline-none"
                                        placeholder="Coordinated SRIJAN Cultural Fest..."
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[10px] text-slate-500 font-mono uppercase">Role / Responsibility</label>
                                      <input
                                        type="text"
                                        value={cc.role || ""}
                                        onChange={(e) => handleUpdateCcField(idx, "role", e.target.value)}
                                        className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded p-2 text-slate-250 text-[11px] outline-none"
                                        placeholder="Coordinator / Member"
                                      />
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                      <label className="text-[10px] text-slate-500 font-mono uppercase">Duration / Period</label>
                                      <input
                                        type="text"
                                        value={cc.period || ""}
                                        onChange={(e) => handleUpdateCcField(idx, "period", e.target.value)}
                                        className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded p-2 text-slate-250 text-[11px] outline-none"
                                        placeholder="September 2024"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {renderSyncStatus()}
                        {renderFooterActionButtons()}
                      </div>
                    )}

                    {/* VISITOR INBOX MESSAGES TAB */}
                    {activeTab === "inbox" && (
                      <div className="space-y-4 font-sans text-xs">
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                          <p className="font-mono text-[10px] text-emerald-400 font-bold tracking-wider uppercase">SECURE INBOX DEPOSIT</p>
                          <p className="text-[11px] text-slate-400 leading-normal">
                            All incoming contact messages recorded from visitors since database deployment are visualised below in real-time.
                          </p>
                        </div>

                        {isInboxLoading && (
                          <div className="flex flex-col items-center justify-center py-12 space-y-2">
                            <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                            <span className="font-mono text-[10px] text-slate-500">Retrieving secure logs...</span>
                          </div>
                        )}

                        {!isInboxLoading && messages.length === 0 && (
                          <div className="text-center py-16 bg-[#080d19] rounded-xl border border-dashed border-slate-800">
                            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                            <p className="text-slate-400 text-xs font-semibold">No submissions present.</p>
                            <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] mx-auto">Fill out the visitor contact block in the layout to watch it stream here!</p>
                          </div>
                        )}

                        {!isInboxLoading && messages.length > 0 && (
                          <div className="space-y-3">
                            {messages.map((msg) => (
                              <div 
                                key={msg.id} 
                                className="bg-[#0b1425] border border-slate-850 rounded-xl p-4 space-y-2 transition-all hover:border-slate-800 relative group animate-fade-in overflow-hidden"
                              >
                                {/* Safe Sandbox Modal Confirmation Panel */}
                                {deletingMessageId === msg.id && (
                                  <div className="absolute inset-x-0 inset-y-0 bg-[#070c16]/95 backdrop-blur-md rounded-xl flex flex-col items-center justify-center p-4 text-center z-20 animate-fade-in">
                                    <AlertCircle className="w-5 h-5 text-red-500 mb-1" />
                                    <span className="font-bold text-slate-200 text-[11px]">Delete this message?</span>
                                    <span className="text-slate-500 text-[9px] mb-2 px-4 leading-normal">This will permanently delete this record from Firestore database.</span>
                                    <div className="flex items-center space-x-2">
                                      <button
                                        type="button"
                                        onClick={() => executeDeleteMessage(msg.id)}
                                        className="px-3 py-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-md text-[10.5px] font-mono cursor-pointer transition-all font-bold"
                                      >
                                        CONFIRM
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setDeletingMessageId(null)}
                                        className="px-3 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-md text-[10.5px] font-mono cursor-pointer transition-all"
                                      >
                                        CANCEL
                                      </button>
                                    </div>
                                  </div>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-all opacity-100 cursor-pointer z-10"
                                  title="Delete permanently from Firestore"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                <div className="space-y-0.5">
                                  <div className="flex items-center space-x-1">
                                    <span className="font-bold text-slate-200">{msg.name}</span>
                                  </div>
                                  <p className="text-[10px] text-emerald-400 font-mono select-all flex items-center space-x-1 hover:underline">
                                    <Mail className="w-3 h-3 text-emerald-400 inline" />
                                    <span>{msg.email}</span>
                                  </p>
                                </div>

                                {msg.subject && (
                                  <p className="text-slate-200 font-semibold tracking-tight border-l border-emerald-500/40 pl-2.5 text-[11px] mt-1.5">
                                    {msg.subject}
                                  </p>
                                )}

                                <p className="text-slate-400 text-[11px] font-sans leading-relaxed italic bg-black/40 p-2.5 rounded-lg whitespace-pre-wrap mt-2">
                                  &ldquo;{msg.message}&rdquo;
                                </p>

                                <div className="flex items-center justify-between font-mono text-[9px] text-slate-500 pt-1 mt-1 border-t border-slate-900/60">
                                  <span>ID: {msg.id.substring(0, 10)}...</span>
                                  <span>{new Date(msg.timestamp).toLocaleString()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TERMINAL CONSOLES TAB */}
                    {activeTab === "terminal" && (
                      <div className="space-y-6 font-sans text-xs">
                        <div className="p-3 bg-emerald-950/20 border border-emerald-500/10 rounded-xl space-y-1">
                          <p className="font-mono text-[10px] text-emerald-400 font-bold tracking-wider uppercase">Interactive Dev Console &amp; Terminal Tabs</p>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Edit the mock interactive terminal tabs displayed in the hero section. All changes are synchronized with Firestore.
                          </p>
                        </div>

                        {/* SECTION 1: profile.json */}
                        <div className="p-4 bg-[#0a0f1d] border border-slate-800 rounded-xl space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="block font-mono text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">🚀 profile.json Properties</span>
                            <button
                              type="button"
                              onClick={() => {
                                const next = { ...localTerminal };
                                if (!next.profile) next.profile = [];
                                next.profile.push({ key: "new_key", value: "new value" });
                                setLocalTerminal(next);
                              }}
                              className="px-2 py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-900/20 transition-all font-mono text-[10px] rounded-lg cursor-pointer flex items-center space-x-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Row</span>
                            </button>
                          </div>
                          
                          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                            {(!localTerminal?.profile || localTerminal.profile.length === 0) ? (
                              <p className="text-slate-500 text-center py-2 font-mono text-[10px]">No key-value pairs configured. Click Add Row above.</p>
                            ) : (
                              localTerminal.profile.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-2 items-center bg-[#0d1627]/60 p-2 rounded-lg border border-slate-850">
                                  <input
                                    type="text"
                                    value={item.key}
                                    onChange={(e) => {
                                      const next = { ...localTerminal };
                                      next.profile[idx].key = e.target.value;
                                      setLocalTerminal(next);
                                    }}
                                    className="w-1/3 px-2 py-1 bg-slate-950 border border-slate-800 rounded font-mono text-teal-400 text-[11px] outline-none focus:border-teal-500"
                                    placeholder="key"
                                  />
                                  <span className="text-slate-600 font-mono">:</span>
                                  <input
                                    type="text"
                                    value={item.value}
                                    onChange={(e) => {
                                      const next = { ...localTerminal };
                                      next.profile[idx].value = e.target.value;
                                      setLocalTerminal(next);
                                    }}
                                    className="flex-1 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-slate-300 text-[11px] outline-none focus:border-teal-500"
                                    placeholder="value"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = { ...localTerminal };
                                      next.profile.splice(idx, 1);
                                      setLocalTerminal(next);
                                    }}
                                    className="p-1 px-2 bg-rose-950/45 text-rose-400 tracking-wider font-mono text-[9px] hover:bg-rose-900/40 rounded transition-colors cursor-pointer"
                                  >
                                    DEL
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* SECTION 2: skills.env */}
                        <div className="p-4 bg-[#0a0f1d] border border-slate-800 rounded-xl space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="block font-mono text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">⚙️ skills.env Parameters</span>
                            <button
                              type="button"
                              onClick={() => {
                                const next = { ...localTerminal };
                                if (!next.skills) next.skills = [];
                                next.skills.push({ name: "NEW SKILL BAR", level: 80 });
                                setLocalTerminal(next);
                              }}
                              className="px-2 py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-900/20 transition-all font-mono text-[10px] rounded-lg cursor-pointer flex items-center space-x-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Skill Bar</span>
                            </button>
                          </div>
                          
                          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                            {(!localTerminal?.skills || localTerminal.skills.length === 0) ? (
                              <p className="text-slate-500 text-center py-2 font-mono text-[10px]">No skills bars configured. Click Add Skill Bar above.</p>
                            ) : (
                              localTerminal.skills.map((sk: any, idx: number) => (
                                <div key={idx} className="flex gap-2.5 items-center bg-[#0d1627]/60 p-2 rounded-lg border border-slate-850">
                                  <input
                                    type="text"
                                    value={sk.name}
                                    onChange={(e) => {
                                      const next = { ...localTerminal };
                                      next.skills[idx].name = e.target.value;
                                      setLocalTerminal(next);
                                    }}
                                    className="w-1/2 px-2 py-1 bg-slate-950 border border-slate-800 rounded font-mono text-emerald-400 text-[11px] outline-none focus:border-emerald-500"
                                    placeholder="Skill Name"
                                  />
                                  <div className="flex-1 flex items-center gap-2">
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      value={sk.level}
                                      onChange={(e) => {
                                        const next = { ...localTerminal };
                                        next.skills[idx].level = parseInt(e.target.value) || 0;
                                        setLocalTerminal(next);
                                      }}
                                      className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                    <span className="font-mono text-slate-400 w-8 text-right text-[11px]">{sk.level}%</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = { ...localTerminal };
                                      next.skills.splice(idx, 1);
                                      setLocalTerminal(next);
                                    }}
                                    className="p-1 px-2 bg-rose-950/45 text-rose-400 tracking-wider font-mono text-[9px] hover:bg-rose-900/40 rounded transition-colors cursor-pointer"
                                  >
                                    DEL
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* SECTION 3: hirebridge.api */}
                        <div className="p-4 bg-[#0a0f1d] border border-slate-800 rounded-xl space-y-3">
                          <span className="block font-mono text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">🌐 hirebridge.api endpoint</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#0d1627]/40 p-3 rounded-lg border border-slate-850">
                            <div className="space-y-1">
                              <label className="block text-[10px] text-slate-400 font-mono uppercase font-semibold">PROJECT URL</label>
                              <input
                                type="text"
                                value={localTerminal?.hirebridge?.url || ""}
                                onChange={(e) => {
                                  const next = { ...localTerminal };
                                  if (!next.hirebridge) next.hirebridge = {};
                                  next.hirebridge.url = e.target.value;
                                  setLocalTerminal(next);
                                }}
                                className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 font-mono text-[11px] outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] text-slate-400 font-mono uppercase font-semibold">CURL STATUS HEADER</label>
                              <input
                                type="text"
                                value={localTerminal?.hirebridge?.status || ""}
                                onChange={(e) => {
                                  const next = { ...localTerminal };
                                  if (!next.hirebridge) next.hirebridge = {};
                                  next.hirebridge.status = e.target.value;
                                  setLocalTerminal(next);
                                }}
                                className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 font-mono text-[11px] outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] text-slate-400 font-mono uppercase font-semibold">SERVER INFO</label>
                              <input
                                type="text"
                                value={localTerminal?.hirebridge?.server || ""}
                                onChange={(e) => {
                                  const next = { ...localTerminal };
                                  if (!next.hirebridge) next.hirebridge = {};
                                  next.hirebridge.server = e.target.value;
                                  setLocalTerminal(next);
                                }}
                                className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] text-slate-400 font-mono uppercase font-semibold">AUTHENTICATION METHOD</label>
                              <input
                                type="text"
                                value={localTerminal?.hirebridge?.auth || ""}
                                onChange={(e) => {
                                  const next = { ...localTerminal };
                                  if (!next.hirebridge) next.hirebridge = {};
                                  next.hirebridge.auth = e.target.value;
                                  setLocalTerminal(next);
                                }}
                                className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label className="block text-[10px] text-slate-400 font-mono uppercase font-semibold">ACTIVE ROLES</label>
                              <input
                                type="text"
                                value={localTerminal?.hirebridge?.activeRoles || ""}
                                onChange={(e) => {
                                  const next = { ...localTerminal };
                                  if (!next.hirebridge) next.hirebridge = {};
                                  next.hirebridge.activeRoles = e.target.value;
                                  setLocalTerminal(next);
                                }}
                                className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label className="block text-[10px] text-slate-400 font-mono uppercase font-semibold">ACTIVE STATUS CHECK FOOTER</label>
                              <input
                                type="text"
                                value={localTerminal?.hirebridge?.footer || ""}
                                onChange={(e) => {
                                  const next = { ...localTerminal };
                                  if (!next.hirebridge) next.hirebridge = {};
                                  next.hirebridge.footer = e.target.value;
                                  setLocalTerminal(next);
                                }}
                                className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-cyan-400 font-mono text-[11px] outline-none focus:border-emerald-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* SECTION 4: rapidkeys.api */}
                        <div className="p-4 bg-[#0a0f1d] border border-slate-800 rounded-xl space-y-3">
                          <span className="block font-mono text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">⌨️ rapidkeys.api endpoint</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#0d1627]/40 p-3 rounded-lg border border-slate-850">
                            <div className="space-y-1">
                              <label className="block text-[10px] text-slate-400 font-mono uppercase font-semibold">PROJECT URL</label>
                              <input
                                type="text"
                                value={localTerminal?.rapidkeys?.url || ""}
                                onChange={(e) => {
                                  const next = { ...localTerminal };
                                  if (!next.rapidkeys) next.rapidkeys = {};
                                  next.rapidkeys.url = e.target.value;
                                  setLocalTerminal(next);
                                }}
                                className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 font-mono text-[11px] outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] text-slate-400 font-mono uppercase font-semibold">CURL STATUS HEADER</label>
                              <input
                                type="text"
                                value={localTerminal?.rapidkeys?.status || ""}
                                onChange={(e) => {
                                  const next = { ...localTerminal };
                                  if (!next.rapidkeys) next.rapidkeys = {};
                                  next.rapidkeys.status = e.target.value;
                                  setLocalTerminal(next);
                                }}
                                className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 font-mono text-[11px] outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label className="block text-[10px] text-slate-400 font-mono uppercase font-semibold">SERVER DETAIL / ENGINES</label>
                              <input
                                type="text"
                                value={localTerminal?.rapidkeys?.server || ""}
                                onChange={(e) => {
                                  const next = { ...localTerminal };
                                  if (!next.rapidkeys) next.rapidkeys = {};
                                  next.rapidkeys.server = e.target.value;
                                  setLocalTerminal(next);
                                }}
                                className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label className="block text-[10px] text-slate-400 font-mono uppercase font-semibold">CORE FEATURES DESCRIPTION</label>
                              <input
                                type="text"
                                value={localTerminal?.rapidkeys?.features || ""}
                                onChange={(e) => {
                                  const next = { ...localTerminal };
                                  if (!next.rapidkeys) next.rapidkeys = {};
                                  next.rapidkeys.features = e.target.value;
                                  setLocalTerminal(next);
                                }}
                                className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label className="block text-[10px] text-slate-400 font-mono uppercase font-semibold">LATENCY / FEEDBACK STATUS LINE</label>
                              <input
                                type="text"
                                value={localTerminal?.rapidkeys?.latency || ""}
                                onChange={(e) => {
                                  const next = { ...localTerminal };
                                  if (!next.rapidkeys) next.rapidkeys = {};
                                  next.rapidkeys.latency = e.target.value;
                                  setLocalTerminal(next);
                                }}
                                className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 font-mono text-[11px] outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label className="block text-[10px] text-slate-400 font-mono uppercase font-semibold">STATUS PRACTICE FOOTER</label>
                              <input
                                type="text"
                                value={localTerminal?.rapidkeys?.footer || ""}
                                onChange={(e) => {
                                  const next = { ...localTerminal };
                                  if (!next.rapidkeys) next.rapidkeys = {};
                                  next.rapidkeys.footer = e.target.value;
                                  setLocalTerminal(next);
                                }}
                                className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-cyan-400 font-mono text-[11px] outline-none focus:border-emerald-500"
                              />
                            </div>
                          </div>
                        </div>

                        {renderFooterActionButtons()}
                      </div>
                    )}

                    {/* SETTINGS / CONFIGURATION TAB */}
                    {activeTab === "settings" && (
                      <form onSubmit={handleSaveConfig} className="space-y-4 text-xs font-sans">
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                          <p className="font-mono text-[10px] text-emerald-400 font-bold tracking-wider uppercase">Administrative Parameters</p>
                          <p className="text-[11px] text-slate-400 leading-normal">
                            All configurations, including the system padlock credentials, are stored directly in Firestore under the <code className="text-emerald-400 font-bold font-mono px-1 bg-[#060911] rounded">/portfolio/config</code> document.
                          </p>
                        </div>

                        <div className="space-y-1.5 p-4 bg-[#0c1425] border border-slate-850 rounded-xl space-y-3">
                          <span className="block font-mono text-[10px] text-slate-400 font-semibold tracking-wider">SECURE PASSCODE OVERRIDE</span>
                          
                          <div className="space-y-1">
                            <label className="block text-[11px] text-slate-400 font-mono font-medium">ADMIN PASSWORD</label>
                            <input
                              type="text"
                              value={adminPasswordSetting}
                              onChange={(e) => setAdminPasswordSetting(e.target.value)}
                              className="w-full bg-[#080d19] border border-slate-800 focus:border-emerald-500/50 rounded-lg p-2.5 text-slate-100 font-mono outline-none focus:ring-1 focus:ring-emerald-500/20"
                              placeholder="New system passcode"
                              required
                            />
                            <p className="text-[10px] text-slate-500 leading-tight">
                              Changing this passcode updates the Firestore value. Future logins will require this exact password string.
                            </p>
                          </div>
                        </div>

                        {/* Config Save Indicator */}
                        {configSaveStatus === "success" && (
                          <div className="flex items-center space-x-2 bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-lg text-emerald-400 font-mono text-[11px]">
                            <Check className="w-4 h-4 shrink-0" />
                            <span>Configuration saved to Firestore successfully!</span>
                          </div>
                        )}
                        {configSaveStatus === "error" && (
                          <div className="flex items-start space-x-2 bg-rose-950/40 border border-rose-500/30 p-3 rounded-lg text-rose-400 font-mono text-[11px]">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>Failed to update config in Firestore. Check layout/network rules.</span>
                          </div>
                        )}

                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={isSavingConfig}
                            className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold font-mono text-[10px] rounded-lg tracking-wide uppercase transition-all shadow-md shadow-emerald-950/10 flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSavingConfig ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" />
                                <span>Securing Configurations...</span>
                              </>
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5 mr-1" />
                                <span>Save System settings</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    )}

                  </div>

                  {/* Connected project metadata details footer of drawer */}
                  <div className="p-4 bg-[#080d19] border-t border-slate-900/60 flex items-center justify-between font-mono text-[9px] text-slate-500 shrink-0">
                    <span>Database: kempt-coast-90bnn</span>
                    <span className="text-emerald-400 flex items-center">
                      <Unlock className="w-2.5 h-2.5 mr-0.5" /> Session Active
                    </span>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );

  // Status reporter helper
  function renderSyncStatus() {
    return (
      <>
        {saveStatus === "success" && (
          <div className="flex items-center space-x-2 bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-lg text-emerald-400 animate-slide-up" id="success-save-alert">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="font-mono text-[10px]">Changes locked and committed inside Firestore! Site refreshed.</span>
          </div>
        )}

        {saveStatus === "error" && (
          <div className="flex items-start space-x-2 bg-rose-950/40 border border-rose-500/30 p-3 rounded-lg text-rose-400 animate-slide-up" id="error-save-alert">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span className="font-mono text-[10px] leading-tight">Database write error: {errorMessage}</span>
          </div>
        )}
      </>
    );
  }

  // Common Save/Reset actions footer
  function renderFooterActionButtons() {
    return (
      <div className="flex space-x-3 pt-3 shrink-0 border-t border-slate-900/60 bg-[#0a0f1d] z-10 select-none">
        <button
          type="button"
          onClick={handleResetToDefault}
          className={`w-1/3 py-2.5 font-semibold font-mono text-[10px] rounded-lg tracking-wide uppercase border transition-all cursor-pointer ${
            resetConfirmState === "clicked"
              ? "bg-red-950/40 border-red-500/40 text-red-400 font-bold animate-pulse"
              : "bg-[#090e19] border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-[#121c32]"
          }`}
        >
          {resetConfirmState === "clicked" ? "Confirm?" : "Reset Local"}
        </button>
        <button
          type="button"
          onClick={() => handleSaveAll()}
          disabled={isSaving}
          className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold font-mono text-[10px] rounded-lg tracking-wide uppercase transition-all shadow-md shadow-emerald-950/10 flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" />
              <span>COMMITTING...</span>
            </>
          ) : (
            <>
              <Database className="w-3.5 h-3.5 mr-1 text-emerald-300 animate-pulse" />
              <span>COMMIT DIRECT TO FIRESTORE</span>
            </>
          )}
        </button>
      </div>
    );
  }
}

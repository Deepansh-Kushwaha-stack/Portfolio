import React, { useState } from "react";
import { X, Printer, Download, Mail, Phone, MapPin, Globe, Github, Linkedin, Sparkles } from "lucide-react";
import { RESUME_DATA } from "../types";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handlePrint = async () => {
    setIsGenerating(true);

    // Save references to original methods and descriptors to restore later
    const origGetPropertyValue = CSSStyleDeclaration.prototype.getPropertyValue;
    const styleCssTextDesc = Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype, "cssText");
    const ruleCssTextDesc = Object.getOwnPropertyDescriptor(CSSRule.prototype, "cssText");

    // Backup and sanitize style elements text content to prevent crashes in html2canvas stylesheet parsing
    const styleElements = Array.from(document.querySelectorAll("style"));
    const styleBackups: { element: HTMLStyleElement; originalText: string }[] = [];

    const replaceOklch = (str: string): string => {
      if (!str || typeof str !== "string") return str;
      if (!str.includes("oklch")) return str;

      return str.replace(/oklch\s*\(([^)]+)\)/gi, (match, content) => {
        try {
          const parts = content.trim().split(/(?:\s*\/\s*|\s+)/);
          if (parts.length >= 3) {
            const l = parseFloat(parts[0]);
            const c = parseFloat(parts[1]);
            const h = parseFloat(parts[2]);
            const a = parts[3] ? parseFloat(parts[3]) : 1;

            // Approximate conversion of low-chroma colors (grays/slates)
            if (c < 0.04) {
              if (l < 0.15) return `rgba(15, 23, 42, ${a})`;
              if (l < 0.3) return `rgba(30, 41, 59, ${a})`;
              if (l < 0.5) return `rgba(71, 85, 105, ${a})`;
              if (l < 0.7) return `rgba(100, 116, 139, ${a})`;
              if (l < 0.85) return `rgba(203, 213, 225, ${a})`;
              return `rgba(248, 250, 252, ${a})`;
            }

            // Emerald colors (greyscale/green transition)
            if (h >= 110 && h <= 170) {
              if (l < 0.5) return `rgba(5, 150, 105, ${a})`;
              if (l < 0.7) return `rgba(16, 185, 129, ${a})`;
              return `rgba(236, 253, 245, ${a})`;
            }

            // Teal/Cyan colors
            if (h > 170 && h < 210) {
              return `rgba(13, 148, 136, ${a})`;
            }

            // High brightness and general fallbacks
            if (l < 0.3) return `rgba(15, 23, 42, ${a})`;
            if (l > 0.85) return `rgba(255, 255, 255, ${a})`;
            return `rgba(100, 116, 139, ${a})`;
          }
        } catch (e) {
          // fallback
        }
        return "rgba(15, 23, 42, 1)";
      });
    };

    try {
      // 1. Override getPropertyValue
      CSSStyleDeclaration.prototype.getPropertyValue = function(this: CSSStyleDeclaration, property: string) {
        const val = origGetPropertyValue.call(this, property);
        return replaceOklch(val);
      };

      // 2. Override cssText on CSSStyleDeclaration
      if (styleCssTextDesc && styleCssTextDesc.get) {
        const origStyleCssTextGet = styleCssTextDesc.get;
        Object.defineProperty(CSSStyleDeclaration.prototype, "cssText", {
          get(this: CSSStyleDeclaration) {
            return replaceOklch(origStyleCssTextGet.call(this));
          },
          configurable: true
        });
      }

      // 3. Override cssText on CSSRule
      if (ruleCssTextDesc && ruleCssTextDesc.get) {
        const origRuleCssTextGet = ruleCssTextDesc.get;
        Object.defineProperty(CSSRule.prototype, "cssText", {
          get(this: CSSRule) {
            return replaceOklch(origRuleCssTextGet.call(this));
          },
          configurable: true
        });
      }

      // 4. Sanitize internal <style> blocks
      for (const styleEl of styleElements) {
        const text = styleEl.textContent || "";
        if (text.includes("oklch")) {
          styleBackups.push({ element: styleEl, originalText: text });
          styleEl.textContent = replaceOklch(text);
        }
      }

      const element = document.getElementById("resume-a4-printable-block");
      if (element) {
        // Clone the element to render a full-height shadow version outside scroll limitations
        const clone = element.cloneNode(true) as HTMLDivElement;
        
        // Remove id or make it unique to avoid duplicates
        clone.id = "resume-clone-temp";
        
        // Set styles to ensure it is rendered fully
        clone.style.position = "absolute";
        clone.style.top = "-9999px";
        clone.style.left = "-9999px";
        clone.style.width = "794px"; // Standard A4 width at 96 DPI
        clone.style.height = "auto";
        clone.style.maxHeight = "none";
        clone.style.overflow = "visible";
        clone.style.backgroundColor = "#ffffff";
        
        document.body.appendChild(clone);

        const canvas = await html2canvas(clone, {
          scale: 2.2, // Crisp, high-precision text rendering
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: "#ffffff",
          windowWidth: 794,
          windowHeight: clone.offsetHeight || clone.scrollHeight || 1123
        });

        document.body.removeChild(clone);

        // Restore style elements textContent immediately so visual page doesn't glitch/flicker
        for (const backup of styleBackups) {
          backup.element.textContent = backup.originalText;
        }
        styleBackups.length = 0;

        const imgData = canvas.toDataURL("image/jpeg", 0.98);
        
        // Define A4 proportions in millimeters
        const pdfWidth = 210;
        const pdfHeight = 297;
        
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4"
        });

        // Always render everything on a single, crisp, perfectly-proportioned A4 page
        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

        // Save PDF file safely
        const sanitizedName = RESUME_DATA.personalInfo.name.replace(/\s+/g, "_");
        pdf.save(`${sanitizedName}_Resume.pdf`);
      } else {
        window.print();
      }
    } catch (error) {
      console.error("PDF Generation failed, falling back to window.print()", error);
      window.print();
    } finally {
      // Restore CSSStyleDeclaration.prototype.getPropertyValue
      CSSStyleDeclaration.prototype.getPropertyValue = origGetPropertyValue;

      // Restore CSSStyleDeclaration.prototype.cssText
      if (styleCssTextDesc) {
        Object.defineProperty(CSSStyleDeclaration.prototype, "cssText", styleCssTextDesc);
      }

      // Restore CSSRule.prototype.cssText
      if (ruleCssTextDesc) {
        Object.defineProperty(CSSRule.prototype, "cssText", ruleCssTextDesc);
      }

      // Restore any remaining modified style elements
      for (const backup of styleBackups) {
        backup.element.textContent = backup.originalText;
      }

      setIsGenerating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      id="resume-modal-mask"
    >
      <div
        className="relative w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl flex flex-col my-8 overflow-hidden max-h-[90vh]"
        id="resume-modal-container"
      >
        {/* Modal controller toolbar - Non Printable */}
        <div className="bg-[#0f172a] text-slate-100 px-6 py-4 flex items-center justify-between border-b border-slate-800 print:hidden shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="font-mono text-xs text-slate-300">recruiter_view_print.v1</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              disabled={isGenerating}
              className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-sans text-xs font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              id="resume-print-btn"
            >
              {isGenerating ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4" />
                  <span>Print or Save PDF</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all focus:outline-none cursor-pointer"
              id="resume-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live A4 Print Screen Content */}
        <div
          className="p-8 md:p-12 overflow-y-auto print:p-0 print:overflow-visible bg-white relative tracking-normal leading-normal"
          id="resume-a4-printable-block"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
          {/* Print/Download Specific Style to override OKLCH variables with fallback hex codes */}
          <style dangerouslySetInnerHTML={{ __html: `
            #resume-a4-printable-block,
            #resume-clone-temp {
              color: #111827 !important;
              background-color: #ffffff !important;
            }
            #resume-a4-printable-block .text-\\[\\#0056b3\\],
            #resume-clone-temp .text-\\[\\#0056b3\\],
            #resume-a4-printable-block .text-blue-700,
            #resume-clone-temp .text-blue-700 {
              color: #0056b3 !important;
            }
            #resume-a4-printable-block a,
            #resume-clone-temp a {
              color: #1d4ed8 !important;
              text-decoration: underline !important;
            }
            #resume-a4-printable-block .text-slate-900,
            #resume-clone-temp .text-slate-900 {
              color: #0f172a !important;
            }
            #resume-a4-printable-block .text-slate-850,
            #resume-clone-temp .text-slate-850 {
              color: #1a202c !important;
            }
            #resume-a4-printable-block .text-slate-800,
            #resume-clone-temp .text-slate-800 {
              color: #1e293b !important;
            }
            #resume-a4-printable-block .text-slate-700,
            #resume-clone-temp .text-slate-700 {
              color: #334155 !important;
            }
            #resume-a4-printable-block .text-slate-600,
            #resume-clone-temp .text-slate-600 {
              color: #475569 !important;
            }
            #resume-a4-printable-block .text-slate-500,
            #resume-clone-temp .text-slate-500 {
              color: #64748b !important;
            }
            #resume-a4-printable-block .border-\\[\\#0056b3\\],
            #resume-clone-temp .border-\\[\\#0056b3\\] {
              border-color: #0056b3 !important;
            }
            #resume-a4-printable-block .border-slate-700,
            #resume-clone-temp .border-slate-700 {
              border-color: #334155 !important;
            }
          ` }} />

          {/* Header Block with Floating Avatar on Top Right */}
          <div className="relative pb-4 mb-4 text-center">
            {/* Centered contact info */}
            <h1 className="text-3xl font-bold text-[#0056b3] uppercase tracking-wide mb-1 leading-tight">
              {RESUME_DATA.personalInfo.name}
            </h1>
            <p className="text-xs text-slate-800 font-medium mb-1">
              {RESUME_DATA.personalInfo.location}, {RESUME_DATA.personalInfo.phone}, <a href={`mailto:${RESUME_DATA.personalInfo.email}`} className="text-blue-700 hover:underline">{RESUME_DATA.personalInfo.email}</a>
            </p>
            <p className="text-xs text-slate-800 font-medium space-x-2">
              {RESUME_DATA.personalInfo.linkedin && (
                <>
                  <span className="font-bold text-[#0056b3]">LinkedIn:</span>{" "}
                  <a href={RESUME_DATA.personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                    {RESUME_DATA.personalInfo.linkedin}
                  </a>
                </>
              )}
              {RESUME_DATA.personalInfo.linkedin && RESUME_DATA.personalInfo.github && (
                <span className="text-slate-300">|</span>
              )}
              {RESUME_DATA.personalInfo.github && (
                <>
                  <span className="font-bold text-[#0056b3]">GitHub:</span>{" "}
                  <a href={RESUME_DATA.personalInfo.github} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                    {RESUME_DATA.personalInfo.github}
                  </a>
                </>
              )}
            </p>

            {/* Profile image placeholder on top-right */}
            <div className="absolute top-0 right-0 hidden md:block print:block z-10">
              <div className="w-20 h-24 border-2 border-slate-700 px-1 py-1 rounded-lg overflow-hidden bg-white shadow-sm flex items-center justify-center">
                <img
                  src={
                    RESUME_DATA.personalInfo.github && RESUME_DATA.personalInfo.github.includes("github.com/")
                      ? `https://github.com/${RESUME_DATA.personalInfo.github.split("github.com/")[1].split("/")[0]}.png`
                      : "https://github.com/Deepansh-Kushwaha-stack.png"
                  }
                  alt={RESUME_DATA.personalInfo.name}
                  className="w-full h-full object-cover rounded-md"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-5 text-xs text-slate-900">
            {/* EDUCATION */}
            {RESUME_DATA.education && RESUME_DATA.education.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-[#0056b3] uppercase tracking-wider mb-0.5">
                  EDUCATION
                </h2>
                <div className="border-t-[1.5px] border-[#0056b3] mb-2.5" />
                <div className="space-y-2">
                  {RESUME_DATA.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-baseline">
                      <div>
                        <span className="font-bold">{edu.degree}, </span>
                        <span className="italic">{edu.institution}{edu.location ? `, ${edu.location}` : ""}</span>
                        {edu.score && <span className="text-slate-750"> - Score: {edu.score}</span>}
                      </div>
                      <span className="font-medium text-slate-800 whitespace-nowrap">{edu.period}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INTERNSHIP/ TRAINING EXPERIENCE */}
            {RESUME_DATA.experiences && RESUME_DATA.experiences.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-[#0056b3] uppercase tracking-wider mb-0.5">
                  INTERNSHIP/ TRAINING EXPERIENCE
                </h2>
                <div className="border-t-[1.5px] border-[#0056b3] mb-2.5" />
                <div className="space-y-4">
                  {RESUME_DATA.experiences.map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-baseline font-bold text-slate-900">
                        <span>{exp.company}{exp.location ? `, ${exp.location}` : ""}</span>
                        <span className="font-medium text-slate-800 whitespace-nowrap">{exp.period}</span>
                      </div>
                      <p className="italic text-slate-800 mt-0.5">{exp.role}</p>
                      {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                        <ul className="list-disc pl-4 space-y-1 text-slate-800 mt-1.5 leading-relaxed">
                          {exp.bulletPoints.map((bp, bpIdx) => (
                            <li key={bpIdx}>{bp}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROJECTS */}
            {RESUME_DATA.projects && RESUME_DATA.projects.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-[#0056b3] uppercase tracking-wider mb-0.5">
                  PROJECTS
                </h2>
                <div className="border-t-[1.5px] border-[#0056b3] mb-2.5" />
                <div className="space-y-3">
                  {RESUME_DATA.projects.map((proj, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-baseline font-bold text-slate-900">
                        <span>
                          {proj.title}
                          {(proj.liveUrl || proj.githubUrl) && (
                            <>
                              {" - "}
                              <a href={proj.liveUrl || proj.githubUrl} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline font-mono text-[10.5px]">
                                {proj.liveUrl || proj.githubUrl}
                              </a>
                            </>
                          )}
                        </span>
                        <span className="font-medium text-slate-800 whitespace-nowrap">{proj.category || "Full-Stack"}</span>
                      </div>
                      {proj.description && (
                        <p className="text-slate-800 mt-0.5">{proj.description}</p>
                      )}
                      {proj.highlights && proj.highlights.length > 0 && (
                        <ul className="list-disc pl-4 space-y-1 text-slate-800 mt-1.5 leading-relaxed">
                          {proj.highlights.map((highlight, hIdx) => (
                            <li key={hIdx}>{highlight}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SKILLS */}
            {RESUME_DATA.skills && RESUME_DATA.skills.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-[#0056b3] uppercase tracking-wider mb-0.5">
                  SKILLS
                </h2>
                <div className="border-t-[1.5px] border-[#0056b3] mb-2.5" />
                <div className="space-y-1.5">
                  {RESUME_DATA.skills.map((cat, idx) => (
                    <p key={idx} className="leading-relaxed">
                      <strong className="font-bold">{cat.title} -&gt; </strong>
                      {cat.skills && cat.skills.map((s: any) => s.name).join(", ")}.
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* PROFESSIONAL ACHIEVEMENTS/ INSIGHTS */}
            {RESUME_DATA.achievements && RESUME_DATA.achievements.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-[#0056b3] uppercase tracking-wider mb-0.5">
                  PROFESSIONAL ACHIEVEMENTS/ INSIGHTS
                </h2>
                <div className="border-t-[1.5px] border-[#0056b3] mb-2.5" />
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-800 leading-relaxed">
                  {RESUME_DATA.achievements.map((ach, idx) => (
                    <li key={idx}>
                      <strong className="font-bold">{ach.title}</strong> - {ach.description}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* CO-CURRICULAR ACTIVITIES */}
            {RESUME_DATA.coCurricular && RESUME_DATA.coCurricular.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-[#0056b3] uppercase tracking-wider mb-0.5">
                  CO-CURRICULAR ACTIVITIES
                </h2>
                <div className="border-t-[1.5px] border-[#0056b3] mb-2.5" />
                <ul className="list-disc pl-4 space-y-1.5 text-slate-800 leading-relaxed">
                  {RESUME_DATA.coCurricular.map((cc, idx) => (
                    <li key={idx}>
                      {cc.role ? <strong className="font-bold">{cc.role}</strong> : null}
                      {cc.role && cc.activity ? " of " : ""}
                      {cc.activity ? <strong className="font-bold">{cc.activity}</strong> : null}
                      {cc.period ? ` (${cc.period})` : ""}.
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* DECLARATION */}
            <div>
              <h2 className="text-sm font-bold text-[#0056b3] uppercase tracking-wider mb-0.5">
                DECLARATION
              </h2>
              <div className="border-t-[1.5px] border-[#0056b3] mb-2.5" />
              <p className="leading-relaxed italic">
                I hereby declare that all the above mentioned information is true and correct to the best of my knowledge.
              </p>
            </div>
          </div>
        </div>

        {/* ModalFooter - Non printable */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-end border-t border-slate-100 gap-3 shrink-0 print:hidden">
          <span className="text-[10px] font-mono text-slate-400 mr-auto">Proportioned A4 Layout</span>
          <button
            onClick={onClose}
            className="px-5 py-2 hover:bg-slate-100 text-slate-600 rounded-xl font-semibold text-xs transition-all border border-slate-200 cursor-pointer"
            id="resume-bottom-close-btn"
          >
            Close Viewer
          </button>
          <button
            onClick={handlePrint}
            disabled={isGenerating}
            className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs rounded-xl transition-all shadow hover:shadow-lg hover:shadow-emerald-500/15 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-1"
            id="resume-bottom-print-btn"
          >
            {isGenerating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Printer className="w-3.5 h-3.5 mr-1" />
                <span>Print Resume</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

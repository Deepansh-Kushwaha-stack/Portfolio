import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Linkedin, Github, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { RESUME_DATA } from "../types";
import { saveContactMessage } from "../firebase";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Quick validation check
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus("error");
      setErrorMessage("Please complete all required fields (Name, Email, Message) before submitting.");
      return;
    }

    setStatus("sending");

    try {
      // 1. Persist message in Firestore database
      const newMessage = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        timestamp: new Date().toISOString()
      };
      
      const firestoreDocId = await saveContactMessage(newMessage);

      // 2. Also keep in localStorage backup
      const savedMessages = JSON.parse(localStorage.getItem("inbox_messages") || "[]");
      savedMessages.push({
        ...newMessage,
        id: firestoreDocId || Math.random().toString(36).substr(2, 9),
        date: newMessage.timestamp
      });
      localStorage.setItem("inbox_messages", JSON.stringify(savedMessages));

      // 3. Dispatch secure email via FormSubmit directly to deepanshthakur866@gmail.com
      try {
        await fetch("https://formsubmit.co/ajax/deepanshthakur866@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name: newMessage.name,
            email: newMessage.email,
            subject: newMessage.subject || "Message from Portfolio Gateway",
            message: newMessage.message,
            _subject: `[PORTFOLIO SECURE MESSAGE] ${newMessage.subject || "Inquiry Form"} - ${newMessage.name}`,
            _replyto: newMessage.email
          })
        });
      } catch (emailErr) {
        // Log forwarding failure, but don't crash since Firestore write is successful
        console.error("Failed to forward secure email via FormSubmit:", emailErr);
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      console.error("Firestore message save failed: ", err);
      setStatus("error");
      setErrorMessage("An unexpected database error occurred. Your message was not stored. Please contact deepanshthakur866@gmail.com directly.");
    }
  };

  return (
    <section className="py-24 px-6 bg-[#080d19] relative" id="contact">
      {/* Absolute decorative glow blur spheres */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto relative z-10"
      >
        
        {/* Section Heading */}
        <div className="flex flex-col mb-16 text-left" id="contact-heading-group">
          <span className="font-mono text-xs text-emerald-400 font-bold tracking-widest uppercase flex items-center gap-1.5 mb-2">
            <MessageSquare className="w-3.5 h-3.5" /> 07 // GET IN TOUCH
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
            Connect With Me
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-2 max-w-xl">
            Want to discuss internship or full-time job opportunities, collab on open-source projects, or look at my credentials? Let&apos;s build together.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mt-3" />
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct connections & directories */}
          <div className="lg:col-span-5 space-y-6" id="contact-direct-directories">
            <h3 className="text-xl font-bold font-sans text-slate-200">
              Interactive Contact Directories
            </h3>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              Recruiters and hiring managers can always reach out using the secure gateway form, or contact me directly using any of my social profiles.
            </p>

            <div className="space-y-4 pt-2">
              {/* Phone item */}
              <div className="flex items-start space-x-4 p-4.5 bg-[#0c1426] border border-slate-800/80 rounded-2xl group transition-all duration-300 hover:border-emerald-500/20">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-all">
                  <Phone className="w-4.5 h-4.5 text-emerald-400" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-slate-500 block uppercase tracking-wider font-semibold">DIAL ME DIRECTLY</span>
                  <a href={`tel:${RESUME_DATA.personalInfo.phone}`} className="font-sans font-bold text-slate-200 text-sm hover:text-emerald-400 transition-colors">
                    {RESUME_DATA.personalInfo.phone}
                  </a>
                  <span className="block text-[11px] text-slate-400 mt-1">Available 9:00 AM – 7:30 PM (IST)</span>
                </div>
              </div>

              {/* Email item */}
              <div className="flex items-start space-x-4 p-4.5 bg-[#0c1426] border border-slate-800/80 rounded-2xl group transition-all duration-300 hover:border-emerald-500/20">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-all">
                  <Mail className="w-4.5 h-4.5 text-emerald-400" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-slate-500 block uppercase tracking-wider font-semibold">EMAIL CORRESPONDENCE</span>
                  <a href={`mailto:${RESUME_DATA.personalInfo.email}`} className="font-mono font-bold text-slate-250 text-xs hover:text-emerald-400 transition-colors break-all">
                    {RESUME_DATA.personalInfo.email}
                  </a>
                  <span className="block text-[11px] text-slate-400 mt-1">Recruiter-friendly inbox</span>
                </div>
              </div>

              {/* Location item */}
              <div className="flex items-start space-x-4 p-4.5 bg-[#0c1426] border border-slate-800/80 rounded-2xl group transition-all duration-300 hover:border-emerald-500/20">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-all">
                  <MapPin className="w-4.5 h-4.5 text-emerald-400" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-slate-500 block uppercase tracking-wider font-semibold">GEOPHYSICAL LOCATION</span>
                  <span className="font-sans font-bold text-slate-200 text-sm">
                    {RESUME_DATA.personalInfo.location}
                  </span>
                  <span className="block text-[11px] text-slate-400 mt-1">GLA University Campus residence</span>
                </div>
              </div>
            </div>

            {/* Social linkages badges */}
            <div className="pt-4 space-y-3">
              <span className="font-mono text-[10px] text-slate-500 block tracking-wider uppercase font-semibold">GET IN TOUCH ON SOCIAL CHANNELS</span>
              <div className="flex items-center gap-3">
                <a
                  href={RESUME_DATA.personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 font-sans font-bold text-xs text-slate-350 px-4 py-2.5 rounded-xl transition-all"
                  id="contact-social-linkedin"
                >
                  <Linkedin className="w-4 h-4 text-emerald-400" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={RESUME_DATA.personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 font-sans font-bold text-xs text-slate-350 px-4 py-2.5 rounded-xl transition-all"
                  id="contact-social-github"
                >
                  <Github className="w-4 h-4 text-emerald-400" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Gateway Form panel */}
          <div className="lg:col-span-7 bg-[#0c1426] border border-slate-800/80 p-6 md:p-8 rounded-2xl" id="contact-form-side">
            <h3 className="text-lg font-bold font-sans text-slate-200 mb-6">
              Interactive Message Form
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4" id="contact-submit-form">
              {/* Double Column name & email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="font-mono text-[10px] text-slate-400/90 font-bold uppercase tracking-wider block">NAME *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full bg-[#0a0f1d] border border-slate-800 hover:border-slate-700 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="font-mono text-[10px] text-slate-400/90 font-bold uppercase tracking-wider block">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full bg-[#0a0f1d] border border-slate-800 hover:border-slate-700 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label htmlFor="subject" className="font-mono text-[10px] text-slate-400/90 font-bold uppercase tracking-wider block">SUBJECT</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="e.g. Internship Inquiry"
                  className="w-full bg-[#0a0f1d] border border-slate-800 hover:border-slate-700 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="font-mono text-[10px] text-slate-400/90 font-bold uppercase tracking-wider block">MESSAGE INQUIRY *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Share details about your project or job opening..."
                  className="w-full bg-[#0a0f1d] border border-slate-800 hover:border-slate-700 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all resize-none animate-none"
                />
              </div>

              {/* Status Alert Panels */}
              {status === "success" && (
                <div className="p-4 bg-emerald-950/45 border border-emerald-500/20 rounded-xl flex items-start space-x-3 text-emerald-400" id="contact-status-success">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="block font-sans font-bold">Message Sent and Dispatched!</strong>
                    <span className="font-sans leading-normal block mt-1">Thank you for your response. Your secure message has been saved to the database and forwarded directly to <strong>deepanshthakur866@gmail.com</strong>. Deepansh will reply shortly.</span>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="p-4 bg-rose-950/45 border border-rose-500/20 rounded-xl flex items-start space-x-3 text-rose-450" id="contact-status-error">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="block font-sans font-bold">Incomplete Parameters Passed</strong>
                    <span className="font-sans leading-normal block mt-1">{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Trigger Submit btn */}
              <button
                type="submit"
                disabled={status === "sending"}
                className={`w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-sans text-xs font-semibold tracking-wide py-3.5 rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-emerald-500/15 ${
                  status === "sending" ? "opacity-75 cursor-wait" : ""
                }`}
                id="contact-form-submit-btn"
              >
                <Send className="w-4 h-4" />
                <span>{status === "sending" ? "TRANSMITTING ENCRYPTED PAYLOAD..." : "SEND SECURE MESSAGE"}</span>
              </button>

            </form>
          </div>

        </div>
      </motion.div>
    </section>
  );
}

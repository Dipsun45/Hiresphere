import { useState, useEffect, useRef } from "react";

/**
 * HireSphere - Projects & Certificates Page
 * Full-stack: connects to Java Backend /api/projects on Port 8085
 * Session-isolated: shows only the logged-in user's projects
 */
export default function Projects({ userId, onLogout, apiBase = "http://localhost:8085", onNavigate }) {
  const [activeTab, setActiveTab] = useState("Projects");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("success");
  const [showForm, setShowForm] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // Project photo preview
  const [projectPhotoPreview, setProjectPhotoPreview] = useState(null);
  const [certPhotoPreview, setCertPhotoPreview] = useState(null);
  const [zipFileName, setZipFileName] = useState(null);

  const projectPhotoRef = useRef(null);
  const certPhotoRef = useRef(null);
  const zipRef = useRef(null);

  const initials = userId ? userId.substring(0, 2).toUpperCase() : "HS";

  const navLinks = [
    { name: "Dashboard" },
    { name: "Profile" },
    { name: "Recruitment Drive" },
    { name: "My Applications" },
    { name: "Company Profile" },
    { name: "Projects" },
    { name: "Contact Us"  },
  ];

  const categories = [
    "Web Development", "Mobile App", "AI / Machine Learning", "Data Science",
    "Cloud & DevOps", "Cybersecurity", "Blockchain", "IoT / Embedded",
    "Game Development", "Open Source", "Academic / Research", "Other",
  ];

  const [form, setForm] = useState({
    projectName: "",
    projectDescription: "",
    techStack: "",
    category: "Web Development",
    liveUrl: "",
    githubUrl: "",
    startDate: "",
    endDate: "",
    projectPhoto: "",
    projectZip: "",
    projectZipName: "",
    certName: "",
    certIssuer: "",
    certDate: "",
    certUrl: "",
    certPhoto: "",
  });

  const showToast = (msg, type = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleNavClick = (linkName) => {
    
    setActiveTab(linkName);
    if (linkName === "Dashboard") onNavigate && onNavigate("home");
    else if (linkName === "Profile") onNavigate && onNavigate("profile");
    else if (linkName === "Recruitment Drive") onNavigate && onNavigate("drive");
    else if (linkName === "My Applications") onNavigate && onNavigate("applied");
    else if (linkName === "Company Profile") onNavigate && onNavigate("company");
    else if (linkName === "Projects") onNavigate && onNavigate("projects");
    else if (linkName === "Contact Us") onNavigate && onNavigate("message");
  };

  const handleLogout = async () => {
    try { await fetch(`${apiBase}/api/logout`, { method: "POST", credentials: "include" }); } catch (_) {}
    onLogout && onLogout();
  };

  // Fetch user's projects from backend
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/projects`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error("[Projects] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle project photo upload
  const handleProjectPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("Please select an image file.", "error"); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProjectPhotoPreview(reader.result);
      setForm((prev) => ({ ...prev, projectPhoto: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Handle certificate photo upload
  const handleCertPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("Please select an image file.", "error"); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      setCertPhotoPreview(reader.result);
      setForm((prev) => ({ ...prev, certPhoto: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Handle ZIP upload
  const handleZipUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validZipTypes = ["application/zip", "application/x-zip-compressed", "application/octet-stream"];
    if (!validZipTypes.includes(file.type) && !file.name.endsWith(".zip") && !file.name.endsWith(".rar")) {
      showToast("Please upload a valid ZIP or RAR file.", "error");
      return;
    }
    setZipFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, projectZip: reader.result, projectZipName: file.name }));
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setForm({
      projectName: "", projectDescription: "", techStack: "", category: "Web Development",
      liveUrl: "", githubUrl: "", startDate: "", endDate: "",
      projectPhoto: "", projectZip: "", projectZipName: "",
      certName: "", certIssuer: "", certDate: "", certUrl: "", certPhoto: "",
    });
    setProjectPhotoPreview(null);
    setCertPhotoPreview(null);
    setZipFileName(null);
    if (projectPhotoRef.current) projectPhotoRef.current.value = null;
    if (certPhotoRef.current) certPhotoRef.current.value = null;
    if (zipRef.current) zipRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.projectName.trim()) { showToast("Project name is required.", "error"); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Project saved to MySQL database successfully! 🎉");
        resetForm();
        fetchProjects();
        setShowForm(false);
        setTimeout(() => setShowForm(true), 100);
      } else {
        showToast(data.message || "Failed to save project.", "error");
      }
    } catch (err) {
      console.error("[Projects] Submit error:", err);
      showToast("Cannot connect to Java backend on port 8085.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project permanently from MySQL?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${apiBase}/api/projects?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        showToast("Project deleted successfully.");
        fetchProjects();
      } else {
        showToast(data.message || "Failed to delete project.", "error");
      }
    } catch (err) {
      showToast("Error deleting project.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const inputClass = "w-full rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-2.5 text-sm text-[#0F2A47] placeholder-[#94A3B8] outline-none focus:ring-2 focus:ring-[#1D8FE0] focus:border-[#1D8FE0] transition";
  const labelClass = "block text-sm font-bold text-[#0F2A47] mb-1.5";
  const sectionHeadClass = "flex items-center gap-2 border-b border-[#F0F6FC] pb-2 mb-4";

  return (
    <div className="min-h-screen bg-[#F4FAFF] flex flex-col font-[Inter]">

      {/* Toast */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce text-white text-sm font-semibold border ${
          toastType === "error"
            ? "bg-red-600 border-red-400/40"
            : "bg-[#0B3D91] border-sky-400/40"
        }`}>
          <span className={`flex h-6 w-6 items-center justify-center rounded-full font-bold text-xs ${toastType === "error" ? "bg-red-400 text-white" : "bg-sky-400 text-[#0B3D91]"}`}>
            {toastType === "error" ? "!" : "✓"}
          </span>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <header
        style={{ background: "linear-gradient(135deg, #0B3D91 0%, #155DC1 50%, #1D8FE0 100%)", boxShadow: "0 4px 25px rgba(11,61,145,0.35)" }}
        className="sticky top-0 z-50 px-4 sm:px-8 py-3.5"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => handleNavClick("Dashboard")}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md ring-1 ring-white/30 shadow-inner">
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white drop-shadow">
                <path d="M12 2 2 7l10 5 10-5-10-5Zm0 7.4L4.3 6 12 2.6 19.7 6 12 9.4ZM2 12.1l10 5 10-5v3.5l-10 5-10-5v-3.5Z" />
              </svg>
            </span>
            <div>
              <span className="font-[Sora] text-xl font-extrabold text-white tracking-tight block leading-tight">HireSphere</span>
              <span className="text-[10px] text-white/80 font-medium tracking-widest uppercase block">Enterprise Talent OS</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/20">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.name)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 text-white ${
                  activeTab === link.name ? "bg-white/25 shadow-sm ring-1 ring-white/40 font-bold" : "hover:bg-white/15"
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2.5 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1.5 border border-white/25">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-[#0B3D91] shadow">{initials}</span>
              <span className="text-xs font-semibold text-white">{userId}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 px-4 py-2 text-xs font-semibold text-white transition-all"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h6v-2H4V5h5V3H3zm10.293 3.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 11H7a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
            <button
              onClick={() => window.open("/ai", "_blank")}
              className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border border-white/30 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white transition-all shadow-md active:scale-95 whitespace-nowrap shrink-0"
            >
              ✨ HireSphere AI
            </button>
          </div>
        </div>
        {/* Mobile nav */}
        <div className="lg:hidden flex items-center justify-around mt-2.5 pt-2 border-t border-white/15 text-xs font-medium text-white overflow-x-auto gap-1">
          {navLinks.map((link) => (
            <button key={link.name} onClick={() => handleNavClick(link.name)}
              className={`px-2 py-1 rounded-md text-white whitespace-nowrap ${activeTab === link.name ? "bg-white/25 font-bold" : "hover:bg-white/10"}`}>
              {link.name}
            </button>
          ))}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">

        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-[Sora] text-2xl sm:text-3xl font-black text-[#0F2A47]">My Projects & Certificates</h1>
            <p className="text-[#5C7B99] text-sm mt-1">Showcase your work, upload files, and attach certifications — all saved to MySQL.</p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {projects.length} Project{projects.length !== 1 ? "s" : ""} Saved
          </div>
        </div>

        {/* ADD PROJECT FORM */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B3D91] to-[#1D8FE0] px-8 py-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/30">
              <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/></svg>
            </span>
            <div>
              <h2 className="font-[Sora] text-lg font-extrabold text-white">Add New Project</h2>
              <p className="text-white/70 text-xs">Fill in project details, upload files and add your certificate</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">

            {/* SECTION 1: PROJECT DETAILS */}
            <div>
              <div className={sectionHeadClass}>
                <span className="w-2.5 h-2.5 rounded-full bg-[#1D8FE0]" />
                <h3 className="font-[Sora] text-base font-bold text-[#0F2A47]">Project Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Project Name <span className="text-red-500">*</span></label>
                  <input type="text" name="projectName" value={form.projectName} onChange={handleChange} required
                    placeholder="e.g. HireSphere Enterprise Platform" className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Project Description</label>
                  <textarea name="projectDescription" value={form.projectDescription} onChange={handleChange} rows={3}
                    placeholder="Describe the problem solved, your role, key features and impact..." className={inputClass + " resize-none"} />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                    {categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Tech Stack / Tools</label>
                  <input type="text" name="techStack" value={form.techStack} onChange={handleChange}
                    placeholder="e.g. React, Java, MySQL, Docker" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Start Date</label>
                  <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>End Date <span className="text-[#94A3B8] font-normal">(leave blank if ongoing)</span></label>
                  <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Live / Demo URL</label>
                  <input type="url" name="liveUrl" value={form.liveUrl} onChange={handleChange}
                    placeholder="https://yourproject.vercel.app" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>GitHub Repository URL</label>
                  <input type="url" name="githubUrl" value={form.githubUrl} onChange={handleChange}
                    placeholder="https://github.com/username/repo" className={inputClass} />
                </div>
              </div>
            </div>

            {/* SECTION 2: PROJECT PHOTO */}
            <div>
              <div className={sectionHeadClass}>
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <h3 className="font-[Sora] text-base font-bold text-[#0F2A47]">Project Screenshot / Photo</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                <div>
                  <label className={labelClass}>Upload Project Image</label>
                  <label className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#D4E6F7] bg-[#F4FAFF] p-6 cursor-pointer hover:border-[#1D8FE0] hover:bg-[#EBF5FF] transition">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#1D8FE0] shadow ring-1 ring-[#1D8FE0]/20 group-hover:bg-[#1D8FE0] group-hover:text-white transition">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <span className="text-sm font-semibold text-[#0F2A47]">Click to upload screenshot</span>
                    <span className="text-xs text-[#5C7B99]">PNG, JPG, WEBP (Max 5MB)</span>
                    <input type="file" accept="image/*" className="hidden" ref={projectPhotoRef} onChange={handleProjectPhoto} />
                  </label>
                </div>
                {projectPhotoPreview && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-[#5C7B99] uppercase tracking-widest">Preview</p>
                    <img src={projectPhotoPreview} alt="Project Preview" className="w-full h-40 object-cover rounded-xl border border-slate-200 shadow" />
                    <button type="button" onClick={() => { setProjectPhotoPreview(null); setForm(p => ({ ...p, projectPhoto: "" })); if (projectPhotoRef.current) projectPhotoRef.current.value = null; }}
                      className="text-xs text-red-500 hover:underline font-semibold">✕ Remove</button>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3: PROJECT ZIP */}
            <div>
              <div className={sectionHeadClass}>
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <h3 className="font-[Sora] text-base font-bold text-[#0F2A47]">Project Source / ZIP File</h3>
              </div>
              <label className="group flex items-center gap-4 rounded-2xl border-2 border-dashed border-[#D4E6F7] bg-[#F4FAFF] p-5 cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-orange-500 shadow ring-1 ring-orange-200 group-hover:bg-orange-500 group-hover:text-white transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </span>
                <div className="flex-1 min-w-0">
                  {zipFileName ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0F2A47] truncate">{zipFileName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold">✓ Attached</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-[#0F2A47]">Upload Project ZIP / RAR</p>
                      <p className="text-xs text-[#5C7B99]">Compressed source code folder (Max 50MB)</p>
                    </>
                  )}
                </div>
                <input type="file" accept=".zip,.rar,.tar,.gz" className="hidden" ref={zipRef} onChange={handleZipUpload} />
              </label>
              {zipFileName && (
                <button type="button" onClick={() => { setZipFileName(null); setForm(p => ({ ...p, projectZip: "", projectZipName: "" })); if (zipRef.current) zipRef.current.value = null; }}
                  className="mt-1.5 text-xs text-red-500 hover:underline font-semibold">✕ Remove ZIP</button>
              )}
            </div>

            {/* SECTION 4: CERTIFICATE */}
            <div>
              <div className={sectionHeadClass}>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="font-[Sora] text-base font-bold text-[#0F2A47]">Certificate Details <span className="text-[#94A3B8] font-normal text-sm">(Optional)</span></h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Certificate Name</label>
                  <input type="text" name="certName" value={form.certName} onChange={handleChange}
                    placeholder="e.g. AWS Certified Solutions Architect" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Issuing Organization</label>
                  <input type="text" name="certIssuer" value={form.certIssuer} onChange={handleChange}
                    placeholder="e.g. Amazon Web Services" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Issue Date</label>
                  <input type="date" name="certDate" value={form.certDate} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Certificate Verification URL</label>
                  <input type="url" name="certUrl" value={form.certUrl} onChange={handleChange}
                    placeholder="https://credentials.aws.amazon.com/..." className={inputClass} />
                </div>

                {/* Certificate Photo */}
                <div>
                  <label className={labelClass}>Certificate Photo / Scan</label>
                  <label className="group flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#D4E6F7] bg-[#F4FAFF] p-5 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-500 shadow ring-1 ring-emerald-200 group-hover:bg-emerald-500 group-hover:text-white transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </span>
                    <span className="text-xs font-semibold text-[#0F2A47]">Upload Certificate Image</span>
                    <span className="text-[11px] text-[#94A3B8]">PNG, JPG (Max 5MB)</span>
                    <input type="file" accept="image/*" className="hidden" ref={certPhotoRef} onChange={handleCertPhoto} />
                  </label>
                </div>
                {certPhotoPreview && (
                  <div className="space-y-2 flex flex-col justify-center">
                    <p className="text-xs font-bold text-[#5C7B99] uppercase tracking-widest">Certificate Preview</p>
                    <img src={certPhotoPreview} alt="Certificate" className="w-full h-32 object-cover rounded-xl border border-slate-200 shadow" />
                    <button type="button" onClick={() => { setCertPhotoPreview(null); setForm(p => ({ ...p, certPhoto: "" })); if (certPhotoRef.current) certPhotoRef.current.value = null; }}
                      className="text-xs text-red-500 hover:underline font-semibold self-start">✕ Remove</button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button type="button" onClick={resetForm}
                className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition">
                Reset Form
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#0B3D91] to-[#1D8FE0] text-white font-extrabold text-sm transition shadow-lg hover:shadow-[#1D8FE0]/40 hover:scale-[1.02] active:scale-95 disabled:opacity-60"
              >
                {submitting ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Save Project to MySQL</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* PROJECTS LIST */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-[Sora] text-xl font-black text-[#0F2A47]">
              {loading ? "Loading..." : `My Projects (${projects.length})`}
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-[#D7E8F7] border-t-[#1D8FE0] rounded-full animate-spin" />
                <span className="text-sm text-[#5C7B99] font-medium">Fetching your projects...</span>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-slate-200 shadow">
              <div className="w-16 h-16 rounded-2xl bg-[#EBF5FF] flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#1D8FE0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="font-[Sora] text-lg font-bold text-[#0F2A47]">No Projects Yet</p>
              <p className="text-sm text-[#5C7B99] mt-1">Add your first project using the form above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {projects.map((proj) => (
                <div key={proj.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition overflow-hidden">
                  <div className="flex flex-col sm:flex-row gap-0">
                    {/* Project Photo */}
                    {proj.projectPhoto ? (
                      <img src={proj.projectPhoto} alt={proj.projectName}
                        className="sm:w-48 w-full h-40 sm:h-auto object-cover rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none" />
                    ) : (
                      <div className="sm:w-48 w-full h-40 sm:h-auto bg-gradient-to-br from-[#0B3D91]/10 to-[#1D8FE0]/20 flex items-center justify-center rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none">
                        <svg className="w-12 h-12 text-[#1D8FE0]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Project Info */}
                    <div className="flex-1 p-5 sm:p-6 space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#0B3D91]/10 text-[#0B3D91] text-[11px] font-extrabold">{proj.category}</span>
                            {proj.certName && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">🏆 Certified</span>
                            )}
                            {proj.projectZipName && (
                              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold">📦 ZIP Attached</span>
                            )}
                          </div>
                          <h3 className="font-[Sora] text-lg font-black text-[#0F2A47]">{proj.projectName}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setExpandedId(expandedId === proj.id ? null : proj.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition"
                          >
                            {expandedId === proj.id ? "▲ Less" : "▼ Details"}
                          </button>
                          <button
                            onClick={() => handleDelete(proj.id)}
                            disabled={deletingId === proj.id}
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition"
                          >
                            {deletingId === proj.id ? "..." : "✕ Delete"}
                          </button>
                        </div>
                      </div>

                      {proj.projectDescription && (
                        <p className="text-sm text-[#5C7B99] leading-relaxed line-clamp-2">{proj.projectDescription}</p>
                      )}

                      {proj.techStack && (
                        <div className="flex flex-wrap gap-1.5">
                          {proj.techStack.split(",").map((t, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-[#F4FAFF] border border-[#D4E6F7] text-[#0B3D91] text-[11px] font-semibold">{t.trim()}</span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#5C7B99]">
                        {proj.startDate && <span>📅 {proj.startDate}{proj.endDate ? ` → ${proj.endDate}` : " → Present"}</span>}
                        {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#1D8FE0] font-semibold hover:underline">🌐 Live Demo</a>}
                        {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#0B3D91] font-semibold hover:underline">⌥ GitHub</a>}
                        {proj.projectZipName && (
                          <a href={proj.projectZip} download={proj.projectZipName}
                            className="flex items-center gap-1 text-orange-600 font-semibold hover:underline">📦 Download ZIP</a>
                        )}
                      </div>

                      {/* Expanded Details */}
                      {expandedId === proj.id && (
                        <div className="mt-3 pt-4 border-t border-slate-100 space-y-4">
                          {/* Certificate Section */}
                          {proj.certName && (
                            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex gap-4">
                              {proj.certPhoto && (
                                <img src={proj.certPhoto} alt={proj.certName}
                                  className="w-20 h-20 object-cover rounded-xl border border-emerald-200 shadow shrink-0" />
                              )}
                              <div className="space-y-1">
                                <p className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600">Certificate</p>
                                <p className="font-[Sora] font-bold text-[#0F2A47] text-sm">{proj.certName}</p>
                                {proj.certIssuer && <p className="text-xs text-[#5C7B99]">Issued by: <strong>{proj.certIssuer}</strong></p>}
                                {proj.certDate && <p className="text-xs text-[#5C7B99]">Date: {proj.certDate}</p>}
                                {proj.certUrl && (
                                  <a href={proj.certUrl} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold hover:underline mt-1">
                                    🔗 Verify Certificate →
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                          <p className="text-[11px] text-[#94A3B8]">Added: {new Date(proj.createdAt).toLocaleString("en-IN")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* FOOTER - Same as Home.jsx */}
      {/* ATTRACTIVE & UNIQUE FOOTER */}
      <footer className="mt-16 bg-[#081B33] text-white pt-16 pb-8 border-t-4 border-[#1D8FE0] relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#155DC1]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#1D8FE0]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0B3D91] to-[#1D8FE0] ring-1 ring-white/30 shadow-lg">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
                    <path d="M12 2 2 7l10 5 10-5-10-5Zm0 7.4L4.3 6 12 2.6 19.7 6 12 9.4ZM2 12.1l10 5 10-5v3.5l-10 5-10-5v-3.5Z" />
                  </svg>
                </span>
                <span className="font-[Sora] text-2xl font-black tracking-tight text-white">HireSphere</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                Transforming global talent management through intelligent recruitment platforms, seamless institutional drives, and robust database architecture.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Backend Port 8085 Online · MySQL 3306 Healthy
              </div>
              <div className="flex items-center gap-3 pt-2">
                {["LinkedIn", "Twitter", "GitHub", "YouTube"].map((network) => (
                  <a key={network} href={`#${network.toLowerCase()}`}
                    className="h-9 w-9 rounded-lg bg-white/10 hover:bg-[#1D8FE0] hover:scale-105 border border-white/10 flex items-center justify-center text-xs font-bold transition text-white">
                    {network[0]}
                  </a>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#7DD3FC] font-[Sora]">Navigation</p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li><button onClick={() => handleNavClick("Dashboard")} className="hover:text-white transition flex items-center gap-1.5"><span>›</span> Dashboard</button></li>
                <li><button onClick={() => handleNavClick("Profile")} className="hover:text-white transition flex items-center gap-1.5"><span>›</span> Profile</button></li>
                <li><button onClick={() => handleNavClick("Projects")} className="hover:text-white transition flex items-center gap-1.5"><span>›</span> Projects</button></li>
                <li><button onClick={() => handleNavClick("Company Profile")} className="hover:text-white transition flex items-center gap-1.5"><span>›</span> Company Profile</button></li>
                <li><button onClick={() => handleNavClick("Contact Us")} className="hover:text-white transition flex items-center gap-1.5"><span>›</span> Contact Us</button></li>
              </ul>
            </div>
            <div className="md:col-span-3 space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#7DD3FC] font-[Sora]">Enterprise Solutions</p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li><a href="#ai-screening" className="hover:text-white transition">AI Automated Screening</a></li>
                <li><a href="#panel-scheduling" className="hover:text-white transition">Multi-Panel Technical Interviews</a></li>
                <li><a href="#mysql-sync" className="hover:text-white transition">MySQL Real-Time Database Sync</a></li>
                <li><a href="#session-guard" className="hover:text-white transition">SessionGuard Cookie Security</a></li>
                <li><a href="#java-http" className="hover:text-white transition">Custom Java HTTP Server Engine</a></li>
              </ul>
            </div>
            <div className="md:col-span-3 space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#7DD3FC] font-[Sora]">Corporate Headquarters</p>
              <div className="space-y-2.5 text-xs text-slate-300">
                <p className="flex items-start gap-2"><span className="text-[#1D8FE0] font-bold">📍</span><span>HireSphere Tech Towers, AURO Campus, Surat, Gujarat, India</span></p>
                <p className="flex items-center gap-2"><span className="text-[#1D8FE0] font-bold">✉️</span><span>support@hiresphere.com</span></p>
                <p className="flex items-center gap-2"><span className="text-[#1D8FE0] font-bold">📞</span><span>+91 (0261) 8085-3306</span></p>
              </div>
              <div className="pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                  <p className="font-semibold text-white mb-0.5">Need System Support?</p>
                  <p className="text-[11px] text-slate-400">Our engineering team is monitoring backend logs on Port 8085.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <span>© {new Date().getFullYear()} HireSphere Technologies Inc. All rights reserved.</span>
            <div className="flex items-center gap-4 text-[11px]">
              <a href="#privacy" className="hover:text-white transition">Privacy Policy</a>
              <span>·</span>
              <a href="#terms" className="hover:text-white transition">Terms of Service</a>
              <span>·</span>
              <a href="#security" className="hover:text-white transition">Security Standard</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState } from "react";

export default function RecruitmentDrive({ userId, onLogout, apiBase = "http://localhost:8085", onNavigate }) {
  const [activeTab, setActiveTab] = useState("Recruitment Drive");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState(null);
  
  // Apply Modal state
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState(null);

  const [applyForm, setApplyForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    qualification: "B.Tech / BE Computer Science",
    experience: "1-2 Years",
    skills: "Java, React, SQL, Cloud Architecture",
    resumeUrl: "",
    coverLetter: "",
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        showToast("Please upload a valid PDF file.");
        e.target.value = null;
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        showToast("File size should be less than 2MB.");
        e.target.value = null;
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setApplyForm({ ...applyForm, resumeUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const initials = userId ? userId.substring(0, 2).toUpperCase() : "HS";

  const navLinks = [
    { name: "Dashboard", href: "#dashboard" },
    { name: "Profile", href: "#profile" },
    { name: "Recruitment Drive", href: "#drives" },
    { name: "My Applications", href: "#my-applications" },
    { name: "Company Profile", href: "#company" },
    { name: "Projects", href: "#projects" },
    { name: "Contact Us", href: "#contact" },
  ];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleNavClick = (linkName) => {
    
    setActiveTab(linkName);
    if (linkName === "Dashboard") {
      onNavigate && onNavigate("home");
    } else if (linkName === "Profile") {
      onNavigate && onNavigate("profile");
    } else if (linkName === "Recruitment Drive") {
      onNavigate && onNavigate("drive");
    } else if (linkName === "My Applications") {
      onNavigate && onNavigate("applied");
    } else if (linkName === "Company Profile") {
      onNavigate && onNavigate("company");
    } else if (linkName === "Projects") {
      onNavigate && onNavigate("projects");
    } else if (linkName === "Contact Us" || linkName === "Message") {
      onNavigate && onNavigate("message");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${apiBase}/api/logout`, { method: "POST", credentials: "include" });
    } catch (_) {}
    onLogout && onLogout();
  };

  const openApplyModal = (drive) => {
    setSelectedDrive(drive);
    setFormSuccessMessage(null);
    setApplyForm({
      fullName: "",
      email: "",
      phone: "",
      qualification: "B.Tech / BE Computer Science",
      experience: "1-2 Years",
      skills: "Java, React, SQL, Cloud Architecture",
      resumeUrl: "",
      coverLetter: "",
    });
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyForm.fullName || !applyForm.email || !applyForm.phone || !applyForm.skills) {
      showToast("Please fill in all required application fields.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      userId: userId || "candidate_user",
      companyName: selectedDrive.company,
      jobTitle: selectedDrive.role,
      fullName: applyForm.fullName,
      email: applyForm.email,
      phone: applyForm.phone,
      qualification: applyForm.qualification,
      experience: applyForm.experience,
      skills: applyForm.skills,
      resumeUrl: applyForm.resumeUrl,
      coverLetter: applyForm.coverLetter,
      applicationStatus: "Submitted",
    };

    try {
      const res = await fetch(`${apiBase}/api/drive/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setFormSuccessMessage(`Application for ${selectedDrive.company} (${selectedDrive.role}) submitted successfully! Data saved to MySQL database.`);
        showToast("Application saved to database successfully!");
      } else {
        showToast(data.message || "Failed to submit application.");
      }
    } catch (err) {
      console.error("[RecruitmentDrive] Error submitting application:", err);
      showToast("Network connection error submitting application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 20 Latest IT Company Recruitment Drives
  const drivesList = [
    {
      id: 1,
      company: "Google",
      badge: "Tier 1 Tech",
      category: "AI & ML",
      role: "Senior Cloud AI / ML Solutions Engineer",
      salary: "$190,000 - $240,000 /yr",
      location: "San Francisco, CA (Hybrid)",
      date: "Oct 15, 2026",
      techStack: ["PyTorch", "TensorFlow", "Kubernetes", "GCP", "Python"],
      eligibility: "B.Tech / MCA / M.Tech in CS or related field",
      experience: "2+ Years",
      bgGradient: "from-blue-600 to-red-600",
      logoLetter: "G",
    },
    {
      id: 2,
      company: "Microsoft",
      badge: "Enterprise Leader",
      category: "Full Stack & Backend",
      role: "Lead Full Stack Java & Azure Systems Architect",
      salary: "$170,000 - $210,000 /yr",
      location: "Seattle, WA (Hybrid)",
      date: "Oct 18, 2026",
      techStack: ["Java 17", "Spring Boot", "React", "Azure", "SQL"],
      eligibility: "BE / B.Tech / MCA with minimum 65% aggregate",
      experience: "1+ Years",
      bgGradient: "from-blue-500 to-teal-500",
      logoLetter: "MS",
    },
    {
      id: 3,
      company: "Amazon AWS",
      badge: "Cloud Pioneer",
      category: "Cloud & DevOps",
      role: "Principal Cloud DevOps & Security Infrastructure Lead",
      salary: "$180,000 - $230,000 /yr",
      location: "Austin, TX (Remote / Hybrid)",
      date: "Oct 20, 2026",
      techStack: ["AWS", "Docker", "Terraform", "Go", "Kubernetes"],
      eligibility: "B.Tech CS / IT / MCA / M.Tech",
      experience: "3+ Years",
      bgGradient: "from-amber-500 to-orange-600",
      logoLetter: "AWS",
    },
    {
      id: 4,
      company: "Meta",
      badge: "Social Systems",
      category: "Full Stack & Backend",
      role: "Lead Front-End Architect & React Core Engineer",
      salary: "$175,000 - $220,000 /yr",
      location: "Menlo Park, CA (Remote)",
      date: "Oct 22, 2026",
      techStack: ["React", "TypeScript", "GraphQL", "WebAssembly", "Node.js"],
      eligibility: "B.Tech / BE / B.Sc IT / MCA",
      experience: "2+ Years",
      bgGradient: "from-blue-600 to-indigo-700",
      logoLetter: "M",
    },
    {
      id: 5,
      company: "OpenAI",
      badge: "Generative AI",
      category: "AI & ML",
      role: "LLM Fine-Tuning & Vector Indexing Engineer",
      salary: "$220,000 - $280,000 /yr",
      location: "San Francisco, CA (Hybrid)",
      date: "Oct 25, 2026",
      techStack: ["PyTorch", "Pinecone", "Transformers", "CUDA", "Python"],
      eligibility: "M.Tech / PhD / B.Tech CS with strong ML fundamentals",
      experience: "2+ Years",
      bgGradient: "from-emerald-600 to-teal-800",
      logoLetter: "AI",
    },
    {
      id: 6,
      company: "NVIDIA",
      badge: "Hardware & AI",
      category: "AI & ML",
      role: "CUDA GPU Parallel Systems Performance Engineer",
      salary: "$200,000 - $250,000 /yr",
      location: "Santa Clara, CA (Onsite)",
      date: "Oct 28, 2026",
      techStack: ["CUDA", "C++20", "GPU Drivers", "Linux Kernel", "Python"],
      eligibility: "B.Tech / M.Tech in CS / ECE / Computer Engineering",
      experience: "2+ Years",
      bgGradient: "from-green-600 to-emerald-700",
      logoLetter: "NV",
    },
    {
      id: 7,
      company: "Apple",
      badge: "Consumer OS",
      category: "Full Stack & Backend",
      role: "Core iOS & Swift Micro-Kernel Systems Engineer",
      salary: "$185,000 - $230,000 /yr",
      location: "Cupertino, CA (Hybrid)",
      date: "Nov 02, 2026",
      techStack: ["Swift", "Objective-C", "iOS SDK", "Metal", "C++"],
      eligibility: "BE / B.Tech CS / IT / Software Engineering",
      experience: "1+ Years",
      bgGradient: "from-slate-700 to-slate-900",
      logoLetter: "AP",
    },
    {
      id: 8,
      company: "Netflix",
      badge: "High Throughput",
      category: "Full Stack & Backend",
      role: "Distributed Microservices & Video Pipeline Engineer",
      salary: "$210,000 - $270,000 /yr",
      location: "Los Gatos, CA (Remote)",
      date: "Nov 05, 2026",
      techStack: ["Java", "Spring Boot", "Kafka", "gRPC", "AWS"],
      eligibility: "B.Tech / MCA / M.Tech in Computer Science",
      experience: "3+ Years",
      bgGradient: "from-red-600 to-rose-800",
      logoLetter: "NF",
    },
    {
      id: 9,
      company: "Adobe",
      badge: "Creative Cloud",
      category: "Full Stack & Backend",
      role: "Creative AI & Web Graphics Engine Developer",
      salary: "$160,000 - $200,000 /yr",
      location: "San Jose, CA (Hybrid)",
      date: "Nov 08, 2026",
      techStack: ["C++", "WebGL", "TypeScript", "WebAssembly", "React"],
      eligibility: "B.Tech / BE / MCA in IT or Computer Science",
      experience: "1+ Years",
      bgGradient: "from-red-500 to-pink-600",
      logoLetter: "AD",
    },
    {
      id: 10,
      company: "Salesforce",
      badge: "SaaS Enterprise",
      category: "Cloud & DevOps",
      role: "Enterprise SaaS Cloud Platform Architect",
      salary: "$165,000 - $205,000 /yr",
      location: "San Francisco, CA (Remote)",
      date: "Nov 10, 2026",
      techStack: ["Java", "Apex", "Lightning Web Components", "AWS", "SQL"],
      eligibility: "B.Tech / MCA with knowledge of Cloud CRM Systems",
      experience: "2+ Years",
      bgGradient: "from-sky-500 to-blue-600",
      logoLetter: "SF",
    },
    {
      id: 11,
      company: "Oracle",
      badge: "Database Giant",
      category: "Full Stack & Backend",
      role: "Autonomous Database Engine & Core Java Engineer",
      salary: "$155,000 - $195,000 /yr",
      location: "Redwood City, CA (Hybrid)",
      date: "Nov 12, 2026",
      techStack: ["Java 17", "Oracle DB", "C", "Linux Kernel", "Docker"],
      eligibility: "B.Tech / MCA / M.Tech Computer Science",
      experience: "1+ Years",
      bgGradient: "from-red-700 to-orange-800",
      logoLetter: "OR",
    },
    {
      id: 12,
      company: "IBM",
      badge: "Quantum & Cyber",
      category: "Security & Data",
      role: "Quantum Computing & Enterprise Cybersecurity Analyst",
      salary: "$150,000 - $190,000 /yr",
      location: "Armonk, NY (Hybrid)",
      date: "Nov 15, 2026",
      techStack: ["Qiskit", "Python", "Linux Security", "Cryptography", "C++"],
      eligibility: "B.Tech CS / Cyber Security / MCA",
      experience: "1+ Years",
      bgGradient: "from-blue-700 to-indigo-900",
      logoLetter: "IBM",
    },
    {
      id: 13,
      company: "Cisco Systems",
      badge: "Network Security",
      category: "Security & Data",
      role: "Zero-Trust Network Security & SD-WAN Specialist",
      salary: "$145,000 - $185,000 /yr",
      location: "San Jose, CA (Remote)",
      date: "Nov 18, 2026",
      techStack: ["C++", "Python", "Networking Protocols", "Linux", "Docker"],
      eligibility: "B.Tech in ECE / CS / IT / Networking",
      experience: "1+ Years",
      bgGradient: "from-sky-600 to-cyan-700",
      logoLetter: "CS",
    },
    {
      id: 14,
      company: "Intel Corporation",
      badge: "Semiconductors",
      category: "Cloud & DevOps",
      role: "Embedded Firmware & x86 Kernel Performance Developer",
      salary: "$140,000 - $180,000 /yr",
      location: "Santa Clara, CA (Onsite)",
      date: "Nov 20, 2026",
      techStack: ["C", "Assembly", "Linux Kernel", "RTOS", "Python"],
      eligibility: "B.Tech / M.Tech ECE / EEE / CS",
      experience: "1+ Years",
      bgGradient: "from-blue-600 to-sky-700",
      logoLetter: "IN",
    },
    {
      id: 15,
      company: "AMD",
      badge: "Processor Tech",
      category: "Cloud & DevOps",
      role: "High-Performance Chiplet & Hardware Verification Lead",
      salary: "$150,000 - $190,000 /yr",
      location: "Austin, TX (Onsite)",
      date: "Nov 22, 2026",
      techStack: ["Verilog", "SystemVerilog", "Python", "C++", "Linux"],
      eligibility: "B.Tech / M.Tech in ECE or Computer Engineering",
      experience: "2+ Years",
      bgGradient: "from-red-600 to-slate-800",
      logoLetter: "AMD",
    },
    {
      id: 16,
      company: "Spotify",
      badge: "Audio Streaming",
      category: "Security & Data",
      role: "Real-time Data Streaming & Recommendation Engineer",
      salary: "$160,000 - $200,000 /yr",
      location: "New York, NY (Remote)",
      date: "Nov 25, 2026",
      techStack: ["Apache Kafka", "Flink", "Java", "Python", "GCP"],
      eligibility: "B.Tech CS / IT / MCA",
      experience: "2+ Years",
      bgGradient: "from-emerald-500 to-green-700",
      logoLetter: "SP",
    },
    {
      id: 17,
      company: "Uber",
      badge: "Geospatial Mobility",
      category: "Full Stack & Backend",
      role: "High-Throughput Routing & Distributed Systems Lead",
      salary: "$175,000 - $220,000 /yr",
      location: "San Francisco, CA (Hybrid)",
      date: "Nov 28, 2026",
      techStack: ["Go", "Java", "Cassandra", "Redis", "Kafka"],
      eligibility: "B.Tech / MCA / M.Tech Computer Science",
      experience: "2+ Years",
      bgGradient: "from-slate-800 to-black",
      logoLetter: "UB",
    },
    {
      id: 18,
      company: "Snowflake",
      badge: "Data Cloud",
      category: "Security & Data",
      role: "Cloud Data Warehouse Core Query Engine Architect",
      salary: "$190,000 - $240,000 /yr",
      location: "San Mateo, CA (Hybrid)",
      date: "Dec 01, 2026",
      techStack: ["C++", "Java", "AWS", "Distributed Storage", "SQL"],
      eligibility: "B.Tech CS / M.Tech Systems Engineering",
      experience: "3+ Years",
      bgGradient: "from-sky-400 to-blue-600",
      logoLetter: "SN",
    },
    {
      id: 19,
      company: "Databricks",
      badge: "Lakehouse AI",
      category: "AI & ML",
      role: "Apache Spark & Lakehouse AI Infrastructure Engineer",
      salary: "$200,000 - $250,000 /yr",
      location: "San Francisco, CA (Hybrid)",
      date: "Dec 05, 2026",
      techStack: ["Scala", "Python", "Spark", "Delta Lake", "Kubernetes"],
      eligibility: "B.Tech / M.Tech in CS / Data Engineering",
      experience: "2+ Years",
      bgGradient: "from-orange-600 to-red-700",
      logoLetter: "DB",
    },
    {
      id: 20,
      company: "Palantir",
      badge: "Defense & Big Data",
      category: "Security & Data",
      role: "Foundry Enterprise Intelligence Data Integration Specialist",
      salary: "$180,000 - $230,000 /yr",
      location: "Denver, CO (Hybrid)",
      date: "Dec 08, 2026",
      techStack: ["TypeScript", "Java", "PostgreSQL", "Docker", "Python"],
      eligibility: "B.Tech / BE Computer Science or Information Tech",
      experience: "2+ Years",
      bgGradient: "from-slate-700 to-slate-900",
      logoLetter: "PL",
    },
  ];

  const filteredDrives = drivesList.filter((d) => {
    const matchesCategory = categoryFilter === "All" || d.category === categoryFilter;
    const matchesSearch =
      d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F4FAFF] flex flex-col font-[Inter] text-slate-800">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B3D91] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-sky-400/40 flex items-center gap-3 animate-bounce">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-400 text-[#0B3D91] font-bold text-xs">
            ✓
          </span>
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Navigation Bar */}
      <header
        style={{
          background: "linear-gradient(135deg, #0B3D91 0%, #155DC1 50%, #1D8FE0 100%)",
          boxShadow: "0 4px 25px rgba(11,61,145,0.35)",
        }}
        className="sticky top-0 z-50 px-4 sm:px-8 py-3.5"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand */}
          <div
            className="flex items-center gap-3 shrink-0 cursor-pointer"
            onClick={() => handleNavClick("Dashboard")}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md ring-1 ring-white/30 shadow-inner">
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white drop-shadow">
                <path d="M12 2 2 7l10 5 10-5-10-5Zm0 7.4L4.3 6 12 2.6 19.7 6 12 9.4ZM2 12.1l10 5 10-5v3.5l-10 5-10-5v-3.5Z" />
              </svg>
            </span>
            <div>
              <span className="font-[Sora] text-xl font-extrabold text-white tracking-tight block leading-tight">
                HireSphere
              </span>
              <span className="text-[10px] text-white/80 font-medium tracking-widest uppercase block">
                Enterprise Talent OS
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/20">
            {navLinks.map((link) => {
              const isActive = activeTab === link.name;
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.name)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 text-white ${
                    isActive
                      ? "bg-white/25 shadow-sm text-white ring-1 ring-white/40 font-bold"
                      : "hover:bg-white/15 hover:text-white"
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2.5 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1.5 border border-white/25 shadow-sm">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-[#0B3D91] shadow">
                {initials}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">{userId}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-all shadow-sm active:scale-95"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h6v-2H4V5h5V3H3zm10.293 3.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 11H7a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
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

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center justify-around mt-2.5 pt-2 border-t border-white/15 text-xs font-medium text-white overflow-x-auto">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.name)}
              className={`px-2.5 py-1 rounded-md text-white whitespace-nowrap ${
                activeTab === link.name ? "bg-white/25 font-bold" : "hover:bg-white/10"
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div
          className="rounded-3xl p-6 sm:p-10 relative overflow-hidden text-white"
          style={{
            background: "linear-gradient(135deg, #0B3D91 0%, #155DC1 55%, #1D8FE0 100%)",
            boxShadow: "0 25px 60px rgba(11,61,145,0.3)",
          }}
        >
          <div className="relative z-10 space-y-4 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-sky-200">
              ⚡ GLOBAL RECRUITMENT DRIVES 2026
            </span>
            <h1 className="font-[Sora] text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              20 Top IT Enterprise Recruitment Drives
            </h1>
            <p className="text-sky-100 text-sm sm:text-base leading-relaxed">
              Explore high-paying IT requisitions, AI research roles, and enterprise systems positions across the world's leading technology corporations. Submit your application directly to MySQL database.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleNavClick("My Applications")}
                className="px-6 py-3 rounded-2xl bg-white text-[#0B3D91] font-extrabold text-xs sm:text-sm hover:bg-sky-50 transition shadow-lg flex items-center gap-2 active:scale-95"
              >
                📋 View My Submitted Applications
              </button>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3.5 top-3 text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search by company, role (e.g. Google, AI, Java, PyTorch)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#0B3D91] outline-none"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {["All", "AI & ML", "Full Stack & Backend", "Cloud & DevOps", "Security & Data"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    categoryFilter === cat
                      ? "bg-[#0B3D91] text-white shadow"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 20 Company Drives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrives.map((drive) => (
            <div
              key={drive.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md hover:shadow-2xl hover:border-[#1D8FE0] transition duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-4">
                {/* Header: Company Logo Badge & Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${drive.bgGradient} text-white font-black text-lg flex items-center justify-center shadow-md`}>
                      {drive.logoLetter}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg font-[Sora] group-hover:text-[#0B3D91] transition">
                        {drive.company}
                      </h3>
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        {drive.badge}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Drive: {drive.date}
                  </span>
                </div>

                {/* Role Title */}
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 font-[Sora] leading-snug">
                    {drive.role}
                  </h4>
                  <p className="text-xs text-[#1D8FE0] font-bold mt-1">📍 {drive.location}</p>
                </div>

                {/* Salary & Eligibility */}
                <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Package:</span>
                    <span className="text-emerald-600 font-extrabold">{drive.salary}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Experience:</span>
                    <span className="font-semibold text-slate-800">{drive.experience}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 truncate">
                    🎓 {drive.eligibility}
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {drive.techStack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-[#0B3D91] border border-blue-100"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <div className="pt-2">
                <button
                  onClick={() => openApplyModal(drive)}
                  className="w-full py-3 rounded-xl bg-[#0B3D91] hover:bg-[#155DC1] text-white font-extrabold text-xs sm:text-sm transition shadow active:scale-95 flex items-center justify-center gap-2"
                >
                  Apply Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* APPLY NOW MODAL FORM */}
      {selectedDrive && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 relative my-8 animate-fadeIn border border-slate-200">
            <button
              onClick={() => setSelectedDrive(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 text-xl font-bold"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pr-6 border-b border-slate-100 pb-4">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-100 text-[#0B3D91]">
                {selectedDrive.company} Recruitment Drive
              </span>
              <h3 className="text-xl font-black text-slate-900 font-[Sora] pt-1">
                Apply for {selectedDrive.role}
              </h3>
              <p className="text-xs text-slate-500">
                💰 {selectedDrive.salary} | 📍 {selectedDrive.location}
              </p>
            </div>

            {formSuccessMessage ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 font-black text-3xl flex items-center justify-center mx-auto">
                  ✓
                </div>
                <h4 className="text-xl font-bold text-slate-900 font-[Sora]">Application Saved to MySQL!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  {formSuccessMessage}
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedDrive(null);
                      handleNavClick("My Applications");
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B3D91] hover:bg-[#155DC1] text-white font-bold text-xs shadow"
                  >
                    Go to My Applications Page →
                  </button>
                  <button
                    onClick={() => setSelectedDrive(null)}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Close Modal
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Verma"
                      value={applyForm.fullName}
                      onChange={(e) => setApplyForm({ ...applyForm, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B3D91] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={applyForm.email}
                      onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B3D91] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={applyForm.phone}
                      onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B3D91] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Highest Qualification *</label>
                    <select
                      value={applyForm.qualification}
                      onChange={(e) => setApplyForm({ ...applyForm, qualification: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B3D91] outline-none"
                    >
                      <option>B.Tech / BE Computer Science</option>
                      <option>MCA / Master of Computer Applications</option>
                      <option>M.Tech / ME Software Systems</option>
                      <option>B.Sc IT / BCA</option>
                      <option>Other STEM Degree</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Experience Level *</label>
                    <select
                      value={applyForm.experience}
                      onChange={(e) => setApplyForm({ ...applyForm, experience: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B3D91] outline-none"
                    >
                      <option>Fresher / 2026 Graduate</option>
                      <option>1-2 Years</option>
                      <option>3-5 Years</option>
                      <option>5+ Years Senior</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Upload Resume (PDF)</label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B3D91] outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {applyForm.resumeUrl && applyForm.resumeUrl.startsWith("data:application/pdf") && (
                      <p className="mt-1 text-[10px] text-emerald-600 font-bold">✓ PDF uploaded successfully</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Key Skills & Tech Stack *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Java, React, Python, AWS, MySQL, Docker"
                    value={applyForm.skills}
                    onChange={(e) => setApplyForm({ ...applyForm, skills: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B3D91] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cover Note / Remarks</label>
                  <textarea
                    rows="3"
                    placeholder="State why you are ideal for this IT drive role..."
                    value={applyForm.coverLetter}
                    onChange={(e) => setApplyForm({ ...applyForm, coverLetter: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B3D91] outline-none"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedDrive(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#0B3D91] text-white text-xs font-bold hover:bg-[#155DC1] transition shadow"
                  >
                    {isSubmitting ? "Saving to MySQL..." : "Submit Drive Application"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}

      {/* ATTRACTIVE & UNIQUE FOOTER */}
      <footer className="mt-16 bg-[#081B33] text-white pt-16 pb-8 border-t-4 border-[#1D8FE0] relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#155DC1]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#1D8FE0]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            
            {/* Column 1: Brand Info & Socials (4 cols) */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0B3D91] to-[#1D8FE0] ring-1 ring-white/30 shadow-lg">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
                    <path d="M12 2 2 7l10 5 10-5-10-5Zm0 7.4L4.3 6 12 2.6 19.7 6 12 9.4ZM2 12.1l10 5 10-5v3.5l-10 5-10-5v-3.5Z" />
                  </svg>
                </span>
                <span className="font-[Sora] text-2xl font-black tracking-tight text-white">
                  HireSphere
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                Transforming global talent management through intelligent recruitment platforms, seamless institutional drives, and robust database architecture.
              </p>
              
              {/* Status pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Backend Port 8085 Online · MySQL 3306 Healthy
              </div>

              {/* Social Media Links */}
              <div className="flex items-center gap-3 pt-2">
                {["LinkedIn", "Twitter", "GitHub", "YouTube"].map((network) => (
                  <a
                    key={network}
                    href={`#${network.toLowerCase()}`}
                    className="h-9 w-9 rounded-lg bg-white/10 hover:bg-[#1D8FE0] hover:scale-105 border border-white/10 flex items-center justify-center text-xs font-bold transition text-white"
                  >
                    {network[0]}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links (2 cols) */}
            <div className="md:col-span-2 space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#7DD3FC] font-[Sora]">
                Navigation
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>
                  <button onClick={() => handleNavClick("Dashboard")} className="hover:text-white transition flex items-center gap-1.5">
                    <span>›</span> Dashboard Overview
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick("Profile")} className="hover:text-white transition flex items-center gap-1.5">
                    <span>›</span> Candidate Profile
                  </button>
                </li>
                <li><a href="#candidates" className="hover:text-white transition flex items-center gap-1.5"><span>›</span> Candidate Directory</a></li>
                <li><a href="#drives" className="hover:text-white transition flex items-center gap-1.5"><span>›</span> Campus Drives</a></li>
                <li>
                  <button onClick={() => handleNavClick("Company Profile")} className="hover:text-white transition flex items-center gap-1.5">
                    <span>›</span> Company Profile
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Solutions (3 cols) */}
            <div className="md:col-span-3 space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#7DD3FC] font-[Sora]">
                Enterprise Solutions
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li><a href="#ai-screening" className="hover:text-white transition">AI Automated Screening</a></li>
                <li><a href="#panel-scheduling" className="hover:text-white transition">Multi-Panel Technical Interviews</a></li>
                <li><a href="#mysql-sync" className="hover:text-white transition">MySQL Real-Time Database Sync</a></li>
                <li><a href="#session-guard" className="hover:text-white transition">SessionGuard Cookie Security</a></li>
                <li><a href="#java-http" className="hover:text-white transition">Custom Java HTTP Server Engine</a></li>
              </ul>
            </div>

            {/* Column 4: Contact & HQ (3 cols) */}
            <div className="md:col-span-3 space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#7DD3FC] font-[Sora]">
                Corporate Headquarters
              </p>
              <div className="space-y-2.5 text-xs text-slate-300">
                <p className="flex items-start gap-2">
                  <span className="text-[#1D8FE0] font-bold">📍</span>
                  <span>HireSphere Tech Towers, AURO Campus, Surat, Gujarat, India</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#1D8FE0] font-bold">✉️</span>
                  <span>support@hiresphere.com</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#1D8FE0] font-bold">📞</span>
                  <span>+91 (0261) 8085-3306</span>
                </p>
              </div>

              <div className="pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                  <p className="font-semibold text-white mb-0.5">Need System Support?</p>
                  <p className="text-[11px] text-slate-400">Our engineering team is monitoring backend logs on Port 8085.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Copyright & Meta */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()} HireSphere Technologies Inc. All rights reserved.</span>
            </div>
            
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

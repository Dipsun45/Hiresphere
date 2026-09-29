import React, { useState } from "react";

export default function CompanyProfile({ userId, onLogout, apiBase = "http://localhost:8085", onNavigate }) {
  const [activeTab, setActiveTab] = useState("Company Profile");
  const [activeSubTab, setActiveSubTab] = useState("overview");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const initials = userId ? userId.substring(0, 2).toUpperCase() : "HS";

  const navLinks = [
    { name: "Dashboard", href: "#dashboard" },
    { name: "Profile", href: "#profile" },
    { name: "Recruitment Drive", href: "#drives" },
    { name: "My Applications", href: "#applied" },
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

  const downloadDossier = () => {
    showToast("Downloading official HireSphere Corporate Overview Dossier (PDF)...");
  };

  const toggleJobDetails = (id) => {
    setExpandedJobId((prev) => (prev === id ? null : id));
  };

  // Careers / Open Positions data (Information only - no apply forms)
  const jobsList = [
    {
      id: 1,
      title: "Principal AI & NLP Research Scientist",
      department: "AI Research",
      location: "San Francisco, CA (Hybrid / Remote)",
      type: "Full-Time",
      experience: "7+ Years",
      salary: "$210,000 - $260,000 + Equity",
      description: "Drive the next generation of semantic candidate vector embedding models, zero-bias screening algorithms, and generative interview assessment tools for enterprise platforms.",
      requirements: [
        "PhD or MSc in Machine Learning, Computational Linguistics, or CS",
        "Strong background in PyTorch, Transformer models, LLM fine-tuning",
        "Experience deploying models to enterprise production scale",
      ],
      code: "JOB-AI-8092",
    },
    {
      id: 2,
      title: "Senior Full-Stack Java & React Engineer",
      department: "Engineering",
      location: "Bengaluru, India (Hybrid / Remote)",
      type: "Full-Time",
      experience: "5+ Years",
      salary: "₹28L - ₹42L P.A. + Equity",
      description: "Build robust distributed backend microservices handling high-throughput candidate applications, real-time messaging, and high-performance React frontends.",
      requirements: [
        "Deep expertise in Java 17+, Spring Boot / Enterprise Java, REST APIs",
        "Proficiency in modern React, Tailwind CSS, State Management",
        "Hands-on experience with PostgreSQL, Redis, Kubernetes & AWS",
      ],
      code: "JOB-ENG-4410",
    },
    {
      id: 3,
      title: "Lead Product Designer & UX Architect",
      department: "Product",
      location: "London, UK (Hybrid)",
      type: "Full-Time",
      experience: "6+ Years",
      salary: "£90,000 - £120,000 + Benefits",
      description: "Design intuitive, futuristic recruitment workflows and candidate portal experiences that make enterprise recruitment effortless and aesthetically delightful.",
      requirements: [
        "Proven track record in SaaS B2B enterprise design systems",
        "Mastery of Figma, micro-interactions, accessibility (WCAG 2.1)",
        "Portfolio showcasing complex data visualization & interactive dashboards",
      ],
      code: "JOB-DES-1029",
    },
    {
      id: 4,
      title: "Enterprise Solutions & Partnership Director",
      department: "Sales & Growth",
      location: "Singapore Hub (Remote APAC)",
      type: "Full-Time",
      experience: "8+ Years",
      salary: "$140,000 - $180,000 OTE + Commissions",
      description: "Partner with Fortune 500 Chief Human Resource Officers and Talent Acquisition Heads across the APAC region to deploy HireSphere Enterprise OS.",
      requirements: [
        "Demonstrated success in Enterprise SaaS B2B sales",
        "Deep network within HR Tech & Enterprise Talent Executive leadership",
        "Exceptional consultative presentation and negotiation skills",
      ],
      code: "JOB-SLS-9931",
    },
    {
      id: 5,
      title: "Staff DevOps & Security Compliance Engineer",
      department: "Engineering",
      location: "Remote (Global)",
      type: "Full-Time",
      experience: "6+ Years",
      salary: "$150,000 - $190,000 + Equity",
      description: "Lead SOC2 Type II, ISO 27001, and GDPR compliance infrastructure, automated CI/CD pipelines, and zero-trust security architecture across multi-cloud deployments.",
      requirements: [
        "Strong background in Kubernetes, Terraform, AWS/GCP cloud security",
        "Experience managing SOC2 & GDPR enterprise security audits",
        "Expertise in automated vulnerability scanning and incident response",
      ],
      code: "JOB-SEC-5512",
    },
  ];

  const filteredJobs =
    departmentFilter === "All"
      ? jobsList
      : jobsList.filter((j) => j.department === departmentFilter);

  // Executive team data
  const leadershipTeam = [
    {
      name: "Dr. Vikramaditya Sharma",
      title: "Founder & Chief Executive Officer",
      bg: "Ex-Google AI Lead, PhD Computer Science Stanford",
      quote: "Our mission is to replace outdated keyword matching with true deep capability understanding, unlocking human potential worldwide.",
      avatar: "VS",
      gradient: "from-blue-600 to-indigo-800",
    },
    {
      name: "Elena Rostova",
      title: "Chief Technology Officer",
      bg: "Ex-VP Engineering at LinkedIn Talent, MS MIT",
      quote: "We engineer systems that process millions of candidate interactions per second while guaranteeing unyielding privacy and zero algorithmic bias.",
      avatar: "ER",
      gradient: "from-teal-600 to-blue-700",
    },
    {
      name: "Marcus Vance",
      title: "Chief Revenue Officer",
      bg: "Ex-Salesforce VP Enterprise Growth, MBA Harvard",
      quote: "HireSphere provides enterprises with a 65% reduction in hiring latency while improving retention by over 94%. That is true ROI.",
      avatar: "MV",
      gradient: "from-indigo-600 to-purple-800",
    },
    {
      name: "Priya Sundaram",
      title: "Chief People & Culture Officer",
      bg: "Ex-Microsoft Global HR Lead, M.A. Industrial Psych",
      quote: "Culture isn't just perks—it's empowering world-class engineers and creators to build the future of global work from anywhere.",
      avatar: "PS",
      gradient: "from-sky-600 to-blue-800",
    },
    {
      name: "David Chen",
      title: "VP of Product Experience",
      bg: "Ex-Design Director at Airbnb, B.Des RISD",
      quote: "Recruitment software should feel elegant, fast, and empowering—not bureaucratic. We design for clarity, speed, and delight.",
      avatar: "DC",
      gradient: "from-blue-700 to-cyan-700",
    },
    {
      name: "Dr. Aisha Bello",
      title: "Head of Ethical AI Research",
      bg: "Ex-DeepMind Fellow, PhD Artificial Intelligence Oxford",
      quote: "Ensuring candidate evaluation is strictly skill-driven and free from gender, racial, or background bias is our mathematical commitment.",
      avatar: "AB",
      gradient: "from-purple-700 to-indigo-900",
    },
  ];

  // Global offices data
  const globalOffices = [
    {
      city: "San Francisco",
      country: "United States",
      type: "Global Headquarters & AI Innovation Lab",
      address: "100 Innovation Way, Suite 1400, Silicon Valley, CA 94107",
      teamSize: "180+ Employees",
      timeZone: "PST (UTC-8)",
      flag: "🇺🇸",
      contact: "sf-hq@hiresphere.com",
    },
    {
      city: "London",
      country: "United Kingdom",
      type: "EMEA Operations & Fintech Talent Hub",
      address: "1 Canada Square, 28th Floor, Canary Wharf, London E14 5AA",
      teamSize: "95+ Employees",
      timeZone: "GMT (UTC+0)",
      flag: "🇬🇧",
      contact: "emea@hiresphere.com",
    },
    {
      city: "Bengaluru",
      country: "India",
      type: "Core Engineering & Product R&D Campus",
      address: "HireSphere Tower, Outer Ring Road, Marathahalli, Bengaluru 560103",
      teamSize: "240+ Employees",
      timeZone: "IST (UTC+5:30)",
      flag: "🇮🇳",
      contact: "india-tech@hiresphere.com",
    },
    {
      city: "Singapore",
      country: "Singapore",
      type: "APAC Regional Expansion Hub",
      address: "Marina Bay Financial Centre, Tower 2, Level 18, Singapore 018983",
      teamSize: "60+ Employees",
      timeZone: "SGT (UTC+8)",
      flag: "🇸🇬",
      contact: "apac@hiresphere.com",
    },
  ];

  // Milestone timeline
  const milestones = [
    {
      year: "2021",
      title: "Founding & $5M Seed Round",
      desc: "HireSphere was founded by Dr. Vikramaditya Sharma with a vision to eliminate manual resume screening using vector skill embeddings.",
    },
    {
      year: "2022",
      title: "Enterprise ATS & 50,000 Profiles",
      desc: "Launched our first enterprise candidate portal, integrating with major ATS systems and passing 50k candidate milestone.",
    },
    {
      year: "2023",
      title: "Series A $25M & APAC Expansion",
      desc: "Secured $25M Series A funding led by top Silicon Valley VCs. Opened Bengaluru R&D campus and London EMEA office.",
    },
    {
      year: "2024",
      title: "AI Match Engine 2.0 & SOC2 Type II",
      desc: "Released deep learning contextual skill matching and achieved SOC2 Type II compliance and ISO 27001 data security certification.",
    },
    {
      year: "2025",
      title: "250,000 Placements & Campus Drive Suite",
      desc: "Surpassed 250,000 successful candidate placements. Released Virtual Recruitment Drive platform for global enterprise hiring events.",
    },
    {
      year: "2026",
      title: "HireSphere 3.0 & 1,200 Enterprise Partners",
      desc: "Unveiled HireSphere 3.0 Enterprise Talent OS with real-time video candidate matching, predictive tenure analytics, and 1,200+ partner corporations.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4FAFF] flex flex-col font-[Inter] text-slate-800">
      {/* Toast Notification */}
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-10">
        {/* 1. HERO BANNER & COMPANY DOSSIER HEADER */}
        <div
          className="rounded-3xl p-6 sm:p-10 relative overflow-hidden text-white"
          style={{
            background: "linear-gradient(135deg, #0B3D91 0%, #155DC1 55%, #1D8FE0 100%)",
            boxShadow: "0 25px 60px rgba(11,61,145,0.3)",
          }}
        >
          {/* Abstract backdrop glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-sky-300/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-sky-200">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              OFFICIAL CORPORATE PROFILE & OS ECOSYSTEM
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <h1 className="font-[Sora] text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
                  HireSphere Inc.
                </h1>
                <p className="text-sky-100 text-base sm:text-lg max-w-3xl leading-relaxed font-normal">
                  Pioneering Next-Generation AI Candidate Matching, Automated Recruitment Drives, and Transparent Talent Discovery for Enterprises Worldwide.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="bg-white/15 text-white text-xs px-3 py-1.5 rounded-xl border border-white/20 font-medium">
                    🏢 Enterprise HQ: San Francisco, CA
                  </span>
                  <span className="bg-white/15 text-white text-xs px-3 py-1.5 rounded-xl border border-white/20 font-medium">
                    ⚡ Founded: 2021
                  </span>
                  <span className="bg-white/15 text-white text-xs px-3 py-1.5 rounded-xl border border-white/20 font-medium">
                    🔒 SOC2 Type II Certified
                  </span>
                  <span className="bg-white/15 text-white text-xs px-3 py-1.5 rounded-xl border border-white/20 font-medium">
                    🌐 1,200+ Corporate Clients
                  </span>
                </div>
              </div>

              {/* Direct Info Actions (Form-Free) */}
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <button
                  onClick={() => {
                    const careersEl = document.getElementById("careers-section");
                    if (careersEl) careersEl.scrollIntoView({ behavior: "smooth" });
                    setActiveSubTab("careers");
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-white text-[#0B3D91] font-extrabold text-sm hover:bg-sky-50 transition shadow-lg flex items-center justify-center gap-2 active:scale-95"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  View Open Roles & Departments
                </button>
                <button
                  onClick={downloadDossier}
                  className="w-full py-3.5 px-6 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-sm transition shadow flex items-center justify-center gap-2 active:scale-95"
                >
                  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" />
                  </svg>
                  Download Corporate Dossier
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                <div className="font-[Sora] text-2xl font-black text-white">500K+</div>
                <div className="text-[11px] text-sky-100 font-medium">Placements</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                <div className="font-[Sora] text-2xl font-black text-white">1,200+</div>
                <div className="text-[11px] text-sky-100 font-medium">Enterprise Clients</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                <div className="font-[Sora] text-2xl font-black text-white">98.4%</div>
                <div className="text-[11px] text-sky-100 font-medium">AI Match Accuracy</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                <div className="font-[Sora] text-2xl font-black text-white">45+</div>
                <div className="text-[11px] text-sky-100 font-medium">Countries Active</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                <div className="font-[Sora] text-2xl font-black text-white">65%</div>
                <div className="text-[11px] text-sky-100 font-medium">Faster Hiring</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                <div className="font-[Sora] text-2xl font-black text-white">$420M+</div>
                <div className="text-[11px] text-sky-100 font-medium">Hiring Cost Saved</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SUB-SECTION TAB NAVIGATION */}
        <div className="sticky top-[68px] z-40 bg-white/80 backdrop-blur-lg p-2 rounded-2xl border border-slate-200 shadow-md flex items-center gap-2 overflow-x-auto">
          {[
            { id: "overview", label: "Overview & Mission" },
            { id: "products", label: "Product Ecosystem" },
            { id: "leadership", label: "Leadership Team" },
            { id: "culture", label: "Culture & Benefits" },
            { id: "offices", label: "Global Tech Hubs" },
            { id: "timeline", label: "Milestones" },
            { id: "careers", label: `Careers & Roles (${jobsList.length})` },
            { id: "contacts", label: "Corporate Desk" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id);
                const el = document.getElementById(`${tab.id}-section`);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeSubTab === tab.id
                  ? "bg-[#0B3D91] text-white shadow"
                  : "text-slate-600 hover:bg-slate-100 hover:text-[#0B3D91]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 3. SECTION 1: OVERVIEW & MISSION STATEMENT */}
        <section id="overview-section" className="space-y-6 scroll-mt-28">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#1D8FE0] font-[Sora]">
              OUR FOUNDATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-[Sora]">
              Connecting Extraordinary Talent with Visionary Enterprise
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              At HireSphere, we believe that traditional recruitment is fundamentally broken—burdened by keyword filters, manual resume fatigue, and opaque hiring pipelines. We are fixing it with ethical AI and precision engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-lg hover:shadow-xl transition relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0B3D91] flex items-center justify-center text-xl font-bold">
                  🎯
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 font-[Sora]">Our Corporate Mission</h3>
                  <span className="text-xs text-blue-600 font-semibold">Transforming How Talent Meets Opportunity</span>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                To build the world’s most precise, unbiased, and transparent talent operating system. We empower job seekers with verifiable career credentials while providing recruiters with deep AI skill insights to make hiring 10x faster and fairer.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-lg hover:shadow-xl transition relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-[#155DC1] flex items-center justify-center text-xl font-bold">
                  🚀
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 font-[Sora]">Our 2030 Global Vision</h3>
                  <span className="text-xs text-indigo-600 font-semibold">A Frictionless Global Talent Market</span>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                To serve as the default infrastructure for 10M+ candidates and 50,000+ global enterprises, enabling merit-based hiring across borders where talent is recognized instantly regardless of geographic or socio-economic boundaries.
              </p>
            </div>
          </div>

          {/* 6 Core Value Pillars */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-extrabold text-slate-900 font-[Sora] text-center">
              Our Core Architectural Values
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { title: "Candidate-First Transparency", icon: "💎", desc: "No hidden statuses or ghosting. Every candidate receives transparent updates and skill assessments." },
                { title: "Zero Algorithmic Bias", icon: "⚖️", desc: "Evaluations strictly focus on verified skills, coding proficiency, and technical aptitude." },
                { title: "Enterprise Reliability", icon: "🛡️", desc: "Built with bank-grade security, SOC2 Type II compliance, and 99.99% system uptime." },
                { title: "High-Volume Scalability", icon: "⚡", desc: "Process 50,000+ applicants in virtual recruitment drives without latency or drop-offs." },
                { title: "Continuous Skill Intelligence", icon: "🧠", desc: "Vector skill mapping adapts to modern tech stacks and emerging industry competencies." },
                { title: "Global Remote Inclusion", icon: "🌍", desc: "Connecting talent across 45+ countries with automated currency and location alignment." },
              ].map((val, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-[#1D8FE0] transition group">
                  <div className="text-3xl mb-3">{val.icon}</div>
                  <h4 className="font-extrabold text-slate-900 text-base font-[Sora] mb-1 group-hover:text-[#0B3D91] transition">
                    {val.title}
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. SECTION 2: PRODUCT ECOSYSTEM */}
        <section id="products-section" className="space-y-6 scroll-mt-28">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#1D8FE0] font-[Sora]">
              TECHNOLOGY SUITE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-[Sora]">
              The HireSphere Product Ecosystem
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Integrated, end-to-end recruitment modules built for enterprise HR teams, hiring managers, and candidates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "HireMatch AI Engine",
                badge: "Core AI",
                desc: "Contextual semantic resume parsing and vector skill similarity matching that identifies top 1% candidates instantly.",
                features: ["Semantic Skill Graphs", "Automated Scorecards", "Resume NLP Parser"],
                bg: "from-blue-50 to-sky-50 border-blue-200",
              },
              {
                title: "DriveSphere Virtual Fairs",
                badge: "Recruitment Drives",
                desc: "High-capacity virtual hiring drive suite for university campus recruitment, hackathons, and corporate hiring events.",
                features: ["Bulk Video Interviews", "Live Coding Sandbox", "Automated Shortlisting"],
                bg: "from-indigo-50 to-blue-50 border-indigo-200",
              },
              {
                title: "TalentPulse Analytics",
                badge: "Enterprise BI",
                desc: "Real-time executive dashboards measuring time-to-fill, candidate pass-through rates, diversity metrics, and ROI.",
                features: ["Predictive Time-to-Hire", "Recruiter Productivity", "Custom CSV/PDF Exports"],
                bg: "from-teal-50 to-emerald-50 border-teal-200",
              },
            ].map((prod, idx) => (
              <div key={idx} className={`bg-gradient-to-b ${prod.bg} rounded-3xl p-6 border shadow-md flex flex-col justify-between`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-[#0B3D91] shadow-sm">
                      {prod.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">v3.4 Enterprise</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 font-[Sora]">{prod.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{prod.desc}</p>
                  <div className="pt-2 space-y-1.5">
                    {prod.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <span className="text-emerald-500 font-bold">✓</span> {feat}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-6">
                  <div className="w-full py-2.5 rounded-xl bg-[#0B3D91] text-white text-xs font-bold text-center shadow">
                    Active System Module
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. SECTION 3: EXECUTIVE LEADERSHIP TEAM */}
        <section id="leadership-section" className="space-y-6 scroll-mt-28">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#1D8FE0] font-[Sora]">
              EXECUTIVE LEADERSHIP
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-[Sora]">
              Meet the Visionaries Behind HireSphere
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A diverse team of veteran computer scientists, enterprise SaaS executives, and HR leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leadershipTeam.map((member, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl transition flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${member.gradient} text-white font-black text-lg flex items-center justify-center shadow-lg`}>
                      {member.avatar}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base font-[Sora]">{member.name}</h3>
                      <p className="text-xs text-[#1D8FE0] font-bold">{member.title}</p>
                    </div>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    {member.bg}
                  </div>
                  <p className="text-slate-600 text-xs italic leading-relaxed bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                    "{member.quote}"
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-4">
                  <span className="text-[11px] font-bold text-slate-400">HireSphere Executive</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-600 font-semibold">LinkedIn Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. SECTION 4: CULTURE & BENEFITS */}
        <section id="culture-section" className="space-y-6 scroll-mt-28">
          <div className="bg-gradient-to-br from-[#0B3D91] via-[#155DC1] to-[#1D8FE0] rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-6 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-sky-200 font-[Sora]">
                LIFE AT HIRESPHERE
              </span>
              <h2 className="text-2xl sm:text-4xl font-black font-[Sora]">
                Empowering Creators in a Remote-First Culture
              </h2>
              <p className="text-sky-100 text-sm sm:text-base leading-relaxed">
                We believe exceptional work happens when talented humans have autonomy, world-class tools, continuous learning, and clear impact.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {[
                { title: "Full Health & Mental Wellness", desc: "100% premium coverage for medical, dental, vision, and mental health consultations." },
                { title: "$3,000 Remote Setup Allowance", desc: "Choose your custom M3 MacBook Pro, ergonomic desk, and monitor workspace setup." },
                { title: "$2,500 Annual Learning Budget", desc: "Stipend for courses, tech certifications, global AI conferences, and books." },
                { title: "Flexible Hours & Unlimited PTO", desc: "We measure outcomes, not hours spent sitting at a desk. Take time off when you need it." },
                { title: "Competitive Equity Options", desc: "Every full-time team member receives stock option grants in HireSphere Inc." },
                { title: "Annual Global Team Retreats", desc: "Past retreats: Bali 2024, Swiss Alps 2025, Kyoto 2026. All expenses paid!" },
              ].map((ben, bIdx) => (
                <div key={bIdx} className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20">
                  <h4 className="font-extrabold text-white text-sm font-[Sora] mb-1">
                    ✨ {ben.title}
                  </h4>
                  <p className="text-sky-100 text-xs leading-relaxed">{ben.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. SECTION 5: GLOBAL OFFICES */}
        <section id="offices-section" className="space-y-6 scroll-mt-28">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#1D8FE0] font-[Sora]">
              GLOBAL FOOTPRINT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-[Sora]">
              Our Global Tech Hubs & Operations
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Headquartered in Silicon Valley with state-of-the-art engineering campuses in America, Europe, and Asia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {globalOffices.map((off, oIdx) => (
              <div key={oIdx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{off.flag}</span>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-blue-50 text-[#0B3D91] border border-blue-200">
                      {off.timeZone}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 font-[Sora]">{off.city}</h3>
                    <p className="text-xs text-[#1D8FE0] font-bold">{off.country}</p>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {off.type}
                  </p>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    📍 {off.address}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 space-y-1">
                  <div className="text-[11px] text-slate-500 font-bold">👥 Team Size: {off.teamSize}</div>
                  <div className="text-[11px] text-blue-600 font-semibold truncate">✉️ {off.contact}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. SECTION 6: MILESTONE TIMELINE */}
        <section id="timeline-section" className="space-y-6 scroll-mt-28">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#1D8FE0] font-[Sora]">
              JOURNEY & GROWTH
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-[Sora]">
              HireSphere Key Milestones
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              From an ambitious Stanford research project to a multi-national Enterprise Talent OS.
            </p>
          </div>

          <div className="relative border-l-4 border-[#0B3D91] ml-4 sm:ml-32 space-y-8 py-2">
            {milestones.map((m, mIdx) => (
              <div key={mIdx} className="relative pl-6 sm:pl-8 group">
                {/* Timeline dot */}
                <div className="absolute -left-[14px] top-1.5 w-6 h-6 rounded-full bg-[#0B3D91] ring-4 ring-white border-2 border-sky-400 group-hover:scale-125 transition" />
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-lg transition space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-[Sora] font-black text-lg text-[#0B3D91] bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                      {m.year}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base font-[Sora]">{m.title}</h3>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. SECTION 7: OPEN CAREERS & ROLES (INFORMATIONAL ONLY - NO APPLY FORM) */}
        <section id="careers-section" className="space-y-6 scroll-mt-28">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-lg space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#1D8FE0] font-[Sora]">
                  TALENT & DEPARTMENTS
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-[Sora]">
                  Active Divisions & Open Positions
                </h2>
                <p className="text-slate-600 text-sm">
                  Detailed breakdown of active talent hiring requisitions across global engineering and research hubs.
                </p>
              </div>

              {/* Department Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                {["All", "Engineering", "AI Research", "Product", "Sales & Growth"].map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setDepartmentFilter(dept)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      departmentFilter === dept
                        ? "bg-[#0B3D91] text-white shadow"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            {/* Jobs Listing with Expandable Requirements (No Forms) */}
            <div className="space-y-4">
              {filteredJobs.map((job) => {
                const isExpanded = expandedJobId === job.id;
                return (
                  <div
                    key={job.id}
                    className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#1D8FE0] transition shadow-sm space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-blue-100 text-[#0B3D91]">
                            {job.department}
                          </span>
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                            {job.type}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded">
                            {job.code}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            📍 {job.location}
                          </span>
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900 font-[Sora]">
                          {job.title}
                        </h3>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                          {job.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-700 pt-1">
                          <span>💰 {job.salary}</span>
                          <span>•</span>
                          <span>⏳ {job.experience}</span>
                        </div>
                      </div>

                      {/* Information Toggle Button (No Form) */}
                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          onClick={() => toggleJobDetails(job.id)}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0B3D91] font-extrabold text-xs transition shadow-sm flex items-center justify-center gap-1.5"
                        >
                          {isExpanded ? "Hide Requirements" : "View Requirements"}
                          <svg
                            className={`w-4 h-4 transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Inline Expanded Requirements (Form-Free) */}
                    {isExpanded && (
                      <div className="pt-4 border-t border-slate-200 space-y-2 bg-white p-4 rounded-xl border">
                        <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#0B3D91] font-[Sora]">
                          Core Requisition Prerequisites & Expectations
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {job.requirements.map((req, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-2">
                              <span className="text-blue-500 font-bold">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 10. SECTION 8: FORM-FREE CORPORATE DIRECTORY & CONTACT DESK */}
        <section id="contacts-section" className="space-y-6 scroll-mt-28">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-lg space-y-8">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#1D8FE0] font-[Sora]">
                DIRECT CONTACT DESK
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-[Sora]">
                Corporate Directory & Global Contact Desk
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Connect directly with HireSphere global departments, executive offices, and corporate operations through verified communication channels.
              </p>
            </div>

            {/* Direct Information Grid Cards (Completely Form-Free) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: Enterprise Sales */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 hover:border-[#1D8FE0] transition">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0B3D91] flex items-center justify-center text-xl font-bold">
                    🏢
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base font-[Sora]">Enterprise Sales</h3>
                    <span className="text-xs text-blue-600 font-semibold">Global Business Partnerships</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-slate-500">Email:</span>
                    <span className="font-semibold text-blue-600">sales@hiresphere.com</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-slate-500">Direct Desk:</span>
                    <span className="font-semibold text-slate-800">+1 (800) 555-HIRE</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-slate-500">Availability:</span>
                    <span className="font-semibold text-emerald-600">24/7 Global Desk</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Press & Media */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 hover:border-[#1D8FE0] transition">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-[#155DC1] flex items-center justify-center text-xl font-bold">
                    📰
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base font-[Sora]">Press & Media</h3>
                    <span className="text-xs text-indigo-600 font-semibold">Public Relations & Media Kit</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-slate-500">Email:</span>
                    <span className="font-semibold text-blue-600">press@hiresphere.com</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-slate-500">Media Kit:</span>
                    <button
                      onClick={() => showToast("Opening Official 2026 Brand Assets & Media Kit...")}
                      className="font-bold text-[#0B3D91] hover:underline"
                    >
                      Download Assets
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-slate-500">Spokesperson:</span>
                    <span className="font-semibold text-slate-800">PR Communications Office</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Investor Relations */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 hover:border-[#1D8FE0] transition">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold">
                    📈
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base font-[Sora]">Investor Desk</h3>
                    <span className="text-xs text-emerald-600 font-semibold">Corporate Governance & Capital</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-slate-500">Email:</span>
                    <span className="font-semibold text-blue-600">investors@hiresphere.com</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-slate-500">Securities Status:</span>
                    <span className="font-semibold text-slate-800">Series A Private</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-slate-500">Annual Audit:</span>
                    <span className="font-semibold text-emerald-600">Verified Deloitte</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Security & Compliance */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 hover:border-[#1D8FE0] transition">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-xl font-bold">
                    🛡️
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base font-[Sora]">Security & Compliance</h3>
                    <span className="text-xs text-sky-600 font-semibold">Data Protection Officer (DPO)</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-slate-500">DPO Contact:</span>
                    <span className="font-semibold text-blue-600">dpo@hiresphere.com</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-slate-500">Certifications:</span>
                    <span className="font-semibold text-slate-800">SOC2 Type II / ISO 27001</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-slate-500">Privacy Standard:</span>
                    <span className="font-semibold text-emerald-600">GDPR & CCPA Compliant</span>
                  </div>
                </div>
              </div>

              {/* Card 5: Candidate Support */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 hover:border-[#1D8FE0] transition">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl font-bold">
                    💬
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base font-[Sora]">Candidate Messaging</h3>
                    <span className="text-xs text-purple-600 font-semibold">Direct Recruiter Portal</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Need assistance with your profile, job application status, or technical messaging? Switch directly to the HireSphere Candidate Support Desk.
                </p>
                <button
                  onClick={() => handleNavClick("Contact Us")}
                  className="w-full py-2.5 rounded-xl bg-[#0B3D91] hover:bg-[#155DC1] text-white text-xs font-bold transition shadow text-center"
                >
                  Open Candidate Message Portal →
                </button>
              </div>

              {/* Card 6: Corporate HQ Visit */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 hover:border-[#1D8FE0] transition">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl font-bold">
                    📍
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base font-[Sora]">Global Head Office</h3>
                    <span className="text-xs text-amber-700 font-semibold">Silicon Valley Headquarters</span>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="font-bold text-slate-800">HireSphere Inc. Headquarters</div>
                  <div>100 Innovation Way, Suite 1400</div>
                  <div>Silicon Valley, San Francisco, CA 94107</div>
                  <div className="text-blue-600 font-semibold pt-1">Reception: +1 (415) 555-0199</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

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

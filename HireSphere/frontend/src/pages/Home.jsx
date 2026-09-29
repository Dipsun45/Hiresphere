import { useState } from "react";

/**
 * HireSphere - Home / Dashboard Page
 * Enhanced with 5 White Header Links, Corporate Information Section, and a Unique Footer.
 */
export default function Home({ userId, onLogout, apiBase, onNavigate }) {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const initials = userId
    ? userId.substring(0, 2).toUpperCase()
    : "HS";

  const handleLogout = async () => {
    try {
      await fetch(`${apiBase}/api/logout`, { method: "POST", credentials: "include" });
    } catch (_) {}
    onLogout && onLogout();
  };

  const navLinks = [
    { name: "Dashboard", href: "#dashboard" },
    { name: "Profile", href: "#profile" },
    { name: "Recruitment Drive", href: "#drives" },
    { name: "My Applications", href: "#applied" },
    { name: "Company Profile", href: "#company" },
    { name: "Projects", href: "#projects" },
    { name: "Contact Us", href: "#contact" },
  ];

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

  return (
    <div className="min-h-screen bg-[#F4FAFF] flex flex-col font-[Inter]">
      {/* Top Navigation Bar */}
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

          {/* Header Link Options - White Color */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/20">
            {navLinks.map((link) => {
              const isActive = activeTab === link.name;
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.name)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 text-white ${
                    isActive
                      ? "bg-white/25 shadow-sm text-white ring-1 ring-white/40"
                      : "hover:bg-white/15 hover:text-white"
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* User info + Logout */}
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

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* Welcome Hero Banner */}
        <div
          className="rounded-3xl p-6 sm:p-8 relative overflow-hidden text-white"
          style={{
            background: "linear-gradient(135deg, #0B3D91 0%, #155DC1 60%, #1D8FE0 100%)",
            boxShadow: "0 20px 50px rgba(11,61,145,0.25)",
          }}
        >
          {/* Abstract glowing shapes */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 right-1/3 w-64 h-64 rounded-full bg-sky-400/20 blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-black text-[#0B3D91] bg-white shadow-xl ring-4 ring-white/20">
                {initials}
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-semibold mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Authenticated Session Active
                </div>
                <h1 className="font-[Sora] text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Welcome back, <span className="text-[#7DD3FC]">{userId}</span>!
                </h1>
                <p className="text-[#DCEEFF] text-sm sm:text-base max-w-xl mt-2 leading-relaxed">
                  Your HireSphere management portal is ready. Access real-time talent analytics, institutional recruitment drives, and secure database connections.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <button className="px-5 py-2.5 rounded-xl bg-white text-[#0B3D91] font-bold text-sm shadow-lg hover:bg-slate-50 transition active:scale-95">
                Launch Drive
              </button>
              <button className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-semibold text-sm transition">
                View Reports
              </button>
            </div>
          </div>
        </div>

        {/* Company Overview & Platform Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Card 1: Global Recruitment Network */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8F2FC] hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFF8FF] text-[#1D8FE0]">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3.005 3.005 0 013.75-2.906z" />
                </svg>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#1D8FE0]">
                1,200+ Corporate Partners
              </span>
            </div>
            <p className="text-xs font-semibold text-[#5C7B99] uppercase tracking-wider">Recruitment Platform</p>
            <p className="text-xl font-bold font-[Sora] text-[#0F2A47] mt-1">50,000+ Placements</p>
            <p className="text-xs text-[#9CB8D2] mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Connecting candidates with Fortune 500 tech partners
            </p>
          </div>

          {/* Card 2: AI Matching Architecture */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8F2FC] hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                99.8% Match Precision
              </span>
            </div>
            <p className="text-xs font-semibold text-[#5C7B99] uppercase tracking-wider">AI Intelligence</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xl font-bold font-[Sora] text-[#0F2A47]">Automated Screening</p>
            </div>
            <p className="text-xs text-[#9CB8D2] mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Skill matrix scoring & automated resume parsing
            </p>
          </div>

          {/* Card 3: Institutional Campus Drives */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8F2FC] hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356.257l4 4a1 1 0 001.388 0l4-4a1 1 0 01.356-.257l2.644-1.131a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-2.75-1.435A1 1 0 011 11.848v-1.455a1 1 0 011.31-.996zM15 10.12l1.69-.723A1 1 0 0118 10.393v1.455a1 1 0 01-1.25.97 8.97 8.97 0 00-2.75 1.435V10.12z" />
                </svg>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-600">
                Active Placement Portal
              </span>
            </div>
            <p className="text-xs font-semibold text-[#5C7B99] uppercase tracking-wider">Institutional Drives</p>
            <p className="text-xl font-bold font-[Sora] text-[#0F2A47] mt-1">Campus Hiring Drives</p>
            <p className="text-xs text-[#9CB8D2] mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Multi-stage technical panels & assessment scheduling
            </p>
          </div>
        </div>

        {/* COMPANY INFORMATION SECTION */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8F2FC] shadow-sm space-y-8">
          {/* Section Header */}
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-lg bg-[#EFF8FF] text-[#1D8FE0] text-xs font-bold uppercase tracking-wider mb-2">
              Corporate Insight
            </span>
            <h2 className="font-[Sora] text-2xl sm:text-3xl font-extrabold text-[#0F2A47]">
              About HireSphere Platform & Technologies
            </h2>
            <p className="text-[#5C7B99] text-sm sm:text-base mt-2 leading-relaxed">
              HireSphere is a next-generation recruitment automation ecosystem designed to bridge top-tier talent with world-class organizations through intelligent workflows and enterprise-grade data management.
            </p>
          </div>

          {/* Key Company Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#F4FAFF] via-[#EFF8FF] to-[#F4FAFF] border border-[#E0EEF9]">
            <div className="text-center p-3">
              <p className="font-[Sora] text-2xl sm:text-4xl font-extrabold text-[#0B3D91]">50,000+</p>
              <p className="text-xs font-semibold text-[#5C7B99] mt-1">Candidates Placed</p>
            </div>
            <div className="text-center p-3 border-l border-[#D4E6F7]">
              <p className="font-[Sora] text-2xl sm:text-4xl font-extrabold text-[#155DC1]">1,200+</p>
              <p className="text-xs font-semibold text-[#5C7B99] mt-1">Corporate Partners</p>
            </div>
            <div className="text-center p-3 border-l border-[#D4E6F7]">
              <p className="font-[Sora] text-2xl sm:text-4xl font-extrabold text-[#1D8FE0]">99.8%</p>
              <p className="text-xs font-semibold text-[#5C7B99] mt-1">Placement Match Rate</p>
            </div>
            <div className="text-center p-3 border-l border-[#D4E6F7]">
              <p className="font-[Sora] text-2xl sm:text-4xl font-extrabold text-emerald-600">24/7</p>
              <p className="text-xs font-semibold text-[#5C7B99] mt-1">Active Backend Sync</p>
            </div>
          </div>

          {/* Company Pillars & Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#F8FBFF] border border-[#E8F2FC]">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0B3D91] flex items-center justify-center font-bold mb-3">
                🚀
              </div>
              <h3 className="font-[Sora] font-bold text-base text-[#0F2A47] mb-1">
                Automated Sourcing
              </h3>
              <p className="text-xs text-[#5C7B99] leading-relaxed">
                Streamline application screening and candidate profiling with automated Java-powered microservices and real-time indexing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FBFF] border border-[#E8F2FC]">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-3">
                ⚡
              </div>
              <h3 className="font-[Sora] font-bold text-base text-[#0F2A47] mb-1">
                Institutional Drives
              </h3>
              <p className="text-xs text-[#5C7B99] leading-relaxed">
                Empower universities and corporate hiring teams to schedule multi-stage technical panels, coding tests, and campus interviews.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FBFF] border border-[#E8F2FC]">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3">
                🛡️
              </div>
              <h3 className="font-[Sora] font-bold text-base text-[#0F2A47] mb-1">
                Enterprise Reliability
              </h3>
              <p className="text-xs text-[#5C7B99] leading-relaxed">
                Protected by MySQL database encryption, custom session token cookies, and high-concurrency Java socket servers.
              </p>
            </div>
          </div>
        </section>

        {/* Available Services Section */}
        <section className="rounded-3xl bg-white border border-[#E8F2FC] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-[Sora] text-xl font-bold text-[#0F2A47] flex items-center gap-2">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-[#1D8FE0]">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Core Modules & Services
              </h2>
              <p className="text-xs text-[#5C7B99] mt-0.5">Explore active features configured for your account level.</p>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
              3 Modules Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: "M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z",
                label: "Talent Sourcing",
                desc: "Find, tag, and screen top talent across domain skillsets.",
                color: "text-[#1D8FE0] bg-[#EFF8FF]",
                tag: "Sourcing OS",
              },
              {
                icon: "M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z",
                label: "Interview Management",
                desc: "Coordinate panel schedules, scores, and candidate feedback.",
                color: "text-violet-500 bg-violet-50",
                tag: "Panel Hub",
              },
              {
                icon: "M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z",
                label: "Placement Drives",
                desc: "Campus & institutional recruitment batch processing.",
                color: "text-emerald-500 bg-emerald-50",
                tag: "Campus Drive",
              },
            ].map((svc) => (
              <div
                key={svc.label}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#E8F2FC] p-5 hover:border-[#1D8FE0]/40 hover:bg-[#F8FBFF] hover:shadow-md transition duration-200 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${svc.color}`}>
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                        <path fillRule="evenodd" d={svc.icon} clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C7B99] px-2 py-0.5 rounded bg-slate-100">
                      {svc.tag}
                    </span>
                  </div>
                  <h3 className="font-[Sora] text-base font-bold text-[#0F2A47] group-hover:text-[#1D8FE0] transition">
                    {svc.label}
                  </h3>
                  <p className="text-xs text-[#5C7B99] mt-1 leading-relaxed">{svc.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1D8FE0]">
                  <span>Explore Module</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
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


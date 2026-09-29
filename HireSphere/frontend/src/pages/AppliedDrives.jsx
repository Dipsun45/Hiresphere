import React, { useState, useEffect } from "react";

export default function AppliedDrives({ userId, onLogout, apiBase = "http://localhost:8085", onNavigate }) {
  const [activeTab, setActiveTab] = useState("My Applications");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  const [withdrawingId, setWithdrawingId] = useState(null);

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

  // Fetch applications for THIS specific logged-in user from MySQL
  const fetchUserApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/drive/applications?userId=${encodeURIComponent(userId || "")}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.applications) {
        setApplications(data.applications);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error("[AppliedDrives] Error fetching user applications:", err);
      showToast("Could not connect to MySQL database server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserApplications();
  }, [apiBase, userId]);

  // Handle application withdrawal (Delete from MySQL)
  const handleWithdraw = async (id, companyName) => {
    if (!window.confirm(`Are you sure you want to withdraw your application for ${companyName}?`)) {
      return;
    }

    setWithdrawingId(id);
    try {
      const res = await fetch(`${apiBase}/api/drive/applications?id=${id}&userId=${encodeURIComponent(userId || "")}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Application for ${companyName} withdrawn successfully.`);
        setApplications((prev) => prev.filter((a) => a.id !== id));
      } else {
        showToast(data.message || "Failed to withdraw application.");
      }
    } catch (err) {
      console.error("[AppliedDrives] Error withdrawing application:", err);
      showToast("Error withdrawing application from database.");
    } finally {
      setWithdrawingId(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === "All" || app.applicationStatus === statusFilter;
    const matchesSearch =
      app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
        {/* Hero Header */}
        <div
          className="rounded-3xl p-6 sm:p-10 relative overflow-hidden text-white"
          style={{
            background: "linear-gradient(135deg, #0B3D91 0%, #155DC1 55%, #1D8FE0 100%)",
            boxShadow: "0 25px 60px rgba(11,61,145,0.3)",
          }}
        >
          <div className="relative z-10 space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-sky-200">
              📋 CANDIDATE DASHBOARD
            </span>
            <h1 className="font-[Sora] text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              My Submitted Recruitment Drive Applications
            </h1>
            <p className="text-sky-100 text-sm sm:text-base max-w-2xl leading-relaxed">
              Viewing active drive application records saved in MySQL database for user:{" "}
              <span className="font-extrabold underline text-white">{userId}</span>
            </p>
            <div className="pt-2 flex items-center gap-4">
              <span className="bg-white/20 px-4 py-2 rounded-xl text-xs font-bold border border-white/30">
                Total Applications: {applications.length}
              </span>
              <button
                onClick={fetchUserApplications}
                className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/30 transition flex items-center gap-1.5"
              >
                🔄 Refresh Applications List
              </button>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3.5 top-3 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Search by applied company or role title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#0B3D91] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {["All", "Submitted", "Under Review", "Shortlisted"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  statusFilter === st
                    ? "bg-[#0B3D91] text-white shadow"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-[#0B3D91] rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">Loading applications from MySQL database...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-md text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0B3D91] flex items-center justify-center text-3xl font-bold mx-auto">
              📁
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 font-[Sora]">
              No Drive Applications Found
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              {searchQuery || statusFilter !== "All"
                ? "No applications match your current search or status filter."
                : "You have not submitted any recruitment drive applications yet. Explore the 20 IT drives available and apply now!"}
            </p>
            <button
              onClick={() => handleNavClick("Recruitment Drive")}
              className="px-6 py-3 rounded-2xl bg-[#0B3D91] hover:bg-[#155DC1] text-white font-extrabold text-xs transition shadow active:scale-95 inline-flex items-center gap-2"
            >
              Explore 20 IT Recruitment Drives →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md hover:shadow-lg transition space-y-6"
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black px-3 py-1 rounded-xl bg-blue-100 text-[#0B3D91] font-[Sora]">
                        {app.companyName}
                      </span>
                      <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800">
                        Status: {app.applicationStatus || "Submitted"}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Applied On: {app.appliedAt || "Recent"}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 font-[Sora] pt-2">
                      {app.jobTitle}
                    </h3>
                  </div>

                  <div className="shrink-0">
                    <button
                      onClick={() => handleWithdraw(app.id, app.companyName)}
                      disabled={withdrawingId === app.id}
                      className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition active:scale-95 flex items-center gap-1.5"
                    >
                      🗑️ {withdrawingId === app.id ? "Withdrawing..." : "Withdraw Application"}
                    </button>
                  </div>
                </div>

                {/* Application Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                      Candidate Name
                    </span>
                    <div className="font-bold text-slate-900 text-sm">{app.fullName}</div>
                    <div className="text-slate-500 font-medium">User ID: {app.userId}</div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                      Contact Details
                    </span>
                    <div className="font-semibold text-blue-600 truncate">📧 {app.email}</div>
                    <div className="text-slate-700 font-semibold">📞 {app.phone}</div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                      Education & Experience
                    </span>
                    <div className="font-bold text-slate-800">{app.qualification}</div>
                    <div className="text-emerald-700 font-bold">Exp: {app.experience}</div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                      Resume & Portfolio
                    </span>
                    {app.resumeUrl ? (
                      app.resumeUrl.startsWith("data:application/pdf") ? (
                        <a
                          href={app.resumeUrl}
                          download={`${app.fullName.replace(/\s+/g, "_")}_Resume.pdf`}
                          className="font-bold text-emerald-600 hover:underline block truncate pt-0.5"
                        >
                          📄 Download PDF Resume ↓
                        </a>
                      ) : (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-blue-600 hover:underline block truncate pt-0.5"
                        >
                          🔗 View Resume Link →
                        </a>
                      )
                    ) : (
                      <div className="text-slate-400 italic">No URL/File provided</div>
                    )}
                  </div>
                </div>

                {/* Skills & Cover Letter */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-600">Applied Skills:</span>
                    {app.skills.split(",").map((sk, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0B3D91] border border-blue-100"
                      >
                        {sk.trim()}
                      </span>
                    ))}
                  </div>

                  {app.coverLetter && (
                    <div className="text-xs bg-sky-50/60 p-3 rounded-2xl border border-sky-100 text-slate-700 italic">
                      "<span className="font-bold">Cover Note:</span> {app.coverLetter}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

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

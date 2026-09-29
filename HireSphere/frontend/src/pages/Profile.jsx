import { useState, useEffect } from "react";

/**
 * HireSphere - Candidate Profile Page
 * Full-stack implementation connected to Java Backend Port 8085 & MySQL `profile` table.
 * Features:
 * - Cookie Session Isolation: Only displays the profile belonging to the currently logged-in user.
 * - Auto Fetch: Checks MySQL database on mount.
 * - Form Hiding: If profile exists in MySQL, the entry form is hidden and the Profile Details View is displayed.
 * - Edit Option: Opens Edit Modal with blurred background backdrop (`backdrop-blur-md bg-black/50`), allowing profile updates.
 * - Delete Option: Deletes the candidate profile record from MySQL database with confirmation prompt.
 * - Initial Entry Form: Form matching design (photo 1) for new candidate profile creation.
 */
export default function Profile({ userId, onLogout, apiBase = "http://localhost:8085", onNavigate }) {
  const [activeTab, setActiveTab] = useState("Profile");
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [savedProfile, setSavedProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    phoneNo: "",
    address: "",
    dob: "",
    gender: "Male",
    tenthPercentage: "",
    tenthYear: "2018",
    twelfthPercentage: "",
    twelfthYear: "2020",
    graduationDegree: "",
    graduationMajor: "Computer Science",
    graduationCgpaPercentage: "",
    graduationYear: "2024",
    skills: "",
    favoriteTechnologies: "",
    language: "",
    githubProfileUrl: "",
    linkedinProfileUrl: "",
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeFileSize, setResumeFileSize] = useState("");

  const initials = userId
    ? userId.substring(0, 2).toUpperCase()
    : "HS";

  // Fetch logged-in user's profile from MySQL on mount
  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${apiBase}/api/profile`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.exists && data.profile) {
        setSavedProfile(data.profile);
        setHasProfile(true);
        populateFormData(data.profile);
      } else {
        setHasProfile(false);
        setSavedProfile(null);
      }
    } catch (err) {
      console.error("[Profile] Error fetching profile:", err);
      setHasProfile(false);
    } finally {
      setFetching(false);
    }
  };

  const populateFormData = (p) => {
    setFormData({
      fullName: p.fullName || "",
      emailAddress: p.emailAddress || "",
      phoneNo: p.phoneNo || "",
      address: p.address || "",
      dob: p.dob || "",
      gender: p.gender || "Male",
      tenthPercentage: p.tenthPercentage || "",
      tenthYear: p.tenthYear || "2018",
      twelfthPercentage: p.twelfthPercentage || "",
      twelfthYear: p.twelfthYear || "2020",
      graduationDegree: p.graduationDegree || "",
      graduationMajor: p.graduationMajor || "Computer Science",
      graduationCgpaPercentage: p.graduationCgpaPercentage || "",
      graduationYear: p.graduationYear || "2024",
      skills: p.skills || "",
      favoriteTechnologies: p.favoriteTechnologies || "",
      language: p.language || "",
      githubProfileUrl: p.githubProfileUrl || "",
      linkedinProfileUrl: p.linkedinProfileUrl || "",
    });
    if (p.profilePhoto) {
      setPhotoPreview(p.profilePhoto);
    }
    if (p.resumePdfPath) {
      setResumeFileName(p.resumePdfPath);
      setResumeFileSize("Attached");
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFileName(file.name);
      setResumeFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
      
      const reader = new FileReader();
      reader.onloadend = () => {
        // Store the base64 string directly in a state so we can save it
        setFormData((prev) => ({ ...prev, resumeBase64: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit/Save profile to MySQL database
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      profilePhoto: photoPreview || "",
      resumePdfPath: formData.resumeBase64 || savedProfile?.resumePdfPath || "",
    };

    try {
      const res = await fetch(`${apiBase}/api/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.profile) {
        setSavedProfile(data.profile);
        setHasProfile(true);
        setIsEditing(false);
        showToast("Profile saved to MySQL database successfully!");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        alert(data.message || "Failed to save profile.");
      }
    } catch (err) {
      console.error("[Profile] Error saving profile:", err);
      alert("Cannot connect to Java backend on port 8085. Ensure MySQL and Java server are running.");
    } finally {
      setLoading(false);
    }
  };

  // Delete profile from MySQL database
  const handleDeleteProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/profile`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setHasProfile(false);
        setSavedProfile(null);
        setShowDeleteConfirm(false);
        setFormData({
          fullName: "",
          emailAddress: "",
          phoneNo: "",
          address: "",
          dob: "",
          gender: "Male",
          tenthPercentage: "",
          tenthYear: "2018",
          twelfthPercentage: "",
          twelfthYear: "2020",
          graduationDegree: "",
          graduationMajor: "Computer Science",
          graduationCgpaPercentage: "",
          graduationYear: "2024",
          skills: "",
          favoriteTechnologies: "",
          language: "",
          githubProfileUrl: "",
          linkedinProfileUrl: "",
        });
        setPhotoPreview(null);
        setPhotoName("");
        setResumeFileName("");
        showToast("Profile deleted from MySQL database.");
      } else {
        alert(data.message || "Failed to delete profile.");
      }
    } catch (err) {
      console.error("[Profile] Error deleting profile:", err);
      alert("Error deleting profile from database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FAFF] flex flex-col font-[Inter] relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0F2A47] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#1D8FE0]/40 flex items-center gap-3 animate-bounce">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs">✓</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header
        style={{
          background: "linear-gradient(135deg, #0B3D91 0%, #155DC1 50%, #1D8FE0 100%)",
          boxShadow: "0 4px 25px rgba(11,61,145,0.35)",
        }}
        className="sticky top-0 z-40 px-4 sm:px-8 py-3.5"
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

          {/* Header Link Options */}
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

      {/* Main Body Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* Banner Header */}
        <div
          className="rounded-3xl p-6 sm:p-8 relative overflow-hidden text-white"
          style={{
            background: "linear-gradient(135deg, #0B3D91 0%, #155DC1 60%, #1D8FE0 100%)",
            boxShadow: "0 20px 50px rgba(11,61,145,0.25)",
          }}
        >
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-semibold mb-2">
                <span className="w-2 h-2 rounded-full bg-sky-300 animate-pulse" />
                Authenticated Session: <span className="font-bold text-white">{userId}</span>
              </div>
              <h1 className="font-[Sora] text-3xl sm:text-4xl font-extrabold tracking-tight">
                Candidate Profile Portal
              </h1>
              <p className="text-[#DCEEFF] text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Persistent MySQL database record tied to your login account.
              </p>
            </div>
            <button
              onClick={() => handleNavClick("Dashboard")}
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-xs sm:text-sm transition shrink-0"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Loading Spinner during initial fetch */}
        {fetching ? (
          <div className="bg-white rounded-3xl p-12 border border-[#E8F2FC] text-center space-y-3">
            <div className="w-10 h-10 border-4 border-sky-200 border-t-[#1D8FE0] rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-[#5C7B99]">Loading your candidate profile from MySQL database...</p>
          </div>
        ) : hasProfile && savedProfile ? (

          /* ========================================================================= */
          /* DISPLAY FILLED DETAILS VIEW (AFTER FORM SUBMISSION / PERSISTED IN MYSQL)   */
          /* ========================================================================= */
          <div className="space-y-8 animate-fadeIn">
            
            {/* Action Header Card with EDIT and DELETE buttons */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8F2FC] shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                  ✓
                </div>
                <div>
                  <h2 className="font-[Sora] text-lg font-bold text-[#0F2A47]">
                    Profile Active in MySQL Database
                  </h2>
                  <p className="text-xs text-[#5C7B99]">
                    Record linked to user: <span className="font-bold text-[#0B3D91]">{userId}</span>
                  </p>
                </div>
              </div>

              {/* Edit & Delete Action Option Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#1D8FE0] hover:bg-[#155DC1] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition flex items-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Option
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs sm:text-sm transition flex items-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Delete Option
                </button>
              </div>
            </div>

            {/* Display Card 1: Avatar & Personal Info */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8F2FC] shadow-xl space-y-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 pb-8 border-b border-[#F0F6FC]">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-gradient-to-tr from-[#0B3D91] via-[#155DC1] to-[#1D8FE0] flex items-center justify-center overflow-hidden text-white font-black text-4xl tracking-wider ring-4 ring-[#1D8FE0]/20 shrink-0">
                  {savedProfile.profilePhoto ? (
                    <img src={savedProfile.profilePhoto} alt="Profile Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>

                <div className="text-center sm:text-left space-y-2.5 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h2 className="font-[Sora] text-3xl font-black text-[#0F2A47]">
                      {savedProfile.fullName || userId}
                    </h2>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-[#1D8FE0] text-xs font-bold border border-blue-200 inline-block self-center sm:self-auto">
                      {savedProfile.gender || "Candidate"}
                    </span>
                  </div>

                  <p className="text-sm text-[#5C7B99] font-medium flex items-center justify-center sm:justify-start gap-2">
                    <span>✉️ {savedProfile.emailAddress || "Not provided"}</span>
                    <span>·</span>
                    <span>📞 {savedProfile.phoneNo || "Not provided"}</span>
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <span className="px-3 py-1 rounded-lg bg-[#F4FAFF] text-[#0F2A47] text-xs font-semibold border border-[#E2EEF9]">
                      📅 DOB: {savedProfile.dob || "N/A"}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-[#F4FAFF] text-[#0F2A47] text-xs font-semibold border border-[#E2EEF9]">
                      📍 Address: {savedProfile.address || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Display Grid 2: Academic Qualifications */}
              <div>
                <h3 className="font-[Sora] text-base font-bold text-[#0F2A47] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1D8FE0]" />
                  Academic Qualifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] text-center">
                    <p className="text-xs text-[#5C7B99] font-bold">10th Percentage</p>
                    <p className="font-[Sora] text-xl font-extrabold text-[#0B3D91] mt-1">{savedProfile.tenthPercentage || "N/A"}</p>
                  </div>
                  <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] text-center">
                    <p className="text-xs text-[#5C7B99] font-bold">12th Percentage</p>
                    <p className="font-[Sora] text-xl font-extrabold text-[#155DC1] mt-1">{savedProfile.twelfthPercentage || "N/A"}</p>
                  </div>
                  <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] text-center">
                    <p className="text-xs text-[#5C7B99] font-bold">Graduation Degree</p>
                    <p className="font-[Sora] text-sm font-extrabold text-[#0F2A47] mt-1 truncate">{savedProfile.graduationDegree || "N/A"}</p>
                  </div>
                  <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] text-center">
                    <p className="text-xs text-[#5C7B99] font-bold">Graduation CGPA / %</p>
                    <p className="font-[Sora] text-xl font-extrabold text-emerald-600 mt-1">{savedProfile.graduationCgpaPercentage || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Display Grid 3: Skills & Technical Portfolio */}
              <div className="space-y-3 pt-2">
                <h3 className="font-[Sora] text-base font-bold text-[#0F2A47] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1D8FE0]" />
                  Skills & Technical Portfolio
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                    <p className="text-xs font-bold text-[#5C7B99] mb-1.5">Technical Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {savedProfile.skills ? (
                        savedProfile.skills.split(",").map((s, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-100 text-[#0B3D91] text-xs font-bold">
                            {s.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">None specified</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                    <p className="text-xs font-bold text-[#5C7B99] mb-1">Favourite Field & Tech</p>
                    <p className="text-sm font-bold text-[#0F2A47]">{savedProfile.favoriteTechnologies || "N/A"}</p>
                    <p className="text-xs font-semibold text-[#5C7B99] mt-2">Languages: <span className="text-[#0F2A47]">{savedProfile.language || "N/A"}</span></p>
                  </div>
                </div>

                {/* Portfolio Links */}
                {(savedProfile.githubProfileUrl || savedProfile.linkedinProfileUrl) && (
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {savedProfile.githubProfileUrl && (
                      <a href={savedProfile.githubProfileUrl} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center gap-2">
                        <span>🔗</span> GitHub Profile
                      </a>
                    )}
                    {savedProfile.linkedinProfileUrl && (
                      <a href={savedProfile.linkedinProfileUrl} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-[#0A66C2] text-white text-xs font-bold hover:bg-[#084e96] transition flex items-center gap-2">
                        <span>🌐</span> LinkedIn Profile
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Display 4: Resume PDF Attachment */}
              <div className="pt-2 border-t border-[#F0F6FC]">
                <div className="bg-[#EFF8FF] p-4 rounded-2xl border border-sky-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1D8FE0] text-white flex items-center justify-center font-bold">
                      📄
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0F2A47]">
                        {savedProfile.resumePdfPath && savedProfile.resumePdfPath.startsWith('data:') ? "Resume.pdf" : (savedProfile.resumePdfPath || "Resume PDF Attached")}
                      </p>
                      <p className="text-[11px] text-[#5C7B99]">Stored in HireSphere MySQL database record</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                      ✓ Verified
                    </span>
                    {savedProfile.resumePdfPath && (
                      savedProfile.resumePdfPath.startsWith('data:') ? (
                        <a 
                          href={savedProfile.resumePdfPath} 
                          download={`${savedProfile.fullName || 'Candidate'}_Resume.pdf`}
                          className="px-4 py-1.5 rounded-full bg-[#1D8FE0] hover:bg-[#157ac2] text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          Download
                        </a>
                      ) : (
                        <button 
                          onClick={() => alert("Resume file is not available for download because it was saved before the file upload fix. Please click 'Edit Profile', re-upload your resume, and save to enable downloading.")}
                          className="px-4 py-1.5 rounded-full bg-[#1D8FE0] hover:bg-[#157ac2] text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          Download
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>
        ) : (

          /* ========================================================================= */
          /* INITIAL ENTRY FORM (WHEN NO PROFILE EXISTS FOR USER IN MYSQL DATABASE)      */
          /* ========================================================================= */
          <div className="bg-white rounded-3xl border border-[#E8F2FC] shadow-xl p-8 sm:p-12 space-y-8 animate-fadeIn">
            
            {/* Header Title Section inside Card */}
            <div className="border-b border-[#F0F6FC] pb-6">
              <h2 className="font-[Sora] text-2xl sm:text-3xl font-extrabold text-[#0F2A47]">
                Welcome back
              </h2>
              <p className="text-[#5C7B99] text-xs sm:text-sm mt-1">
                Sign in to continue to your HireSphere dashboard and manage your profile information.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-8">
              
              {/* Profile Photo Upload Section */}
              <div className="bg-gradient-to-r from-[#EFF8FF] via-[#F4FAFF] to-[#EFF8FF] p-6 sm:p-8 rounded-3xl border border-[#D4E6F7] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group shrink-0">
                    <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg bg-gradient-to-tr from-[#0B3D91] via-[#155DC1] to-[#1D8FE0] flex items-center justify-center overflow-hidden text-white font-black text-3xl tracking-wider ring-4 ring-[#1D8FE0]/20">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>
                    <label
                      htmlFor="photo-file"
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#1D8FE0] text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-[#155DC1] hover:scale-110 transition ring-2 ring-white"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" />
                      </svg>
                    </label>
                    <input id="photo-file" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </div>

                  <div className="text-center sm:text-left space-y-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h3 className="text-base font-extrabold text-[#0F2A47]">Profile Photo</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#1D8FE0]">JPG / PNG</span>
                    </div>
                    <p className="text-xs text-[#5C7B99]">Upload a clear portrait picture (JPG, PNG). Max size 5MB.</p>
                    {photoName && <p className="text-xs font-bold text-emerald-600">✓ Selected: {photoName}</p>}
                  </div>
                </div>

                <label htmlFor="photo-file" className="px-5 py-2.5 rounded-xl bg-white border border-[#1D8FE0]/30 hover:border-[#1D8FE0] text-[#1D8FE0] font-bold text-xs sm:text-sm shadow-sm hover:bg-[#1D8FE0] hover:text-white transition cursor-pointer shrink-0">
                  Choose Photo
                </label>
              </div>

              {/* Render Form Inputs */}
              {renderFormFields(formData, handleChange, handleResumeChange, resumeFileName, resumeFileSize)}

              {/* Submit Profile Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: "linear-gradient(135deg, #1D8FE0 0%, #155DC1 100%)",
                    boxShadow: "0 10px 25px rgba(29, 143, 224, 0.35)",
                  }}
                  className="w-full py-4 px-6 rounded-2xl text-white font-bold text-base hover:opacity-95 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving to MySQL Database...</span>
                    </>
                  ) : (
                    <span>Submit Profile</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* EDIT PROFILE MODAL DIALOG WITH BACKGROUND BLUR (PHOTO 1 DESIGN)           */}
      {/* ========================================================================= */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Blurred Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-md transition-all"
            onClick={() => setIsEditing(false)}
          />

          {/* Modal Content Card */}
          <div className="relative bg-white rounded-3xl max-w-6xl w-full p-8 sm:p-12 shadow-2xl border border-[#E8F2FC] max-h-[90vh] overflow-y-auto z-10 space-y-8 animate-scaleIn">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F0F6FC]">
              <div>
                <h2 className="font-[Sora] text-2xl font-extrabold text-[#0F2A47]">
                  Edit Candidate Profile
                </h2>
                <p className="text-xs text-[#5C7B99] mt-0.5">
                  Update your profile details stored in MySQL database for <span className="font-bold text-[#0B3D91]">{userId}</span>
                </p>
              </div>

              <button
                onClick={() => setIsEditing(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F2A47] font-bold flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveProfile} className="space-y-6">
              
              {/* Photo Upload inside Modal */}
              <div className="bg-[#F4FAFF] p-4 rounded-2xl border border-[#E2EEF9] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#1D8FE0] text-white flex items-center justify-center font-bold text-xl overflow-hidden">
                    {photoPreview ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" /> : initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0F2A47]">Profile Photo</p>
                    <p className="text-xs text-[#5C7B99]">Change your headshot image</p>
                  </div>
                </div>
                <label htmlFor="edit-photo-file" className="px-4 py-2 rounded-xl bg-white border border-[#1D8FE0] text-[#1D8FE0] font-bold text-xs cursor-pointer hover:bg-[#1D8FE0] hover:text-white transition">
                  Change Photo
                </label>
                <input id="edit-photo-file" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </div>

              {/* Render Form Inputs */}
              {renderFormFields(formData, handleChange, handleResumeChange, resumeFileName, resumeFileSize)}

              {/* Modal Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#F0F6FC]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F2A47] font-bold text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: "linear-gradient(135deg, #1D8FE0 0%, #155DC1 100%)",
                  }}
                  className="px-8 py-3 rounded-xl text-white font-bold text-sm hover:opacity-95 shadow-md transition"
                >
                  {loading ? "Updating MySQL..." : "Update Profile"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL                                                  */}
      {/* ========================================================================= */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl z-10 border border-red-100">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-2xl mx-auto">
              ⚠️
            </div>
            <div>
              <h3 className="font-[Sora] text-lg font-bold text-[#0F2A47]">
                Delete Candidate Profile?
              </h3>
              <p className="text-xs text-[#5C7B99] mt-1 leading-relaxed">
                This will permanently delete your profile record from the MySQL database table. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProfile}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                {loading ? "Deleting..." : "Yes, Delete Profile"}
              </button>
            </div>
          </div>
        </div>
      )}

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

const renderFormFields = (formData, handleChange, handleResumeChange, resumeFileName, resumeFileSize) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-[#0F2A47] mb-2">Full Name</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] focus:border-transparent transition text-sm" placeholder="e.g. John Doe" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#0F2A47] mb-2">Email Address</label>
          <input type="email" name="emailAddress" value={formData.emailAddress} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] focus:border-transparent transition text-sm" placeholder="john@example.com" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-bold text-[#0F2A47] mb-2">Phone Number</label>
          <input type="tel" name="phoneNo" value={formData.phoneNo} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] focus:border-transparent transition text-sm" placeholder="+1 234 567 8900" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#0F2A47] mb-2">Date of Birth</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] focus:border-transparent transition text-sm" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#0F2A47] mb-2">Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] focus:border-transparent transition text-sm appearance-none">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-[#0F2A47] mb-2">Address</label>
        <textarea name="address" value={formData.address} onChange={handleChange} required rows={2} className="w-full px-4 py-3 rounded-xl border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] focus:border-transparent transition text-sm resize-none" placeholder="123 Main St, City, Country" />
      </div>

      <div className="pt-4 border-t border-[#F0F6FC]">
        <h3 className="font-[Sora] text-base font-bold text-[#0F2A47] mb-4">Academic Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-xs font-bold text-[#5C7B99] mb-2">10th %</label>
            <input type="text" name="tenthPercentage" value={formData.tenthPercentage} onChange={handleChange} required className="w-full px-3 py-2.5 rounded-lg border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] transition text-sm" placeholder="e.g. 85.5" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5C7B99] mb-2">10th Year</label>
            <input type="text" name="tenthYear" value={formData.tenthYear} onChange={handleChange} required className="w-full px-3 py-2.5 rounded-lg border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] transition text-sm" placeholder="2018" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5C7B99] mb-2">12th %</label>
            <input type="text" name="twelfthPercentage" value={formData.twelfthPercentage} onChange={handleChange} required className="w-full px-3 py-2.5 rounded-lg border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] transition text-sm" placeholder="e.g. 88.0" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5C7B99] mb-2">12th Year</label>
            <input type="text" name="twelfthYear" value={formData.twelfthYear} onChange={handleChange} required className="w-full px-3 py-2.5 rounded-lg border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] transition text-sm" placeholder="2020" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className="block text-xs font-bold text-[#5C7B99] mb-2">Degree</label>
          <input type="text" name="graduationDegree" value={formData.graduationDegree} onChange={handleChange} required className="w-full px-3 py-2.5 rounded-lg border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] transition text-sm" placeholder="B.Tech" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#5C7B99] mb-2">Major</label>
          <input type="text" name="graduationMajor" value={formData.graduationMajor} onChange={handleChange} required className="w-full px-3 py-2.5 rounded-lg border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] transition text-sm" placeholder="Computer Science" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#5C7B99] mb-2">CGPA / %</label>
          <input type="text" name="graduationCgpaPercentage" value={formData.graduationCgpaPercentage} onChange={handleChange} required className="w-full px-3 py-2.5 rounded-lg border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] transition text-sm" placeholder="e.g. 8.5" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#5C7B99] mb-2">Grad Year</label>
          <input type="text" name="graduationYear" value={formData.graduationYear} onChange={handleChange} required className="w-full px-3 py-2.5 rounded-lg border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] transition text-sm" placeholder="2024" />
        </div>
      </div>

      <div className="pt-4 border-t border-[#F0F6FC]">
        <h3 className="font-[Sora] text-base font-bold text-[#0F2A47] mb-4">Skills & Profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-[#0F2A47] mb-2">Technical Skills (comma separated)</label>
            <input type="text" name="skills" value={formData.skills} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] focus:border-transparent transition text-sm" placeholder="React, Node.js, Python" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#0F2A47] mb-2">Favorite Technologies</label>
            <input type="text" name="favoriteTechnologies" value={formData.favoriteTechnologies} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] focus:border-transparent transition text-sm" placeholder="Machine Learning, Web3" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          <div>
            <label className="block text-sm font-bold text-[#0F2A47] mb-2">Languages</label>
            <input type="text" name="language" value={formData.language} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] focus:border-transparent transition text-sm" placeholder="English, Spanish" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#0F2A47] mb-2">GitHub URL</label>
            <input type="url" name="githubProfileUrl" value={formData.githubProfileUrl} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] focus:border-transparent transition text-sm" placeholder="https://github.com/..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#0F2A47] mb-2">LinkedIn URL</label>
            <input type="url" name="linkedinProfileUrl" value={formData.linkedinProfileUrl} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] focus:border-transparent transition text-sm" placeholder="https://linkedin.com/in/..." />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#F0F6FC]">
        <h3 className="font-[Sora] text-base font-bold text-[#0F2A47] mb-4">Resume Upload</h3>
        <div className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-[#D4E6F7] rounded-2xl">
          <div>
            <p className="text-sm font-bold text-[#0F2A47]">Upload PDF Resume</p>
            {resumeFileName ? (
              <p className="text-xs text-emerald-600 font-bold mt-1">✓ {resumeFileName} ({resumeFileSize})</p>
            ) : (
              <p className="text-xs text-[#5C7B99] mt-1">Max size: 5MB</p>
            )}
          </div>
          <label className="px-4 py-2 rounded-xl bg-white border border-[#D4E6F7] hover:border-[#1D8FE0] text-[#0F2A47] font-bold text-xs cursor-pointer hover:text-[#1D8FE0] transition shadow-sm">
            Select File
            <input type="file" accept=".pdf" onChange={handleResumeChange} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
};


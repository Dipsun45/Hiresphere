import { useState, useEffect } from "react";

/**
 * HireSphere - Contact Us / User Message Page
 * Matches exact design language of Profile.jsx and Home.jsx
 * Allows users to submit inquiries, profile update requests, and view sent message history.
 */
export default function Message({ userId, onLogout, apiBase, onNavigate }) {
  const [activeTab, setActiveTab] = useState("Contact Us");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [fetchingMessages, setFetchingMessages] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: userId.includes("@") ? userId : "",
    phoneNo: "",
    subject: "Profile Details Update Request",
    messageContent: "",
  });

  const initials = userId
    ? userId.substring(0, 2).toUpperCase()
    : "HS";

  const navLinks = [
    { name: "Dashboard" },
    { name: "Profile" },
    { name: "Recruitment Drive" },
    { name: "My Applications" },
    { name: "Company Profile" },
    { name: "Projects" },
    { name: "Contact Us"  },
  ];

  // Show temporary toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch candidate profile to pre-fill name/email/phone if available
  useEffect(() => {
    fetch(`${apiBase}/api/profile`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setFormData((prev) => ({
            ...prev,
            fullName: data.profile.fullName || prev.fullName,
            emailAddress: data.profile.emailAddress || prev.emailAddress,
            phoneNo: data.profile.phoneNo || prev.phoneNo,
          }));
        }
      })
      .catch((err) => console.error("[Message] Error pre-filling profile info:", err));
  }, [apiBase]);

  // Fetch existing messages sent by this user
  const fetchUserMessages = () => {
    setFetchingMessages(true);
    fetch(`${apiBase}/api/message`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.messages) {
          setMessages(data.messages);
        }
      })
      .catch((err) => console.error("[Message] Error fetching messages:", err))
      .finally(() => setFetchingMessages(false));
  };

  useEffect(() => {
    fetchUserMessages();
  }, [apiBase]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit message to backend MySQL database
  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    if (!formData.messageContent.trim()) {
      alert("Please enter your message content before submitting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        showToast("Your message has been submitted and saved to MySQL!");
        setFormData((prev) => ({
          ...prev,
          messageContent: "",
        }));
        fetchUserMessages();
      } else {
        alert(data.message || "Failed to send message.");
      }
    } catch (err) {
      console.error("[Message] Error submitting message:", err);
      alert("Cannot connect to Java backend on port 8085.");
    } finally {
      setLoading(false);
    }
  };

  // Delete message
  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message record?")) return;

    try {
      const res = await fetch(`${apiBase}/api/message?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        showToast("Message deleted successfully.");
        fetchUserMessages();
      } else {
        alert(data.message || "Failed to delete message.");
      }
    } catch (err) {
      console.error("[Message] Error deleting message:", err);
      alert("Error deleting message from database.");
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
                Contact Us & Message Portal
              </h1>
              <p className="text-[#DCEEFF] text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Submit queries, profile correction requests, or support messages directly to the HireSphere administration team.
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

        {/* Message Form Card */}
        <div className="bg-white rounded-3xl border border-[#E8F2FC] shadow-xl p-8 sm:p-12 space-y-8 animate-fadeIn">
          
          <div className="border-b border-[#F0F6FC] pb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-[Sora] text-2xl sm:text-3xl font-extrabold text-[#0F2A47]">
                Send a Message
              </h2>
              <p className="text-[#5C7B99] text-xs sm:text-sm mt-1">
                Fill in the details below. All queries are persisted in our MySQL database table for admin review.
              </p>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-sky-50 text-[#1D8FE0] text-xs font-bold border border-sky-200">
              ✉️ Admin Support
            </span>
          </div>

          <form onSubmit={handleSubmitMessage} className="space-y-8">
            
            {/* Form Fields Grid */}
            <div className="space-y-6">
              
              {/* Full Name & Email Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#0F2A47] mb-2">Full Name <span className="text-red-500">*</span></label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#1D8FE0", pointerEvents: "none", zIndex: 10 }}>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      style={{ paddingLeft: "52px", paddingRight: "16px" }}
                      className="w-full rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] py-3.5 text-sm font-medium text-[#0F2A47] placeholder-[#94A3B8] outline-none focus:border-[#1D8FE0] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0F2A47] mb-2">Email Address <span className="text-red-500">*</span></label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#1D8FE0", pointerEvents: "none", zIndex: 10 }}>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                    </div>
                    <input
                      type="email"
                      name="emailAddress"
                      required
                      value={formData.emailAddress}
                      onChange={handleChange}
                      placeholder="e.g. alex.johnson@example.com"
                      style={{ paddingLeft: "52px", paddingRight: "16px" }}
                      className="w-full rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] py-3.5 text-sm font-medium text-[#0F2A47] placeholder-[#94A3B8] outline-none focus:border-[#1D8FE0] focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* Phone No & Subject Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#0F2A47] mb-2">Phone No <span className="text-red-500">*</span></label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#1D8FE0", pointerEvents: "none", zIndex: 10 }}>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                    </div>
                    <input
                      type="tel"
                      name="phoneNo"
                      required
                      value={formData.phoneNo}
                      onChange={handleChange}
                      placeholder="Enter your contact phone number"
                      style={{ paddingLeft: "52px", paddingRight: "16px" }}
                      className="w-full rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] py-3.5 text-sm font-medium text-[#0F2A47] placeholder-[#94A3B8] outline-none focus:border-[#1D8FE0] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0F2A47] mb-2">Subject / Category <span className="text-red-500">*</span></label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#1D8FE0", pointerEvents: "none", zIndex: 10 }}>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                    </div>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      style={{ paddingLeft: "52px", paddingRight: "36px" }}
                      className="w-full rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] py-3.5 text-sm font-medium text-[#0F2A47] outline-none appearance-none cursor-pointer focus:border-[#1D8FE0] focus:bg-white transition"
                    >
                      <option value="Profile Details Update Request">Profile Details Update Request</option>
                      <option value="General Inquiry & Feedback">General Inquiry & Feedback</option>
                      <option value="Technical Support & System Bug">Technical Support & System Bug</option>
                      <option value="Recruitment Drive & Campus Interview Query">Recruitment Drive & Campus Interview Query</option>
                      <option value="Other Inquiry">Other Inquiry</option>
                    </select>
                    <div style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#8EA8C3", pointerEvents: "none" }}>▼</div>
                  </div>
                </div>
              </div>

              {/* Message Content Area */}
              <div>
                <label className="block text-sm font-bold text-[#0F2A47] mb-2">Message Content <span className="text-red-500">*</span></label>
                <div style={{ position: "relative", display: "flex", alignItems: "flex-start" }}>
                  <div style={{ position: "absolute", left: "14px", top: "16px", color: "#1D8FE0", pointerEvents: "none", zIndex: 10 }}>
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0h-2v2h2V9z" clipRule="evenodd" /></svg>
                  </div>
                  <textarea
                    name="messageContent"
                    rows="5"
                    required
                    value={formData.messageContent}
                    onChange={handleChange}
                    placeholder="Describe your query, profile update request, or details you wish to communicate to HireSphere..."
                    style={{ paddingLeft: "52px", paddingTop: "14px", paddingRight: "16px" }}
                    className="w-full rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] py-3.5 text-sm font-medium text-[#0F2A47] placeholder-[#94A3B8] outline-none resize-y focus:border-[#1D8FE0] focus:bg-white transition"
                  />
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <div>
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
                    <span>Submitting Message to MySQL...</span>
                  </>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Previous Sent Messages History Section */}
        <div className="bg-white rounded-3xl border border-[#E8F2FC] shadow-xl p-8 sm:p-12 space-y-6">
          <div className="border-b border-[#F0F6FC] pb-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-[Sora] text-xl font-extrabold text-[#0F2A47]">
                Your Sent Messages History
              </h3>
              <p className="text-xs text-[#5C7B99] mt-0.5">
                Records of inquiries and messages submitted from account: <span className="font-bold text-[#0B3D91]">{userId}</span>
              </p>
            </div>
            <button
              onClick={fetchUserMessages}
              className="px-3.5 py-1.5 rounded-xl bg-[#F4FAFF] hover:bg-sky-100 text-[#1D8FE0] font-bold text-xs border border-sky-200 transition"
            >
              🔄 Refresh List
            </button>
          </div>

          {fetchingMessages ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-8 h-8 border-4 border-sky-200 border-t-[#1D8FE0] rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-[#5C7B99]">Loading your message history from MySQL...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="py-8 text-center bg-[#F8FAFC] rounded-2xl border border-dashed border-[#CBD5E1] p-6">
              <span className="text-3xl block mb-2">📬</span>
              <p className="text-sm font-bold text-[#0F2A47]">No Messages Submitted Yet</p>
              <p className="text-xs text-[#5C7B99] mt-1">Fill out the form above to send your first message or support query.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 hover:border-sky-300 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-[#0B3D91] text-xs font-bold">
                        {msg.subject}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">
                        ✓ {msg.status || "Pending"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-medium text-[#5C7B99]">
                        📅 {msg.createdAt || "Recently"}
                      </span>
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-[#5C7B99] space-y-1">
                    <p><span className="font-bold text-[#0F2A47]">From:</span> {msg.fullName} ({msg.emailAddress}) {msg.phoneNo ? `· 📞 ${msg.phoneNo}` : ""}</p>
                    <div className="mt-2 bg-white p-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0F2A47] whitespace-pre-wrap leading-relaxed">
                      {msg.messageContent}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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


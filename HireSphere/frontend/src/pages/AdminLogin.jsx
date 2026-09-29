import { useState } from "react";

/**
 * HireSphere — Admin Login
 * Integrated Recruitment & Career Management System
 * Connected to Java backend at /api/admin/login
 */
export default function AdminLogin({ onLoginSuccess, apiBase = "http://localhost:8085" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (data.success) {
        onLoginSuccess && onLoginSuccess(data.email);
      } else {
        setError(data.message || "Admin Sign in failed. Please try again.");
      }
    } catch (err) {
      setError("Cannot connect to server. Make sure the Java backend is running on port 8085.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0 min-h-screen bg-[#F4FAFF]">
      <div className="row g-0 min-h-screen">
        {/* Left — brand panel */}
        <div className="col-12 col-lg-5 d-flex">
          <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#0B3D91] via-[#155DC1] to-[#1D8FE0] px-8 py-10 sm:px-12 sm:py-14 lg:py-14 flex flex-col justify-between min-h-[300px] lg:min-h-screen">
            {/* decorative node network */}
            <svg
              className="pointer-events-none absolute -right-16 -top-10 h-72 w-72 opacity-30 sm:h-96 sm:w-96"
              viewBox="0 0 400 400"
              fill="none"
            >
              <circle cx="80" cy="70" r="6" fill="#BFE3FF" />
              <circle cx="200" cy="40" r="5" fill="#BFE3FF" />
              <circle cx="320" cy="110" r="7" fill="#BFE3FF" />
              <circle cx="260" cy="220" r="5" fill="#BFE3FF" />
              <circle cx="120" cy="200" r="6" fill="#BFE3FF" />
              <circle cx="50" cy="300" r="5" fill="#BFE3FF" />
              <circle cx="220" cy="330" r="6" fill="#BFE3FF" />
              <line x1="80" y1="70" x2="200" y2="40" stroke="#BFE3FF" strokeWidth="1" />
              <line x1="200" y1="40" x2="320" y2="110" stroke="#BFE3FF" strokeWidth="1" />
              <line x1="320" y1="110" x2="260" y2="220" stroke="#BFE3FF" strokeWidth="1" />
              <line x1="260" y1="220" x2="120" y2="200" stroke="#BFE3FF" strokeWidth="1" />
              <line x1="120" y1="200" x2="80" y2="70" stroke="#BFE3FF" strokeWidth="1" />
              <line x1="120" y1="200" x2="50" y2="300" stroke="#BFE3FF" strokeWidth="1" />
              <line x1="120" y1="200" x2="220" y2="330" stroke="#BFE3FF" strokeWidth="1" />
              <line x1="260" y1="220" x2="220" y2="330" stroke="#BFE3FF" strokeWidth="1" />
            </svg>

            {/* Top Brand & Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm ring-1 ring-white/25 shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
                    <path d="M12 2 2 7l10 5 10-5-10-5Zm0 7.4L4.3 6 12 2.6 19.7 6 12 9.4ZM2 12.1l10 5 10-5v3.5l-10 5-10-5v-3.5Z" />
                  </svg>
                </span>
                <span className="font-[Sora] text-xl font-semibold tracking-tight text-white">
                  HireSphere
                </span>
              </div>
            </div>

            {/* Main Hero, Services & Success Content */}
            <div className="relative z-10 my-4 lg:my-6 space-y-5">
              <div>
                <h1 className="font-[Sora] text-[26px] font-semibold leading-tight text-white sm:text-[32px] lg:text-[34px]">
                  HireSphere
                  <br />
                  Admin Panel
                </h1>
                <p className="mt-2.5 max-w-sm text-[13.5px] leading-relaxed text-[#DCEEFF]">
                  Administer recruitment drives, monitor system health, and manage user portfolios directly from the core enterprise OS.
                </p>
              </div>

              {/* Our Services */}
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md shadow-[0_12px_32px_0_rgba(7,28,66,0.25)]">
                <div className="flex items-center justify-between border-b border-white/15 pb-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#7BD4FF]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    System Control
                  </span>
                  <span className="text-[10px] font-medium text-[#BEE3FF] bg-white/10 px-2 py-0.5 rounded-full">
                    Admin Only
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15 text-[#E0F2FE]">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-white">Full User Management</h3>
                      <p className="text-[11px] text-[#C2E2FF] leading-snug">View and manage candidate profiles across the platform.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15 text-[#E0F2FE]">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-white">Database Operations</h3>
                      <p className="text-[11px] text-[#C2E2FF] leading-snug">Monitor real-time data sync, projects, and drives from MySQL.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15 text-[#E0F2FE]">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-white">System Logs & Metrics</h3>
                      <p className="text-[11px] text-[#C2E2FF] leading-snug">Track application volumes, system health, and recruitment metrics.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Capabilities Highlights */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#A0CEF8] mb-2">
                  Key Capabilities
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
                    <div className="flex items-center gap-1.5 text-emerald-300 mb-1">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[11px] font-semibold text-white">Live Monitoring</span>
                    </div>
                    <p className="text-[11px] text-[#D0EAFF] leading-tight">Instant access to active projects and pending applications.</p>
                  </div>

                  <div className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
                    <div className="flex items-center gap-1.5 text-cyan-300 mb-1">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[11px] font-semibold text-white">Access Control</span>
                    </div>
                    <p className="text-[11px] text-[#D0EAFF] leading-tight">Manage user communications and strictly secure system permissions.</p>
                  </div>
                </div>
              </div>

              {/* Bottom Enterprise Trust Badges */}
              <div className="relative z-10 border-t border-white/15 pt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 backdrop-blur-sm px-2.5 py-1 text-[11px] text-[#E1F1FF] border border-white/15">
                    <svg className="w-3.5 h-3.5 text-emerald-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Enterprise Security
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 backdrop-blur-sm px-2.5 py-1 text-[11px] text-[#E1F1FF] border border-white/15">
                    <svg className="w-3.5 h-3.5 text-cyan-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    24/7 Availability
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — form panel */}
        <div className="col-12 col-lg-7 d-flex align-items-center justify-content-center bg-white">
          <div className="w-full px-6 py-12 sm:px-10 lg:px-16 xl:px-20">
            <div className="mx-auto w-full max-w-[430px]">
              <h2 className="font-[Sora] text-2xl font-bold tracking-tight text-[#0F2A47] sm:text-[28px]">
                Welcome back, Admin
              </h2>
              <p className="mt-2 text-sm text-[#5C7B99]">
                Sign in to continue to your Admin Dashboard.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-semibold text-[#0F2A47]"
                  >
                    Admin Email
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8FB4D6]">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                        <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.2-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.8-3.6-5-8-5Z" />
                      </svg>
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter admin email"
                      className="w-full rounded-xl border border-[#D7E8F7] bg-[#F8FBFF] py-3 pl-11 pr-4 text-[15px] text-[#0F2A47] placeholder:text-[#9CB8D2] outline-none transition focus:border-[#1D8FE0] focus:bg-white focus:ring-4 focus:ring-[#1D8FE0]/15"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-sm font-semibold text-[#0F2A47]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8FB4D6]">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                        <path d="M17 9V7a5 5 0 0 0-10 0v2a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3ZM9 7a3 3 0 0 1 6 0v2H9V7Z" />
                      </svg>
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-[#D7E8F7] bg-[#F8FBFF] py-3 pl-11 pr-11 text-[15px] text-[#0F2A47] placeholder:text-[#9CB8D2] outline-none transition focus:border-[#1D8FE0] focus:bg-white focus:ring-4 focus:ring-[#1D8FE0]/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#8FB4D6] hover:text-[#1D8FE0]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                          <path d="M12 6c-5 0-9 3.6-10 6 .5 1.2 1.6 2.8 3.2 4.1l-1.6 1.6 1.1 1.1 17-17-1.1-1.1-2.1 2.1C16.8 6.4 14.5 6 12 6Zm0 3a3 3 0 0 1 3 3c0 .5-.1.9-.3 1.3l-4-4c.4-.2.8-.3 1.3-.3Zm-3.7 1.4L6.9 11.8A3 3 0 0 0 9 15a3 3 0 0 0 2.4-1.2l-3.1-3.1Zm3.7 6.6c2.9 0 5.5-1.1 7.5-2.9l-1.5-1.5A9 9 0 0 1 12 15a9 9 0 0 1-1.7-.2l1.7 1.8Z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                          <path d="M12 5C6.5 5 2 9.5 1 12c1 2.5 5.5 7 11 7s10-4.5 11-7c-1-2.5-5.5-7-11-7Zm0 11.5A4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 0 1 0 9Zm0-7.2a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me (To match user login) */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#B9D6EF] text-[#1D8FE0] focus:ring-[#1D8FE0]"
                  />
                  <label htmlFor="remember" className="text-sm text-[#5C7B99]">
                    Keep me signed in
                  </label>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 mt-0.5 shrink-0 text-red-500">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#1D8FE0] py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(29,143,224,0.55)] transition hover:bg-[#0B3D91] focus:outline-none focus:ring-4 focus:ring-[#1D8FE0]/25 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

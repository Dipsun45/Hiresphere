import { useState, useEffect, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ComposedChart
} from "recharts";

export default function AdminDashboard({ adminEmail, onLogout, onNavigate, apiBase = "http://localhost:8085" }) {
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    try {
      await fetch(`${apiBase}/api/admin/logout`, { method: "POST", credentials: "include" });
    } catch (_) {}
    onLogout && onLogout();
  };

  useEffect(() => {
    const fetchData = () => {
      fetch(`${apiBase}/api/admin/data`, { credentials: "include" })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setDbData(data.data);
          } else {
            setError(data.message || "Failed to load database data.");
          }
        })
        .catch(() => setError("Network error fetching database data."))
        .finally(() => setLoading(false));
    };

    // Initial fetch
    fetchData();

    // Auto-refresh every 5 seconds for live data
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [apiBase]);

  // Derived Statistics
  const stats = useMemo(() => {
    if (!dbData) return null;
    return {
      users: dbData.users?.length || 0,
      projects: dbData.projects?.length || 0,
      applications: dbData.applications?.length || 0,
      messages: dbData.messages?.length || 0,
    };
  }, [dbData]);

  // Chart Data Preparation - Live Data Derived from Database
  const COLORS = ['#1D8FE0', '#0B3D91', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  
  const appStatusData = useMemo(() => {
    if (!dbData || !dbData.applications) return [];
    const counts = {};
    dbData.applications.forEach(d => {
      const status = d.application_status || 'Applied';
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [dbData]);

  const monthlyTrendData = useMemo(() => {
    if (!dbData || !dbData.applications) return [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts = { Jan:0, Feb:0, Mar:0, Apr:0, May:0, Jun:0, Jul:0, Aug:0, Sep:0, Oct:0, Nov:0, Dec:0 };
    dbData.applications.forEach(d => {
      if (d.applied_at && d.applied_at !== "N/A") {
        try {
          const date = new Date(d.applied_at);
          if (!isNaN(date.getMonth())) {
            counts[months[date.getMonth()]]++;
          }
        } catch(e) {}
      }
    });
    return months.map(m => ({ name: m, apps: counts[m] })).filter(m => m.apps > 0 || m.name === "Jan"); // Keep at least one to show chart
  }, [dbData]);

  const userTrendData = useMemo(() => {
    if (!dbData || !dbData.users) return [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts = { Jan:0, Feb:0, Mar:0, Apr:0, May:0, Jun:0, Jul:0, Aug:0, Sep:0, Oct:0, Nov:0, Dec:0 };
    dbData.users.forEach(u => {
      if (u.created_at && u.created_at !== "N/A") {
        try {
          const date = new Date(u.created_at);
          if (!isNaN(date.getMonth())) {
            counts[months[date.getMonth()]]++;
          }
        } catch(e) {}
      }
    });
    return months.map(m => ({ name: m, users: counts[m] })).filter(m => m.users > 0 || m.name === "Jan");
  }, [dbData]);

  const messageStatusData = useMemo(() => {
    if (!dbData || !dbData.messages) return [];
    const counts = {};
    dbData.messages.forEach(m => {
      const status = m.status || 'Pending';
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [dbData]);

  const projectStatusData = useMemo(() => {
    if (!dbData || !dbData.projects) return [];
    const counts = {};
    dbData.projects.forEach(p => {
      const cat = p.category || 'Uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [dbData]);

  const skillsData = useMemo(() => {
    if (!dbData || !dbData.profiles) return [];
    const counts = {};
    dbData.profiles.forEach(p => {
      if (p.skills) {
        const skillsArray = p.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
        skillsArray.forEach(s => {
          counts[s] = (counts[s] || 0) + 1;
        });
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1]) // Sort descending
      .slice(0, 5) // Top 5
      .map(([name, count]) => ({ name, count }));
  }, [dbData]);

  const handleNavClick = (page) => {
    
    if (onNavigate) {
      onNavigate(page);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4FAFF] flex items-center justify-center flex-col">
        <div className="w-12 h-12 border-4 border-[#D7E8F7] border-t-[#1D8FE0] rounded-full animate-spin mb-4"></div>
        <p className="text-[#5C7B99] font-medium animate-pulse">Loading HireSphere Command Center...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F4FAFF] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 max-w-md text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">System Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4FAFF] font-sans text-slate-800 flex flex-col">
      
      {/* 🔹 PREMIUM HEADER (MATCHING HOME.JSX EXACTLY) */}
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
            {[
              { name: "Dashboard" }, { name: "Users" },
              { name: "Messages" },
              { name: "Profile Details" },
              { name: "Projects Details" }, { name: "Job Apply Applications Details" },
            ].map((link) => {
              const isActive = link.name === "Dashboard";
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
                {adminEmail ? adminEmail.substring(0, 2).toUpperCase() : "AD"}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">{adminEmail}</span>
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
      </header>

      {/* 🔹 MAIN DASHBOARD CONTENT */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* KPI Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Users", val: stats?.users, icon: "👥", trend: "+12.5%", color: "text-blue-600", bg: "bg-blue-50" },
            { title: "Active Projects", val: stats?.projects, icon: "💻", trend: "+5.2%", color: "text-indigo-600", bg: "bg-indigo-50" },
            { title: "Applications", val: stats?.applications, icon: "🚀", trend: "+18.4%", color: "text-emerald-600", bg: "bg-emerald-50" },
            { title: "Active Messages", val: stats?.messages, icon: "✉️", trend: "+2.1%", color: "text-amber-600", bg: "bg-amber-50" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8F2FC] flex items-center justify-between group hover:shadow-md transition cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.title}</p>
                <div className="flex items-end gap-3">
                  <h3 className="font-[Sora] text-3xl font-black text-[#0F2A47]">{stat.val}</h3>
                  <span className={`text-[11px] font-bold ${stat.color} ${stat.bg} px-2 py-0.5 rounded-md mb-1`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div className={`text-3xl p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Trend Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-[#E8F2FC]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-[Sora] font-bold text-[#0F2A47]">Monthly Applications Trend</h3>
              <select className="text-xs bg-[#F4FAFF] border border-[#D7E8F7] rounded-lg px-2 py-1 text-slate-600 outline-none">
                <option>This Year</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="apps" stroke="#1D8FE0" strokeWidth={4} dot={{ r: 4, fill: '#1D8FE0', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Application Status Pie */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8F2FC]">
            <h3 className="font-[Sora] font-bold text-[#0F2A47] mb-6">Application Status</h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={appStatusData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {appStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Projects Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8F2FC]">
            <h3 className="font-[Sora] font-bold text-[#0F2A47] mb-6">Projects by Category</h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectStatusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f8fbff' }} />
                  <Bar dataKey="count" fill="#1D8FE0" radius={[4, 4, 0, 0]}>
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Skills Horizontal Bar */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-[#E8F2FC]">
            <h3 className="font-[Sora] font-bold text-[#0F2A47] mb-6">Top Skills in Demand</h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={skillsData} margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                  <Tooltip cursor={{ fill: '#f8fbff' }} />
                  <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* New Top Level Charts for Users & Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Registration Trend */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-[#E8F2FC]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-[Sora] font-bold text-[#0F2A47]">User Registrations Trend</h3>
              <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">New Users</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="users" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Messages Status Pie */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8F2FC]">
            <h3 className="font-[Sora] font-bold text-[#0F2A47] mb-6">Support Messages</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={messageStatusData} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                    {messageStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Data Tables Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8F2FC] overflow-hidden">
          <div className="border-b border-[#E8F2FC] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-4 border-b sm:border-0 border-slate-100">
              {['applications', 'projects', 'users', 'messages'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 sm:pb-0 font-bold text-sm transition-colors capitalize ${
                    activeTab === tab ? "text-[#1D8FE0] border-b-2 border-[#1D8FE0]" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Recent {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 hover:bg-slate-100 transition">
                <span>⬇️</span> Export PDF
              </button>
              <button className="px-3 py-1.5 text-xs font-semibold bg-[#1D8FE0] text-white rounded-lg hover:bg-[#0B3D91] transition">
                View All
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-[#F4FAFF] text-xs font-bold text-slate-500 uppercase">
                <tr>
                  {activeTab === 'applications' && (
                    <>
                      <th className="px-6 py-4">Applicant ID</th>
                      <th className="px-6 py-4">Drive Name</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </>
                  )}
                  {activeTab === 'projects' && (
                    <>
                      <th className="px-6 py-4">Project Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Tech Stack</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </>
                  )}
                  {activeTab === 'users' && (
                    <>
                      <th className="px-6 py-4">User ID / Email</th>
                      <th className="px-6 py-4">Registered Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </>
                  )}
                  {activeTab === 'messages' && (
                    <>
                      <th className="px-6 py-4">Sender Name</th>
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8F2FC]">
                {activeTab === 'applications' && dbData.applications?.slice(0, 5).map((app, i) => (
                  <tr key={i} className="hover:bg-[#F9FCFF] transition">
                    <td className="px-6 py-4 text-sm font-medium text-[#0F2A47]">{app.user_id}</td>
                    <td className="px-6 py-4 text-sm text-[#5C7B99]">{app.company_name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                        app.application_status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                        app.application_status === 'Rejected' ? 'bg-red-50 text-red-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {app.application_status || 'Applied'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#1D8FE0] hover:underline text-xs font-semibold">Review</button>
                    </td>
                  </tr>
                ))}
                
                {activeTab === 'projects' && dbData.projects?.slice(0, 5).map((proj, i) => (
                  <tr key={i} className="hover:bg-[#F9FCFF] transition">
                    <td className="px-6 py-4 text-sm font-medium text-[#0F2A47]">{proj.project_name}</td>
                    <td className="px-6 py-4 text-sm text-[#5C7B99]">{proj.category || '—'}</td>
                    <td className="px-6 py-4 text-sm text-[#5C7B99] truncate max-w-xs">{proj.tech_stack || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#1D8FE0] hover:underline text-xs font-semibold">View</button>
                    </td>
                  </tr>
                ))}

                {activeTab === 'users' && dbData.users?.slice(0, 5).map((user, i) => (
                  <tr key={i} className="hover:bg-[#F9FCFF] transition">
                    <td className="px-6 py-4 text-sm font-medium text-[#0F2A47] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                        {user.userId.charAt(0).toUpperCase()}
                      </div>
                      {user.userId}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5C7B99]">{user.created_at || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-red-500 hover:underline text-xs font-semibold">Suspend</button>
                    </td>
                  </tr>
                ))}

                {activeTab === 'messages' && dbData.messages?.slice(0, 5).map((msg, i) => (
                  <tr key={i} className="hover:bg-[#F9FCFF] transition">
                    <td className="px-6 py-4 text-sm font-medium text-[#0F2A47]">{msg.name}</td>
                    <td className="px-6 py-4 text-sm text-[#5C7B99] truncate max-w-xs">{msg.subject}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{msg.sent_at}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#1D8FE0] hover:underline text-xs font-semibold">Reply</button>
                    </td>
                  </tr>
                ))}

                {/* Empty State Fallback */}
                {(!dbData[activeTab] || dbData[activeTab].length === 0) && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium">
                      No records found in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 🔹 ATTRACTIVE & UNIQUE FOOTER */}
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
                <span className="font-[Sora] text-2xl font-black tracking-tight text-white">
                  HireSphere Admin
                </span>
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

            <div className="md:col-span-2 space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#7DD3FC] font-[Sora]">
                Navigation
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li><button onClick={() => handleNavClick("Dashboard")} className="hover:text-white transition flex items-center gap-1.5"><span>›</span> Dashboard Overview</button></li>
                <li><button onClick={() => handleNavClick("Profile")} className="hover:text-white transition flex items-center gap-1.5"><span>›</span> Candidate Profile</button></li>
                <li><a href="#candidates" className="hover:text-white transition flex items-center gap-1.5"><span>›</span> Candidate Directory</a></li>
                <li><a href="#drives" className="hover:text-white transition flex items-center gap-1.5"><span>›</span> Campus Drives</a></li>
                <li><button onClick={() => handleNavClick("Company")} className="hover:text-white transition flex items-center gap-1.5"><span>›</span> Company Profile</button></li>
              </ul>
            </div>

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

            <div className="md:col-span-3 space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#7DD3FC] font-[Sora]">
                Corporate Headquarters
              </p>
              <div className="space-y-2.5 text-xs text-slate-300">
                <p className="flex items-start gap-2"><span className="text-[#1D8FE0] font-bold">📍</span><span>HireSphere Tech Towers, AURO Campus, Surat, India</span></p>
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
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()} HireSphere Technologies Inc. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <a href="#privacy" className="hover:text-white transition">Privacy Policy</a><span>·</span>
              <a href="#terms" className="hover:text-white transition">Terms of Service</a><span>·</span>
              <a href="#security" className="hover:text-white transition">Security Standard</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

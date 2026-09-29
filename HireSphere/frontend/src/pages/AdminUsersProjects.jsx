import { useState, useEffect } from "react";

export default function AdminUsersProjects({ adminEmail, onLogout, onNavigate, apiBase = "http://localhost:8085" }) {
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    project_name: "", project_description: "", tech_stack: "", category: "", live_url: "", github_url: "", start_date: "", end_date: "",
    cert_name: "", cert_issuer: "", cert_date: "", cert_url: "", project_zip_name: ""
  });

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

  useEffect(() => {
    fetchData();
  }, [apiBase]);

  const handleLogout = async () => {
    try {
      await fetch(`${apiBase}/api/admin/logout`, { method: "POST", credentials: "include" });
    } catch (_) {}
    onLogout && onLogout();
  };

  const handleNavClick = (page) => {
    
    onNavigate && onNavigate(page);
  };

  const handleEditClick = (project) => {
    setEditingId(project.id);
    setEditForm({
      project_name: project.project_name || "",
      project_description: project.project_description || "",
      tech_stack: project.tech_stack || "",
      category: project.category || "",
      live_url: project.live_url || "",
      github_url: project.github_url || "",
      start_date: project.start_date || "",
      end_date: project.end_date || "",
      cert_name: project.cert_name || "",
      cert_issuer: project.cert_issuer || "",
      cert_date: project.cert_date || "",
      cert_url: project.cert_url || "",
      project_zip_name: project.project_zip_name || ""
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = (id) => {
    fetch(`${apiBase}/api/admin/projects/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...editForm })
    })
      .then(res => res.json())
      .then(data => {
        if(data.success) {
          setEditingId(null);
          fetchData(); // refresh
        } else {
          alert('Failed to update project.');
        }
      })
      .catch(() => alert('Network error while updating project.'));
  };

  const handleDelete = (id) => {
    if(!window.confirm("Are you sure you want to delete this project?")) return;
    
    fetch(`${apiBase}/api/admin/projects/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then(data => {
        if(data.success) {
          fetchData(); // refresh
        } else {
          alert('Failed to delete project.');
        }
      })
      .catch(() => alert('Network error while deleting project.'));
  };

  const handleDeleteAll = () => {
    if(!window.confirm("Are you sure you want to delete ALL projects? This action cannot be undone.")) return;
    
    fetch(`${apiBase}/api/admin/projects/deleteAll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        if(data.success) {
          fetchData(); // refresh
        } else {
          alert('Failed to delete all projects.');
        }
      })
      .catch(() => alert('Network error while deleting projects.'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4FAFF] flex items-center justify-center flex-col">
        <div className="w-12 h-12 border-4 border-[#D7E8F7] border-t-[#1D8FE0] rounded-full animate-spin mb-4"></div>
        <p className="text-[#5C7B99] font-medium animate-pulse">Loading Projects Data...</p>
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
      {/* 🔹 PREMIUM HEADER */}
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

          {/* Header Link Options */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/20">
            {[
              { name: "Dashboard" }, { name: "Users" },
              { name: "Messages" },
              { name: "Profile Details" },
              { name: "Projects Details" }, { name: "Job Apply Applications Details" },
            ].map((link) => {
              const isActive = link.name === "Projects Details";
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

      {/* 🔹 MAIN PROJECTS CONTENT */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-6 py-8 space-y-8 relative">
        
        {/* ATTRACTIVE HEADING BANNER */}
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
                Admin Panel Directory
              </div>
              <h1 className="font-[Sora] text-3xl sm:text-4xl font-extrabold tracking-tight">
                Projects Management
              </h1>
              <p className="text-[#DCEEFF] text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Review, manage, update, and oversee candidate projects and tech stacks submitted.
              </p>
            </div>
            <button 
              onClick={handleDeleteAll}
              className="px-5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-sm shrink-0"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Delete All Projects
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xl border border-[#E8F2FC]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-[Sora] text-2xl font-bold text-[#0F2A47]">All Projects Data</h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#D7E8F7] pb-2">
            <table className="w-full min-w-[1200px] text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#F4FAFF] to-[#E8F2FC] border-b border-[#D7E8F7]">
                  <th className="py-4 px-4 text-left font-extrabold text-[#0B3D91] uppercase tracking-widest whitespace-nowrap">ID</th>
                  <th className="py-4 px-4 text-left font-extrabold text-[#0B3D91] uppercase tracking-widest whitespace-nowrap">User ID</th>
                  <th className="py-4 px-4 text-left font-extrabold text-[#0B3D91] uppercase tracking-widest whitespace-nowrap">Project Name</th>
                  <th className="py-4 px-4 text-left font-extrabold text-[#0B3D91] uppercase tracking-widest whitespace-nowrap">Category</th>
                  <th className="py-4 px-4 text-left font-extrabold text-[#0B3D91] uppercase tracking-widest whitespace-nowrap">Tech Stack</th>
                  <th className="py-4 px-4 text-left font-extrabold text-[#0B3D91] uppercase tracking-widest whitespace-nowrap">Start Date</th>
                  <th className="py-4 px-4 text-left font-extrabold text-[#0B3D91] uppercase tracking-widest whitespace-nowrap">End Date</th>
                  <th className="py-4 px-4 text-left font-extrabold text-[#0B3D91] uppercase tracking-widest whitespace-nowrap">Live URL</th>
                  <th className="py-4 px-4 text-left font-extrabold text-[#0B3D91] uppercase tracking-widest whitespace-nowrap">GitHub URL</th>
                  <th className="py-4 px-4 text-left font-extrabold text-[#0B3D91] uppercase tracking-widest whitespace-nowrap">Certificate Name</th>
                  <th className="py-4 px-4 text-left font-extrabold text-[#0B3D91] uppercase tracking-widest whitespace-nowrap">Certificate Issuer</th>
                  <th className="py-4 px-4 text-left font-extrabold text-[#0B3D91] uppercase tracking-widest whitespace-nowrap">Certificate Date</th>
                  <th className="py-4 px-4 text-left font-extrabold text-[#0B3D91] uppercase tracking-widest whitespace-nowrap">Certificate URL</th>
                  <th className="py-4 px-4 text-left font-extrabold text-[#0B3D91] uppercase tracking-widest whitespace-nowrap">Zip Name</th>
                  <th className="py-4 px-4 text-center font-extrabold text-[#0B3D91] uppercase tracking-widest whitespace-nowrap sticky right-0 bg-[#E8F2FC] z-10 shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.05)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dbData && dbData.projects && dbData.projects.map((project) => (
                  <tr key={project.id} className="border-b border-[#E8F2FC] hover:bg-[#EFF8FF] transition-all duration-200">
                    <td className="py-3 px-4 font-black text-[#1D8FE0] text-base">{project.id}</td>
                    <td className="py-3 px-4 text-[#0F2A47] font-bold">{project.user_id}</td>
                    <td className="py-3 px-4 font-[Sora] font-extrabold text-[#0F2A47] whitespace-nowrap text-[15px]">{project.project_name}</td>
                    <td className="py-3 px-4 text-[#0B3D91] font-bold uppercase text-[11px] tracking-wider">{project.category}</td>
                    <td className="py-3 px-4 text-slate-800 font-extrabold max-w-[250px] truncate" title={project.tech_stack}>{project.tech_stack}</td>
                    <td className="py-3 px-4 text-slate-900 font-bold whitespace-nowrap">{project.start_date}</td>
                    <td className="py-3 px-4 text-slate-900 font-bold whitespace-nowrap">{project.end_date}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {project.live_url ? <a href={project.live_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F2FC] text-[#1D8FE0] font-black rounded-lg hover:bg-[#1D8FE0] hover:text-white transition-all shadow-sm">Live Link ↗</a> : <span className="text-slate-400 font-bold">-</span>}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {project.github_url ? <a href={project.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1e293b] text-white font-black rounded-lg hover:bg-black transition-all shadow-sm">GitHub ↗</a> : <span className="text-slate-400 font-bold">-</span>}
                    </td>
                    <td className="py-3 px-4 text-[#0F2A47] font-extrabold whitespace-nowrap">{project.cert_name || '-'}</td>
                    <td className="py-3 px-4 text-[#0B3D91] font-bold uppercase text-[11px] tracking-wider whitespace-nowrap">{project.cert_issuer || '-'}</td>
                    <td className="py-3 px-4 text-slate-900 font-bold whitespace-nowrap">{project.cert_date || '-'}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {project.cert_url ? <a href={project.cert_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 font-black rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm">Cert Link ↗</a> : <span className="text-slate-400 font-bold">-</span>}
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-bold whitespace-nowrap">{project.project_zip_name || '-'}</td>

                    <td className="py-3 px-4 sticky right-0 bg-white shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEditClick(project)} className="px-4 py-1.5 bg-[#F4FAFF] border border-[#1D8FE0]/30 text-[#1D8FE0] rounded-lg text-xs font-bold hover:bg-[#1D8FE0] hover:text-white transition shadow-sm active:scale-95">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(project.id)} className="px-4 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition shadow-sm active:scale-95">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {(!dbData || !dbData.projects || dbData.projects.length === 0) && (
                  <tr>
                    <td colSpan="15" className="py-12 text-center text-[#5C7B99] font-medium bg-[#F9FCFF]">
                      No projects found in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* EDIT PROJECT MODAL DIALOG WITH BACKGROUND BLUR                            */}
        {/* ========================================================================= */}
        {editingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Blurred Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-md transition-all"
              onClick={handleCancelEdit}
            />

            {/* Modal Content Card */}
            <div className="relative bg-white rounded-3xl max-w-3xl w-full p-8 sm:p-10 shadow-2xl border border-[#E8F2FC] z-10 my-8">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#F0F6FC] mb-6">
                <div>
                  <h2 className="font-[Sora] text-2xl font-extrabold text-[#0F2A47]">
                    Edit Project Details
                  </h2>
                  <p className="text-xs text-[#5C7B99] mt-1">
                    Update project information for Project ID <span className="font-bold text-[#0B3D91]">#{editingId}</span>
                  </p>
                </div>
                <button
                  onClick={handleCancelEdit}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F2A47] font-bold flex items-center justify-center transition"
                >
                  ✕
                </button>
              </div>

              {/* Edit Form */}
              <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(editingId); }} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#0F2A47] mb-2 uppercase tracking-wide">Project Name</label>
                    <input 
                      type="text" 
                      value={editForm.project_name} 
                      onChange={(e) => setEditForm({...editForm, project_name: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] focus:border-transparent transition text-sm font-semibold text-[#0F2A47]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F2A47] mb-2 uppercase tracking-wide">Category</label>
                    <input 
                      type="text" 
                      value={editForm.category} 
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] focus:border-transparent transition text-sm font-semibold text-[#0F2A47]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F2A47] mb-2 uppercase tracking-wide">Tech Stack</label>
                    <input 
                      type="text" 
                      value={editForm.tech_stack} 
                      onChange={(e) => setEditForm({...editForm, tech_stack: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] focus:border-transparent transition text-sm font-semibold text-[#0F2A47]"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#0F2A47] mb-2 uppercase tracking-wide">Description</label>
                    <textarea 
                      value={editForm.project_description} 
                      onChange={(e) => setEditForm({...editForm, project_description: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] focus:border-transparent transition text-sm font-semibold text-[#0F2A47]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F2A47] mb-2 uppercase tracking-wide">Start Date</label>
                    <input 
                      type="text" 
                      value={editForm.start_date} 
                      onChange={(e) => setEditForm({...editForm, start_date: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] focus:border-transparent transition text-sm font-semibold text-[#0F2A47]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F2A47] mb-2 uppercase tracking-wide">End Date</label>
                    <input 
                      type="text" 
                      value={editForm.end_date} 
                      onChange={(e) => setEditForm({...editForm, end_date: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] focus:border-transparent transition text-sm font-semibold text-[#0F2A47]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F2A47] mb-2 uppercase tracking-wide">Live URL</label>
                    <input 
                      type="text" 
                      value={editForm.live_url} 
                      onChange={(e) => setEditForm({...editForm, live_url: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] focus:border-transparent transition text-sm font-semibold text-[#0F2A47]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F2A47] mb-2 uppercase tracking-wide">GitHub URL</label>
                    <input 
                      type="text" 
                      value={editForm.github_url} 
                      onChange={(e) => setEditForm({...editForm, github_url: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] focus:border-transparent transition text-sm font-semibold text-[#0F2A47]"
                    />
                  </div>
                  <div className="md:col-span-2 pt-4 border-t border-[#F0F6FC]">
                    <h3 className="text-sm font-bold text-[#0F2A47] mb-4">Certification & Attachments</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Certificate Name</label>
                        <input type="text" value={editForm.cert_name} onChange={(e) => setEditForm({...editForm, cert_name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Certificate Issuer</label>
                        <input type="text" value={editForm.cert_issuer} onChange={(e) => setEditForm({...editForm, cert_issuer: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Certificate Date</label>
                        <input type="text" value={editForm.cert_date} onChange={(e) => setEditForm({...editForm, cert_date: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Certificate URL</label>
                        <input type="text" value={editForm.cert_url} onChange={(e) => setEditForm({...editForm, cert_url: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] text-sm" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Project Zip Name</label>
                        <input type="text" value={editForm.project_zip_name} onChange={(e) => setEditForm({...editForm, project_zip_name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-[#D4E6F7] bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#1D8FE0] text-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Buttons */}
                <div className="pt-6 flex items-center justify-end gap-3 border-t border-[#F0F6FC]">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F2A47] font-bold text-sm transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: "linear-gradient(135deg, #1D8FE0 0%, #155DC1 100%)",
                      boxShadow: "0 4px 15px rgba(29, 143, 224, 0.25)",
                    }}
                    className="px-8 py-3 rounded-xl text-white font-bold text-sm hover:opacity-95 shadow-md transition active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}
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
                <li><button onClick={() => handleNavClick("Users")} className="hover:text-white transition flex items-center gap-1.5"><span>›</span> User Management</button></li>
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

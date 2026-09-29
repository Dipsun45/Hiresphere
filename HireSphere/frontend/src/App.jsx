import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Message from "./pages/Message";
import CompanyProfile from "./pages/CompanyProfile";
import RecruitmentDrive from "./pages/RecruitmentDrive";
import AppliedDrives from "./pages/AppliedDrives";
import Projects from "./pages/Projects";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsersLogin from "./pages/AdminUsersLogin";
import AdminUsersMessages from "./pages/AdminUsersMessages";
import AdminUsersProfiles from "./pages/AdminUsersProfiles";
import AdminUsersProjects from "./pages/AdminUsersProjects";
import AdminUsersApply from "./pages/AdminUsersApply";
import AiChat from "./pages/AiChat";
import "./index.css";

const API_BASE = "http://localhost:8085";

function App() {
  const [user, setUser] = useState(null);   // null = not checked yet
  const [adminUser, setAdminUser] = useState(() => localStorage.getItem("hiresphere_admin_email") || null);
  const [page, setPage] = useState("home");  // "home" | "profile" | "message" | "company" | "drive" | "applied" | "projects"
  const [adminPage, setAdminPage] = useState(() => localStorage.getItem("hiresphere_admin_page") || "Dashboard");
  const [loading, setLoading] = useState(true);
  
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  // Helper to handle admin navigation and persist active tab
  const handleAdminNavigate = (newPage) => {
    localStorage.setItem("hiresphere_admin_page", newPage);
    setAdminPage(newPage);
  };

  // On mount: check session state
  useEffect(() => {
    if (isAdminRoute) {
      const savedAdminEmail = localStorage.getItem("hiresphere_admin_email");
      if (savedAdminEmail) {
        setAdminUser(savedAdminEmail);
      }
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}/api/user`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.authenticated) {
          setUser(data.userId);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [isAdminRoute]);

  // Enforce 5 minute (300,000 ms) session timeout on the frontend
  useEffect(() => {
    let timeoutId;
    if (user) {
      timeoutId = setTimeout(() => {
        handleLogout();
        alert("Your session has expired after 5 minutes. Please login again.");
      }, 5 * 60 * 1000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user]);

  // Enforce 5 minute (300,000 ms) session timeout for ADMIN
  useEffect(() => {
    let timeoutId;
    if (adminUser) {
      timeoutId = setTimeout(() => {
        handleAdminLogout();
        alert("Admin session has expired after 5 minutes. Please login again.");
      }, 5 * 60 * 1000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [adminUser]);

  const handleLoginSuccess = (userId) => {
    setUser(userId);
    setPage("profile");
  };

  const handleLogout = () => {
    fetch(`${API_BASE}/api/logout`, {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      setUser(null);
      setPage("home");
    });
  };

  const handleAdminLoginSuccess = (email) => {
    localStorage.setItem("hiresphere_admin_email", email);
    setAdminUser(email);
  };

  const handleAdminLogout = () => {
    fetch(`${API_BASE}/api/admin/logout`, {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      localStorage.removeItem("hiresphere_admin_email");
      localStorage.removeItem("hiresphere_admin_page");
      setAdminUser(null);
      setAdminPage("Dashboard");
    });
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#F4FAFF",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "4px solid #D7E8F7",
              borderTop: "4px solid #1D8FE0",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          <p style={{ color: "#5C7B99", fontFamily: "Inter, sans-serif", fontSize: 14 }}>
            Loading HireSphere...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // AI Route
  const isAiRoute = window.location.pathname.startsWith('/ai');
  if (isAiRoute) {
    return <AiChat apiBase={API_BASE} />;
  }

  // Admin Routing
  if (isAdminRoute) {
    if (adminUser) {
      if (adminPage === "Users") {
        return <AdminUsersLogin adminEmail={adminUser} onLogout={handleAdminLogout} apiBase={API_BASE} onNavigate={handleAdminNavigate} />;
      }
      if (adminPage === "Messages") {
        return <AdminUsersMessages adminEmail={adminUser} onLogout={handleAdminLogout} apiBase={API_BASE} onNavigate={handleAdminNavigate} />;
      }
      if (adminPage === "Profile Details") {
        return <AdminUsersProfiles adminEmail={adminUser} onLogout={handleAdminLogout} apiBase={API_BASE} onNavigate={handleAdminNavigate} />;
      }
      if (adminPage === "Projects Details") {
        return <AdminUsersProjects adminEmail={adminUser} onLogout={handleAdminLogout} apiBase={API_BASE} onNavigate={handleAdminNavigate} />;
      }
      if (adminPage === "Job Apply Applications Details") {
        return <AdminUsersApply adminEmail={adminUser} onLogout={handleAdminLogout} apiBase={API_BASE} onNavigate={handleAdminNavigate} />;
      }
      return <AdminDashboard adminEmail={adminUser} onLogout={handleAdminLogout} apiBase={API_BASE} onNavigate={handleAdminNavigate} />;
    } else {
      return <AdminLogin onLoginSuccess={handleAdminLoginSuccess} apiBase={API_BASE} />;
    }
  }

  // Regular User Routing
  return user ? (
    page === "profile" ? (
      <Profile userId={user} onLogout={handleLogout} apiBase={API_BASE} onNavigate={setPage} />
    ) : page === "message" ? (
      <Message userId={user} onLogout={handleLogout} apiBase={API_BASE} onNavigate={setPage} />
    ) : page === "company" ? (
      <CompanyProfile userId={user} onLogout={handleLogout} apiBase={API_BASE} onNavigate={setPage} />
    ) : page === "drive" ? (
      <RecruitmentDrive userId={user} onLogout={handleLogout} apiBase={API_BASE} onNavigate={setPage} />
    ) : page === "applied" ? (
      <AppliedDrives userId={user} onLogout={handleLogout} apiBase={API_BASE} onNavigate={setPage} />
    ) : page === "projects" ? (
      <Projects userId={user} onLogout={handleLogout} apiBase={API_BASE} onNavigate={setPage} />
    ) : (
      <Home userId={user} onLogout={handleLogout} apiBase={API_BASE} onNavigate={setPage} />
    )
  ) : (
    <Login onLoginSuccess={handleLoginSuccess} apiBase={API_BASE} />
  );
}

export default App;
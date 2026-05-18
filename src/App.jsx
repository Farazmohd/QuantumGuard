import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import AdminDashboard from './components/Admin/AdminDashboard';
import OrgDashboard from './components/Organization/OrgDashboard';
import ResearcherDashboard from './components/Researcher/ResearcherDashboard';

function App() {
  // Roles: null (landing), 'login' (auth screen), 'admin', 'org', 'researcher'
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Theme support
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('quantumTheme') === 'light';
  });

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('quantumTheme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('quantumTheme', 'dark');
    }
  }, [isLightMode]);

  const handleLogin = (role, user) => {
    setUserRole(role);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
  };

  const toggleTheme = () => setIsLightMode(prev => !prev);

  return (
    <div className="quantum-guard-app">
      {/* Universal Scanline Effect */}
      <div className="scanline"></div>

      {/* Dynamic View Engine */}
      {!userRole && <LandingPage onEnter={() => setUserRole('login')} toggleTheme={toggleTheme} />}

      {userRole === 'login' && (
        <Auth
          onBack={() => setUserRole(null)}
          onLogin={handleLogin}
          toggleTheme={toggleTheme}
        />
      )}

      {userRole === 'admin' && (
        <AdminDashboard user={currentUser} onLogout={handleLogout} toggleTheme={toggleTheme} />
      )}

      {userRole === 'org' && (
        <OrgDashboard user={currentUser} onLogout={handleLogout} toggleTheme={toggleTheme} />
      )}

      {userRole === 'researcher' && (
        <ResearcherDashboard user={currentUser} onLogout={handleLogout} toggleTheme={toggleTheme} />
      )}
    </div>
  );
}

export default App;

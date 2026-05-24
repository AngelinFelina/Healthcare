import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import DiagnosticTool from './components/DiagnosticTool';
import ImageScan from './components/ImageScan';
import MedicineInfo from './components/MedicineInfo';
import MedicineReminder from './components/MedicineReminder';
import Login from './components/Login';
import SignUp from './components/SignUp';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    return window.location.hash.replace('#', '') || 'home';
  });
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      
      const validRoutes = ['home', 'login', 'signup', 'dashboard', 'diagnostic', 'maternal', 'imagescan', 'medicine', 'reminder'];
      if (!validRoutes.includes(hash)) {
        window.location.hash = 'home';
        return;
      }

      // Guard protected routes
      const protectedRoutes = ['dashboard', 'diagnostic', 'maternal', 'imagescan', 'medicine', 'reminder'];
      if (protectedRoutes.includes(hash) && !user) {
        window.location.hash = 'login';
        return;
      }

      // Guard login/signup if user is logged in
      if (user && (hash === 'login' || hash === 'signup')) {
        window.location.hash = 'dashboard';
        return;
      }

      setCurrentPage(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Sync initial route
    const currentHash = window.location.hash.replace('#', '');
    if (!currentHash) {
      window.location.hash = currentPage;
    } else {
      handleHashChange();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]);

  const handleLogin = (jwt, userData) => {
    setToken(jwt);
    setUser(userData);
    window.location.hash = 'dashboard';
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    window.location.hash = 'home';
  };

  const handleNavClick = (route) => {
    window.location.hash = route;
  };

  return (
    <div className="app-container">
      {currentPage === 'home' && (
        <LandingPage
          onStartScan={() => handleNavClick('dashboard')}
          onNavClick={handleNavClick}
          user={user}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'login' && (
        <Login
          onLogin={handleLogin}
          onBack={() => window.location.hash = 'home'}
          onNavigateToSignUp={() => window.location.hash = 'signup'}
        />
      )}

      {currentPage === 'signup' && (
        <SignUp
          onSignUp={handleLogin}
          onBack={() => window.location.hash = 'home'}
          onNavigateToLogin={() => window.location.hash = 'login'}
        />
      )}

      {currentPage === 'dashboard' && (
        <Dashboard
          onNavClick={handleNavClick}
          user={user}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'diagnostic' && (
        <DiagnosticTool defaultMode="general" onBack={() => window.location.hash = 'dashboard'} />
      )}

      {currentPage === 'maternal' && (
        <DiagnosticTool defaultMode="maternal" onBack={() => window.location.hash = 'dashboard'} />
      )}

      {currentPage === 'imagescan' && (
        <ImageScan onBack={() => window.location.hash = 'dashboard'} />
      )}

      {currentPage === 'medicine' && (
        <MedicineInfo onBack={() => window.location.hash = 'dashboard'} />
      )}

      {currentPage === 'reminder' && (
        <MedicineReminder onBack={() => window.location.hash = 'dashboard'} />
      )}
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import { getCurrentUser } from './utils/api';

function App() {
  const [currentView, setCurrentView] = useState('loading'); // 'loading' | 'home' | 'login' | 'register' | 'dashboard' | 'add-product' | 'edit-product'
  const [user, setUser] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);

  // ── On mount: try to restore session from cookie ──────────────────────
  useEffect(() => {
    async function restoreSession() {
      const savedUser = await getCurrentUser();
      if (savedUser) {
        setUser(savedUser);
        setCurrentView('dashboard');
      } else {
        setCurrentView('home');
      }
    }
    restoreSession();
  }, []);

  const handleNavigate = (view, data = null) => {
    if (view === 'edit-product' && data) {
      setActiveProduct(data);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Called after successful login or register
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  // Called on logout
  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
  };

  // ── Loading splash ────────────────────────────────────────────────────
  if (currentView === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center shadow-lg shadow-primary/25 animate-pulse">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-slate-500 font-medium">Loading FreshTrack...</p>
        </div>
      </div>
    );
  }

  // ── Protected dashboard: redirect to login if no user ─────────────────
  if (currentView === 'dashboard') {
    if (!user) {
      // Should not happen but guard it
      return <LoginPage onNavigate={handleNavigate} onLoginSuccess={handleAuthSuccess} />;
    }
    return (
      <DashboardPage
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
    );
  }

  if (currentView === 'add-product') {
    if (!user) {
      return <LoginPage onNavigate={handleNavigate} onLoginSuccess={handleAuthSuccess} />;
    }
    return (
      <AddProductPage
        onNavigate={handleNavigate}
      />
    );
  }

  if (currentView === 'edit-product') {
    if (!user) {
      return <LoginPage onNavigate={handleNavigate} onLoginSuccess={handleAuthSuccess} />;
    }
    return (
      <EditProductPage
        product={activeProduct}
        onNavigate={handleNavigate}
      />
    );
  }

  if (currentView === 'login') {
    return <LoginPage onNavigate={handleNavigate} onLoginSuccess={handleAuthSuccess} />;
  }

  if (currentView === 'register') {
    return <RegisterPage onNavigate={handleNavigate} onRegisterSuccess={handleAuthSuccess} />;
  }

  // Default: landing page
  return (
    <LandingPage
      onNavigate={handleNavigate}
      user={user}
      onLogout={handleLogout}
    />
  );
}

export default App;

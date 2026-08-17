import Logo from './Logo';

export default function Header({ onNavigate, user, onLogout }) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div onClick={() => onNavigate?.('home')} className="flex items-center cursor-pointer">
          <Logo />
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
          <a href="#benefits" className="hover:text-primary transition-colors">Benefits</a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Go to Dashboard */}
              <button
                onClick={() => onNavigate?.('dashboard')}
                className="text-sm font-semibold text-primary hover:text-primary-hover px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                Dashboard
              </button>
              <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-3.5 py-2 rounded-xl">
                Hi, {user.name?.split(' ')[0] || 'User'}
              </span>
              <button
                id="header-logout-btn"
                onClick={onLogout}
                className="text-sm font-medium text-slate-500 hover:text-red-600 px-3 py-2 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onNavigate?.('login')}
                className="text-sm font-semibold text-slate-700 hover:text-primary px-4 py-2 rounded-xl transition-colors"
              >
                Log in
              </button>
              <button
                onClick={() => onNavigate?.('register')}
                className="text-sm font-semibold text-white bg-secondary hover:bg-secondary-hover px-5 py-2.5 rounded-xl shadow-md shadow-secondary/20 transition-all active:scale-95"
              >
                Register Free
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

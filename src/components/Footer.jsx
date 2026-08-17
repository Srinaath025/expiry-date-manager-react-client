import Logo from './Logo';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="text-white">
              <Logo />
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Your smart assistant for managing item expiration dates, preventing unnecessary waste, and saving money every day.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate?.('home')} className="hover:text-white transition-colors">Home</button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('login')} className="hover:text-white transition-colors">Login</button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('register')} className="hover:text-white transition-colors">Register</button>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Features</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">UPC Camera Scan</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Smart Reminders</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Category Management</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FreshTrack Expiry Date Manager. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

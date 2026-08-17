import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

export default function LandingPage({ onNavigate, user, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header onNavigate={onNavigate} user={user} onLogout={onLogout} />
      <main className="flex-grow">
        <Hero onNavigate={onNavigate} user={user} />
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

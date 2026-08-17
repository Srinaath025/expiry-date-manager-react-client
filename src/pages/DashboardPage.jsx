import { useState, useEffect, useMemo } from 'react';
import Logo from '../components/Logo';
import { logoutUser, getProducts, updateProduct, deleteProduct } from '../utils/api';

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = ['Pantry', 'Fridge', 'Freezer', 'Medicine', 'Beverages', 'Cleaning', 'Other'];

const CATEGORY_EMOJI = {
  Fridge: '🥛', Medicine: '💊', Beverages: '🧃',
  Freezer: '🧊', Cleaning: '🧹', Pantry: '🥫', Other: '📦',
};

const STATUS = { EXPIRED: 'expired', SOON: 'soon', SAFE: 'safe' };

function getStatus(expiryDateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateStr); expiry.setHours(0, 0, 0, 0);
  const diff = Math.ceil((expiry - today) / 86400000);
  if (diff < 0) return STATUS.EXPIRED;
  if (diff <= 7) return STATUS.SOON;
  return STATUS.SAFE;
}

function daysUntil(expiryDateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateStr); expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry - today) / 86400000);
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status, days }) {
  if (status === STATUS.EXPIRED)
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        Expired {Math.abs(days)}d ago
      </span>
    );
  if (status === STATUS.SOON)
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold border border-orange-100">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
        Expires in {days}d
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-100">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      {days}d left
    </span>
  );
}

// ─── Expiry Alert Banner ──────────────────────────────────────────────────────

function AlertBanner({ items }) {
  const [dismissed, setDismissed] = useState(false);
  const urgent = items.filter((i) => {
    const d = daysUntil(i.expiryDate);
    return d >= 0 && d <= 3;
  });
  const expired = items.filter((i) => getStatus(i.expiryDate) === STATUS.EXPIRED);

  if (dismissed || (urgent.length === 0 && expired.length === 0)) return null;

  return (
    <div className="mb-6 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-4 flex items-start gap-3 relative">
      <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center shrink-0">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-orange-800 mb-1">
          ⚠️ Expiration Alert
        </p>
        <div className="flex flex-wrap gap-2">
          {expired.length > 0 && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
              🔴 {expired.length} item{expired.length > 1 ? 's' : ''} already expired — remove now
            </span>
          )}
          {urgent.map((item) => (
            <span key={item._id} className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">
              🟠 {item.title} — {daysUntil(item.expiryDate) === 0 ? 'expires TODAY' : `${daysUntil(item.expiryDate)}d left`}
            </span>
          ))}
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-orange-400 hover:text-orange-600 transition-colors shrink-0"
        title="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}



// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, color, sub, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border p-5 flex items-start gap-4 shadow-sm transition-all ${color} ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color.replace('border-', 'bg-').replace('-200', '-100').replace('-100', '-50')}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-slate-900">{value}</p>
        <p className="text-sm font-semibold text-slate-600">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardPage({ user, onLogout, onNavigate }) {
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, expired: 0, soon: 0, safe: 0 });

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Debounce search query to prevent backend spamming
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 450);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filterStatus, filterCategory]);

  // Fetch product list from API
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await getProducts({
        page,
        limit,
        search: debouncedSearch,
        category: filterCategory,
        status: filterStatus,
      });
      setItems(data.products || []);
      setTotalItems(data.total || 0);
      setStats(data.stats || { total: 0, expired: 0, soon: 0, safe: 0 });
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [page, limit, debouncedSearch, filterCategory, filterStatus]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    await logoutUser();
    setLogoutLoading(false);
    onLogout?.();
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteProduct(id);
      setDeleteConfirm(null);
      fetchInventory();
    } catch (err) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  const userInitial = (user?.name || 'U').charAt(0).toUpperCase();
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Top Nav ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div onClick={() => onNavigate?.('home')} className="cursor-pointer shrink-0">
            <Logo />
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-sm relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or barcode..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-slate-50"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Scan button routes to standalone Add Product */}
            <button
              id="scan-btn"
              onClick={() => onNavigate('add-product')}
              title="Scan Barcode"
              className="hidden sm:flex items-center gap-2 px-3 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 hover:border-primary/30 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <span className="hidden lg:inline">Scan UPC</span>
            </button>

            {/* Add item routes to standalone Add Product */}
            <button
              id="add-item-btn"
              onClick={() => onNavigate('add-product')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl shadow-md shadow-primary/20 transition-all active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Item
            </button>

            {/* User Profile dropdown */}
            <div className="relative">
              <button
                id="user-menu-btn"
                onClick={() => setShowUserMenu((p) => !p)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-purple-400 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                  {userInitial}
                </div>
                <span className="text-sm font-semibold text-slate-700 hidden sm:block">{user?.name || 'User'}</span>
                <svg className="w-4 h-4 text-slate-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-100 shadow-xl z-40 overflow-hidden">
                    <div className="p-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900">{user?.name || 'User'}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
                    </div>
                    <div className="p-1.5">
                      <button
                        id="logout-btn"
                        onClick={handleLogout}
                        disabled={logoutLoading}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        {logoutLoading ? (
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        )}
                        {logoutLoading ? 'Signing out...' : 'Sign Out'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-semibold flex items-center gap-2">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">
            {greeting}, <span className="text-primary">{user?.name?.split(' ')[0] || 'there'}</span> 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* ── Alert Banner (Urgently expiring items) ───────────────────── */}
        <AlertBanner items={items} />

        {/* ── Stats Grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Items"
            value={stats.total}
            color="border-slate-200"
            onClick={() => { setFilterStatus('all'); setFilterCategory('all'); setSearchQuery(''); }}
            icon={<svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" /></svg>}
          />
          <StatCard
            label="Expired"
            value={stats.expired}
            color="border-red-200"
            sub="Click to view"
            onClick={() => { setFilterStatus('expired'); setFilterCategory('all'); setSearchQuery(''); }}
            icon={<svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            label="Expiring Soon"
            value={stats.soon}
            color="border-orange-200"
            sub="Within 7 days"
            onClick={() => { setFilterStatus('soon'); setFilterCategory('all'); setSearchQuery(''); }}
            icon={<svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          />
          <StatCard
            label="Safe"
            value={stats.safe}
            color="border-emerald-200"
            sub="More than 7 days"
            onClick={() => { setFilterStatus('safe'); setFilterCategory('all'); setSearchQuery(''); }}
            icon={<svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
        </div>

        {/* ── Quick Mobile Actions ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => onNavigate('add-product')}
            className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Scan UPC Barcode</p>
              <p className="text-xs text-slate-400">Auto-fill using camera</p>
            </div>
          </button>

          <button
            onClick={() => { setFilterStatus('soon'); setFilterCategory('all'); setSearchQuery(''); }}
            className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Expiring Soon</p>
              <p className="text-xs text-slate-400">{stats.soon} items need attention</p>
            </div>
          </button>
        </div>

        {/* ── Product Table ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Product Inventory
              {(filterStatus !== 'all' || filterCategory !== 'all' || searchQuery) && (
                <button onClick={() => { setFilterStatus('all'); setFilterCategory('all'); setSearchQuery(''); }} className="ml-2 text-xs text-primary font-normal underline">clear filters</button>
              )}
            </h2>
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Status selector */}
              <div className="flex rounded-xl border border-slate-200 overflow-hidden text-xs font-semibold shrink-0">
                {[['all', 'All'], ['expired', '🔴 Expired'], ['soon', '🟠 Soon'], ['safe', '🟢 Safe']].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setFilterStatus(val)}
                    className={`px-3 py-1.5 transition-colors ${filterStatus === val ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {/* Category selector */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 shrink-0"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              {/* Mobile search */}
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="md:hidden px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 flex-1 min-w-[80px]"
              />
              {/* Mobile actions */}
              <button
                onClick={() => onNavigate('add-product')}
                className="sm:hidden flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-xl shrink-0"
              >
                Add
              </button>
            </div>
          </div>

          {/* Table content */}
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate-400 text-xs">Loading items from server...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
                </svg>
              </div>
              <p className="text-slate-500 font-semibold">No products found</p>
              <p className="text-slate-400 text-sm mt-1">
                {searchQuery || filterStatus !== 'all' || filterCategory !== 'all'
                  ? 'Try adjusting your filters or search terms.'
                  : 'Add your first product to get started.'}
              </p>
              {!searchQuery && filterStatus === 'all' && filterCategory === 'all' && (
                <button
                  onClick={() => onNavigate('add-product')}
                  className="mt-4 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-primary-hover transition-all"
                >
                  + Add First Product
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wide font-semibold">
                    <th className="text-left px-5 py-3">Product</th>
                    <th className="text-left px-5 py-3 hidden md:table-cell">Category</th>
                    <th className="text-left px-5 py-3 hidden sm:table-cell">Amount</th>
                    <th className="text-left px-5 py-3 hidden sm:table-cell">Expiry Date</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-right px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map((item) => {
                    const status = getStatus(item.expiryDate);
                    const days = daysUntil(item.expiryDate);
                    return (
                      <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${status === STATUS.EXPIRED ? 'bg-red-50' : status === STATUS.SOON ? 'bg-orange-50' : 'bg-emerald-50'}`}>
                              {CATEGORY_EMOJI[item.category || 'Pantry'] || '📦'}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 leading-tight">{item.title}</p>
                              <div className="flex gap-2 items-center mt-1">
                                {item.upc && <span className="text-[10px] text-slate-400 font-mono">UPC: {item.upc}</span>}
                                <span className="sm:hidden text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{item.amount}</span>
                                <span className="sm:hidden text-[10px] font-medium text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{fmtDate(item.expiryDate)}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 hidden md:table-cell">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">{item.category || 'Pantry'}</span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 hidden sm:table-cell font-medium">{item.amount}</td>
                        <td className="px-5 py-3.5 text-slate-600 hidden sm:table-cell">{fmtDate(item.expiryDate)}</td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={status} days={days} />
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          {deleteConfirm === item._id ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <span className="text-xs text-red-500 font-medium">Confirm?</span>
                              <button onClick={() => handleDeleteItem(item._id)} className="px-2 py-0.5 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors">Yes</button>
                              <button onClick={() => setDeleteConfirm(null)} className="px-2 py-0.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">No</button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => onNavigate('edit-product', item)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                                title="Edit item"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(item._id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                title="Delete item"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {!loading && totalItems > limit && (
            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <span className="text-xs text-slate-500 font-medium">
                Page {page} of {Math.ceil(totalItems / limit)} (Total: {totalItems})
              </span>
              <button
                disabled={page >= Math.ceil(totalItems / limit)}
                onClick={() => setPage((p) => p + 1)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}

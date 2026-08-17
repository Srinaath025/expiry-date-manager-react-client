import { useState } from 'react';
import Logo from '../components/Logo';
import { updateProduct } from '../utils/api';

const CATEGORIES = ['Pantry', 'Fridge', 'Freezer', 'Medicine', 'Beverages', 'Cleaning', 'Other'];

export default function EditProductPage({ product, onNavigate }) {
  if (!product) {
    // If no product is passed, safely fall back to dashboard
    onNavigate('dashboard');
    return null;
  }

  const [form, setForm] = useState({
    title: product.title || '',
    category: product.category || 'Pantry',
    upc: product.upc || '',
    amount: product.amount || '',
    expiryDate: product.expiryDate ? new Date(product.expiryDate).toISOString().split('T')[0] : '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Product title is required.'); return; }
    if (!form.amount.trim()) { setError('Amount/quantity is required.'); return; }
    if (!form.expiryDate) { setError('Expiry date is required.'); return; }

    setLoading(true);
    setError('');
    try {
      await updateProduct(product._id, form);
      setSuccess('Product details updated successfully!');
      setTimeout(() => {
        onNavigate('dashboard');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to update product details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div onClick={() => onNavigate('dashboard')} className="cursor-pointer">
            <Logo />
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
          >
            ← Cancel and Back
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-xl w-full mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-xl font-extrabold text-slate-900">Edit Product details</h1>
            <p className="text-slate-500 text-sm mt-1">Make changes to the details of the product.</p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <span>⚠️ {error}</span>
            </div>
          )}
          {success && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <span>✅ {success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Barcode input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Barcode / UPC Code</label>
              <input
                name="upc"
                value={form.upc}
                onChange={handleChange}
                placeholder="Barcode"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-mono bg-slate-50"
              />
            </div>

            {/* Product Title */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Product Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Product name"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
            </div>

            {/* Categories & Amount */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-white"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Amount / Size *</label>
                <input
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="e.g. 500g"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
              </div>
            </div>

            {/* Expiry Date */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Expiry Date *</label>
              <input
                name="expiryDate"
                type="date"
                value={form.expiryDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="flex-1 py-3 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-lg shadow-primary/25 rounded-xl transition-all flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

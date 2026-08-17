import { useState, useRef, useEffect } from 'react';
import Logo from '../components/Logo';
import { createProduct } from '../utils/api';
import { Html5Qrcode } from 'html5-qrcode';

const CATEGORIES = ['Pantry', 'Fridge', 'Freezer', 'Medicine', 'Beverages', 'Cleaning', 'Other'];

export default function AddProductPage({ onNavigate }) {
  const [form, setForm] = useState({
    title: '',
    category: 'Pantry',
    upc: '',
    amount: '',
    expiryDate: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [barcodeLoading, setBarcodeLoading] = useState(false);

  // Camera Scanner States
  const [showScanner, setShowScanner] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const html5QrCodeRef = useRef(null);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
      } catch (err) {
        console.error('Error stopping scanner:', err);
      } finally {
        html5QrCodeRef.current = null;
      }
    }
  };

  const startCamera = async () => {
    setCameraError('');
    setShowScanner(true);
    // Wait for the container element to render in DOM
    setTimeout(async () => {
      try {
        const html5QrCode = new Html5Qrcode('reader');
        html5QrCodeRef.current = html5QrCode;

        const config = {
          fps: 15,
          qrbox: (width, height) => {
            const side = Math.min(width, height) * 0.75;
            return { width: Math.max(side, 250), height: Math.max(side, 250) };
          },
          aspectRatio: 1.0,
        };

        await html5QrCode.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            // Success: Barcode scanned!
            stopCamera();
            setShowScanner(false);
            lookupBarcode(decodedText);
          },
          () => {
            // Verbose logging callback (ignored to keep UI quiet)
          }
        );
      } catch (err) {
        setCameraError('Unable to access camera or start scanner. Verify permissions.');
      }
    }, 150);
  };

  const lookupBarcode = async (code) => {
    setBarcodeLoading(true);
    setForm((prev) => ({ ...prev, upc: code }));
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json`, {
        signal: AbortSignal.timeout(8000),
      });
      const data = await res.json();
      if (data.status === 1 && data.product) {
        const p = data.product;
        const title = p.product_name_en || p.product_name || p.abbreviated_product_name || '';
        const amount = p.quantity || '';
        const category = detectCategory(p.categories_tags || []);
        
        setForm((prev) => ({
          ...prev,
          title: title || prev.title,
          amount: amount || prev.amount,
          category: category || prev.category,
        }));
        setSuccess('Product details loaded from barcode database!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Barcode lookup complete. No record found; please fill details manually.');
        setTimeout(() => setError(''), 4000);
      }
    } catch {
      setError('Barcode lookup failed. Please enter details manually.');
      setTimeout(() => setError(''), 4000);
    } finally {
      setBarcodeLoading(false);
    }
  };

  const detectCategory = (tags) => {
    const s = tags.join(' ').toLowerCase();
    if (s.includes('dairy') || s.includes('milk') || s.includes('cheese') || s.includes('yogurt')) return 'Fridge';
    if (s.includes('beverage') || s.includes('drink') || s.includes('juice') || s.includes('water')) return 'Beverages';
    if (s.includes('medicine') || s.includes('supplement') || s.includes('vitamin')) return 'Medicine';
    if (s.includes('frozen')) return 'Freezer';
    return 'Pantry';
  };

  const handleBarcodeChange = (e) => {
    const val = e.target.value;
    setForm((p) => ({ ...p, upc: val }));
    if (val.length >= 8) {
      // Debounce barcode typing lookup
      const handler = setTimeout(() => lookupBarcode(val), 1000);
      return () => clearTimeout(handler);
    }
  };

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
      await createProduct(form);
      setSuccess('Product successfully added!');
      setTimeout(() => {
        onNavigate('dashboard');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to create product.');
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
            ← Back to Inventory
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-xl w-full mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-xl font-extrabold text-slate-900">Add New Product</h1>
            <p className="text-slate-500 text-sm mt-1">Scan a product barcode or enter details manually below.</p>
          </div>

          {/* Feedback alerts */}
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

          {/* Camera Scanner Viewport */}
          {showScanner && (
            <div className="mb-6 border border-slate-200 rounded-2xl p-4 bg-slate-900 relative">
              {/* html5-qrcode container */}
              <div id="reader" className="w-full max-w-md mx-auto overflow-hidden rounded-xl bg-black" />
              
              {cameraError && <p className="text-red-400 text-xs text-center mt-2 font-medium">{cameraError}</p>}
              
              <div className="flex gap-2 justify-center mt-4">
                <button
                  onClick={() => {
                    const typed = prompt('Confirm Barcode / UPC code:');
                    if (typed) {
                      stopCamera();
                      setShowScanner(false);
                      lookupBarcode(typed);
                    }
                  }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Enter Code Manually
                </button>
                <button
                  onClick={() => { stopCamera(); setShowScanner(false); }}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Close Camera
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Barcode scan option */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">
                Barcode / UPC Code
                {barcodeLoading && <span className="ml-2 text-xs font-normal text-primary animate-pulse">Running lookup...</span>}
              </label>
              <div className="flex gap-2">
                <input
                  name="upc"
                  value={form.upc}
                  onChange={handleBarcodeChange}
                  placeholder="Scan or enter code"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-mono"
                />
                {!showScanner && (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                    Scan
                  </button>
                )}
              </div>
            </div>

            {/* Title / Name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Product Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Greek Yogurt"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
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
                <label className="block text-sm font-semibold text-slate-700">Amount / Quantity *</label>
                <input
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="e.g. 500g, 2 units"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-white"
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

            {/* Form actions */}
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
                Add Product
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

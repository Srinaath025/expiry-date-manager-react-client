export default function Hero({ onNavigate, user }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-purple-50/40 via-white to-slate-50 pt-16 pb-24 md:pt-24 md:pb-32">
      {/* Decorative background blurs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-primary/15 to-secondary/15 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light text-primary text-xs font-semibold tracking-wide uppercase mb-8 border border-primary/20 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Smart Expiry Management System
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
          Never Let Good Food & Products <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Expire Again</span>
        </h1>

        {/* Sub-heading */}
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Effortlessly scan barcodes using your camera, track shelf life, receive timely alerts, and reduce waste in your home or store.
        </p>

        {/* CTA Buttons — adapts for logged-in vs. guest */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          {user ? (
            <button
              onClick={() => onNavigate?.('dashboard')}
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-white text-base font-bold rounded-2xl shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 flex items-center justify-center gap-2 group"
            >
              <span>Go to Dashboard</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          ) : (
            <>
              <button
                onClick={() => onNavigate?.('register')}
                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-white text-base font-bold rounded-2xl shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 flex items-center justify-center gap-2 group"
              >
                <span>Get Started for Free</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <button
                onClick={() => onNavigate?.('login')}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 text-base font-bold rounded-2xl border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In to Account</span>
              </button>
            </>
          )}
        </div>

        {/* Highlights Cards */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 text-left scroll-mt-24">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Camera UPC Scan</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Scan product barcodes instantly using your smartphone or webcam to fetch item details automatically.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Expiration Reminders</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Get intelligent color-coded alerts before items spoil so you can use or restock them on time.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Category & Inventory</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Organize products by pantry, fridge, medicine cabinet, or custom categories seamlessly.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="pt-24 pb-12 scroll-mt-24 text-left">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">How FreshTrack Works</h2>
            <p className="text-slate-600 text-base">Get started tracking your items in three simple steps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-base shadow-md shadow-primary/20">1</div>
              <h3 className="text-lg font-bold text-slate-900">Scan or Type Barcode</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Scan any product barcode with your device camera, or type the code manually to look up product metadata.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center font-bold text-base shadow-md shadow-secondary/20">2</div>
              <h3 className="text-lg font-bold text-slate-900">Enter Details & Expiry</h3>
              <p className="text-slate-600 text-sm leading-relaxed">The name is auto-filled. Simply add the size/quantity (amount) and pick the expiry date from the calendar view.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-base shadow-md shadow-emerald-500/20">3</div>
              <h3 className="text-lg font-bold text-slate-900">Track on Dashboard</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Your dashboard filters and sorts items by nearest expiry, showing clear alerts when items are nearing expiration.</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div id="benefits" className="pt-20 pb-8 scroll-mt-24 text-left">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">Why Choose FreshTrack?</h2>
            <p className="text-slate-600 text-base">Key benefits of using our smart expiry manager.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Reduce Food Waste</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Use products before they expire to lower your carbon footprint and make the most out of your inventory.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Save Money</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Avoid throwing away forgotten groceries. Families save an average of $300-$500 annually using FreshTrack.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

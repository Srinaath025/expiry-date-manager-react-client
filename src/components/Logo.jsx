export default function Logo({ className = "h-9" }) {
  return (
    <div className={`flex items-center gap-2.5 font-bold text-xl tracking-tight select-none cursor-pointer ${className}`}>
      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-purple-400 text-white flex items-center justify-center shadow-md shadow-primary/25">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
        </span>
      </div>
      <span className="text-slate-900 font-extrabold">
        Fresh<span className="text-primary">Track</span>
      </span>
    </div>
  );
}

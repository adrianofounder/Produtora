import Link from "next/link";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Global Estrutural */}
      <aside className="w-64 glass-panel border-r border-white/5 hidden md:flex flex-col h-screen sticky top-0 p-6 z-40">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 shadow-glow" />
          <h1 className="font-sans font-bold text-xl tracking-tight text-white">AD_LABS</h1>
        </div>
        
        <nav className="flex flex-col gap-2">
          <Link href="/" className="px-4 py-2.5 rounded-md hover:bg-white/10 text-white font-medium transition-colors">🏠 Home</Link>
          <Link href="/canais" className="px-4 py-2.5 rounded-md text-slate-400 hover:bg-white/5 hover:text-white transition-colors">📺 Canais</Link>
          <Link href="/laboratorio" className="px-4 py-2.5 rounded-md text-slate-400 hover:bg-white/5 hover:text-white transition-colors">🌊 Laboratório</Link>
          <Link href="/tendencias" className="px-4 py-2.5 rounded-md text-slate-400 hover:bg-white/5 hover:text-white transition-colors">📈 Tendências</Link>
          <Link href="/studio" className="px-4 py-2.5 rounded-md text-slate-400 hover:bg-white/5 hover:text-white transition-colors">🧪 Studio (Blueprint)</Link>
          <Link href="/configuracoes" className="px-4 py-2.5 rounded-md text-slate-400 hover:bg-white/5 hover:text-white transition-colors">⚙️ Configurações</Link>
          
          <div className="mt-8 pt-4 border-t border-white/10">
            <Link href="/hq" className="px-4 py-2 rounded-md font-bold text-xs text-primary/70 hover:text-primary transition-colors flex items-center gap-2">
              <span>👁️</span> God Mode (HQ)
            </Link>
          </div>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
        {/* Topbar Global */}
        <header className="h-20 border-b border-white/5 glass-panel px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-medium">Data Local: Hoje</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="text-sm text-slate-300 font-medium">Sistema Online</span>
            </div>
            <Link href="/login" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">👤</Link>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="p-8 pb-20 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

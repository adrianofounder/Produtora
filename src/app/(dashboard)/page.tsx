export default function Home() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
      {/* KPI Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Canais", value: "3", desc: "Em operação" },
          { label: "Em Planejamento", value: "12", desc: "Ganchos e Scripts" },
          { label: "Na Fábrica", value: "8", desc: "Produção ativa" },
          { label: "Aguardando", value: "2", desc: "Vídeos atrasados", isAlert: true }
        ].map((kpi, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <div className="w-16 h-16 rounded-full bg-primary blur-2xl"></div>
            </div>
            <span className="text-sm font-medium text-slate-400">{kpi.label}</span>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold font-sans text-white">{kpi.value}</span>
              {kpi.isAlert && (
                <span className="w-2 h-2 mb-2 rounded-full bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></span>
              )}
            </div>
            <span className="text-xs text-slate-500">{kpi.desc}</span>
          </div>
        ))}
      </section>

      {/* Alertas Imediatos */}
      <section className="glass-panel rounded-2xl p-6 border-l-4 border-l-destructive">
        <h2 className="text-lg font-bold font-sans text-white mb-4 flex items-center gap-2">
          <span>🛑</span> Alertas Críticos da Operação
        </h2>
        <ul className="flex flex-col gap-3">
          <li className="flex items-center justify-between bg-white/5 px-4 py-3 rounded-lg border border-white/5">
            <span className="text-sm text-slate-300">O Canal <strong>"Jesus"</strong> tem 2 vídeos atrasados na esteira de Roteiro.</span>
            <button className="text-xs font-semibold px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors">
              Resolver Agora
            </button>
          </li>
          <li className="flex items-center justify-between bg-white/5 px-4 py-3 rounded-lg border border-white/5">
            <span className="text-sm text-slate-300">Conta YouTube XYZ perdeu a autenticação OAuth2.</span>
            <button className="text-xs font-semibold px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors">
              Reconectar
            </button>
          </li>
        </ul>
      </section>

      {/* Grid de Canais (A Tropa) */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold font-sans text-white">A Tropa (Canais Ativos)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border-t border-t-white/10 hover:-translate-y-1 transition-transform cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-900 to-slate-800 border border-white/10"></div>
                <div>
                  <h3 className="font-bold text-white">Histórias Ocultas</h3>
                  <span className="text-xs text-slate-400">🌊 Maré: Aguardando</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 border-t border-white/5 pt-4">
              <span>Plan: 4</span>
              <span>Prod: 2</span>
              <span>Prontos: 1</span>
            </div>
            <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden mt-2">
              <div className="h-full w-[45%] bg-blue-500 rounded-full"></div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border-t-2 border-t-primary shadow-[0_0_30px_rgba(124,58,237,0.15)] hover:-translate-y-1 transition-transform cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-900 to-red-900 border border-white/10"></div>
                <div>
                  <h3 className="font-bold text-white">Jesus Reage</h3>
                  <span className="text-xs text-primary font-semibold">🌊 Maré: Ativada (Eixo 05)</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 border-t border-white/5 pt-4">
              <span>Plan: 0</span>
              <span>Prod: 5</span>
              <span>Ativos: 48</span>
            </div>
            <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden mt-2">
              <div className="h-full w-[85%] bg-primary shadow-glow rounded-full"></div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default function Tendencias() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-sans font-bold text-white">📈 Tendências & Vídeos Virais</h1>
        <p className="text-slate-400 text-sm mt-1">Radar de Nichos Globais (Garimpo Inteligente)</p>
      </header>

      {/* Matriz Oceano Azul Base */}
      <section className="glass-panel p-6 rounded-2xl border-t border-t-white/10">
        <h2 className="text-lg font-bold text-white mb-4">🌊 Matriz Oceano Azul (Oportunidades)</h2>
        <div className="h-48 w-full bg-white/5 border border-white/10 rounded-xl relative flex items-center justify-center overflow-hidden">
          <div className="absolute w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(#7C3AED 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-red-500/50 rounded-full blur-sm flex items-center justify-center text-xs">Lotado</div>
          <div className="absolute bottom-1/4 right-1/3 w-8 h-8 bg-primary shadow-glow rounded-full flex items-center justify-center text-xs font-bold text-white z-10 cursor-pointer hover:scale-110 transition-transform" title="Gap Detectado: Relatos de Trabalho VIP">Gap</div>
          
          <span className="text-slate-500 z-0">Gráfico de Dispersão Carregando dados da API...</span>
        </div>
      </section>

      {/* Tabela Nichos */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold font-sans text-white">Resultados da Pesquisa (Garimpo)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="glass-panel p-5 rounded-xl border border-white/5 flex gap-4 hover:border-primary/50 transition-colors">
            <div className="w-32 h-20 bg-slate-800 rounded-md overflow-hidden relative">
               <div className="absolute bottom-1 right-1 bg-black/80 px-1 text-[10px] rounded">12:40</div>
            </div>
            <div className="flex flex-col gap-1 flex-1 justify-center">
              <h3 className="font-bold text-white text-sm line-clamp-2">The boss who lost $2M on purpose</h3>
              <p className="text-xs text-slate-400">Canal Gringo XYZ • 4M Views</p>
              <div className="mt-2 flex gap-2">
                <button className="text-xs font-semibold px-2 py-1 bg-primary text-white rounded hover:bg-primary/80">🚀 Criar Canal Disto</button>
                <button className="text-xs font-medium px-2 py-1 bg-white/10 text-white rounded hover:bg-white/20">🕵️ Analisar Canal</button>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

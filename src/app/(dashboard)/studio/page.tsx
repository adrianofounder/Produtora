export default function Studio() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-sans font-bold text-white">🧪 Studio (Blueprint)</h1>
          <p className="text-slate-400 text-sm mt-1">Engenharia de Retenção e Receita do Canal</p>
        </div>
        <button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-glow px-4 py-2 rounded-md font-bold transition-colors">
          Salvar Edição
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {/* Painel de Receita */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 md:col-span-2 flex flex-col gap-6">
          
          <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
            <span className="text-sm font-semibold text-white">CANAL ALVO: <span className="text-primary ml-2">Histórias Ocultas ▾</span></span>
            <div className="flex gap-2">
               <input type="text" className="bg-transparent border border-white/20 rounded px-3 py-1 text-xs text-white" value="https://youtube.com/watch?v=viral" readOnly/>
               <button className="text-xs bg-primary text-white px-3 border-none rounded font-bold shadow-glow">⚡ Analisar com Extrator IA</button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold text-white">A. ESTRUTURA DE ENGAJAMENTO</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400">Hook Inquebrável (0-5s)</label>
                <textarea className="bg-surface-1 border border-white/10 rounded p-3 text-sm text-white resize-none" rows={3} defaultValue={"Iniciar narrando pelo ponto mais crítico e injusto da história e pausar dramáticamente."}></textarea>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs text-slate-400">Voz do Narrador Padrão</label>
                  <select className="bg-surface-1 border border-white/10 rounded p-2 text-sm text-white"><option>Marcus (Drama Hushed)</option></select>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                   <label className="text-xs text-slate-400">Emoção Dominante</label>
                   <select className="bg-surface-1 border border-white/10 rounded p-2 text-sm text-white"><option>Choque Moral</option></select>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Sidebar Status Blueprint */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-6 border-t-4 border-t-emerald-500">
            <h3 className="font-bold text-white mb-2">Veredito do Maestro</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Quality Score:</span> <span className="font-bold text-emerald-400">8.5 / 10</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Gatilhos Escapados:</span> <span className="font-bold text-white">Curiosity Gap</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Risco:</span> <span className="font-bold text-emerald-400">Baixo</span></div>
            </div>
            <button className="w-full mt-6 bg-white/10 text-white border border-white/20 py-2 rounded-md hover:bg-white/20 transition-colors">
              Injetar no Motor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

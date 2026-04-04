export default function HQ() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-sans font-bold text-white flex items-center gap-2"><span>👁️</span> AD_LABS Headquarters (God Mode)</h1>
        <p className="text-slate-400 text-sm mt-1">Centro Nervoso e Tributário de todo o Ecosistema</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
       <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
              <div className="w-24 h-24 rounded-full bg-red-600 blur-3xl"></div>
          </div>
          <h2 className="text-lg font-bold text-white z-10">💰 Custos de Inteligência Artificial</h2>
          <div className="flex flex-col gap-2 z-10">
            <div className="flex justify-between border-b border-white/5 py-2">
              <span className="text-sm text-slate-400">OpenAI (Tokens consumidos hoje)</span>
              <span className="font-bold text-white">$4.50</span>
            </div>
            <div className="flex justify-between border-b border-white/5 py-2">
              <span className="text-sm text-slate-400">ElevenLabs (Áudios gerados)</span>
              <span className="font-bold text-white">$12.20</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-sm font-bold text-primary">Total Estimado Mês</span>
              <span className="font-bold text-primary text-xl">$150.00</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-white/5">
          <h2 className="text-lg font-bold text-white">👥 Gestão de Assinantes (Tenants)</h2>
          <div className="flex flex-col gap-3">
             <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                <div>
                   <p className="font-bold text-sm text-white">Cliente VIP #1</p>
                   <p className="text-xs text-slate-400">Plano Anual via Kiwify</p>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Ativo</span>
             </div>
             <button className="text-xs border border-white/20 text-white w-full py-2 hover:bg-white/10 rounded">Sincronizar Webhooks Kiwify</button>
          </div>
        </div>

      </section>
    </div>
  );
}

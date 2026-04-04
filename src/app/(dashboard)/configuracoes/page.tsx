export default function Configuracoes() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <header>
        <h1 className="text-2xl font-sans font-bold text-white">🔑 Configurações do Sistema</h1>
        <p className="text-slate-400 text-sm mt-1">Integrações de API e Conexão de Contas Sociais</p>
      </header>

      <section className="flex flex-col gap-6">
        {/* Contas Conectadas */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-white/5">
          <div className="flex justify-between items-center">
             <h2 className="text-lg font-bold text-white">📺 Contas e Canais Conectados</h2>
             <button className="text-xs border border-white/20 text-white px-3 py-1.5 rounded hover:bg-white/5">+ Nova Conta</button>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex-1 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600 flex-center font-bold text-white">YT</div>
                <div>
                  <p className="text-sm font-bold text-white">Histórias Ocultas</p>
                  <p className="text-xs text-emerald-400">🟢 Ativa (Autenticada)</p>
                </div>
              </div>
              <button className="text-xs text-slate-400 hover:text-white">Desconectar</button>
            </div>
          </div>
        </div>

        {/* APIs */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-white/5">
          <div className="flex justify-between items-center">
             <h2 className="text-lg font-bold text-white">🧠 Chaves de API (Inteligência)</h2>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { provider: "Provedor de Texto (OpenAI/Gemini)", status: "🟢 ON", date: "03/04/2026" },
              { provider: "Provedor de Áudio (ElevenLabs)", status: "🔴 FALTANDO", date: "--/--/----" },
              { provider: "Supabase Backend Auth", status: "🟢 ON", date: "Integrado via RLS" }
            ].map((api, idx) => (
               <div key={idx} className="flex justify-between items-center pb-3 border-b border-white/5 last:border-0 last:pb-0">
                  <span className="text-sm font-medium text-slate-300">{api.provider}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs">{api.status}</span>
                    <button className="text-xs text-primary hover:underline">Editar Chave</button>
                  </div>
               </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

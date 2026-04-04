export default function Canais() {
  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Top Bar Específico da Tela de Canais */}
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-3 text-sm font-medium text-white">
          <span>Selecionar Canal:</span>
          <select className="bg-surface-1 border border-white/20 rounded-md px-3 py-1.5 text-white outline-none focus:border-primary">
            <option>Histórias Ocultas</option>
            <option>Jesus Reage</option>
            <option>Escola Drama</option>
          </select>
        </div>
        <button className="bg-primary hover:bg-primary/80 transition-colors text-white px-4 py-2 rounded-md font-bold text-sm shadow-glow">
          + Novo Canal
        </button>
      </div>

      {/* Header do Canal / KPIs / Dados Gerais */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <div className="w-32 h-32 rounded-full bg-primary blur-3xl"></div>
        </div>

        <div>
          <h1 className="text-2xl font-sans font-bold text-white tracking-tight">🎬 Canal: HISTÓRIAS OCULTAS</h1>
          <p className="text-primary font-bold text-sm mt-1">🌊 STATUS DA MARÉ: Eixo "Relatos TRABALHO" bombando!</p>
        </div>

        {/* Estatísticas Macro */}
        <div className="flex gap-4 text-sm font-medium text-slate-300">
           <span>Planejamento: <strong className="text-white">4</strong></span> |
           <span>Produção: <strong className="text-white">2</strong></span> |
           <span>Prontos: <strong className="text-white">1</strong></span> |
           <span>Agendados: <strong className="text-white">3</strong></span> |
           <span>Atrasados: <strong className="text-white">0</strong></span> |
           <span>Publicados: <strong className="text-white">12</strong></span>
        </div>

        {/* Dados do Canal */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400 bg-black/20 p-4 rounded-xl border border-white/5">
           <span>Idioma: <strong className="text-slate-200">PT-BR</strong></span>
           <span>Frequência: <strong className="text-slate-200">1/dia</strong></span>
           <span>Horário padrão: <strong className="text-slate-200">18h00</strong></span>
           <span>E-mail: <strong className="text-slate-200">contato@historias.com</strong></span>
           <span className="w-full mt-2">Anotações/Descrição: <em className="text-slate-300">Canal focado em relatos dark. Não usar narração com voz aguda.</em></span>
        </div>

        <div className="flex gap-3">
          <button className="text-xs bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded border border-white/5 transition-colors flex items-center gap-2">
            📊 Visualizar Analytics e X-Ray do Canal
          </button>
        </div>
      </div>

      {/* Abas de Configuração Específica do Canal (Ref Seção 4.3 / 10.2 do PRD) */}
      <div className="flex gap-2 border-b border-white/10 pb-3 mt-2">
        <button className="px-4 py-2 rounded-md font-semibold text-sm bg-white/10 text-white">👤 Perfil Geral</button>
        <button className="px-4 py-2 rounded-md font-semibold text-sm text-slate-400 hover:text-white hover:bg-white/5">👥 Equipe</button>
        <button className="px-4 py-2 rounded-md font-semibold text-sm text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-1">🤖 Automação (Auto-Refill)</button>
        <button className="px-4 py-2 rounded-md font-semibold text-sm text-slate-400 hover:text-white hover:bg-white/5">▶️ Integrações YouTube</button>
      </div>

      {/* Área da Fábrica / Gestão de Vídeos Específicos */}
      <div className="flex flex-col gap-4 mt-2">
        {/* Filtros e Controles do Kanban */}
        <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
           <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-bold bg-white text-black rounded">Todos (22)</button>
              <button className="px-3 py-1 text-xs font-medium text-slate-400 hover:text-white">Planejamento (4)</button>
              <button className="px-3 py-1 text-xs font-medium text-slate-400 hover:text-white">Produção (2)</button>
              <button className="px-3 py-1 text-xs font-medium text-slate-400 hover:text-white">Finalizados (1)</button>
              <button className="px-3 py-1 text-xs font-medium text-slate-400 hover:text-white">Agendados/Publicados (15)</button>
           </div>
           <div className="flex items-center gap-4">
              <input type="text" placeholder="🔍 Buscar títulos..." className="bg-transparent border border-white/20 text-sm text-white px-3 py-1 rounded outline-none focus:border-primary" />
              <div className="text-xs font-medium text-slate-300 flex items-center gap-2 border-l border-white/10 pl-4">
                 <span>Visualização:</span>
                 <span className="text-primary font-bold">(•) KANBAN</span>
                 <span className="hover:text-white cursor-pointer">( ) CALENDÁRIO</span>
              </div>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                 + Adicionar Novo Vídeo
              </button>
           </div>
        </div>

        {/* Kanban: Lista de Vídeos */}
        <div className="flex flex-col gap-3">
          {/* Card Vídeo 1 */}
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-primary flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex flex-col gap-2">
              <div className="flex gap-3 items-center">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase border border-primary/20">Em Produção</span>
                <span className="text-xs font-medium text-slate-500">Data Prevista: 06/04</span>
                <span className="text-xs font-medium text-slate-400 ml-4">Eixo: Relatos TRABALHO</span>
              </div>
              <h3 className="font-sans font-bold text-white text-lg">O chefe que não sabia de nada</h3>
              <div className="flex gap-2 text-xs font-medium mt-1">
                 <span className="text-emerald-400">✅ Título</span>
                 <span className="text-emerald-400">✅ Roteiro</span>
                 <span className="text-amber-400 animate-pulse">⏳ Áudio</span>
                 <span className="text-slate-500">[ ] Imagens</span>
                 <span className="text-slate-500">[ ] Montagem</span>
                 <span className="text-slate-500">[ ] Thumb</span>
                 <span className="text-slate-500">[ ] Agendado</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-xs bg-white/5 hover:bg-white/10 text-white px-2 py-1 rounded border border-white/10">✏️ Editar</button>
                <button className="text-xs bg-destructive/10 hover:bg-destructive/20 text-destructive px-2 py-1 rounded border border-destructive/20">🗑️ Excluir</button>
              </div>
              <button className="text-xs bg-primary hover:bg-primary/80 text-white font-bold shadow-glow px-4 py-2 rounded transition-colors mt-2">
                Aprovar Áudio
              </button>
            </div>
          </div>

          {/* Card Vídeo 2 */}
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-slate-600 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex flex-col gap-2">
              <div className="flex gap-3 items-center">
                <span className="text-xs font-bold text-slate-300 bg-slate-700/50 px-2 py-0.5 rounded uppercase border border-white/10">Planejamento</span>
                <span className="text-xs font-medium text-slate-500">Data Prevista: 07/04</span>
                <span className="text-xs font-medium text-slate-400 ml-4">Eixo: Relatos TRABALHO</span>
              </div>
              <h3 className="font-sans font-bold text-white text-lg">Fui demitida e olha no que deu</h3>
              <div className="flex gap-2 text-xs font-medium mt-1">
                 <span className="text-emerald-400">✅ Título</span>
                 <span className="text-amber-400 animate-pulse">⏳ Roteiro</span>
                 <span className="text-slate-500">[ ] Áudio</span>
                 <span className="text-slate-500">[ ] Imagens</span>
                 <span className="text-slate-500">[ ] Montagem</span>
                 <span className="text-slate-500">[ ] Thumb</span>
                 <span className="text-slate-500">[ ] Agendado</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-xs bg-white/5 hover:bg-white/10 text-white px-2 py-1 rounded border border-white/10">✏️ Editar</button>
                <button className="text-xs bg-destructive/10 hover:bg-destructive/20 text-destructive px-2 py-1 rounded border border-destructive/20">🗑️ Excluir</button>
              </div>
              <button className="text-xs bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded transition-colors mt-2">
                Revisar Ideia
              </button>
            </div>
          </div>
          
          {/* Card Vídeo 3 */}
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-emerald-500 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group bg-emerald-900/5">
            <div className="flex flex-col gap-2">
              <div className="flex gap-3 items-center">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-900/50 px-2 py-0.5 rounded uppercase border border-emerald-500/20">Agendado</span>
                <span className="text-xs font-medium text-slate-500">Data Prevista: 05/04</span>
                <span className="text-xs font-medium text-slate-400 ml-4">Eixo: Relatos TRABALHO</span>
              </div>
              <h3 className="font-sans font-bold text-white text-lg">O colega que roubava ideias</h3>
              <div className="flex gap-2 text-xs font-medium mt-1 opacity-70">
                 <span className="text-emerald-400">✅ Título</span>
                 <span className="text-emerald-400">✅ Roteiro</span>
                 <span className="text-emerald-400">✅ Áudio</span>
                 <span className="text-emerald-400">✅ Imagens</span>
                 <span className="text-emerald-400">✅ Montagem</span>
                 <span className="text-emerald-400">✅ Thumb</span>
                 <span className="text-emerald-400">✅ Agendado</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-xs bg-white/5 hover:bg-white/10 text-white px-2 py-1 rounded border border-white/10">✏️ Editar</button>
                <button className="text-xs bg-destructive/10 hover:bg-destructive/20 text-destructive px-2 py-1 rounded border border-destructive/20">🗑️ Excluir</button>
              </div>
              <button className="text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/20 font-bold px-4 py-2 rounded transition-colors mt-2">
                📅 Ver no Calendário
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

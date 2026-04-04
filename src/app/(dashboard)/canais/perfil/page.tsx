import React from 'react';
import { Settings, User, Users, Bot, Youtube, Save, Info, ImagePlus, ShieldAlert } from 'lucide-react';

export default function CanalPerfilPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <header className="flex items-center justify-between mt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="icon-box-sm icon-box-accent">
              <Settings className="h-5 w-5 text-[var(--color-accent)]" />
            </span>
            Identidade do Canal: <span className="text-[var(--color-accent)] ml-1">HISTÓRIAS OCULTAS</span>
          </h1>
          <p className="text-[var(--color-text-3)] text-sm mt-1">
            Espelho do YouTube. Configure metadados e regras de operação para o canal.
          </p>
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex items-center gap-1 border-b border-[var(--color-surface)] pb-px">
        <button className="nav-active flex items-center gap-2 px-4 py-2 text-sm font-medium">
          <User className="h-4 w-4" />
          PERFIL GERAL
        </button>
        <button className="nav-item flex items-center gap-2 px-4 py-2 text-sm font-medium">
          <Users className="h-4 w-4" />
          Equipe
        </button>
        <button className="nav-item flex items-center gap-2 px-4 py-2 text-sm font-medium">
          <Bot className="h-4 w-4" />
          Automação (Auto-Refill)
        </button>
        <button className="nav-item flex items-center gap-2 px-4 py-2 text-sm font-medium">
          <Youtube className="h-4 w-4" />
          Integrações YouTube
        </button>
      </nav>

      {/* Panel: Perfil Geral */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Avatar e Banner */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="section-label">Identidade Visual</h3>
            
            <div className="card-inner flex flex-col items-center justify-center py-8 gap-4">
              <div className="h-24 w-24 rounded-full bg-[var(--color-background)] border-2 border-[var(--color-surface)] flex items-center justify-center relative overflow-hidden group cursor-pointer transition-all hover:border-[var(--color-accent)]">
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ImagePlus className="h-6 w-6 text-white" />
                </div>
                <Users className="h-10 w-10 text-[var(--color-text-3)]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white">Avatar do Canal</p>
                <p className="text-xs text-[var(--color-text-3)]">800x800px (PNG ou JPG)</p>
              </div>
            </div>

            <div className="card-inner aspect-video flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-colors hover:border-[var(--color-accent)]">
              <ImagePlus className="h-6 w-6 text-[var(--color-text-3)]" />
              <div>
                <p className="text-sm font-medium text-white">Capa / Banner</p>
                <p className="text-xs text-[var(--color-text-3)]">2560x1440px</p>
              </div>
            </div>
          </div>

          {/* Dados Textuais e Metadados */}
          <div className="md:col-span-2 space-y-6">
            
            <div className="space-y-3">
              <h3 className="section-label flex items-center justify-between">
                DESCRIÇÃO PADRÃO (Bio)
                <span className="text-[10px] text-[var(--color-text-3)] font-normal normal-case">Visível no Módulo "Sobre"</span>
              </h3>
              <textarea 
                className="input w-full h-28 resize-none"
                defaultValue="Canal focado em histórias narradas sobre exploração laboral. Contamos os relatos mais absurdos e bizarros enviados de forma anônima por trabalhadores que deram a volta por cima."
                placeholder="Descreva o canal..."
              />
            </div>

            <div className="space-y-4">
              <h3 className="section-label">METADADOS DE SUBIDA</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-text-3)]">Idioma Principal</label>
                  <select className="input w-full" defaultValue="pt-BR">
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-text-3)]">País / Região</label>
                  <select className="input w-full" defaultValue="BR">
                    <option value="BR">Brasil</option>
                    <option value="US">Estados Unidos</option>
                    <option value="PT">Portugal</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-text-3)]">Categoria Padrão</label>
                  <select className="input w-full" defaultValue="entertainment">
                    <option value="entertainment">Entretenimento</option>
                    <option value="education">Educação</option>
                    <option value="gaming">Jogos</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-text-3)]">Privacidade da Subida</label>
                  <select className="input w-full" defaultValue="unlisted">
                    <option value="unlisted">Não Listado (Para aprovação no app)</option>
                    <option value="private">Privado</option>
                    <option value="public">Público (Direto)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="divider"></div>

            {/* Compliance IA (FR18) */}
            <div className="card-accent p-4 flex gap-4 items-start">
              <div className="icon-box-sm icon-box-warning shrink-0 mt-0.5">
                <ShieldAlert className="h-4 w-4 text-[var(--color-warning)]" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white flex items-center gap-2">
                    Conteúdo Sintético ou Alterado (FR18)
                  </p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--color-surface)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
                  </label>
                </div>
                <p className="text-xs text-[var(--color-text-3)] leading-relaxed">
                  Obrigatório marcar a flag "Conteúdo Alterado" nos metadados do YouTube Studio. Isto protege o canal contra Shadowban e punições do algoritmo ao informar uso de Inteligência Artificial.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex items-center justify-between pt-4 border-t border-[var(--color-surface)]">
          <p className="text-xs text-[var(--color-text-3)] flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            Alterações refletirão no próximo envio (upload).
          </p>
          <button className="btn-primary">
            <Save className="h-4 w-4 mr-2" />
            Salvar Perfil do Canal
          </button>
        </div>

      </div>
    </div>
  );
}

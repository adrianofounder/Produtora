'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Settings, User, Users, Bot, MonitorPlay, Save, Info, ImagePlus, ShieldAlert, Loader2, CheckCircle2 } from 'lucide-react';

interface Canal {
  id: string;
  nome: string;
  descricao: string | null;
  idioma: string;
  pais: string;
  categoria: string;
  privacidade_padrao: 'public' | 'unlisted' | 'private';
  conteudo_sintetico: boolean;
  email_contato: string | null;
  motor_ativo: boolean;
  auto_aprovacao_titulos: boolean;
  auto_aprovacao_roteiros: boolean;
  auto_post: boolean;
  estoque_minimo_planejamento: number;
  estoque_minimo_producao: number;
}

function CanalPerfilContent() {
  const searchParams = useSearchParams();
  const canalId = searchParams.get('id');
  const [canais, setCanais] = useState<Canal[]>([]);
  const [canal, setCanal] = useState<Canal | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // form state
  const [descricao, setDescricao] = useState('');
  const [idioma, setIdioma] = useState('pt-BR');
  const [pais, setPais] = useState('BR');
  const [categoria, setCategoria] = useState('Entretenimento');
  const [privacidade, setPrivacidade] = useState<'public'|'unlisted'|'private'>('unlisted');
  const [sintetico, setSintetico] = useState(true);
  const [motorAtivo, setMotorAtivo] = useState(false);
  const [autoAprovTitulos, setAutoAprovTitulos] = useState(false);
  const [autoAprovRoteiros, setAutoAprovRoteiros] = useState(false);
  const [estoqueMin, setEstoqueMin] = useState(10);

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      const res = await fetch('/api/canais');
      if (!res.ok) { setLoading(false); return; }
      const data: Canal[] = await res.json();
      setCanais(Array.isArray(data) ? data : []);
      const alvo = data.find(c => c.id === canalId) ?? data[0];
      if (alvo) {
        setCanal(alvo);
        setDescricao(alvo.descricao ?? '');
        setIdioma(alvo.idioma);
        setPais(alvo.pais);
        setCategoria(alvo.categoria);
        setPrivacidade(alvo.privacidade_padrao);
        setSintetico(alvo.conteudo_sintetico);
        setMotorAtivo(alvo.motor_ativo);
        setAutoAprovTitulos(alvo.auto_aprovacao_titulos);
        setAutoAprovRoteiros(alvo.auto_aprovacao_roteiros);
        setEstoqueMin(alvo.estoque_minimo_planejamento);
      }
      setLoading(false);
    }
    carregar();
  }, [canalId]);

  async function salvar() {
    if (!canal) return;
    setSaving(true);
    setSaved(false);
    try {
      await fetch(`/api/canais/${canal.id}/perfil`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descricao,
          idioma,
          pais,
          categoria,
          privacidade_padrao: privacidade,
          conteudo_sintetico: sintetico,
          motor_ativo: motorAtivo,
          auto_aprovacao_titulos: autoAprovTitulos,
          auto_aprovacao_roteiros: autoAprovRoteiros,
          estoque_minimo_planejamento: estoqueMin,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--color-accent)' }} />
      </div>
    );
  }

  if (!canal) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: 'var(--color-text-3)' }}>Nenhum canal encontrado. Crie um canal primeiro.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <header className="flex items-center justify-between mt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="icon-box-sm icon-box-accent">
              <Settings className="h-5 w-5 text-[var(--color-accent)]" />
            </span>
            Identidade do Canal: <span className="text-[var(--color-accent)] ml-1">{canal.nome.toUpperCase()}</span>
          </h1>
          <p className="text-[var(--color-text-3)] text-sm mt-1">
            Espelho do YouTube. Configure metadados e regras de operação para o canal.
          </p>
        </div>
        {/* Canal switcher */}
        {canais.length > 1 && (
          <select
            className="input text-sm"
            value={canal.id}
            onChange={(e) => {
              const found = canais.find(c => c.id === e.target.value);
              if (found) {
                setCanal(found);
                setDescricao(found.descricao ?? '');
                setIdioma(found.idioma);
                setPais(found.pais);
                setCategoria(found.categoria);
                setPrivacidade(found.privacidade_padrao);
                setSintetico(found.conteudo_sintetico);
              }
            }}
          >
            {canais.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        )}
      </header>

      {/* Tabs */}
      <nav className="flex items-center gap-1 border-b border-[var(--color-surface)] pb-px">
        <button className="nav-active flex items-center gap-2 px-4 py-2 text-sm font-medium">
          <User className="h-4 w-4" /> PERFIL GERAL
        </button>
        <button className="nav-item flex items-center gap-2 px-4 py-2 text-sm font-medium">
          <Users className="h-4 w-4" /> Equipe
        </button>
        <button className="nav-item flex items-center gap-2 px-4 py-2 text-sm font-medium">
          <Bot className="h-4 w-4" /> Automação (Auto-Refill)
        </button>
        <button className="nav-item flex items-center gap-2 px-4 py-2 text-sm font-medium">
          <MonitorPlay className="h-4 w-4" /> Integrações YouTube
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

          {/* Dados e Metadados */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-3">
              <h3 className="section-label flex items-center justify-between">
                DESCRIÇÃO PADRÃO (Bio)
                <span className="text-[10px] text-[var(--color-text-3)] font-normal normal-case">Visível no Módulo "Sobre"</span>
              </h3>
              <textarea
                className="input w-full h-28 resize-none"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o canal..."
              />
            </div>

            <div className="space-y-4">
              <h3 className="section-label">METADADOS DE SUBIDA</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-text-3)]">Idioma Principal</label>
                  <select className="input w-full" value={idioma} onChange={(e) => setIdioma(e.target.value)}>
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-text-3)]">País / Região</label>
                  <select className="input w-full" value={pais} onChange={(e) => setPais(e.target.value)}>
                    <option value="BR">Brasil</option>
                    <option value="US">Estados Unidos</option>
                    <option value="PT">Portugal</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-text-3)]">Categoria Padrão</label>
                  <select className="input w-full" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                    <option value="Entretenimento">Entretenimento</option>
                    <option value="Educação">Educação</option>
                    <option value="Jogos">Jogos</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-text-3)]">Privacidade da Subida</label>
                  <select className="input w-full" value={privacidade} onChange={(e) => setPrivacidade(e.target.value as typeof privacidade)}>
                    <option value="unlisted">Não Listado (Para aprovação no app)</option>
                    <option value="private">Privado</option>
                    <option value="public">Público (Direto)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="divider" />

            {/* Compliance IA (FR18) */}
            <div className="card-accent p-4 flex gap-4 items-start">
              <div className="icon-box-sm icon-box-warning shrink-0 mt-0.5">
                <ShieldAlert className="h-4 w-4 text-[var(--color-warning)]" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">Conteúdo Sintético ou Alterado (FR18)</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={sintetico} onChange={(e) => setSintetico(e.target.checked)} className="sr-only peer" />
                    <div className="w-9 h-5 bg-[var(--color-surface)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
                  </label>
                </div>
                <p className="text-xs text-[var(--color-text-3)] leading-relaxed">
                  Obrigatório marcar a flag "Conteúdo Alterado" nos metadados do YouTube Studio. Protege o canal contra Shadowban.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex items-center justify-between pt-4 border-t border-[var(--color-surface)]">
          <p className="text-xs text-[var(--color-text-3)] flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            {saved ? 'Perfil salvo com sucesso!' : 'Alterações refletirão no próximo envio (upload).'}
          </p>
          <button onClick={salvar} disabled={saving} className="btn-primary">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="h-4 w-4" style={{ color: 'var(--color-success)' }} />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar Perfil do Canal'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CanalPerfilPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--color-accent)' }} /></div>}>
      <CanalPerfilContent />
    </Suspense>
  );
}

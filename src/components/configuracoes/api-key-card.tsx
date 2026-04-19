'use client';

import { useState } from 'react';
import { Pencil, Loader2, CheckCircle2, ShieldAlert, Plus, Trash2, Zap } from 'lucide-react';
import { BaseModal } from '@/components/ui/base-modal';
import {
  upsertCredential,
  deleteCredential,
  ICredentialPayload,
} from '@/app/(dashboard)/configuracoes/actions';

export type ApiStatus = 'on' | 'faltando' | 'fallback';

export interface ApiData {
  id: number;
  provider_type: string;        // Chave técnica do provedor
  provider: string;             // Nome amigável
  tipo: string;                 // Categoria de uso
  status: ApiStatus;
  api_key_masked?: string;      // Chave mascarada para display
  base_url?: string;
  model_id?: string;
  maxDailyLimit?: number;
  isLimitActive?: boolean;
  isSystemFallback?: boolean;
  dailySpendCount?: number;
}

interface ApiKeyCardProps {
  apis: ApiData[];
  onRefresh?: () => void;
}

// Providers pré-cadastrados para novo registro
const PROVIDER_PRESETS = [
  { provider_type: 'llm_text',  label: 'Motor LLM (Texto)',   placeholder: 'OpenAI, Gemini, DeepSeek...' },
  { provider_type: 'tts_audio', label: 'Motor TTS (Voz)',     placeholder: 'ElevenLabs, OpenAI TTS...' },
  { provider_type: 'image_gen', label: 'Geração de Imagem',   placeholder: 'DALL-E, Stable Diffusion...' },
];

// ============================================================
// Barra de progresso do teto de gastos
// ============================================================
function SpendBar({ spent, limit, isActive }: { spent: number; limit: number; isActive: boolean }) {
  if (!isActive || !limit) return null;
  const pct = Math.min((spent / limit) * 100, 100);
  const color = pct > 85 ? 'var(--color-error)' : pct > 60 ? 'var(--color-warning)' : 'var(--color-success)';

  return (
    <div className="flex flex-col gap-1 mt-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px]" style={{ color: 'var(--color-text-3)' }}>
          Uso do dia
        </span>
        <span className="text-[10px] font-mono" style={{ color }}>
          {spent.toLocaleString()} / {limit.toLocaleString()} un.
        </span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ============================================================
// Componente principal
// ============================================================
export function ApiKeyCard({ apis, onRefresh }: ApiKeyCardProps) {
  const [editingApi, setEditingApi] = useState<ApiData | null>(null);
  const [isNewMode, setIsNewMode]   = useState(false);

  // Campos do formulário
  const [providerNameInput,    setProviderNameInput]    = useState('');
  const [providerTypeInput,    setProviderTypeInput]    = useState('llm_text');
  const [apiKeyInput,          setApiKeyInput]          = useState('');
  const [baseUrlInput,         setBaseUrlInput]         = useState('');
  const [modelIdInput,         setModelIdInput]         = useState('');
  const [maxLimitInput,        setMaxLimitInput]        = useState(50000);
  const [limitActiveInput,     setLimitActiveInput]     = useState(true);
  const [systemFallbackInput,  setSystemFallbackInput]  = useState(false);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg]     = useState('');

  const openEditor = (api: ApiData) => {
    setIsNewMode(false);
    setEditingApi(api);
    setProviderNameInput(api.provider);
    setProviderTypeInput(api.provider_type);
    setApiKeyInput(api.api_key_masked ?? '');
    setBaseUrlInput(api.base_url ?? '');
    setModelIdInput(api.model_id ?? '');
    setMaxLimitInput(api.maxDailyLimit ?? 50000);
    setLimitActiveInput(api.isLimitActive ?? true);
    setSystemFallbackInput(api.isSystemFallback ?? false);
    setSaveStatus('idle');
    setErrorMsg('');
  };

  const openNew = () => {
    setIsNewMode(true);
    setEditingApi(null);
    setProviderNameInput('');
    setProviderTypeInput('llm_text');
    setApiKeyInput('');
    setBaseUrlInput('');
    setModelIdInput('');
    setMaxLimitInput(50000);
    setLimitActiveInput(true);
    setSystemFallbackInput(false);
    setSaveStatus('idle');
    setErrorMsg('');
  };

  const closeModal = () => {
    setEditingApi(null);
    setIsNewMode(false);
    setSaveStatus('idle');
    setErrorMsg('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    setErrorMsg('');

    const providerType = isNewMode ? providerTypeInput : editingApi!.provider_type;

    const payload: ICredentialPayload = {
      provider_type:     providerType,
      provider_name:     providerNameInput.trim(),
      api_key:           apiKeyInput,
      base_url:          baseUrlInput.trim() || undefined,
      model_id:          modelIdInput.trim() || undefined,
      max_daily_limit:   maxLimitInput,
      is_limit_active:   limitActiveInput,
      is_system_fallback: systemFallbackInput,
    };

    const result = await upsertCredential(payload);

    if (result.success) {
      setSaveStatus('saved');
      onRefresh?.();
      setTimeout(closeModal, 1500);
    } else {
      setSaveStatus('error');
      setErrorMsg(result.error ?? 'Erro desconhecido.');
    }
  };

  const handleDelete = async (api: ApiData) => {
    if (!confirm(`Remover credencial "${api.provider}"?`)) return;
    const result = await deleteCredential(api.provider_type);
    if (result.success) onRefresh?.();
  };

  const isModalOpen = !!editingApi || isNewMode;
  const modalTitle  = isNewMode ? 'Adicionar Provedor de IA' : `Configurar ${editingApi?.provider}`;

  return (
    <>
      <div className="card overflow-hidden">
        {/* Header da tabela */}
        <div
          className="grid px-5 py-3 border-b"
          style={{
            gridTemplateColumns: '1fr 130px 120px 90px',
            borderColor: 'var(--color-border)',
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          {['Provedor / Modelo', 'Tipo', 'Status', 'Ação'].map((h) => (
            <span key={h} className="section-label">{h}</span>
          ))}
        </div>

        {/* Linhas */}
        {apis.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-sm" style={{ color: 'var(--color-text-3)' }}>
            Nenhum provedor configurado ainda.
          </div>
        ) : (
          apis.map((api) => (
            <div
              key={api.id}
              className="flex flex-col border-b last:border-b-0"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div
                className="grid items-center px-5 py-4 transition-colors"
                style={{ gridTemplateColumns: '1fr 130px 120px 90px' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text-1)' }}>
                    {api.provider}
                  </span>
                  {api.model_id && (
                    <span className="text-[11px] font-mono" style={{ color: 'var(--color-text-3)' }}>
                      {api.model_id}
                    </span>
                  )}
                </div>

                <span className="text-[12px]" style={{ color: 'var(--color-text-3)' }}>
                  {api.tipo}
                </span>

                <div className="flex items-center gap-2">
                  {api.status === 'on' ? (
                    <>
                      <div className="dot-live" />
                      <span className="text-[12px] font-bold" style={{ color: 'var(--color-success)' }}>ATIVA</span>
                    </>
                  ) : api.status === 'fallback' ? (
                    <>
                      <Zap size={10} style={{ color: 'var(--color-warning)' }} />
                      <span className="text-[12px] font-bold" style={{ color: 'var(--color-warning)' }}>SISTEMA</span>
                    </>
                  ) : (
                    <>
                      <div className="dot-error" />
                      <span className="text-[12px] font-bold" style={{ color: 'var(--color-error)' }}>FALTANDO</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button onClick={() => openEditor(api)} className="btn-ghost h-7 px-2 text-[11px]">
                    <Pencil size={10} /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(api)}
                    className="btn-ghost h-7 px-2 text-[11px]"
                    style={{ color: 'var(--color-error)' }}
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>

              {/* Barra de progresso do teto */}
              {api.isLimitActive && api.maxDailyLimit && (
                <div className="px-5 pb-3">
                  <SpendBar
                    spent={api.dailySpendCount ?? 0}
                    limit={api.maxDailyLimit}
                    isActive={api.isLimitActive ?? false}
                  />
                </div>
              )}
            </div>
          ))
        )}

        {/* Botão adicionar */}
        <div className="flex justify-end px-5 py-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <button onClick={openNew} className="btn-primary h-8 text-xs gap-1.5">
            <Plus size={12} /> Adicionar Provedor
          </button>
        </div>
      </div>

      {/* Modal de edição / criação */}
      <BaseModal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        <form onSubmit={handleSave} className="flex flex-col gap-5 pt-4">

          {/* Nome do Provedor */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-2)' }}>
              Nome do Provedor *
            </label>
            <input
              type="text"
              placeholder="Ex: OpenAI GPT-4o, ElevenLabs, DeepSeek..."
              className="input-field max-w-full text-sm"
              value={providerNameInput}
              onChange={(e) => setProviderNameInput(e.target.value)}
              required
            />
          </div>

          {/* Tipo (novo registro) ou exibição fixa */}
          {isNewMode ? (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-2)' }}>
                Tipo de Motor *
              </label>
              <select
                className="input-field max-w-full text-sm"
                value={providerTypeInput}
                onChange={(e) => setProviderTypeInput(e.target.value)}
              >
                {PROVIDER_PRESETS.map((p) => (
                  <option key={p.provider_type} value={p.provider_type}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {/* API Key */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-2)' }}>
              API Key {systemFallbackInput ? '(opcional se usar Chave do Sistema)' : '*'}
            </label>
            <input
              type="password"
              placeholder={systemFallbackInput ? 'Deixe vazio para usar a Chave do Sistema' : 'sk-...'}
              className="input-field max-w-full font-mono text-sm"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              required={!systemFallbackInput}
            />
            <p className="text-[11px] text-zinc-500 flex items-start gap-1.5">
              <ShieldAlert size={12} className="shrink-0 mt-0.5 text-zinc-400" />
              Armazenada com RLS no seu tenant. Nunca exposta ao navegador sem máscara.
            </p>
          </div>

          {/* Campos avançados (opcionais) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-2)' }}>
                URL Base (opcional)
              </label>
              <input
                type="url"
                placeholder="https://api.openai.com/v1"
                className="input-field max-w-full text-sm"
                value={baseUrlInput}
                onChange={(e) => setBaseUrlInput(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-2)' }}>
                Model ID (opcional)
              </label>
              <input
                type="text"
                placeholder="gpt-4o, gemini-flash..."
                className="input-field max-w-full text-sm"
                value={modelIdInput}
                onChange={(e) => setModelIdInput(e.target.value)}
              />
            </div>
          </div>

          {/* Teto de Gastos */}
          <div className="card-inner p-4 flex flex-col gap-4" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-[13px] font-semibold" style={{ color: 'var(--color-text-1)' }}>
                  Trava de Custos
                </label>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-3)' }}>
                  Bloqueia chamadas ao atingir o limite diário de Unidades
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={limitActiveInput}
                  onChange={(e) => setLimitActiveInput(e.target.checked)}
                />
                <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
              </label>
            </div>

            {limitActiveInput && (
              <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800/50">
                <label className="text-xs font-medium" style={{ color: 'var(--color-text-2)' }}>
                  Volume Diário (Unidades)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  className="input-field max-w-full font-mono text-sm"
                  value={maxLimitInput}
                  onChange={(e) => setMaxLimitInput(parseInt(e.target.value) || 0)}
                />
                <p className="text-[10px]" style={{ color: 'var(--color-text-3)' }}>
                  1.000 tokens LLM = 1.000 un. · 1.000 chars TTS = 2.000 un. · 1 imagem = 5.000 un.
                </p>
              </div>
            )}
          </div>

          {/* Fallback do Sistema */}
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
            <div>
              <label className="text-[13px] font-semibold" style={{ color: 'var(--color-accent)' }}>
                Usar Chave do Sistema (Fallback)
              </label>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-3)' }}>
                Se ativo, usa a chave do .env quando a Key acima estiver vazia
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={systemFallbackInput}
                onChange={(e) => setSystemFallbackInput(e.target.checked)}
              />
              <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
            </label>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-3 justify-end mt-1">
            <button type="button" onClick={closeModal} className="btn-ghost" disabled={saveStatus === 'saving'}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={saveStatus === 'saving' || saveStatus === 'saved'}
              style={saveStatus === 'saved' ? { background: 'var(--color-success)', color: '#000' } : {}}
            >
              {saveStatus === 'saving' && <Loader2 size={16} className="animate-spin" />}
              {saveStatus === 'saved'  && <CheckCircle2 size={16} />}
              {saveStatus === 'idle' || saveStatus === 'error' ? 'Salvar Credencial' :
               saveStatus === 'saving' ? 'Salvando...' : 'Salvo!'}
            </button>
          </div>

          {saveStatus === 'error' && errorMsg && (
            <p className="text-xs text-right" style={{ color: 'var(--color-error)' }}>{errorMsg}</p>
          )}
        </form>
      </BaseModal>
    </>
  );
}

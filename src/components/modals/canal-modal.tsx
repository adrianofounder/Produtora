'use client';

import { useState } from 'react';
import { BaseModal } from '@/components/ui/base-modal';
import { Loader2, Plus, Tv2 } from 'lucide-react';

interface CanalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CanalModal({ isOpen, onClose, onSuccess }: CanalModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    idioma: 'pt-BR',
    pais: 'BR',
    categoria: 'Entretenimento',
    privacidade_padrao: 'unlisted',
    frequencia_dia: 1,
    horario_padrao: '18:00',
    conteudo_sintetico: true
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/canais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Erro ao criar canal');

      onSuccess?.();
      onClose();
      // Limpa form
      setFormData({
        nome: '',
        descricao: '',
        idioma: 'pt-BR',
        pais: 'BR',
        categoria: 'Entretenimento',
        privacidade_padrao: 'unlisted',
        frequencia_dia: 1,
        horario_padrao: '18:00',
        conteudo_sintetico: true
      });
    } catch (err) {
      console.error(err);
      alert('Falha ao criar canal. Verifique os logs.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Novo Canal"
      description="Configure seu novo centro de produção automatizada"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="section-label">Nome do Canal</label>
          <div className="relative">
            <Tv2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-3)]" />
            <input
              type="text"
              required
              placeholder="Ex: Curiosidades do Mundo"
              className="input pl-10 w-full"
              value={formData.nome}
              onChange={e => setFormData({ ...formData, nome: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="section-label">Descrição (Opcional)</label>
          <textarea
            placeholder="Sobre o que é este canal?"
            className="input w-full min-h-[80px] py-3 resize-none"
            value={formData.descricao}
            onChange={e => setFormData({ ...formData, descricao: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="section-label">Idioma</label>
            <select 
              className="input w-full appearance-none bg-[#1A1A1E]"
              value={formData.idioma}
              onChange={e => setFormData({ ...formData, idioma: e.target.value })}
            >
              <option value="pt-BR">Português (BR)</option>
              <option value="en-US">Inglês (US)</option>
              <option value="es-ES">Espanhol (ES)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="section-label">Frequência/Dia</label>
            <input
              type="number"
              min={1}
              max={10}
              className="input w-full"
              value={formData.frequencia_dia}
              onChange={e => setFormData({ ...formData, frequencia_dia: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
          <input
            type="checkbox"
            id="synthetic"
            className="w-4 h-4 rounded border-white/10 bg-white/5 text-[var(--color-accent)]"
            checked={formData.conteudo_sintetico}
            onChange={e => setFormData({ ...formData, conteudo_sintetico: e.target.checked })}
          />
          <label htmlFor="synthetic" className="text-xs font-medium text-[var(--color-text-2)] cursor-pointer">
            Conteúdo Sintético (IA) ativo por padrão
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost flex-1 h-11"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 h-11 shadow-lg shadow-purple-500/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <><Plus className="w-4 h-4" /> Criar Canal</>
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

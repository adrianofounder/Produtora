'use client';

import { useState } from 'react';
import { BaseModal } from '@/components/ui/base-modal';
import { Loader2, Film, Calendar, Tag } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  canalId: string;
}

export function VideoModal({ isOpen, onClose, onSuccess, canalId }: VideoModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    eixo: '',
    status: 'planejamento',
    data_previsao: new Date().toISOString().split('T')[0],
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canalId) {
      alert('Selecione um canal antes de criar um vídeo.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          canal_id: canalId
        })
      });

      if (!res.ok) throw new Error('Erro ao criar vídeo');

      onSuccess?.();
      onClose();
      // Limpa form
      setFormData({
        titulo: '',
        eixo: '',
        status: 'planejamento',
        data_previsao: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error(err);
      alert('Falha ao criar vídeo no Kanban.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Planejar Novo Vídeo"
      description="Inicie um novo ciclo de produção para este canal"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="section-label">Título do Vídeo (Provisório)</label>
          <div className="relative">
            <Film className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-3)]" />
            <input
              type="text"
              required
              placeholder="Ex: Por que os gatos odeiam água?"
              className="input pl-10 w-full"
              value={formData.titulo}
              onChange={e => setFormData({ ...formData, titulo: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="section-label">Eixo Temático</label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-3)]" />
            <input
              type="text"
              placeholder="Ex: Curiosidades Animais"
              className="input pl-10 w-full"
              value={formData.eixo}
              onChange={e => setFormData({ ...formData, eixo: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="section-label">Status Inicial</label>
            <select 
              className="input w-full appearance-none bg-[#1A1A1E]"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="planejamento">Planejamento</option>
              <option value="producao">Em Produção</option>
              <option value="pronto">Pronto</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="section-label">Previsão</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-3)]" />
              <input
                type="date"
                className="input pl-10 w-full"
                value={formData.data_previsao}
                onChange={e => setFormData({ ...formData, data_previsao: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost flex-1 h-11"
          >
            Sair
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 h-11"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              'Agendar Vídeo'
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

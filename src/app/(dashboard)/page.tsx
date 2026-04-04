'use client';

import { useState, useEffect } from 'react';
import {
  AlertOctagon, Activity, Unplug, Clock, Plus,
  LayoutGrid, Tv2, CheckCircle2, CalendarClock, AlertCircle, Loader2,
} from 'lucide-react';
import { MetricCard } from '@/components/dashboard/metric-card';
import { ChannelCard } from '@/components/dashboard/channel-card';

interface Canal {
  id: string;
  nome: string;
  mare_status: 'aguardando' | 'testando' | 'ativa' | 'pausada';
  mare_eixo_ativo: string | null;
}

interface VideoStats {
  planejamento: number;
  producao: number;
  pronto: number;
  agendado: number;
  publicado: number;
  atrasado: number;
}

interface Alerta {
  id: string;
  tipo: 'erro' | 'aviso' | 'mare' | 'info';
  titulo: string;
  mensagem: string;
  canal_id: string | null;
  link_acao: string | null;
}

function calcKpis(canais: Canal[], stats: Record<string, VideoStats>) {
  const totals: VideoStats = { planejamento: 0, producao: 0, pronto: 0, agendado: 0, publicado: 0, atrasado: 0 };
  Object.values(stats).forEach((s) => {
    totals.planejamento += s.planejamento;
    totals.producao += s.producao;
    totals.pronto += s.pronto;
    totals.agendado += s.agendado;
    totals.publicado += s.publicado;
    totals.atrasado += s.atrasado;
  });
  return {
    totalCanais: canais.length,
    ...totals,
    maresAtivas: canais.filter((c) => c.mare_status === 'ativa').length,
  };
}

export default function Home() {
  const [canais, setCanais] = useState<Canal[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      try {
        const [canaisRes, alertasRes] = await Promise.all([
          fetch('/api/canais'),
          fetch('/api/alertas'),
        ]);

        if (canaisRes.ok) {
          const data = await canaisRes.json();
          setCanais(Array.isArray(data) ? data : []);
        }
        if (alertasRes.ok) {
          const data = await alertasRes.json();
          setAlertas(Array.isArray(data) ? data : []);
        }
      } catch {
        // silencia erros de rede — interface permanece com mock
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const kpis = [
    { label: 'Total Canais',  value: String(canais.length),                                             icon: LayoutGrid,    box: 'icon-box-muted',    num: 'var(--color-text-1)' },
    { label: 'Planejamento',  value: '--',                                                               icon: Tv2,           box: 'icon-box-muted',    num: 'var(--color-text-1)' },
    { label: 'Em Produção',   value: '--',                                                               icon: Activity,      box: 'icon-box-accent',   num: 'var(--color-accent)' },
    { label: 'Prontos',       value: '--',                                                               icon: CheckCircle2,  box: 'icon-box-success',  num: 'var(--color-success)' },
    { label: 'Agendados',     value: '--',                                                               icon: CalendarClock, box: 'icon-box-accent',   num: '#60A5FA' },
    { label: 'Marés Ativas',  value: String(canais.filter((c) => c.mare_status === 'ativa').length),    icon: AlertCircle,   box: 'icon-box-warning',   num: 'var(--color-warning)' },
  ];

  const maresAtivas = canais.filter((c) => c.mare_status === 'ativa');

  const iconePorTipo = {
    erro: { icon: AlertOctagon, box: 'icon-box-error' },
    aviso: { icon: Unplug, box: 'icon-box-warning' },
    mare: { icon: Activity, box: 'icon-box-accent' },
    info: { icon: AlertCircle, box: 'icon-box-muted' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--color-accent)' }} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1280px] mx-auto flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--color-text-1)' }}>
            Estado Geral da Fábrica
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--color-text-3)' }}>
            Visão macro da operação — todos os canais
          </p>
        </div>
        <button className="btn-primary h-9">
          <Plus className="w-4 h-4" /> Novo Canal
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((k) => (
          <MetricCard
            key={k.label}
            label={k.label}
            value={k.value}
            icon={k.icon}
            boxColorClass={k.box}
            numberColor={k.num}
          />
        ))}
      </div>

      {/* Banner Maré */}
      {maresAtivas.length > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            background: 'rgba(94,106,210,0.07)',
            border: '1px solid rgba(94,106,210,0.22)',
            boxShadow: 'inset 0 1px 0 rgba(94,106,210,0.12)',
          }}
        >
          <span className="icon-box icon-box-accent">
            <Activity className="w-4 h-4" />
          </span>
          <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-accent)' }}>
            MARÉS ATIVAS: {maresAtivas.length}
          </span>
          <span className="text-[13px]" style={{ color: 'var(--color-text-3)' }}>
            — {maresAtivas.map((c) => `${c.nome}${c.mare_eixo_ativo ? ` (${c.mare_eixo_ativo})` : ''}`).join(', ')}
          </span>
        </div>
      )}

      {/* Alertas + Publicações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Alertas */}
        <div className="card p-5 flex flex-col gap-3">
          <h2 className="section-label mb-1">Alertas Imediatos</h2>
          {alertas.length === 0 ? (
            <div className="card-inner text-center py-6">
              <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>Nenhum alerta ativo. ✅</p>
            </div>
          ) : (
            alertas.slice(0, 5).map((a) => {
              const config = iconePorTipo[a.tipo] ?? iconePorTipo.info;
              const Icon = config.icon;
              return (
                <div key={a.id} className="card-inner flex items-start gap-3 px-3 py-3 cursor-pointer hover:border-white/10 transition-colors">
                  <span className={`icon-box-sm ${config.box}`} style={{ width: 26, height: 26, borderRadius: 6, flexShrink: 0 }}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <p className="text-[13px] leading-snug pt-0.5" style={{ color: 'var(--color-text-2)' }}>
                    {a.titulo}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Próximas Publicações */}
        <div className="card p-5 flex flex-col gap-3">
          <h2 className="section-label mb-1">Próximas Publicações</h2>
          <div className="card-inner text-center py-6">
            <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>Nenhum vídeo agendado ainda.</p>
          </div>
        </div>
      </div>

      {/* A Tropa */}
      <div>
        <h2 className="section-label mb-3">A Tropa — Grid de Canais</h2>
        {canais.length === 0 ? (
          <div className="card text-center py-16 flex flex-col items-center gap-3">
            <LayoutGrid className="h-10 w-10" style={{ color: 'var(--color-text-3)' }} />
            <div>
              <p className="font-medium" style={{ color: 'var(--color-text-1)' }}>Nenhum canal na Tropa</p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-3)' }}>Crie seu primeiro canal para começar a produção.</p>
            </div>
            <button className="btn-primary mt-2">
              <Plus className="w-4 h-4" /> Primeiro Canal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {canais.map((c) => (
              <ChannelCard
                key={c.id}
                nome={c.nome}
                mare={c.mare_eixo_ativo ?? c.mare_status}
                ativa={c.mare_status === 'ativa'}
                dados={{ plan: 0, prod: 0, pronto: 0, agend: 0, atras: 0, pub: 0 }}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

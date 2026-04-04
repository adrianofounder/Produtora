import { Pencil } from 'lucide-react';

export type ApiStatus = 'on' | 'faltando';

export interface ApiData {
  id: number;
  provider: string;
  tipo: string;
  status: ApiStatus;
  data: string;
}

interface ApiKeyCardProps {
  apis: ApiData[];
}

export function ApiKeyCard({ apis }: ApiKeyCardProps) {
  return (
    <div className="card overflow-hidden">
      {/* Header da tabela */}
      <div
        className="grid px-5 py-3 border-b"
        style={{
          gridTemplateColumns: '1fr 120px 120px 100px',
          borderColor: 'var(--color-border)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        {['Provedor', 'Tipo', 'Status', 'Ação'].map((h) => (
          <span key={h} className="section-label">{h}</span>
        ))}
      </div>

      {/* Linhas */}
      {apis.map((api) => (
        <div
          key={api.id}
          className="grid items-center px-5 py-4 border-b last:border-b-0 transition-colors"
          style={{
            gridTemplateColumns: '1fr 120px 120px 100px',
            borderColor: 'var(--color-border)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text-1)' }}>
            {api.provider}
          </span>

          <span className="text-[12px]" style={{ color: 'var(--color-text-3)' }}>
            {api.tipo}
          </span>

          <div className="flex items-center gap-2">
            {api.status === 'on' ? (
              <>
                <div className="dot-live" />
                <span className="text-[12px] font-bold" style={{ color: 'var(--color-success)' }}>ON</span>
              </>
            ) : (
              <>
                <div className="dot-error" />
                <span className="text-[12px] font-bold" style={{ color: 'var(--color-error)' }}>FALTANDO</span>
              </>
            )}
          </div>

          <button className="btn-ghost h-7 px-2.5 text-[11px] w-fit">
            <Pencil size={10} />
            Editar
          </button>
        </div>
      ))}
    </div>
  );
}

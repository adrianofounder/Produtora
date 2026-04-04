import { Users, RefreshCw } from 'lucide-react';

interface Tenant {
  id: number;
  name: string;
  plan: string;
  status: 'ativo' | 'pendente' | 'cancelado';
}

const TENANTS: Tenant[] = [
  { id: 1, name: 'Produtora VIP #1 (Mestres)', plan: 'Anual via Kiwify', status: 'ativo' },
  { id: 2, name: 'Lucas (Agência X)',          plan: 'Mensal via Kiwify', status: 'pendente' },
  { id: 3, name: 'Canal Cortes Express',       plan: 'Anual via Kiwify', status: 'cancelado' },
];

const STATUS_CONFIG = {
  ativo:     { label: 'Ativo',     badge: 'badge-success' },
  pendente:  { label: 'Pendente',  badge: 'badge-warning' },
  cancelado: { label: 'Cancelado', badge: 'badge-error' },
};

export function TenantManager() {
  return (
    <div className="card flex flex-col gap-4 min-h-full">
      <div className="p-5 flex flex-col gap-5 flex-1">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="icon-box icon-box-accent shrink-0">
            <Users size={14} />
          </span>
          <div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--color-text-1)' }}>
              Gestão de Assinantes
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>
              Tenants VIP conectadas ao sistema
            </p>
          </div>
        </div>

        {/* Tabela / Lista */}
        <div className="flex flex-col gap-2 flex-1">
          {TENANTS.map((t) => {
            const config = STATUS_CONFIG[t.status];

            return (
              <div 
                key={t.id} 
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: 'var(--color-surface-3)' }}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text-1)' }}>
                    {t.name}
                  </span>
                  <span className="text-[11px]" style={{ color: 'var(--color-text-3)' }}>
                    {t.plan}
                  </span>
                </div>
                <span className={`badge ${config.badge}`}>
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <button className="btn-ghost w-full justify-center h-9 mt-1">
          <RefreshCw size={12} />
          Sincronizar Webhooks Kiwify
        </button>

      </div>
    </div>
  );
}

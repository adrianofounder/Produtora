import { Eye } from 'lucide-react';
import { FinancialWidget } from '@/components/hq/financial-widget';
import { TenantManager } from '@/components/hq/tenant-manager';

export default function HQ() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-sans font-bold text-white uppercase tracking-tight">
            HQ (God Mode)
          </h1>
          <span className="badge badge-accent shadow-glow">
            <Eye size={10} />
            ROOT
          </span>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>
          Centro Nervoso e Tributário de todo o Ecosistema AD_LABS
        </p>
      </header>

      {/* Main Grid / Bento Layout */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* IA Costs */}
        <div className="lg:col-span-1">
          <FinancialWidget totalEstimado="$150.00" />
        </div>

        {/* SaaS / Tenant Management */}
        <div className="lg:col-span-2">
          <TenantManager />
        </div>

      </section>
    </div>
  );
}

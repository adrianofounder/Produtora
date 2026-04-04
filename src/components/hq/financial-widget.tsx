import { DollarSign, ShieldAlert } from 'lucide-react';

interface CostData {
  provider: string;
  type: string;
  amount: string;
}

const COSTS: CostData[] = [
  { provider: 'OpenAI (GPT-4o)', type: 'Tokens/Texto', amount: '$4.50' },
  { provider: 'ElevenLabs',      type: 'Tts/Áudios',   amount: '$12.20' },
  { provider: 'Fal.ai',          type: 'Imagens/Flux', amount: '$1.80' }
];

interface FinancialWidgetProps {
  totalEstimado: string;
}

export function FinancialWidget({ totalEstimado }: FinancialWidgetProps) {
  return (
    <div className="card relative overflow-hidden flex flex-col gap-4 min-h-full">
      {/* Glow Alert no canto sup-direito sutil */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[64px] opacity-20 pointer-events-none"
        style={{ background: 'var(--color-error)' }}
      />

      <div className="p-5 flex flex-col gap-5 flex-1">
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="icon-box icon-box-error shrink-0">
            <DollarSign size={14} />
          </span>
          <div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--color-text-1)' }}>
              Custos de IA
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>
              Monitoramento de consumo diário (APIs)
            </p>
          </div>
        </div>

        {/* Listagem */}
        <div className="flex flex-col gap-1 flex-1">
          {COSTS.map((c, i) => (
            <div 
              key={c.provider} 
              className="flex justify-between items-center py-2 border-b last:border-b-0"
              style={{ borderColor: 'var(--color-border-2)' }}
            >
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text-2)' }}>
                  {c.provider}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--color-text-3)' }}>
                  {c.type}
                </span>
              </div>
              <span className="text-[13px] font-mono font-bold" style={{ color: 'var(--color-text-1)' }}>
                {c.amount}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Metric */}
        <div className="pt-4 border-t flex justify-between items-center" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-1.5">
            <ShieldAlert size={12} style={{ color: 'var(--color-error)' }} />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-error)' }}>
              Total Mês (Est.)
            </span>
          </div>
          <span className="text-lg font-mono font-bold" style={{ color: 'var(--color-error)' }}>
            {totalEstimado}
          </span>
        </div>
      </div>
    </div>
  );
}

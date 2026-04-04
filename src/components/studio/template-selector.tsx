"use client";

export interface TemplateTrigger {
  id: string;
  label: string;
  active: boolean;
}

export interface TemplateSelectorProps {
  templates: { id: string; name: string; emoji: string; category: string }[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function TemplateSelector({ templates, activeId, onSelect }: TemplateSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="section-label">Templates de Roteiro</p>
      <div className="grid grid-cols-2 gap-2">
        {templates.map((t) => {
          const isActive = t.id === activeId;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className="relative flex flex-col gap-1 p-3 rounded-xl text-left transition-all duration-200"
              style={{
                background: isActive
                  ? "rgba(124,58,237,0.12)"
                  : "rgba(255,255,255,0.03)",
                border: isActive
                  ? "1px solid rgba(124,58,237,0.30)"
                  : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <span className="text-lg leading-none">{t.emoji}</span>
              <span
                className="text-[12px] font-bold leading-tight"
                style={{ color: isActive ? "var(--color-text-1)" : "var(--color-text-2)" }}
              >
                {t.name}
              </span>
              <span className="text-[10px]" style={{ color: "var(--color-text-3)" }}>
                {t.category}
              </span>
              {isActive && (
                <span
                  className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--color-accent)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export interface TriggerGridProps {
  triggers: TemplateTrigger[];
  onToggle: (id: string) => void;
}

export function TriggerGrid({ triggers, onToggle }: TriggerGridProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="section-label">Gatilhos Psicológicos Ativos</p>
      <div className="flex flex-wrap gap-2">
        {triggers.map((t) => (
          <button
            key={t.id}
            onClick={() => onToggle(t.id)}
            className="badge transition-all duration-150"
            style={
              t.active
                ? {
                    background: "rgba(124,58,237,0.13)",
                    color: "#A78BFA",
                    border: "1px solid rgba(124,58,237,0.30)",
                  }
                : {
                    background: "rgba(255,255,255,0.04)",
                    color: "var(--color-text-3)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }
            }
          >
            {t.active ? "✓" : "+"} {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

import { LucideIcon } from 'lucide-react';
import React from 'react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 rounded-xl border border-dashed border-[var(--color-border)] bg-[rgba(255,255,255,0.02)] min-h-[200px]">
      {Icon && (
        <div className="p-4 rounded-full bg-[rgba(255,255,255,0.05)] text-[var(--color-text-3)] mb-2">
          <Icon size={32} />
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-[var(--color-text-1)]">{title}</h3>
        {description && <p className="text-sm text-[var(--color-text-3)] max-w-sm mx-auto">{description}</p>}
      </div>
      {action && <div className="mt-4 pt-2">{action}</div>}
    </div>
  );
}

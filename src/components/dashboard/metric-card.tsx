"use client";

import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  boxColorClass: string; // e.g. "icon-box-muted"
  numberColor: string;   // e.g. "var(--color-text-1)"
}

export function MetricCard({ label, value, icon: Icon, boxColorClass, numberColor }: MetricCardProps) {
  return (
    <div className="card p-4 flex flex-col gap-3 cursor-default group transition-all duration-300">
      <span className={`icon-box ${boxColorClass}`}>
        <Icon className="w-4 h-4" />
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="section-label">{label}</span>
        <span
          className="text-[28px] font-mono font-bold leading-none mt-1"
          style={{ color: numberColor }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

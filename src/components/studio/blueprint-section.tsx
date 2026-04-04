"use client";

import { ReactNode } from "react";

export interface BlueprintSectionProps {
  index: string;       // "A", "B", "C"...
  title: string;       // "Hook Inquebrável (0-5s)"
  description?: string;
  children: ReactNode;
  accentColor?: string; // CSS color ou var(--...)
}

export function BlueprintSection({
  index,
  title,
  description,
  children,
  accentColor = "var(--color-accent)",
}: BlueprintSectionProps) {
  return (
    <div className="card-inner p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start gap-3">
        <span
          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black"
          style={{
            background: `rgba(124,58,237,0.14)`,
            border: `1px solid rgba(124,58,237,0.25)`,
            color: accentColor,
          }}
        >
          {index}
        </span>
        <div className="flex flex-col gap-0.5 min-w-0">
          <p
            className="text-[13px] font-bold tracking-tight leading-none"
            style={{ color: "var(--color-text-1)" }}
          >
            {title}
          </p>
          {description && (
            <p
              className="text-[11px] leading-snug"
              style={{ color: "var(--color-text-3)" }}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Slot de conteúdo */}
      <div className="pl-10">{children}</div>
    </div>
  );
}

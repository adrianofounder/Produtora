"use client";

import Link from "next/link";
import { User } from "lucide-react";

export function Topbar() {
  // We can fetch the current user dynamically later
  const today = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date());

  return (
    <header
      className="h-14 flex items-center justify-between px-6 sticky top-0 z-30"
      style={{
        background: "rgba(10,10,10,0.88)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <span className="section-label tracking-widest uppercase">
        Data Local: {today}
      </span>

      <div className="flex items-center gap-3">
        <span className="text-[13px] font-semibold" style={{ color: "var(--color-text-1)" }}>
          Olá, Maestro
        </span>
        <Link
          href="/configuracoes"
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <User className="w-4 h-4" style={{ color: "var(--color-text-2)" }} />
        </Link>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { User, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function Topbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const today = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date());

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    getUser();
  }, [supabase.auth]);

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
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin opacity-40" />
        ) : (
          <span className="text-[13px] font-semibold" style={{ color: "var(--color-text-1)" }}>
            Olá, {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || "Maestro"}
          </span>
        )}
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

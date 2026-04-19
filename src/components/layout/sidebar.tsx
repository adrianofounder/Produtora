"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MonitorPlay,
  FlaskConical,
  TrendingUp,
  Beaker,
  Settings,
  Eye,
  Zap,
} from "lucide-react";

const navMain = [
  { href: "/", label: "Home", icon: Home, box: "icon-box-accent" },
  { href: "/canais", label: "Canais", icon: MonitorPlay, box: "icon-box-muted" },
  { href: "/laboratorio", label: "Laboratório", icon: FlaskConical, box: "icon-box-muted" },
  { href: "/tendencias", label: "Tendências", icon: TrendingUp, box: "icon-box-muted" },
];

const navTools = [
  { href: "/studio", label: "Studio (Blueprint)", icon: Beaker, box: "icon-box-muted" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-56 hidden md:flex flex-col h-screen sticky top-0 z-40"
      style={{
        background: "linear-gradient(180deg, #0D0D0D 0%, #080808 100%)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* TOPO ─ Logo */}
      <div className="flex items-center gap-2.5 px-4 pt-5 pb-4">
        <div
          className="icon-box icon-box-accent"
          style={{ width: 30, height: 30, borderRadius: 8 }}
        >
          <Zap className="w-[15px] h-[15px]" style={{ color: "var(--color-accent)" }} />
        </div>
        <span
          className="text-[15px] font-bold tracking-tight"
          style={{ color: "var(--color-text-1)" }}
        >
          AD_LABS
        </span>
      </div>

      <hr className="divider mx-3 mb-3" />

      {/* CENTRO ─ Navegação */}
      <div className="flex-1 flex flex-col gap-0.5 px-2 overflow-y-auto">
        <span className="section-label px-2 mb-2">Principal</span>

        {navMain.map(({ href, label, icon: Icon, box }) => {
          const isActive = pathname === href || pathname?.startsWith(href !== "/" ? href : "/nothing");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium ${
                isActive ? "nav-active" : "nav-item"
              }`}
            >
              <span className={`icon-box-sm ${isActive ? "icon-box-accent" : box}`}>
                <Icon className="w-3.5 h-3.5" />
              </span>
              {label}
            </Link>
          );
        })}

        <div className="my-3 mx-1"><hr className="divider" /></div>

        <span className="section-label px-2 mb-2">Ferramentas</span>
        {navTools.map(({ href, label, icon: Icon, box }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium ${
                isActive ? "nav-active" : "nav-item"
              }`}
            >
              <span className={`icon-box-sm ${isActive ? "icon-box-accent" : box}`}>
                <Icon className="w-3.5 h-3.5" />
              </span>
              {label}
            </Link>
          );
        })}
      </div>

      {/* RODAPÉ ─ Configs + HQ */}
      <div className="px-2 pb-4 flex flex-col gap-1">
        <hr className="divider mb-2" />

        <Link
          href="/configuracoes"
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium ${
            pathname === "/configuracoes" ? "nav-active" : "nav-item"
          }`}
        >
          <span className="icon-box-sm icon-box-muted">
            <Settings className="w-3.5 h-3.5" />
          </span>
          Configurações
        </Link>

        {/* HQ em destaque */}
        <Link
          href="/hq"
          className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-[13px] font-semibold mt-0.5 transition-all outline-none"
          style={{
            background: pathname === "/hq" ? "rgba(124,58,237,0.18)" : "rgba(124,58,237,0.08)",
            border: pathname === "/hq" ? "1px solid rgba(124,58,237,0.40)" : "1px solid rgba(124,58,237,0.22)",
            color: "var(--color-accent)",
          }}
        >
          <span
            className="icon-box-sm"
            style={{
              background: "rgba(124,58,237,0.16)",
              border: "1px solid rgba(124,58,237,0.28)",
              color: "var(--color-accent)",
            }}
          >
            <Eye className="w-3.5 h-3.5" />
          </span>
          HQ / God Mode
        </Link>

        {/* Botão de Logout Rápido */}
        <button
          onClick={async () => {
             const { createClient } = await import('@supabase/supabase-js');
             const supabase = createClient(
               process.env.NEXT_PUBLIC_SUPABASE_URL!,
               process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
             );
             await supabase.auth.signOut();
             window.location.href = '/login';
          }}
          className="flex items-center gap-2.5 px-2.5 py-2 mt-2 rounded-lg text-[13px] font-medium nav-item outline-none text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-colors text-left"
        >
          <span className="icon-box-sm icon-box-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </span>
          Sair da Conta
        </button>
      </div>
    </aside>
  );
}

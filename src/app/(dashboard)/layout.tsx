import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-background)" }}>
      {/* ══ SIDEBAR ══════════════════════════════════════════ */}
      <Sidebar />

      {/* ══ MAIN ══════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden relative z-0">
        <div className="mesh-bg" />

        {/* Topbar */}
        <Topbar />

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AD_LABS | Automação",
  description: "Sistema de Produção",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

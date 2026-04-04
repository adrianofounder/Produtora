import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AD_LABS | Automação",
  description: "Sistema",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-body antialiased bg-base text-foreground min-h-screen`}>
        <div className="mesh-bg" />
        {children}
      </body>
    </html>
  );
}

"use client";

import React from "react";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="linear-card p-8 w-full max-w-sm flex flex-col gap-6 relative">
        {/* Glow de fundo sutil */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[var(--color-accent)] blur-[80px] opacity-20 pointer-events-none" />

        <div className="text-center z-10">
          <div className="w-10 h-10 rounded shadow-[0_0_15px_rgba(94,106,210,0.5)] bg-[var(--color-accent)] mx-auto mb-5" />
          <h1 className="text-xl font-sans font-semibold text-[#E4E4E7] tracking-tight">Entrar no AD_LABS</h1>
        </div>
        
        <form className="flex flex-col gap-4 z-10">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[#71717A] uppercase tracking-wider">E-mail Corporativo</label>
            <input type="email" required className="linear-input w-full h-10 rounded text-sm px-3" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[#71717A] uppercase tracking-wider">Senha de Acesso</label>
            <input type="password" required className="linear-input w-full h-10 rounded text-sm px-3" />
          </div>
          
          <button 
            type="button" 
            onClick={() => window.location.href = '/'} 
            className="btn-linear-primary w-full h-10 mt-2"
          >
            Conectar
          </button>
        </form>
        
        <div className="text-center text-[12px] text-[#71717A] mt-2 z-10">
          Problemas de acesso? <br/>
          <a href="#" className="text-[var(--color-accent)] hover:underline opacity-80">Restaure sua conta</a>
        </div>
      </div>
    </div>
  );
}

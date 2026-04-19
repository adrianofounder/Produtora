'use client';
import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function LogoutPage() {
  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    // Remove a sessão do usuário de forma forçada
    supabase.auth.signOut().then(() => {
      // Redireciona imediatamente para a tela de SignIn
      window.location.href = '/login';
    });
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#080808]">
      <p className="text-white">Desconectando com segurança...</p>
    </div>
  );
}

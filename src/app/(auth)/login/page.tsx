'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('E-mail ou senha inválidos.');
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  }

  async function handleGoogleLogin() {
    setLoadingGoogle(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        scopes: 'https://www.googleapis.com/auth/youtube.readonly',
      },
    });

    if (error) {
      setError('Falha ao conectar com o Google.');
      setLoadingGoogle(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4" style={{ background: 'var(--color-background)' }}>
      {/* Glow de fundo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[120px] opacity-10 pointer-events-none"
        style={{ background: 'var(--color-accent)' }} />

      <div className="card w-full max-w-sm flex flex-col gap-6 relative z-10">
        {/* Logo */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'var(--color-accent)', boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}>
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-text-1)' }}>
            Entrar no AD_LABS
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-3)' }}>
            Cockpit da Produtora Lendária
          </p>
        </div>

        {/* Erro */}
        {error && (
          <div className="card-inner flex items-center gap-2 p-3"
            style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)' }}>
            <AlertCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--color-error)' }} />
            <p className="text-xs" style={{ color: 'var(--color-error)' }}>{error}</p>
          </div>
        )}

        {/* Form email/senha */}
        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <label className="section-label flex items-center gap-1.5">
              <Mail className="h-3 w-3" /> E-mail Corporativo
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="input w-full"
            />
          </div>
          <div className="space-y-1.5">
            <label className="section-label flex items-center gap-1.5">
              <Lock className="h-3 w-3" /> Senha de Acesso
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input w-full"
            />
          </div>

          <button type="submit" className="btn-primary w-full mt-1" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            {loading ? 'Conectando...' : 'Entrar'}
          </button>
        </form>

        {/* Divisor */}
        <div className="divider relative flex items-center justify-center">
          <span className="absolute px-3 text-xs" style={{ background: 'var(--color-surface)', color: 'var(--color-text-3)' }}>
            ou continue com
          </span>
        </div>

        {/* Google OAuth */}
        <button onClick={handleGoogleLogin} disabled={loadingGoogle} className="btn-ghost w-full">
          {loadingGoogle ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          Entrar com Google
        </button>

        <p className="text-center text-xs" style={{ color: 'var(--color-text-3)' }}>
          Problemas de acesso?{' '}
          <a href="#" className="hover:underline" style={{ color: 'var(--color-accent)' }}>
            Restaurar conta
          </a>
        </p>
      </div>
    </div>
  );
}

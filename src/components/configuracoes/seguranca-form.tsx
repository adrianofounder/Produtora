'use client';

import { useState } from 'react';
import { Key, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function SegurancaForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const supabase = createClient();

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setStatus('error');
      setMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setStatus('idle');

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus('error');
      setMessage(error.message);
    } else {
      setStatus('success');
      setMessage('Senha atualizada com sucesso!');
      setPassword('');
      setConfirmPassword('');
    }
    setLoading(false);
  }

  return (
    <div className="card p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="icon-box icon-box-accent">
            <Key size={14} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Segurança da Conta</h3>
            <p className="text-[11px] opacity-40">Gerencie sua senha e acessos</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
        {status !== 'idle' && (
          <div className={`
            flex items-center gap-2 p-3 rounded-xl border text-xs
            ${status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}
          `}>
            {status === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            {message}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="section-label">Nova Senha</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input pr-10 w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="section-label">Confirmar Nova Senha</label>
          <input
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="input w-full"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary w-full mt-2 py-2.5 shadow-lg shadow-purple-500/10"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Atualizar Senha'}
        </button>
      </form>
    </div>
  );
}

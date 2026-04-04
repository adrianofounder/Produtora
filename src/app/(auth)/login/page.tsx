export default function Login() {
  return (
    <div className="flex-center min-h-screen">
      <div className="glass-panel p-8 rounded-2xl w-full max-w-sm flex flex-col gap-6 !border-primary/20 shadow-glow">
        <div className="text-center">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-blue-600 shadow-glow mx-auto mb-4" />
          <h1 className="text-2xl font-sans font-bold text-white text-gradient">Bem-vindo ao AD_LABS</h1>
        </div>
        
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">E-mail</label>
            <input type="email" required className="bg-surface-1 border border-white/10 rounded-md p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Senha</label>
            <input type="password" required className="bg-surface-1 border border-white/10 rounded-md p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
          </div>
          
          <button type="button" onClick={() => window.location.href = '/'} className="mt-2 bg-primary hover:bg-primary/80 transition-colors py-3 rounded-md font-semibold text-white shadow-glow">
            Entrar no Sistema
          </button>
        </form>
        
        <div className="text-center text-sm text-slate-500">
          Você não usou a Kiwify na compra? <br/>
          <a href="#" className="text-primary hover:underline">Recupere seu acesso</a>
        </div>
      </div>
    </div>
  );
}

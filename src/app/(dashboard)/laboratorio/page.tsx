export default function Laboratorio() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-sans font-bold text-white">🌊 Laboratório & Marés</h1>
        <p className="text-slate-400 text-sm mt-1">Motor de testes e eixos temáticos do canal.</p>
      </header>

      {/* Matriz dos 5 Eixos */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { nome: "Eixo 1: Escola", status: "Testando", won: false },
          { nome: "Eixo 2: Hospital", status: "Aguardando", won: false },
          { nome: "Eixo 3: Igreja", status: "Testando", won: false },
          { nome: "Eixo 4: Rua", status: "Aguardando", won: false },
          { nome: "Eixo 5: Trabalho", status: "VENCEU! 👑", won: true },
        ].map((eixo, idx) => (
          <div key={idx} className={`glass-panel p-4 rounded-xl border ${eixo.won ? 'border-secondary shadow-glow' : 'border-white/5'} flex flex-col gap-2 items-center text-center cursor-pointer hover:-translate-y-1 transition-transform`}>
            <span className="font-bold text-sm text-white">{eixo.nome}</span>
            <span className={`text-xs font-semibold ${eixo.won ? 'text-secondary' : 'text-slate-400'}`}>{eixo.status}</span>
          </div>
        ))}
      </section>

      {/* Banco de Ideias Validado */}
      <section className="flex flex-col gap-4 mt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold font-sans text-white">Ideias do Eixo Vencedor (30)</h2>
          <button className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-glow">
            + Enviar Lote (5) pra Fábrica
          </button>
        </div>

        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-4 border-b border-white/5 text-sm font-medium text-slate-400 bg-white/5">
            <span className="col-span-2">Ideia / Premissa</span>
            <span>Nota IA</span>
            <span>Ação</span>
          </div>
          {[
            { title: "Jesus e o pastor mentiroso", nota: "9/10" },
            { title: "O chefe que não sabia de nada", nota: "8/10" },
            { title: "Criança humilhada dá o troco", nota: "7/10" },
          ].map((ideia, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-4 p-4 border-b border-white/5 text-sm text-white items-center hover:bg-white/5 transition-colors">
              <span className="col-span-2 font-medium">{ideia.title}</span>
              <span className="text-primary font-bold">{ideia.nota}</span>
              <div>
                <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors">Mandar P/ Fábrica</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

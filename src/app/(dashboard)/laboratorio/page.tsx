'use client';

import { useState } from 'react';
import { EixoData, EixoCard } from '@/components/laboratorio/eixo-card';
import { IdeiasTable, IdeiaData } from '@/components/laboratorio/ideias-table';
import { TrendAnalysis, TrendMetrica } from '@/components/laboratorio/trend-analysis';

const EIXOS: EixoData[] = [
  { id: 1, nome: 'Escola', nicho: 'Justiça Dramática', status: 'testando',  videos: 8,  mediaViews: '124K', taxaAprovacao: 62 },
  { id: 2, nome: 'Hospital',nicho: 'Emoção Extrema',  status: 'aguardando',videos: 3,  mediaViews: '47K',  taxaAprovacao: 38 },
  { id: 3, nome: 'Igreja',  nicho: 'Fé & Conflito',   status: 'testando',  videos: 12, mediaViews: '210K', taxaAprovacao: 74 },
  { id: 4, nome: 'Rua',     nicho: 'Superação Real',  status: 'aguardando',videos: 5,  mediaViews: '83K',  taxaAprovacao: 51 },
  { id: 5, nome: 'Trabalho',nicho: 'Chefe vs. Tropa', status: 'venceu',    videos: 21, mediaViews: '487K', taxaAprovacao: 89 },
];

const IDEIAS: IdeiaData[] = [
  { id: 1, titulo: 'O chefe que não sabia de NADA',       premissa: 'Funcionário corrige chefe ao vivo sem perceber', notaIA: 9.2, tags: ['viral','trabalho'], status: 'fabrica'   },
  { id: 2, titulo: 'Jesus e o pastor mentiroso',           premissa: 'Fiel descobre fraude da liderança em culto',    notaIA: 8.7, tags: ['drama','fé'],      status: 'pendente'  },
  { id: 3, titulo: 'Criança humilhada dá o troco',         premissa: 'Bully da turma pega o que merece na frente de todos', notaIA: 8.1, tags: ['escola'],   status: 'pendente'  },
  { id: 4, titulo: 'O estagiário que salvou a empresa',    premissa: 'CEO descobre que apenas o júnior sabia a solução', notaIA: 7.9, tags: ['trabalho'],    status: 'publicado' },
  { id: 5, titulo: 'Médico descobre que é o paciente',     premissa: 'Ironia trágica em diagnóstico hospitalar',     notaIA: 7.4, tags: ['hospital'],      status: 'pendente'  },
  { id: 6, titulo: 'A mãe que ninguém esperava',           premissa: 'Sacrifício anônimo revelado no pior momento',   notaIA: 9.5, tags: ['emoção','viral'], status: 'fabrica'   },
  { id: 7, titulo: 'Diretora x professora substituta',     premissa: 'Hierarquia invertida gera crise na escola',    notaIA: 6.8, tags: ['escola'],        status: 'pendente'  },
];

const TRENDS: TrendMetrica[] = [
  { eixo: 'Trabalho (Chefe vs. Tropa)', score: 94, views7d: '2.1M', ctr: '8.4%', retencao: '73%', direcao: 'up'     },
  { eixo: 'Igreja (Fé & Conflito)',     score: 71, views7d: '980K', ctr: '6.1%', retencao: '61%', direcao: 'up'     },
  { eixo: 'Escola (Justiça Dramática)', score: 58, views7d: '640K', ctr: '5.2%', retencao: '54%', direcao: 'stable' },
  { eixo: 'Rua (Superação Real)',       score: 43, views7d: '380K', ctr: '4.8%', retencao: '49%', direcao: 'stable' },
  { eixo: 'Hospital (Emoção Extrema)',  score: 29, views7d: '190K', ctr: '3.1%', retencao: '41%', direcao: 'down'   },
];

export default function Laboratorio() {
  const [activeEixoId, setActiveEixoId] = useState<number>(5); // Eixo Trabalho como default

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-sans font-bold text-white">🌊 Laboratório & Marés</h1>
          <span className="badge badge-accent">BETA</span>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>
          Motor de testes e análise de eixos temáticos do canal.
        </p>
      </header>

      {/* Row 1: Eixos */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
            Matriz de Eixos 
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {EIXOS.map((eixo) => (
            <EixoCard 
              key={eixo.id} 
              eixo={eixo} 
              isActive={activeEixoId === eixo.id}
              onClick={() => setActiveEixoId(eixo.id)} 
            />
          ))}
        </div>
      </section>

      {/* Row 2: Banco de Ideias + Tendências */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left: Tabela com col-span-3 */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="flex justify-between items-center h-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
              Banco de Ideias Validado
              <span className="badge badge-muted font-mono">{IDEIAS.length}</span>
            </h2>
            <button className="btn-primary">
              + Enviar Lote (5) p/ Fábrica
            </button>
          </div>
          
          {/* As ideias idealmente seriam filtradas pelo eixo ativo, 
              mas usando o MOCK do epic as exibiremos diretamente */}
          <IdeiasTable 
            ideias={IDEIAS} 
            onSendToFabrica={(id) => console.log('Enviando ideia', id)} 
          />
        </div>

        {/* Right: Motor de Tendências com col-span-2 */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center h-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Sinais e Tendências
            </h2>
          </div>
          <TrendAnalysis metricas={TRENDS} />
        </div>

      </section>
    </div>
  );
}


import pg from 'pg';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const { Client } = pg;

async function runSqlWithPg() {
  // Tentando conexão direta (Porta 5432) ou Porta 6543 (Pooler) com formato de usuário correto
  // Supabase Direct Connection: db.PROJECT_ID.supabase.co
  const projectId = 'uwopcvzhjdmfuogfjqpj';
  const password = process.env.SUPABASE_DB_PASSWORD;
  
  // Opção A: Direct Connection
  const connectionString = `postgres://postgres:${password}@db.${projectId}.supabase.co:5432/postgres`;
  
  const client = new Client({ 
    connectionString,
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log(`🔌 Tentando conectar a db.${projectId}.supabase.co...`);
    await client.connect();
    console.log('✅ Conectado!');
    
    const migrationPath = resolve(__dirname, '../supabase/migrations/20260419150800_create_tenant_credentials.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('🔨 Executando SQL...');
    await client.query(sql);
    console.log('🎊 Migração aplicada com SUCESSO!');
    
  } catch (err) {
    console.error('❌ Erro na migração:', err.message);
    console.log('💡 Tentando conexão secundária via AWS Pooler...');
    
    // Opção B: Pooler
    const clientPooler = new Client({
      connectionString: `postgres://postgres.${projectId}:${password}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`,
    });

    try {
      await clientPooler.connect();
      console.log('✅ Conectado via Pooler!');
      const migrationPath = resolve(__dirname, '../supabase/migrations/20260419150800_create_tenant_credentials.sql');
      const sql = fs.readFileSync(migrationPath, 'utf8');
      await clientPooler.query(sql);
      console.log('🎊 Migração aplicada via Pooler!');
    } catch (err2) {
      console.error('❌ Falha total na conexão:', err2.message);
    } finally {
      await clientPooler.end();
    }

  } finally {
    await client.end();
  }
}

runSqlWithPg();

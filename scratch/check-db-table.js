
import pg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

async function checkTable() {
  const client = new Client({
    connectionString: `postgres://postgres.uwopcvzhjdmfuogfjqpj:${process.env.SUPABASE_DB_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`,
  });

  try {
    await client.connect();
    console.log('🔌 Conectado ao banco!');
    const res = await client.query("SELECTEXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tenant_credentials');");
    console.log('📊 Tabela tenant_credentials existe?', res.rows[0].exists);
    
    if (!res.rows[0].exists) {
      console.log('⚠️ Tabela não encontrada. Dex esqueceu de rodar a migration?');
    }
  } catch (err) {
    console.error('❌ Erro na conexão DB:', err.message);
  } finally {
    await client.end();
  }
}

checkTable();

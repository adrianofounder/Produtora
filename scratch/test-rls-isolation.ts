
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const alphaEmail = 'qa_user_alpha@example.com';
const betaEmail = 'qa_user_beta@example.com';
const pass = 'PassQa123!';

async function testRls() {
  console.log('🧪 Iniciando Teste de Isolamento RLS (Multi-Tenant)...');

  // 1. Conectar como ALPHA
  const clientA = createClient(supabaseUrl, supabaseAnonKey);
  const { data: authA, error: errA } = await clientA.auth.signInWithPassword({ email: alphaEmail, password: pass });
  if (errA) throw errA;
  console.log(`👤 Logado como ALPHA: ${authA.user.id}`);

  // 2. ALPHA cria uma credencial
  const { error: insErr } = await clientA.from('tenant_credentials').upsert({
    user_id: authA.user.id,
    provider_type: 'llm_text_rls_test',
    provider_name: 'Teste RLS Alpha',
    api_key: 'secret-alpha-key',
    max_daily_limit: 1000,
  }, { onConflict: 'user_id, provider_type' });
  
  if (insErr) {
    console.error('❌ Erro ao criar credencial ALPHA:', insErr.message);
    return;
  }
  console.log('📝 ALPHA salvou uma credencial secreta.');

  // 3. Conectar como BETA
  const clientB = createClient(supabaseUrl, supabaseAnonKey);
  const { data: authB, error: errB } = await clientB.auth.signInWithPassword({ email: betaEmail, password: pass });
  if (errB) throw errB;
  console.log(`👤 Logado como BETA: ${authB.user.id}`);

  // 4. BETA tenta ler a credencial do ALPHA (Tentativa de Leak)
  console.log('🔍 BETA tentando ler credenciais de ALPHA via SELECT explícito...');
  const { data: leakAttempt, error: leakErr } = await clientB
    .from('tenant_credentials')
    .select('*')
    .eq('user_id', authA.user.id);

  if (leakErr) {
    console.log(`✅ Sucesso: Supabase barrou o leak com erro: ${leakErr.message}`);
  } else if (leakAttempt && leakAttempt.length > 0) {
    console.error('❌ FALHA DE SEGURANÇA: BETA conseguiu ler dados do ALPHA!');
    console.table(leakAttempt);
  } else {
    console.log('✅ Sucesso: BETA não conseguiu ler nada (0 resultados retornados pelo RLS).');
  }

  // 5. BETA tenta ler suas próprias credenciais (deve estar vazio)
  const { data: betaOwn } = await clientB.from('tenant_credentials').select('*');
  console.log(`ℹ️ BETA leu suas próprias credenciais: ${betaOwn?.length ?? 0} registros encontrados.`);

  // Cleanup Alpha
  await clientA.from('tenant_credentials').delete().eq('provider_type', 'llm_text_rls_test');
  console.log('🧹 Cleanup concluído.');
}

testRls().catch(console.error);

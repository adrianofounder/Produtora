
import { checkSpendLimit, incrementSpend } from '../src/lib/ai/consumption-tracker';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const alphaEmail = 'qa_user_alpha@example.com';
const pass = 'PassQa123!';

async function testStress() {
  console.log('🧪 Iniciando Teste de Estresse (Trava de Segurança)...');

  // 1. Obter ID do ALPHA
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const alpha = users.find(u => u.email === alphaEmail);
  if (!alpha) throw new Error('Usuário ALPHA não encontrado.');
  const userId = alpha.id;

  // 2. Definir teto baixo (500 unidades)
  console.log('📝 Configurando teto de 500 unidades para LLM...');
  await supabase.from('tenant_credentials').upsert({
    user_id: userId,
    provider_type: 'llm_text',
    provider_name: 'OpenAI Test',
    api_key: 'test-key',
    max_daily_limit: 500,
    daily_spend_count: 0,
    is_limit_active: true,
    last_reset_at: new Date().toISOString()
  }, { onConflict: 'user_id, provider_type' });

  // 3. Simular consumo gradual
  for (let i = 1; i <= 5; i++) {
    const check = await checkSpendLimit(userId, 'llm_text', supabase);
    console.log(`🔍[Chamada ${i}] Permitido? ${check.allowed} | Restante: ${check.remaining}`);
    
    if (check.allowed) {
      await incrementSpend(userId, 'llm_text', 100, supabase);
      console.log(`⚡ Consumiu 100 unidades.`);
    }
  }

  // 4. Testar estouro (6ª chamada)
  console.log('🚨 Tentando 6ª chamada (deve ser bloqueada)...');
  const finalCheck = await checkSpendLimit(userId, 'llm_text', supabase);
  if (!finalCheck.allowed) {
    console.log(`✅ BLOQUEIO REALIZADO COM SUCESSO! Mensagem: ${finalCheck.message}`);
  } else {
    console.error('❌ ERRO: O sistema permitiu a chamada mesmo acima do teto!');
  }

  // 5. Testar Auto-Reset Diário (Simulado)
  console.log('\n📅 Testando Auto-Reset Diário...');
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  await supabase.from('tenant_credentials').update({
    last_reset_at: yesterday.toISOString()
  }).eq('user_id', userId).eq('provider_type', 'llm_text');
  
  console.log('⏰ Manipulei last_reset_at para ontem.');
  const resetCheck = await checkSpendLimit(userId, 'llm_text', supabase);
  if (resetCheck.allowed && resetCheck.remaining === 500) {
    console.log('✅ AUTO-RESET FUNCIONOU: Novo dia detectado e saldo restaurado.');
  } else {
    console.error('❌ ERRO: Auto-reset falhou.');
  }
}

testStress().catch(console.error);


import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Erro: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontrados no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createQaUser(email: string, pass: string) {
  console.log(`🔌 Criando/Buscando usuário: ${email}...`);
  
  // Verificar se o usuário já existe
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('❌ Erro ao listar usuários:', listError.message);
    return null;
  }

  let user = users.find(u => u.email === email);

  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: pass,
      email_confirm: true
    });

    if (error) {
      console.error(`❌ Erro ao criar ${email}:`, error.message);
      return null;
    }
    user = data.user;
    console.log(`✅ Usuário criado: ${email} (${user.id})`);
  } else {
    console.log(`ℹ️ Usuário já existe: ${email} (${user.id})`);
  }

  return user;
}

async function main() {
  const alpha = await createQaUser('qa_user_alpha@example.com', 'PassQa123!');
  const beta = await createQaUser('qa_user_beta@example.com', 'PassQa123!');

  if (alpha && beta) {
    console.log('\n🚀 Ambiente de QA Provisionado com Sucesso!');
    console.log('---');
    console.log(`ALPHA_ID: ${alpha.id}`);
    console.log(`BETA_ID: ${beta.id}`);
    console.log('---');
  }
}

main();

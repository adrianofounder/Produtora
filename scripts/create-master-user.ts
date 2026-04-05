import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carrega .env manualmente para o script
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Erro: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontrados no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createMasterUser() {
  const email = 'adriano.founder@gmail.com';
  const password = '1234';

  console.log(`Tentando criar usuário: ${email}...`);

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'Maestro Supremo' }
  });

  if (error) {
    if (error.message.includes('already registered')) {
        console.log('Usuário já existe. Tentando resetar a senha para "1234"...');
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === email)?.id!,
            { password: '1234' }
        );
        if (updateError) console.error('Erro ao resetar senha:', updateError.message);
        else console.log('Senha resetada com sucesso para "1234".');
    } else {
        console.error('Erro ao criar usuário:', error.message);
    }
  } else {
    console.log('Usuário Mestre criado com sucesso!', data.user?.id);
  }
}

createMasterUser();

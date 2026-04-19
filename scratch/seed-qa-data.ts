
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('🚀 Seeding test data for Story 3.2...');

  // 1. Get or Create User
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('❌ Error listing users:', listError);
    return;
  }

  let user = users.users.find(u => u.email === 'qa_user_alpha@example.com');
  if (!user) {
    console.log('👤 Creating test user...');
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: 'qa_user_alpha@example.com',
      password: 'password123',
      email_confirm: true
    });
    if (createError) {
      console.error('❌ Error creating user:', createError);
      return;
    }
    user = newUser.user;
  }
  const userId = user!.id;
  console.log('✅ User ID:', userId);

  // 2. Create Channel
  console.log('📺 Creating test channel...');
  const { data: channel, error: channelError } = await supabase
    .from('canais')
    .upsert({
      nome: 'QA Alpha Channel',
      descricao: 'Canal de testes para Story 3.2',
      user_id: userId,
      idioma: 'pt-BR',
      categoria: 'Tecnologia'
    })
    .select()
    .single();

  if (channelError) {
    console.error('❌ Error creating channel:', channelError);
    return;
  }
  console.log('✅ Channel ID:', channel.id);

  // 3. Create Blueprint
  console.log('📐 Creating blueprint...');
  const { error: blueprintError } = await supabase
    .from('blueprints')
    .upsert({
      canal_id: channel.id,
      voz_narrador: 'Masc/Narrador Sério',
      tipo_narrativa: 'Curiosidades rápidas',
      estrutura_emocional: 'Atenção -> Curiosidade -> Revelação',
      emocao_dominante: 'Fascinado'
    });

  if (blueprintError) {
    console.error('❌ Error creating blueprint:', blueprintError);
    // Continue anyway
  }

  // 4. Create Video
  console.log('🎬 Creating test video...');
  const { data: video, error: videoError } = await supabase
    .from('videos')
    .insert({
      titulo: 'O Segredo da Vontade Infinita',
      eixo: 'Mentalidade',
      status: 'producao',
      canal_id: channel.id,
      user_id: userId,
      data_previsao: new Date().toISOString()
    })
    .select()
    .single();

  if (videoError) {
    console.error('❌ Error creating video:', videoError);
    return;
  }
  console.log('✅ Video created successfully:', video.id);
  console.log('🏁 Seeding complete! You can now log in with qa_user_alpha@example.com / password123');
}

seed();

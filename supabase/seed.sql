-- ============================================================
-- AD_LABS — Script de População Inicial (Seed) - Story 2.1
-- ============================================================

-- Variáveis estáticas de ID para garantir relacionamentos consistentes
DO $$ 
DECLARE
    -- Prefixo v_ para evitar conflito de nomes com colunas nas cláusulas WHERE
    v_user_id  UUID := '00000000-0000-0000-0000-000000000001';
    v_canal_id UUID := '11111111-1111-1111-1111-111111111111';
    v_eixo1_id UUID := '22222222-2222-2222-2222-222222222221';
    v_eixo2_id UUID := '22222222-2222-2222-2222-222222222222';
    v_eixo3_id UUID := '22222222-2222-2222-2222-222222222223';
    v_eixo4_id UUID := '22222222-2222-2222-2222-222222222224';
    v_eixo5_id UUID := '22222222-2222-2222-2222-222222222225';
BEGIN

    -- 1. Criação do Usuário MOCK no auth.users
    -- NOTA: Em produção os usuários nascem pelo Supabase Auth (SignUp). 
    -- Em dev local usamos INSERT com colunas válidas apenas.
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_user_id) THEN
        INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at) 
        VALUES (
            v_user_id, 
            '00000000-0000-0000-0000-000000000000', 
            'maestro@adlabs.com', 
            crypt('Seed@123456', gen_salt('bf')),
            NOW(),
            '{"full_name": "Maestro AD"}',
            NOW(),
            NOW()
        );
    END IF;

    -- O Trigger criará automaticamente o public.profiles. Vamos apenas dar update.
    UPDATE public.profiles SET full_name = 'Maestro AD', role = 'admin' WHERE id = v_user_id;

    -- 2. Criação do Canal MOCK
    IF NOT EXISTS (SELECT 1 FROM public.canais WHERE id = v_canal_id) THEN
        INSERT INTO public.canais (id, user_id, nome, descricao, idioma, pais, categoria, mare_status, mare_eixo_ativo, motor_ativo)
        VALUES (
            v_canal_id, v_user_id, 'Histórias Ocultas', 'Canal dark focado em relatos narrados e exposição de bastidores.',
            'pt-BR', 'BR', 'Entretenimento', 'ativa', 'Relatos VIP Trabalho', TRUE
        );
    END IF;

    -- 3. Criação de 5 Eixos (Cobrindo DNA de Eixo - 20 Atributos PRD-Revisado)
    -- score_mare (0-100): Score da Maré = Indicador de performance/tendência do eixo (Principal KPI do Laboratório)
    -- score_retencao (0-10): Nível de retenção estimada de audiência
    -- taxa_concorrencia: 'baixa' | 'media' | 'alta' — Filtro de nicho (Oceano Azul)
    DELETE FROM public.eixos WHERE canal_id = v_canal_id; -- v_canal_id evita ambiguidade com a coluna
    INSERT INTO public.eixos (
        id, canal_id, nome, premissa, sentimento_dominante, gatilho_curiosidade, 
        arquetipo_protagonista, arquetipo_antagonista, tipo_conflito, payoff, 
        taxa_concorrencia, rpm_estimado, score_retencao, views_acumuladas, status, score_mare
    ) VALUES 
    (v_eixo1_id, v_canal_id, 'Escola',   'Justiça Dramática contra o sistema educacional.', 'Injustiça',        'Curiosidade Mórbida', 'Aluno Invisível',   'Diretor Corrupto',       'Impotência vs Cérebro',   'Demissão humilhante', 'media', 3.50, 6.2, 124000, 'testando',  58.0),
    (v_eixo2_id, v_canal_id, 'Hospital', 'Emoção Extrema entre vida e morte no plantão.',  'Tensão',           'Negligência',         'Enfermeiro Ético',  'Administrador Ganancioso','Ética vs Lucro',          'Revelação pública',   'alta',  4.20, 3.8,  47000, 'aguardando',29.0),
    (v_eixo3_id, v_canal_id, 'Igreja',   'Fé & Conflito interno na liderança.',             'Fé Traída',        'Hipocrisia',          'Fiel Questionador', 'Falso Profeta',           'Verdade vs Instituição',  'Exposição de fraude', 'media', 2.80, 7.4, 210000, 'testando',  71.0),
    (v_eixo4_id, v_canal_id, 'Rua',      'Superação Real do morador de rua para o sucesso.','Superação',        'O Tesouro Oculto',    'O Invisível',       'A Sociedade',             'Pobreza vs Potencial',    'Sucesso estrondoso',  'alta',  1.50, 5.1,  83000, 'aguardando',43.0),
    (v_eixo5_id, v_canal_id, 'Trabalho', 'Chefe vs. Tropa - O funcionário júnior dá o troco.','Satisfação Pessoal','O Erro de 1 Milhão', 'Estagiário',        'Ex-Chefe',                'Arrogância vs Silêncio',  'Falência da empresa', 'baixa', 6.50, 8.9, 487000, 'venceu',    94.0);

    -- 4. Criação das Ideias (Tabela vídeos com status='planejamento')
    -- REGRA: No banco NÃO existe tabela 'ideias'. Ideias = videos com status 'planejamento' (Story 2.1 handoff pelo SM)
    DELETE FROM public.videos WHERE canal_id = v_canal_id; -- v_canal_id evita ambiguidade
    INSERT INTO public.videos (canal_id, user_id, titulo, eixo, status) VALUES
    (v_canal_id, v_user_id, 'O chefe que não sabia de NADA (Perdeu R$ 2M)',       'Trabalho', 'planejamento'),
    (v_canal_id, v_user_id, 'O estagiário que salvou a empresa da falência',       'Trabalho', 'planejamento'),
    (v_canal_id, v_user_id, 'Como o júnior demitiu o Diretor Sênior',              'Trabalho', 'planejamento'),
    (v_canal_id, v_user_id, 'Minha chefe me humilhou, então comprei a empresa',    'Trabalho', 'planejamento'),
    (v_canal_id, v_user_id, 'Jesus e o pastor mentiroso',                          'Igreja',   'planejamento'),
    (v_canal_id, v_user_id, 'Médico descobre que é o paciente',                    'Hospital', 'planejamento'),
    (v_canal_id, v_user_id, 'Diretora x professora substituta (Vingança)',          'Escola',   'planejamento');

    -- 5. Povoando o Mock Temporário do Crawler OpenCLI-rs
    DELETE FROM public.matriz_nichos;
    INSERT INTO public.matriz_nichos (label, tipo, x, y, opacity, pulse) VALUES 
    ('True Crime US', 'lotado', 20.0, 30.0, 0.5, FALSE),
    ('React Cristão', 'lotado', 15.0, 70.0, 0.6, FALSE),
    ('Shorts de Tech', 'lotado', 80.0, 20.0, 0.4, FALSE),
    ('Relatos VIP', 'gap', 85.0, 80.0, 1.0, TRUE),
    ('Gringo Dublado', 'gap', 75.0, 65.0, 1.0, FALSE);

    DELETE FROM public.garimpos_minados;
    INSERT INTO public.garimpos_minados (titulo, canal, views_text, tag, thumbnail_url) VALUES
    ('The boss who lost $2M on purpose to teach a lesson', 'Corporate Tales', '4.2M', 'Gap: Relatos', 'https://i.ytimg.com/vi/q7XmOnc_z8U/mqdefault.jpg'),
    ('Why everyone is quitting their $100k tech jobs', 'Tech Dropout', '1.8M', 'Gap: Carreiras', 'https://i.ytimg.com/vi/aZ3fS8oGgks/mqdefault.jpg'),
    ('I stayed in the worlds most illegal hotel', 'Urbex Worldwide', '8.4M', 'Lotado: Urbex', 'https://i.ytimg.com/vi/LpG9YqByC2M/mqdefault.jpg');

END $$;

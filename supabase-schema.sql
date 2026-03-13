-- FeedSyncs - Schema do Banco de Dados
-- Execute este SQL no Supabase: SQL Editor > New Query > Colar > Run

-- Tabela de Gestores/Usuários
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  store TEXT,
  "avatarUrl" TEXT,
  "slackUserId" TEXT,
  "averageRating" DOUBLE PRECISION DEFAULT 0,
  "totalRatings" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Feedbacks
CREATE TABLE IF NOT EXISTS feedbacks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  rating INTEGER NOT NULL,
  comment TEXT,
  anonymous BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de Ouvidoria/Denúncias
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  anonymous BOOLEAN DEFAULT true,
  "reporterEmail" TEXT,
  status TEXT DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "reportedUserId" TEXT REFERENCES users(id) ON DELETE SET NULL
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_feedbacks_userId ON feedbacks("userId");
CREATE INDEX IF NOT EXISTS idx_reports_reportedUserId ON reports("reportedUserId");
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Gestor de teste (senha: 123456)
INSERT INTO users (id, name, email, password, role, store, "averageRating", "totalRatings")
VALUES (
  'demo-manager-001',
  'Maria Silva',
  'maria.silva@oboticario.com.br',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G1zGvzG1Qvq1Vy',
  'Gerente de Loja',
  'Shopping Center Norte',
  4.5,
  12
) ON CONFLICT (email) DO NOTHING;

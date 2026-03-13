# FeedSyncs - Sistema de Feedback para Gestores

Sistema de avaliação e feedback para gestores da franquia O Boticário. Plataforma moderna inspirada no design do Culture Amp.

## Funcionalidades

- **Listagem Pública de Gestores**: Cards com foto, nome, cargo e nota média
- **Sistema de Avaliação**: Notas de 1 a 5 estrelas + comentários privados
- **Dashboard do Gestor**: Visualização de feedbacks, estatísticas e alteração de foto
- **Ouvidoria**: Canal seguro e anônimo para denúncias
- **Integração Slack**: Notificações automáticas de novos feedbacks
- **Deploy Render**: Configuração pronta para deploy

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **Integração**: Slack Web API
- **Deploy**: Render.com

## Início Rápido

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/feedsyncs"
JWT_SECRET="sua-chave-secreta"
SLACK_BOT_TOKEN="xoxb-seu-token"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Configurar banco de dados

```bash
# Criar tabelas
npm run db:push

# Popular com dados de exemplo
npm run db:seed
```

### 4. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Credenciais de Teste

Após rodar o seed, use estas credenciais para login:

- **Email**: maria.silva@oboticario.com.br
- **Senha**: 123456

## Configuração do Slack

1. Crie um app em [api.slack.com/apps](https://api.slack.com/apps)
2. Adicione as permissões: `chat:write`, `users:read`
3. Instale o app no workspace
4. Copie o Bot Token (xoxb-...) para `SLACK_BOT_TOKEN`
5. (Opcional) Configure `SLACK_ADMIN_CHANNEL` para notificações de ouvidoria

## Deploy no Render

1. Faça push do código para o GitHub
2. No Render, crie um novo Blueprint
3. Conecte ao repositório
4. O `render.yaml` configurará automaticamente:
   - Web Service (Next.js)
   - PostgreSQL Database
5. Configure as variáveis de ambiente marcadas como `sync: false`

## Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Iniciar em produção
npm run db:push      # Sincronizar schema com banco
npm run db:migrate   # Criar migração
npm run db:seed      # Popular banco com dados de exemplo
npm run db:studio    # Interface visual do Prisma
npm run lint         # Verificar código
```

## Estrutura do Projeto

```
feedsyncs/
├── prisma/
│   ├── schema.prisma    # Modelos do banco
│   └── seed.ts          # Dados de exemplo
├── src/
│   ├── app/             # Páginas (App Router)
│   │   ├── api/         # API Routes
│   │   ├── avaliar/     # Página de avaliação
│   │   ├── dashboard/   # Dashboard do gestor
│   │   ├── login/       # Página de login
│   │   └── ouvidoria/   # Página de ouvidoria
│   ├── components/      # Componentes React
│   │   ├── feedback/    # Componentes de feedback
│   │   ├── layout/      # Navbar, Footer
│   │   ├── manager/     # Cards de gestores
│   │   └── ui/          # Design system
│   └── lib/             # Utilitários
│       ├── auth.ts      # Autenticação JWT
│       ├── prisma.ts    # Cliente Prisma
│       ├── slack.ts     # Integração Slack
│       └── utils.ts     # Funções auxiliares
├── render.yaml          # Config do Render
└── README.md
```

## Licença

Projeto interno - O Boticário Franquia

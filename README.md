# 🚀 PegaLead

Um sistema automatizado de onboarding sem atrito para a **Zions Vision** que converte leads em clientes com apenas alguns cliques.

## 📋 Visão Geral

**PegaLead** é uma solução que simplifica o processo de captura e onboarding de clientes. Os visitantes leem um QR Code ou acessam um link, preenchem um formulário rápido e, em segundos, ganham acesso automático a um trial gratuito — sem qualquer intervenção manual.

O sistema integra-se perfeitamente com o **Heimdall** (para criar tenants) e o **CRM Command** (para sincronizar dados comerciais), garantindo uma experiência fluida e um fluxo operacional eficiente.

---

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia |
|-----------|-----------|
| **Frontend & Backend** | Next.js 15+ |
| **Linguagem** | TypeScript |
| **Banco de Dados** | PostgreSQL |
| **ORM** | Prisma |
| **Integrações** | Heimdall API, CRM Command |
| **Monitoramento** | Grafana |

---

## 🔄 Arquitetura e Fluxo de Automação

O PegaLead implementa um fluxo de automação completo que reduz o tempo de conversão a segundos:

```
┌─────────────────┐
│    Lead         │
│  Preenche       │
│  Formulário     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PegaLead      │
│  Valida Dados   │
│  Armazena no DB │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Heimdall API   │
│  Cria Tenant    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  CRM Command    │
│  Sincroniza     │
│  Dados do Lead  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Sucesso!     │
│  Trial Ativo    │
└─────────────────┘
```

### 📌 Descrição do Fluxo

1. **Captura de Lead:** O visitante acessa o link ou scanneia o QR Code e preenche o formulário de contato
2. **Processamento:** O PegaLead valida os dados e armazena no banco de dados
3. **Criação de Tenant:** Chamada automática à API do Heimdall para provisionar um novo tenant
4. **Sincronização CRM:** Os dados do lead são enviados para o CRM Command para acompanhamento comercial
5. **Acesso Imediato:** O cliente recebe credenciais e acesso ao trial instantaneamente

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** 18.0.0 ou superior
- **npm** ou **yarn** ou **pnpm**
- **PostgreSQL** 13+
- **Git**

---

## 🚀 Instalação e Configuração

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/omaatheus/pegalead.git
cd pegalead
```

### 2️⃣ Instalar Dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3️⃣ Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as variáveis necessárias:

```env
# Database
DATABASE_URL="postgresql://user:password@ip:port/database?schema=public"

# Heimdall API
NEXT_PUBLIC_HEIMDALL_SUBDOMAIN="neuralseg"
NEXT_PUBLIC_SUPERADMIN_USER="User"
NEXT_PUBLIC_SUPERADMIN_PASSWORD="Password"

# CRM Command
NEXT_PUBLIC_COMMAND_TOKEN="token"
NEXT_PUBLIC_COMMAND_URL="https://api.usecommand.io/api/kanban/boards/{board-id-hopper}/cards/webhook"

```

### 4️⃣ Executar Migrações do Prisma

```bash
npx prisma migrate dev
```

Isso irá:
- Criar as tabelas no banco de dados
- Gerar o cliente do Prisma automaticamente

### 5️⃣ Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em **http://localhost:3000**

---

## 📊 Monitoramento com Grafana

O PegaLead envia métricas em tempo real para o **Grafana**, permitindo que você visualize métricas.

### Acessar Dashboard

1. Acesse **https://localhost:3020**
2. Faça login com suas credenciais
3. Adicione o Postgresql como datasource
4. Crie um novo dashboard

---

## 📁 Estrutura de Diretórios

```
pegalead/
├── src/
│   ├── app/                 # Páginas e rotas (Next.js App Router)
│   │   ├── actions/         # Server actions para automação
│   │   └── contact/         # Página de contato/formulário
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── forms/           # Formulários de captura
│   │   ├── layout/          # Layout e navegação
│   │   └── ui/              # Componentes UI base
│   ├── lib/                 # Utilitários e clientes
│   │   └── prisma.ts        # Cliente Prisma
│   ├── config/              # Configurações da app
│   ├── constants/           # Constantes globais
│   ├── types/               # Tipos TypeScript
│   └── utils/               # Funções auxiliares
├── prisma/
│   ├── schema.prisma        # Schema do banco de dados
│   └── migrations/          # Histórico de migrações
├── public/                  # Arquivos estáticos (imagens, etc)
├── .env.local               # Variáveis de ambiente (local)
├── next.config.ts           # Configuração Next.js
└── tsconfig.json            # Configuração TypeScript
```

---

## 🔧 Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia o servidor em modo watch

# Produção
npm run build            # Compila a aplicação
npm start                # Inicia o servidor de produção

# Banco de Dados
npx prisma migrate dev   # Executa migrações e atualiza schema
npx prisma db seed       # Popula dados iniciais
npx prisma studio       # Abre o Prisma Studio (GUI)

# Linting e Formatação
npm run lint             # Verifica erros com ESLint
npm run format           # Formata código com Prettier
```

---

## 🤝 Fluxo de Desenvolvimento

1. **Criar branch** para sua feature: `git checkout -b feature/sua-feature`
2. **Fazer commits** significativos: `git commit -m "feat: adiciona nova funcionalidade"`
3. **Push para repositório**: `git push origin feature/sua-feature`
4. **Criar Pull Request** e aguardar review

---

## 🐛 Troubleshooting

### Erro de conexão com PostgreSQL
```
Verifique se o PostgreSQL está rodando:
psql postgres -U seu_usuario
Confirme a DATABASE_URL em .env.local
```

### Erro ao rodar migrações do Prisma
```
Limpe cache e tente novamente:
rm -rf node_modules .next
npm install
npx prisma migrate dev
```

### Erro ao chamar APIs (Heimdall/Command)
```
Verifique as variáveis de ambiente:
- HEIMDALL_API_KEY
- COMMAND_CRM_API_KEY
Teste a conectividade com os servidores
```

---

## 📖 Documentação Complementar

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Prisma](https://www.prisma.io/docs/)
- [Documentação do TypeScript](https://www.typescriptlang.org/docs/)
- [API Heimdall](https://docs.heimdall.example.com)
- [API CRM Command](https://docs.command.example.com)

---

## 👥 Contato e Suporte

Para dúvidas, sugestões ou reportar bugs:

- **Email:** matheus@pereiradasilv@gmail.com

---

**Desenvolvido com ❤️ para a Zions Vision**

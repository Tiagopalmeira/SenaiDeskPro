# Senai Desk Pro - Sistema de Gestão de Solicitações

Sistema completo de gestão de solicitações (chamados) desenvolvido com Next.js, React e TypeScript. Permite que usuários criem e acompanhem solicitações, enquanto administradores gerenciam e respondem aos chamados.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Rotas e Páginas](#rotas-e-páginas)
- [API e Integração](#api-e-integração)
- [Autenticação](#autenticação)
- [Funcionalidades](#funcionalidades)
- [Configuração](#configuração)
- [Como Executar](#como-executar)

---

## 🎯 Visão Geral

O **Senai Desk Pro** é um sistema de gestão de solicitações que permite:

- **Usuários Comuns**: Criar e acompanhar suas próprias solicitações
- **Administradores**: Gerenciar todas as solicitações, assinar chamados, alterar status e responder aos usuários

O sistema possui controle de permissões baseado em roles, filtros avançados, busca em tempo real e interface responsiva com suporte a tema claro/escuro.

---

## 🛠 Tecnologias

- **Next.js 16.0.3** - Framework React com App Router
- **React 19.2.0** - Biblioteca de interface
- **TypeScript 5** - Tipagem estática
- **Styled Components 6.1.19** - Estilização CSS-in-JS
- **REST API** - Integração com backend

---

## 📁 Estrutura do Projeto

```
SenaiDeskPro/
├── src/
│   ├── app/                    # Rotas e páginas (Next.js App Router)
│   │   ├── page.tsx           # Página de login (rota raiz)
│   │   ├── home/              # Dashboard
│   │   ├── chamados/          # Sistema de solicitações
│   │   ├── config/            # Configurações do usuário
│   │   └── layout.tsx        # Layout raiz com providers
│   │
│   ├── components/            # Componentes React
│   │   ├── chamados/          # Componentes de chamados
│   │   │   ├── TicketCard.tsx
│   │   │   ├── TicketDetailModal.tsx
│   │   │   ├── FilterModal.tsx
│   │   │   ├── NewTicketModal.tsx
│   │   │   └── *Styles.tsx    # Styled components separados
│   │   ├── home/              # Componentes do dashboard
│   │   └── Sidebar.tsx        # Navegação lateral
│   │
│   ├── hooks/                 # Hooks customizados
│   │   ├── useSolicitacoes.tsx    # Gerenciamento de solicitações
│   │   ├── useFilterModal.tsx     # Lógica de filtros
│   │   ├── useNewTicketForm.tsx   # Lógica de formulário
│   │   ├── useTicketDetail.tsx   # Lógica de detalhes
│   │   └── ...
│   │
│   ├── api_requests/          # Funções de requisição à API
│   │   ├── login.ts           # Autenticação
│   │   ├── solicitacoes.ts    # CRUD de solicitações
│   │   ├── movimentacoes.ts   # Gerenciamento de movimentações
│   │   ├── recursos.ts        # Locais, cursos, tipos
│   │   └── usuarios.ts       # Dados de usuários
│   │
│   ├── context/               # Context API
│   │   ├── AuthContext.tsx    # Autenticação e usuário
│   │   └── ThemeContext.tsx   # Tema claro/escuro
│   │
│   ├── utils/                 # Utilitários
│   │   ├── dateHelpers.ts     # Formatação de datas
│   │   ├── constants/         # Constantes e dados mockados
│   │   └── mocks/             # Dados mockados (dev)
│   │
│   └── constants/             # Constantes globais
│
└── public/                    # Arquivos estáticos
    └── image/                 # Imagens (logo, background)
```

---

## 🗺 Rotas e Páginas

### Rotas Públicas

#### `/` (Página de Login)
- **Arquivo**: `src/app/page.tsx`
- **Descrição**: Tela inicial de autenticação
- **Funcionalidades**:
  - Login com usuário e senha
  - Toggle para entrar como administrador
  - Validação de credenciais
  - Redirecionamento automático se já autenticado

#### `/login`
- **Arquivo**: `src/app/login/page.tsx`
- **Descrição**: Página alternativa de login

### Rotas Protegidas

#### `/home` (Dashboard)
- **Arquivo**: `src/app/home/page.tsx`
- **Descrição**: Painel principal com estatísticas e tickets recentes
- **Componentes**:
  - `DashboardStats` - Cards com estatísticas
  - `RecentTickets` - Lista de tickets recentes
- **Proteção**: Requer autenticação

#### `/chamados` (Sistema de Solicitações)
- **Arquivo**: `src/app/chamados/page.tsx`
- **Descrição**: Página principal de gestão de solicitações
- **Funcionalidades**:
  - Listagem de solicitações (filtrada por permissão)
  - Busca por texto
  - Filtros avançados (modal)
  - Visualização de detalhes (modal)
  - Criação de novos chamados (usuários)
- **Proteção**: Requer autenticação

#### `/config` (Configurações)
- **Arquivo**: `src/app/config/page.tsx`
- **Descrição**: Configurações do perfil do usuário
- **Funcionalidades**:
  - Editar nome
  - Alterar foto de perfil
- **Proteção**: Requer autenticação

---

## 🔌 API e Integração

### Configuração da API

A URL base da API é configurada através da variável de ambiente:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Se não configurada, o padrão é `http://127.0.0.1:8000/api`.

### Autenticação

Todas as requisições autenticadas incluem o token no header:

```typescript
Authorization: Bearer {token}
```

O token é armazenado no `localStorage` com a chave `authToken`.

### Endpoints Implementados

#### 1. Autenticação

**POST** `/usuario/login`
- **Arquivo**: `src/api_requests/login.ts`
- **Payload**:
  ```json
  {
    "usuario": "string",
    "senha": "string"
  }
  ```
- **Resposta**:
  ```json
  {
    "data": {
      "token": "string",
      "usuario": {
        "id_usuario": number,
        "nome": "string",
        "email": "string",
        "cargo": "string",
        "login": "string",
        "matricula": "string"
      }
    }
  }
  ```

#### 2. Solicitações

**GET** `/solicitacao/`
- **Arquivo**: `src/api_requests/solicitacoes.ts`
- **Função**: `listarSolicitacoes(filters?)`
- **Query Parameters**:
  - `usuarioId` - Filtrar por usuário
  - `solicitacaoId` - Filtrar por ID específico
  - `area` - Filtrar por área
  - `categoriaId` - Filtrar por categoria
  - `localId` - Filtrar por local
  - `cursoId` - Filtrar por curso
  - `prioridade` - Filtrar por prioridade (0, 1, 2)
  - `status` - Filtrar por status (0=Aberta, 1=Em Andamento, 2=Concluída)
  - `dataInicio` - Data inicial (ISO date-time)
  - `dataFim` - Data final (ISO date-time)
- **Resposta**:
  ```json
  {
    "data": {
      "solicitacoes": [
        {
          "id_solicitacao": number,
          "descricao": "string",
          "prioridade": number,
          "data_abertura": "string",
          "id_usuario": number,
          "id_local": number,
          "id_tipo_solicitacao": number,
          "id_curso": number | null
        }
      ]
    }
  }
  ```

**GET** `/solicitacao/{id}`
- **Função**: `buscarSolicitacaoPorId(id)`
- **Resposta**: Retorna uma única solicitação

**POST** `/solicitacao/`
- **Função**: `criarSolicitacao(data)`
- **Payload**:
  ```json
  {
    "usuarioId": number,
    "localId": number,
    "tipoSolicitacaoId": number,
    "cursoId": number | null,
    "descricao": "string",
    "prioridade": 0 | 1 | 2,
    "imagemBase64": "string" | null
  }
  ```

#### 3. Movimentações

**GET** `/movimentacao/`
- **Arquivo**: `src/api_requests/movimentacoes.ts`
- **Função**: `listarMovimentacoes(filters?)`
- **Query Parameters**:
  - `usuarioId` - Filtrar por usuário responsável
  - `solicitacaoId` - Filtrar por solicitação
  - `status` - Filtrar por status
- **Resposta**:
  ```json
  {
    "data": {
      "movimentacoes": [
        {
          "id_movimentacao": number,
          "id_usuario": number,
          "id_solicitacao": number,
          "status": number,
          "data_atualizacao": "string",
          "resposta": "string" | null
        }
      ]
    }
  }
  ```

**POST** `/movimentacao/`
- **Função**: `criarOuAtualizarMovimentacao(data)`
- **Payload**:
  ```json
  {
    "movimentacaoId": number,        // Opcional (para atualizar)
    "solicitacaoId": number,
    "usuarioId": number,
    "status": 0 | 1 | 2,             // Opcional
    "resposta": "string" | null      // Opcional
  }
  ```
- **Uso**: Criar nova movimentação ou atualizar existente (assinar chamado, alterar status, responder)

#### 4. Recursos Auxiliares

**GET** `/local/`
- **Arquivo**: `src/api_requests/recursos.ts`
- **Função**: `listarLocais()`
- **Resposta**: Lista de locais (laboratórios, salas, etc.)

**GET** `/curso/`
- **Função**: `listarCursos()`
- **Resposta**: Lista de cursos

**GET** `/tipo-solicitacao/`
- **Função**: `listarTiposSolicitacao()`
- **Resposta**: Lista de tipos/categorias de solicitação

#### 5. Usuários

**GET** `/usuario/{id}`
- **Arquivo**: `src/api_requests/usuarios.ts`
- **Função**: `buscarUsuarioPorId(id)`
- **Resposta**: Dados completos do usuário

---

## 🔐 Autenticação

### Fluxo de Autenticação

1. **Login** (`src/context/AuthContext.tsx`):
   - Usuário insere credenciais na página `/`
   - Sistema tenta login mockado primeiro (`USR`/`PSSW`)
   - Se não for mockado, faz requisição para `/usuario/login`
   - Token e dados do usuário são salvos no `localStorage`
   - Usuário é redirecionado para `/home`

2. **Armazenamento**:
   - `authToken` - Token JWT no `localStorage`
   - `authUser` - Dados do usuário serializados em JSON

3. **Requisições Autenticadas**:
   - Todas as funções em `api_requests/` incluem automaticamente o header `Authorization`
   - Token é obtido do `localStorage` em cada requisição

4. **Logout**:
   - Remove `authToken` e `authUser` do `localStorage`
   - Redireciona para página de login

### Login Mockado (Desenvolvimento)

Para desenvolvimento/teste, o sistema aceita:
- **Usuário**: `USR`
- **Senha**: `PSSW`
- **Toggle Admin**: Define se entra como admin ou usuário comum

---

## ⚙️ Funcionalidades

### 1. Sistema de Solicitações

#### Carregamento Inicial

**Usuário Comum**:
- Busca apenas solicitações onde `id_usuario` = ID do usuário logado
- Vê apenas suas próprias solicitações

**Administrador**:
- Busca solicitações atribuídas a ele (via movimentações)
- Busca solicitações em aberto (sem responsável ou status = 0)
- **Nunca** vê solicitações atribuídas a outros administradores

#### Filtros Avançados

Disponíveis através do ícone de filtro:
- **Status**: Aberta, Em Andamento, Concluída
- **Área/Categoria**: Tipos de solicitação
- **Laboratório/Local**: Locais físicos
- **Curso**: Cursos (se aplicável)
- **Prioridade**: Baixa, Média, Alta
- **Período**: Data início e data fim
- **Busca por Texto**: Descrição ou ID da solicitação

Os filtros podem ser combinados e atualizam os cards em tempo real.

#### Visualização de Detalhes

Ao clicar em um card:
- **Usuário Comum**: Visualiza apenas (status, datas, resposta do setor)
- **Administrador**: Pode editar (alterar status, responder, assinar)

#### Assinar Chamado (Admin)

- Disponível apenas para chamados em aberto (status = 0) sem responsável
- Cria movimentação atribuindo o chamado ao admin
- Atualiza o campo `assignedTo` com o ID do admin

#### Alterar Status (Admin)

Administradores podem alterar status para:
- **0** - Aberta
- **1** - Em Andamento
- **2** - Concluída

#### Responder/Adicionar Andamento (Admin)

- Campo de texto para resposta
- Salva na movimentação
- Visível para o usuário que criou a solicitação

### 2. Criação de Solicitações

**Apenas para usuários comuns** (não administradores):
- Modal com formulário completo
- Campos obrigatórios: Local, Sub-local, Descrição, Categoria, Prioridade
- Upload de imagem opcional
- Validação em tempo real
- Mensagem de sucesso após criação

### 3. Dashboard

- **Estatísticas**: Total, Abertos, Em Andamento, Resolvidos
- **Tickets Recentes**: Últimos 5 tickets do usuário
- Dados filtrados automaticamente por permissão

---

## 🎣 Hooks Customizados

### `useSolicitacoes`

**Arquivo**: `src/hooks/useSolicitacoes.tsx`

Gerencia o carregamento e filtragem de solicitações.

```typescript
const {
  solicitacoes,      // Array de solicitações completas
  loading,           // Estado de carregamento
  error,             // Mensagem de erro (se houver)
  filtros,           // Filtros atuais
  atualizarFiltros,  // Função para atualizar filtros
  limparFiltros,     // Função para limpar todos os filtros
  recarregar,        // Função para recarregar dados
} = useSolicitacoes({ userId, isAdmin });
```

**Lógica**:
- Carrega solicitações baseado em permissões
- Enriquece dados com movimentações e nomes de responsáveis
- Aplica filtros em tempo real
- Formata datas automaticamente

### `useFilterModal`

**Arquivo**: `src/hooks/useFilterModal.tsx`

Gerencia o carregamento de recursos para filtros.

```typescript
const { locais, cursos, tiposSolicitacao, loading } = useFilterModal(isOpen);
```

### `useNewTicketForm`

**Arquivo**: `src/hooks/useNewTicketForm.tsx`

Gerencia estado e validação do formulário de novo chamado.

```typescript
const {
  formData,          // Dados do formulário
  errors,            // Erros de validação
  imagePreview,     // Preview da imagem
  handleChange,      // Atualizar campo
  handleImageChange, // Atualizar imagem
  removeImage,      // Remover imagem
  validate,         // Validar formulário
  reset,            // Resetar formulário
} = useNewTicketForm(userName, userMatricula, userCargo);
```

### `useTicketDetail`

**Arquivo**: `src/hooks/useTicketDetail.tsx`

Gerencia lógica de detalhes e edição de solicitação.

```typescript
const {
  status,           // Status atual
  setStatus,        // Atualizar status
  resposta,         // Resposta atual
  setResposta,      // Atualizar resposta
  loading,          // Estado de carregamento
  error,            // Erro (se houver)
  success,          // Sucesso (se houver)
  handleAssinar,    // Função para assinar chamado
  handleSalvar,     // Função para salvar alterações
} = useTicketDetail(solicitacao, userId);
```

---

## 🧩 Componentes Principais

### Modais

#### `TicketDetailModal`
- Visualização completa da solicitação
- Edição (admin): status, resposta
- Assinatura de chamado (admin)

#### `FilterModal`
- Filtros avançados
- Carrega recursos dinamicamente
- Aplica filtros e atualiza lista

#### `NewTicketModal`
- Formulário de criação
- Validação em tempo real
- Upload de imagem
- Mensagem de sucesso

### Cards e Listagens

#### `TicketCard`
- Exibe informações resumidas
- Clicável para abrir detalhes
- Badges de status e prioridade

### Layout

#### `Sidebar`
- Navegação principal
- Colapsável
- Menu responsivo

---

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

### Estrutura de Dados

#### Status de Solicitação
- `0` - Aberta
- `1` - Em Andamento
- `2` - Concluída

#### Prioridade
- `0` - Baixa
- `1` - Média
- `2` - Alta

#### Formato de Datas
- **API**: ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`)
- **Exibição**: Formato brasileiro (`DD/MM/YYYY` ou `DD/MM/YYYY HH:mm`)

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Backend da API rodando (opcional para desenvolvimento)

### Instalação

```bash
# Instalar dependências
npm install

# ou
yarn install
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# ou
yarn dev
```

Acesse: `http://localhost:3000`

### Build de Produção

```bash
# Criar build de produção
npm run build

# Iniciar servidor de produção
npm start
```

### Login de Teste

Para testar sem a API:
- **Usuário**: `USR`
- **Senha**: `PSSW`
- Marque "Sou administrador" se quiser entrar como admin

---

## 📝 Notas Importantes

### Permissões

- O sistema determina se o usuário é admin baseado no campo `isAdmin` do contexto de autenticação
- Para login real, a lógica verifica o cargo do usuário ou usa o toggle do formulário

### Token de Autenticação

- O token é armazenado no `localStorage`
- Todas as requisições autenticadas incluem o token automaticamente
- Se o token expirar, o usuário precisará fazer login novamente

### Filtros

- Os filtros são aplicados tanto no frontend (busca por texto) quanto no backend (outros filtros)
- A combinação de filtros é suportada
- Filtros são mantidos durante a sessão

### Performance

- O hook `useSolicitacoes` usa `useMemo` e `useCallback` para otimização
- Dados são carregados sob demanda
- Movimentações são buscadas apenas quando necessário

---

## 🔄 Fluxo de Dados

### Carregamento de Solicitações

1. Usuário acessa `/chamados`
2. `useSolicitacoes` é inicializado
3. Sistema determina filtros baseados em permissão
4. Faz requisição para `/solicitacao/` com filtros
5. Para cada solicitação, busca movimentações em `/movimentacao/`
6. Para cada movimentação, busca nome do responsável em `/usuario/{id}`
7. Enriquece dados e formata datas
8. Aplica filtro de busca por texto (se houver)
9. Atualiza interface

### Criação de Movimentação

1. Admin clica em "Assinar" ou "Salvar Alterações"
2. `useTicketDetail` chama `criarOuAtualizarMovimentacao`
3. Requisição POST para `/movimentacao/`
4. Se sucesso, atualiza estado local
5. `useSolicitacoes` recarrega dados
6. Interface atualiza automaticamente

---

## 🐛 Troubleshooting

### Erro: "Não foi possível conectar ao servidor"

- Verifique se a API está rodando
- Confirme a URL em `NEXT_PUBLIC_API_URL`
- Verifique CORS no backend

### Erro: "Token inválido"

- Faça logout e login novamente
- Verifique se o token está sendo salvo corretamente

### Solicitações não aparecem

- Verifique permissões do usuário (admin vs comum)
- Confirme filtros aplicados
- Verifique console do navegador para erros

---

## 📚 Estrutura de Arquivos Detalhada

### API Requests (`src/api_requests/`)

Cada arquivo contém:
- Interfaces TypeScript para tipos de dados
- Função helper `getApiUrl()` - Obtém URL base
- Função helper `getAuthToken()` - Obtém token do localStorage
- Função helper `authenticatedFetch()` - Faz requisições autenticadas
- Funções exportadas para cada endpoint

### Hooks (`src/hooks/`)

- Lógica de negócio reutilizável
- Gerenciamento de estado
- Integração com API
- Validações

### Components (`src/components/`)

- Componentes de apresentação
- Styled components em arquivos separados (`*Styles.tsx`)
- Lógica mínima (apenas renderização)

### Utils (`src/utils/`)

- Helpers de formatação
- Constantes e dados mockados
- Funções utilitárias

---

## 🔐 Segurança

- Tokens são armazenados no `localStorage` (considerar migrar para httpOnly cookies em produção)
- Todas as requisições incluem validação de token
- Rotas protegidas verificam autenticação antes de renderizar
- Validação de permissões no frontend e backend

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console do navegador
2. Verifique os logs do servidor da API
3. Confirme que todas as variáveis de ambiente estão configuradas
4. Verifique a documentação da API no backend

---

## 📄 Licença

Este projeto é privado e de uso interno.

---

**Desenvolvido para o Hackaton SENAI**

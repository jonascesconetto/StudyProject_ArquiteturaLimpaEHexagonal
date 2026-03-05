# Projeto de Estudo — Ports and Adapters (Arquitetura Hexagonal)

Projeto desenvolvido durante o curso de **Arquitetura Limpa e Hexagonal** da [FormacaoDEV](https://formacao.dev), com foco na aplicação prática do padrão **Ports and Adapters** (Alistair Cockburn, 2005).

O sistema é uma API REST de controle financeiro pessoal que permite registrar usuários, autenticar via JWT e gerenciar transações financeiras com extrato mensal.

---

## O que é Ports and Adapters?

O padrão isola o núcleo da aplicação (regras de negócio) de qualquer tecnologia externa. O core nunca depende diretamente de banco de dados, frameworks ou bibliotecas — ele define **contratos (ports)** que o mundo externo deve implementar via **adaptadores (adapters)**.

```text
[HTTP / Express]                [banco de dados / bcrypt / jwt]
      |                                       |
 Controllers          CORE             Adapters de DB/Auth
(adapters de      (Casos de Uso   <-->  implementam os ports
  entrada)         + Ports)             definidos no core
```

O core só conhece interfaces. Quem decide qual implementação concreta usar é a composição feita em `src/index.ts`.

---

## Estrutura do Projeto

```text
src/
├── core/                        # Nucleo da aplicacao (sem dependencias externas)
│   ├── shared/
│   │   ├── CasoDeUso.ts         # Interface generica para casos de uso
│   │   └── Id.ts                # Gerador de IDs
│   ├── usuario/
│   │   ├── Usuario.ts           # Entidade Usuario
│   │   ├── ColecaoUsuario.ts    # PORT: contrato de persistencia de usuarios
│   │   ├── ProvedorCriptografia.ts  # PORT: contrato de criptografia de senha
│   │   ├── ProvedorToken.ts     # PORT: contrato de geracao/validacao de token
│   │   ├── RegistrarUsuario.ts  # CASO DE USO: registrar novo usuario
│   │   └── LoginUsuario.ts      # CASO DE USO: autenticar usuario
│   └── transacao/
│       ├── Transacao.ts         # Entidade Transacao
│       ├── ColecaoTransacao.ts  # PORT: contrato de persistencia de transacoes
│       ├── SalvarTransacao.ts   # CASO DE USO: criar ou atualizar transacao
│       ├── ExtratoMensal.ts     # CASO DE USO: buscar extrato por mes
│       └── Saldo.ts             # Calculo de saldo
├── adapters/
│   ├── auth/
│   │   ├── BcryptAdapter.ts     # ADAPTER: implementa ProvedorCriptografia com bcrypt
│   │   ├── JwtAdaptar.ts        # ADAPTER: implementa ProvedorToken com jsonwebtoken
│   │   ├── InverterSenha.ts     # ADAPTER alternativo: inverte a string da senha
│   │   └── SenhaComEspaco.ts    # ADAPTER alternativo: adiciona espacos na senha
│   └── db/
│       ├── conexao.ts           # Conexao Knex com PostgreSQL
│       ├── knexfile.js          # Configuracao do Knex
│       ├── ColecaoUsuarioDB.ts  # ADAPTER: implementa ColecaoUsuario com Knex/PG
│       ├── ColecaoTransacaoDB.ts # ADAPTER: implementa ColecaoTransacao com Knex/PG
│       └── migrations/          # Migrations do banco de dados
└── controllers/                 # ADAPTERS de entrada (HTTP via Express)
    ├── RegistrarUsuarioController.ts
    ├── LoginUsuarioController.ts
    ├── SalvarTransacaoController.ts
    ├── ExtratoMensalController.ts
    └── UsuarioMiddleware.ts

test/
├── core/                        # Testes unitarios do core (sem banco de dados)
├── api/                         # Testes de integracao via HTTP
└── fake/
    └── UsuarioEmMemoria.ts      # ADAPTER de teste: substitui o banco por array em memoria
```

### Ports definidos no core

| Port | Arquivo | Contrato |
|------|---------|----------|
| `ColecaoUsuario` | `src/core/usuario/ColecaoUsuario.ts` | `inserir`, `buscarPorEmail` |
| `ColecaoTransacao` | `src/core/transacao/ColecaoTransacao.ts` | `adicionar`, `atualizar`, `buscarPorId`, `buscarPorMes` |
| `ProvedorCriptografia` | `src/core/usuario/ProvedorCriptografia.ts` | `criptografar`, `comparar` |
| `ProvedorToken` | `src/core/usuario/ProvedorToken.ts` | `gerar`, `validar` |

### Adapters e seus ports

| Adapter | Port implementado | Tecnologia |
|---------|-------------------|------------|
| `BcryptAdapter` | `ProvedorCriptografia` | bcrypt |
| `JwtAdapter` | `ProvedorToken` | jsonwebtoken |
| `ColecaoUsuarioDB` | `ColecaoUsuario` | Knex + PostgreSQL |
| `ColecaoTransacaoDB` | `ColecaoTransacao` | Knex + PostgreSQL |
| `InverterSenha` | `ProvedorCriptografia` | alternativo (estudo) |
| `SenhaComEspaco` | `ProvedorCriptografia` | alternativo (estudo) |
| `UsuarioEmMemoria` | `ColecaoUsuario` | em memoria (testes) |

---

## Endpoints da API

| Metodo | Rota | Autenticacao | Descricao |
|--------|------|-------------|-----------|
| `POST` | `/usuario` | Nao | Registrar novo usuario |
| `POST` | `/login` | Nao | Autenticar e obter token JWT |
| `POST` | `/transacao` | Sim | Criar transacao |
| `POST` | `/transacao/:id` | Sim | Atualizar transacao |
| `GET` | `/extrato` | Sim | Obter extrato mensal |

---

## Configuracao de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORTA=3001

# PostgreSQL
DB_USER=admin
DB_PASSWORD=sua_senha_segura
DB_NAME=meu_banco
DB_PORT=5432

# pgAdmin (opcional)
PGADMIN_EMAIL=admin@email.com
PGADMIN_PASSWORD=admin123
PGADMIN_PORT=5050

# JWT
JWT_SECRET=seu_segredo_jwt
```

---

## Como Iniciar o Projeto

### Com Docker (recomendado)

Sobe o PostgreSQL e o pgAdmin via Docker Compose:

```bash
docker-compose up -d
```

Servicos disponiveis apos o comando:

| Servico    | Endereco                |
|------------|-------------------------|
| PostgreSQL | `localhost:5432`        |
| pgAdmin    | `http://localhost:5050` |

> **Dica pgAdmin:** ao registrar um novo servidor, use `postgres` como host (nome do service no Docker), nao `localhost`.

Instale as dependencias e rode as migrations:

```bash
npm install
npm run migrate:up
```

Inicie o servidor em modo desenvolvimento:

```bash
npm run dev
```

### Ambiente Local (sem Docker)

Certifique-se de ter um PostgreSQL rodando localmente e configure o `.env` com os dados de conexao. O `knexfile.js` usa `127.0.0.1` como host por padrao.

Instale as dependencias:

```bash
npm install
```

Execute as migrations:

```bash
npm run migrate:up
```

Inicie o servidor:

```bash
npm run dev
```

---

## Scripts Disponiveis

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Inicia o servidor com hot-reload via ts-node-dev |
| `npm run build` | Compila o TypeScript para JavaScript |
| `npm test` | Executa a suite de testes com Jest |
| `npm run migrate:up` | Aplica todas as migrations pendentes |
| `npm run migrate:down` | Reverte a ultima migration |
| `npm run migrate:make <nome>` | Cria uma nova migration |

---

## Tecnologias

- **TypeScript** — linguagem principal
- **Node.js + Express** — servidor HTTP
- **PostgreSQL** — banco de dados relacional
- **Knex.js** — query builder e migrations
- **bcrypt** — criptografia de senhas
- **jsonwebtoken** — autenticacao via JWT
- **Jest** — testes unitarios e de integracao
- **Docker + Docker Compose** — ambiente de banco de dados

---

## Curso

**FormacaoDEV** — Trilha de Design de Software
Modulo: Arquitetura Limpa e Hexagonal
Autor do curso: Leonardo Moura Leitao

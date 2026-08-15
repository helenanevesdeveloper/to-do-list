# To Do List

Aplicação web de gerenciamento de tarefas.

## Requisitos x estado atual

- [x] `React`
- [x] `Docker e Docker Compose`
- [x] `Django REST Framework`
- [x] `pytest` no backend
- [x] `Categorias`
- [x] `Compartilhamento de tarefas`, com escopo reduzido para permissão `reader`
- [x] `Cadastro e login`
- [x] `Marcar tarefa como concluída/não concluída`
- [x] `Filtragem de tarefas`, com `scope`, `is_completed` e `category_id`
- [x] `Paginação`
- [ ] `Selenium`
- [ ] `CI/CD`

## Stack

- Frontend: React 18, Vite, Chakra UI, Axios
- Backend: Python 3.14, Django 6, Django REST Framework, drf-spectacular
- Banco: PostgreSQL 18
- Testes frontend: Vitest e Playwright
- Testes backend: pytest
- Containerização: Docker e Docker Compose

## Arquitetura

O repositório está organizado em monorepo simples:

```text
.
|-- 📁 apps/
|   |-- 📁 backend/
|   |   |-- 📁 app/
|   |   |   |-- 📁 auth/
|   |   |   |-- 📁 tasks/
|   |   |   `-- 📁 shared/
|   |   |-- 📁 config/
|   |   `-- 🧪 tests/
|   `-- 📁 frontend/
|       |-- 📁 src/
|       |   |-- 🧭 app/
|       |   |-- 🧩 features/
|       |   |   |-- 🔐 auth/
|       |   |   |   |-- 📁 login/
|       |   |   |   |-- 📁 register/
|       |   |   |   |-- 📁 session/
|       |   |   |   `-- 📁 shared/
|       |   |   `-- ✅ tasks/
|       |   |       |-- 📁 categories/
|       |   |       |-- 📁 create/
|       |   |       |-- 📁 dashboard/
|       |   |       |-- 📁 delete/
|       |   |       |-- 📁 list/
|       |   |       |-- 📁 sharing/
|       |   |       |-- 📁 update/
|       |   |       `-- 📁 shared/
|       |   |-- 📄 pages/
|       |   `-- 🛠️ shared/
|       `-- 🎭 e2e/
|-- 📝 docs/
`-- 🐳 docker-compose.yml
```

### Backend

O backend usa Django/DRF na borda HTTP, mas preserva uma separação em camadas:

- `domain`: entidades e regras de negócio
- `application`: casos de uso e DTOs
- `infrastructure`: persistência, JWT, hash de senha e adaptadores técnicos
- `presentation`: serializers, views, autenticação DRF e OpenAPI

#### Clean Architecture

Na prática, isso aparece assim:

- as views DRF recebem HTTP, validam a entrada e delegam para casos de uso
- os casos de uso operam sobre DTOs e contratos
- repositórios e adaptadores concretos ficam fora do núcleo de regras
- `app/container.py` monta as dependências e evita espalhar detalhes de infraestrutura pelas camadas de negócio

Esse desenho não está totalmente purista, mas a intenção arquitetural do repositório é separar regra de negócio de detalhes de framework e persistência.

### Frontend

O frontend segue organização `feature-first`: o código principal fica em `src/features/`, com `auth` e `tasks` como os dois agrupamentos de primeiro nível mais relevantes do produto.

Além da organização por feature, o frontend concentra a experiência autenticada em `/dashboard` e opera a maior parte do fluxo sem troca de rota:

- listagem paginada de tarefas
- criação inline
- edição inline
- criação, edição e exclusão de categorias dentro do fluxo da lista
- compartilhamento de tarefa em modal

## Como subir com Docker

Pré-requisitos:

- Docker
- Docker Compose

Copie os arquivos de exemplo:

```sh
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

Subida dos serviços:

```sh
docker compose up --build
```

Serviços expostos:

- frontend: `http://localhost:3000`
- backend: `http://localhost:8000`
- swagger: `http://localhost:8000/swagger/`
- redoc: `http://localhost:8000/redoc/`
- openapi: `http://localhost:8000/openapi.json`
- healthcheck: `http://localhost:8000/health/`
- postgres: `localhost:5432`

## Testes

Backend:

```sh
cd apps/backend
python -m pytest
```

Frontend unitário:

```sh
cd apps/frontend
npm test
```

Frontend E2E:

```sh
cd apps/frontend
npm run test:e2e
```

Importante:

- os testes E2E atuais usam `Playwright`
- eles validam fluxos de interface com interceptação de rede, não uma suíte full-stack contra o backend real
- o requisito literal de `Selenium` continua pendente

## Fluxo rápido para avaliação

1. Suba o ambiente com `docker compose up --build`.
2. Abra `http://localhost:3000/register` e crie um usuário.
3. Faça login em `http://localhost:3000/login`.
4. No dashboard, crie uma categoria.
5. Crie tarefas, altere status, edite e exclua.
6. Teste filtros de `scope`, `status`, `categoria` e paginação.
7. Consulte a API em `http://localhost:8000/swagger/`.

Para testar compartilhamento, crie um segundo usuário e compartilhe uma tarefa pelo email dele.

## Decisões de design

As decisões mais importantes deste repositório são:

- manter o backend final em Django + DRF
- preservar uma organização por camadas, mesmo dentro do Django
- usar `AppContainer` para evitar espalhar composição de dependências pelo framework
- integrar JWT ao DRF por meio de uma classe de autenticação própria, em vez de parsing manual em cada view
- migrar o schema para `manage.py migrate` como mecanismo oficial de evolução do banco
- concentrar o dashboard em uma única tela com operações inline, reduzindo troca de contexto

## Implementações futuras

| Hoje | Amanhã |
|---|---|
| Compartilhamento aceita apenas permissão `reader`. | Evoluir para permissão `editor` e fluxo de convite/aprovação. |
| Não há filtro textual exposto para tarefas. | Adicionar busca textual em PostgreSQL com abordagem a definir entre `unaccent`, FTS ou collations não determinísticas. |
| Login e logout ainda dependem de sessões persistidas em `auth_sessions`. | Simplificar o fluxo de autenticação, com possibilidade de remover armazenamento de sessão e evoluir para modelo mais stateless. |
| O backend sobe `migrate` e `runserver` no mesmo processo, o que é aceitável apenas em ambiente local. | Separar migração como etapa explícita de deploy e manter o runtime da aplicação desacoplado da evolução de schema. |

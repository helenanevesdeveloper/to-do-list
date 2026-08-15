# To Do List

Aplicação web de gerenciamento de tarefas.

Em **15 de agosto de 2026**, o estado do projeto é:

- frontend em React com dashboard autenticado
- backend em Django REST Framework
- banco PostgreSQL via Docker Compose
- autenticação com JWT
- CRUD de tarefas
- CRUD de categorias
- compartilhamento de tarefas com permissão `reader`
- filtros por escopo, status e categoria
- paginação server-side
- testes de backend com `pytest`
- testes de frontend com `vitest` e fluxos E2E com `Playwright`

Itens ainda não entregues ou entregues apenas parcialmente:

- Selenium no frontend: o projeto usa `Playwright`, não `Selenium`, por falta de tempo para fazer a migração
- CI/CD: não existe pipeline versionado em `.github/workflows`
- deploy em AWS: há planejamento e variáveis de ambiente, mas não há infraestrutura versionada nem automação de deploy

## Requisitos x estado atual

- `React`: concluído
- `Docker e Docker Compose`: concluído
- `Django REST Framework`: concluído
- `pytest` no backend: concluído
- `Categorias`: concluído
- `Compartilhamento de tarefas`: concluído com escopo reduzido para permissão `reader`
- `Cadastro e login`: concluído
- `Marcar tarefa como concluída/não concluída`: concluído
- `Filtragem de tarefas`: com `scope`, `is_completed` e `category_id`
- `Paginação`: concluído
- `Selenium`: pendente
- `CI/CD`: pendente

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
|-- apps/
|   |-- backend/
|   |   |-- app/
|   |   |   |-- auth/
|   |   |   |-- tasks/
|   |   |   `-- shared/
|   |   |-- config/
|   |   `-- tests/
|   `-- frontend/
|       |-- src/
|       `-- e2e/
|-- docs/
`-- docker-compose.yml
```

### Backend

O backend usa Django/DRF na borda HTTP, mas preserva uma separação em camadas:

- `domain`: entidades e regras de negócio
- `application`: casos de uso e DTOs
- `infrastructure`: persistência, JWT, hash de senha e adaptadores técnicos
- `presentation`: serializers, views, autenticação DRF e OpenAPI

Decisões relevantes do estado atual:

- `app/container.py` funciona como composition root da aplicação.
- `auth` usa repositórios próprios com `psycopg` para `users` e `auth_sessions`.
- `tasks` usa models e repositorios baseados no ORM do Django.
- a autenticação HTTP é feita por `JwtAuthentication`, integrada ao DRF.
- o schema da API é exposto por `drf-spectacular` em `/openapi.json`, `/swagger/` e `/redoc/`.
- o container do backend executa `python manage.py migrate --noinput` antes de subir o `runserver`.

#### Clean Architecture

O projeto busca seguir uma leitura de Clean Architecture no backend. Na prática, isso aparece assim:

- as views DRF recebem HTTP, validam a entrada e delegam para casos de uso
- os casos de uso operam sobre DTOs e contratos
- repositórios e adaptadores concretos ficam fora do núcleo de regras
- `app/container.py` monta as dependências e evita espalhar detalhes de infraestrutura pelas camadas de negócio

Esse desenho não está totalmente purista, mas a intenção arquitetural do repositório é separar regra de negócio de detalhes de framework e persistência.

### SOLID, DRY e KISS

Neste repositório:

- `SOLID`: há vários exemplos concretos, principalmente de `SRP`, `ISP` e `DIP`
- `DRY`: há reutilização de componentes e bases comuns para evitar duplicação
- `KISS`: vários fluxos foram mantidos simples para caber no prazo do teste

### Frontend

O frontend concentra a experiência autenticada em `/dashboard` e opera a maior parte do fluxo sem troca de rota:

- listagem paginada de tarefas
- criação inline
- edição inline
- criação, edição e exclusão de categorias dentro do fluxo da lista
- compartilhamento de tarefa em modal

## Funcionalidades implementadas

- cadastro de usuário
- login e logout
- listagem de tarefas do próprio usuário
- listagem de tarefas compartilhadas com usuário autenticado
- listagem combinada `owned`, `shared` e `all`
- criação de tarefas em lote na API e criação unitária no dashboard
- edição parcial de tarefa
- exclusão de tarefas em lote
- marcação de conclusão via update parcial
- criação, listagem, edição e exclusão de categorias
- compartilhamento de tarefa com outro usuário por email
- remoção de compartilhamento
- documentação OpenAPI/Swagger/Redoc
- healthcheck em `/health/`

## Como subir com Docker

### Pre-requisitos

- Docker
- Docker Compose

### Configuração

Copie os arquivos de exemplo:

```sh
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

Os defaults do `docker-compose.yml` já sobem o banco com:

- `POSTGRES_USER=todo_list`
- `POSTGRES_PASSWORD=todo_list`
- `POSTGRES_DB=todo_list`

No `.env` do backend, ajuste ao menos:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_ISSUER`
- `JWT_AUDIENCE`
- `ALLOWED_ORIGINS`

Exemplo para uso local com Docker Compose:

```env
DATABASE_URL=postgresql://todo_list:todo_list@db:5432/todo_list
JWT_SECRET=change-me-to-a-long-random-secret
JWT_ISSUER=http://localhost:8000
JWT_AUDIENCE=dropbox-web-dev
ALLOWED_ORIGINS=http://localhost:3000
```

No frontend, o default local é:

```env
VITE_API_URL=http://localhost:8000
```

### Subida dos serviços

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

Observação:

- o backend aplica migrations automaticamente no startup
- esse fluxo é adequado para desenvolvimento local, mas o próprio projeto documenta que não deve ser o padrão final de produção

## Desenvolvimento local sem Docker

### Backend

```sh
cd apps/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### Frontend

```sh
cd apps/frontend
npm install
cp .env.example .env
npm run dev
```

## Análise estática

### Backend

As bibliotecas de análise estática usadas no backend hoje são:

- `ruff`: lint geral de Python
- `mypy`: checagem estática de tipos
- `django-stubs` e `djangorestframework-stubs`: suporte de tipos para Django e DRF no `mypy`
- `pylint-django`: extensão do `pylint` para entendimento do ecossistema Django
- `perflint`: plugin carregado pelo `pylint` para apontar problemas comuns de performance

Os arquivos de configuração presentes no repositório são:

- `apps/backend/mypy.ini`
- `apps/backend/.pylintrc`

Para criar uma `venv` dedicada e avaliar essas ferramentas localmente:

```sh
cd apps/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
```

Com a `venv` ativa, rode:

```sh
python -m ruff check app config tests manage.py
python -m mypy --config-file mypy.ini app config
python -m pylint --rcfile=.pylintrc app config
```

Observações:

- o `pylint` já carrega `perflint` e `pylint-django` pela configuração em `.pylintrc`
- o `mypy` já usa os plugins de Django e DRF definidos em `mypy.ini`
- atualmente não existe um script pronto no `package.json` ou no backend para encapsular essas verificações

### Frontend

No frontend, a análise estática atual usa ferramentas do ecossistema Node:

- `eslint`
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `typescript` com `tsc --noEmit`

Com as dependencias do frontend instaladas, rode:

```sh
cd apps/frontend
npm run lint
npm run typecheck
```

## Testes

### Backend

```sh
cd apps/backend
python -m pytest
```

### Frontend unitário

```sh
cd apps/frontend
npm test
```

### Frontend E2E

```sh
cd apps/frontend
npm run test:e2e
```

Importante:

- os testes E2E atuais usam `Playwright`
- eles validam fluxos de interface com interceptação de rede, não uma suíte full-stack contra o backend real
- o requisito literal de `Selenium` continua pendente

### Outros comandos úteis do frontend

```sh
npm run build
npm run lint
npm run typecheck
npm run perf:assert
```

## Fluxo rápido para avaliação

1. Suba o ambiente com `docker compose up --build`.
2. Abra `http://localhost:3000/register` e crie um usuário.
3. Faça login em `http://localhost:3000/login`.
4. No dashboard, crie uma categoria.
5. Crie tarefas, altere status, edite e exclua.
6. Teste filtros de `scope`, `status`, `categoria` e paginação.
7. Consulte a API em `http://localhost:8000/swagger/`.

Para testar compartilhamento, crie um segundo usuário e compartilhe uma tarefa pelo email dele.

## Endpoints principais

### Auth

- `GET /api/auth/`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Tasks

- `GET /api/tasks/`
- `POST /api/tasks/`
- `DELETE /api/tasks/`
- `PATCH /api/tasks/<task_id>/`
- `GET /api/tasks/categories/`
- `POST /api/tasks/categories/`
- `PATCH /api/tasks/categories/<category_id>/`
- `DELETE /api/tasks/categories/<category_id>/`
- `GET /api/tasks/<task_id>/shares/`
- `POST /api/tasks/<task_id>/shares/`
- `DELETE /api/tasks/<task_id>/shares/<share_id>/`

Filtros disponíveis em `GET /api/tasks/`:

- `page`
- `page_size`
- `scope=owned|shared|all`
- `is_completed=true|false`
- `category_id=<id>`

## Decisões de design

As decisões mais importantes deste repositório, considerando código e documentação em `docs/`, são:

- manter o backend final em Django + DRF
- preservar uma organização por camadas, mesmo dentro do Django
- usar `AppContainer` para evitar espalhar composição de dependências pelo framework
- integrar JWT ao DRF por meio de uma classe de autenticação própria, em vez de parsing manual em cada view
- migrar o schema para `manage.py migrate` como mecanismo oficial de evolução do banco
- concentrar o dashboard em uma única tela com operações inline, reduzindo troca de contexto

## Limitações conhecidas

- compartilhamento aceita apenas permissao `reader`
- não há filtro textual exposto para tarefas
- login e logout ainda dependem de sessoes persistidas em auth_sessions
- a autenticação dos endpoints protegidos ainda não consulta auth_sessions para validar revogação por request
- CI/CD não foi implementado
- Selenium não foi implementado
- em desenvolvimento local, o `React.StrictMode` pode gerar requests duplicadas perceptíveis em recarregamentos
- subir `migrate` e `runserver` no mesmo processo é aceitável apenas para ambiente local

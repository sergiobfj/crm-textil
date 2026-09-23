SECCO Têxtil API

Backend da aplicação SECCO Têxtil, desenvolvido com FastAPI, Supabase Auth e PostgreSQL.

A aplicação utiliza o Supabase para autenticação, persistência dos dados e controle de acesso por organização.

Tecnologias
Python
FastAPI
Uvicorn
Pydantic Settings
Supabase
PostgreSQL
Supabase Auth
Row Level Security (RLS)
Estrutura
backend/
├── app/
│   ├── api/
│   │   ├── auth.py
│   │   └── health.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   │
│   ├── schemas/
│   │   └── auth.py
│   │
│   ├── services/
│   │   ├── auth.py
│   │   ├── current_user.py
│   │   └── supabase.py
│   │
│   └── main.py
│
├── .env
├── requirements.txt
└── README.md

Banco de dados

A aplicação utiliza uma arquitetura multi-tenant.

A estrutura principal é:

auth.users
    │
    │ id
    ▼
profiles
    │
    │ organization_id
    ▼
organizations
    │
    │ organization_id
    ▼
parties

auth.users

Gerenciado pelo Supabase Auth.

É responsável pela identidade e autenticação do usuário.

profiles

Armazena os dados específicos do usuário na aplicação:

id
organization_id
full_name
role
created_at


profiles.id possui uma referência para auth.users.id.

organizations

Representa uma empresa/loja dentro do sistema:

id
name
document
created_at

parties

Representa entidades relacionadas à organização, como clientes e fornecedores:

id
organization_id
name
trade_name
document
email
phone
whatsapp
pix_key
bank_name
bank_agency
bank_account
notes
created_at

Multi-tenancy

Cada usuário pertence a uma organização através de:

profiles.organization_id


O usuário também possui um papel:

owner
admin
manager
employee


O organization_id e o role não devem ser confiados ao frontend.

Eles devem ser obtidos a partir do usuário autenticado e do registro correspondente em profiles.

Exemplo:

Usuário
  │
  ├── id
  ├── email
  │
  ▼
profiles
  │
  ├── organization_id
  └── role


As tabelas compartilhadas entre organizações devem utilizar Row Level Security (RLS) para impedir que usuários acessem dados pertencentes a outras organizações.

Autenticação

A autenticação é realizada pelo Supabase Auth.

O fluxo esperado é:

Frontend
   │
   │ email + password
   ▼
FastAPI
   │
   ▼
Supabase Auth
   │
   ▼
auth.users
   │
   ▼
access_token (JWT)


Nas requisições autenticadas, o token deve ser enviado como:

Authorization: Bearer <access_token>


O backend valida o token e identifica o usuário.

Depois consulta:

auth.users.id
       ↓
profiles.id
       ↓
organization_id + role

Endpoints de autenticação
Registrar usuário
POST /auth/register


Exemplo:

{
  "email": "dono@empresa.com",
  "password": "UmaSenhaForte123!",
  "full_name": "João Silva",
  "organization_name": "Confecções Silva"
}


O primeiro usuário criado para uma nova organização recebe:

role = owner

Login
POST /auth/login


Exemplo:

{
  "email": "dono@empresa.com",
  "password": "UmaSenhaForte123!"
}


O login retorna um access_token e um refresh_token.

Usuário autenticado
GET /auth/me


Requer:

Authorization: Bearer <access_token>


Retorna informações do usuário, organização e papel.

Variáveis de ambiente

Crie um arquivo .env dentro de backend/.

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

Segurança

O arquivo .env não deve ser versionado.

Adicione ao .gitignore:

.env
.venv/
venv/
__pycache__/
*.pyc


Nunca exponha a SUPABASE_SERVICE_ROLE_KEY no frontend, no Git ou em respostas de API.

A service role é uma credencial privilegiada e deve permanecer exclusivamente no backend.

Instalação

Crie e ative um ambiente virtual:

Windows
python -m venv venv
venv\Scripts\activate


Instale as dependências:

pip install -r requirements.txt


Caso ainda não exista requirements.txt, instale inicialmente:

pip install fastapi uvicorn supabase pydantic-settings email-validator

Executar a API

Dentro da pasta backend:

uvicorn app.main:app --reload


A API estará disponível em:

http://127.0.0.1:8000


Documentação Swagger:

http://127.0.0.1:8000/docs


OpenAPI:

http://127.0.0.1:8000/openapi.json

Health Check

Endpoint:

GET /health/database


Exemplo:

curl http://localhost:8000/health/database


Retorno esperado:

{
  "status": "ok",
  "database": "connected"
}

Desenvolvimento

As rotas disponíveis podem ser verificadas no terminal ao iniciar a aplicação.

O main.py imprime as rotas registradas durante o desenvolvimento.

Banco e RLS

A aplicação utiliza PostgreSQL através do Supabase.

As tabelas que contêm dados específicos de uma organização devem possuir RLS habilitado e políticas que utilizem a organização do usuário autenticado.

Exemplo conceitual:

auth.uid()
    ↓
profiles.id
    ↓
profiles.organization_id
    ↓
dados da organização


O objetivo é garantir que um usuário de uma organização não consiga ler, alterar ou excluir dados pertencentes a outra organização.

Próximas etapas
 Registro de usuários
 Validação do JWT
 Controle de organização
 RLS para organizations
 Convite de funcionários
 Controle de permissões por role
 CRUD de clientes
 CRUD de fornecedores
 Demais endpoints do CRM
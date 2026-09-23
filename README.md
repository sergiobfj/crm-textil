# 🧵 SECCO Têxtil API

 > Backend do **SECCO Têxtil**, um CRM para gestão de lojas e empresas do setor têxtil.

 Construído com **FastAPI + Supabase + PostgreSQL**, com autenticação e arquitetura **multi-tenant**, permitindo que diferentes empresas utilizem a mesma aplicação mantendo seus dados isolados.

---

 ## 🚀 Stack

 | Tecnologia | Uso |
| --- | --- |
| 🐍 Python | Linguagem |
| ⚡ FastAPI | API REST |
| 🚀 Uvicorn | Servidor |
| 🔐 Supabase Auth | Autenticação |
| 🐘 PostgreSQL | Banco de dados |
| 🛡️ RLS | Isolamento entre organizações |
| 📦 Pydantic | Validação e configurações |

---

 ## 📁 Estrutura

```
backend/
├── app/
│   ├── api/          # Rotas da API
│   ├── core/         # Configurações e segurança
│   ├── schemas/      # Schemas Pydantic
│   ├── services/     # Regras e integrações
│   └── main.py       # Inicialização da API
│
├── .env              # Variáveis locais
├── .gitignore
├── requirements.txt
└── README.md
```

---

 ## ⚙️ Configuração

 ### 1\. Criar ambiente virtual

 **Windows / PowerShell:**

```
python -m venv venv
venv\Scripts\activate
```

 ### 2\. Instalar dependências

```
pip install -r requirements.txt
```

 ### 3\. Configurar `.env`

 Crie o arquivo `.env` dentro de `backend/`:

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

 > 🔒 **Nunca** envie a `SUPABASE_SERVICE_ROLE_KEY` para o frontend ou versionamento.

---

 ## ▶️ Executar

 Dentro da pasta `backend/`:

```
uvicorn app.main:app --reload
```

 API:

```
http://127.0.0.1:8000
```

 Swagger:

```
http://127.0.0.1:8000/docs
```

 OpenAPI:

```
http://127.0.0.1:8000/openapi.json
```

---

 ## 🔐 Autenticação

 A autenticação utiliza o **Supabase Auth**.

 O fluxo principal é:

```
Usuário
   │
   ▼
Supabase Auth
   │
   ▼
auth.users
   │
   ▼
profiles
   │
   └── organization_id
          │
          ▼
     organizations
```

 O primeiro usuário de uma organização é criado como:

```
owner
```

 Funcionários e outros usuários serão adicionados posteriormente através de um fluxo de convite.

---

 ## 🏢 Multi-tenant

 Cada usuário pertence a uma organização:

```
profiles.organization_id
        │
        ▼
organizations.id
```

 Os dados de uma organização não devem ser acessíveis por usuários de outra organização.

 Essa proteção será feita em duas camadas:

```
        JWT
         │
         ▼
    FastAPI
         │
         ▼
 organization_id
         │
         ▼
 PostgreSQL + RLS
```

 O `organization_id` **não deve ser confiado ao frontend**.

---

 ## 🗄️ Banco de dados

 Principais tabelas:

```
organizations
     │
     ├── profiles
     │
     └── parties

auth.users
     │
     └── profiles
```

 ### `organizations`

 Empresas/lojas cadastradas no sistema.

 ### `profiles`

 Dados dos usuários da aplicação.

```
id
organization_id
full_name
role
created_at
```

 ### `parties`

 Clientes, fornecedores e demais partes relacionadas à organização.

---

 ## ❤️ Health Check

 Verificar conexão com o banco:

```
GET /health/database
```

 Ou:

```
curl http://localhost:8000/health/database
```

 Resposta esperada:

```
{
  "status": "ok",
  "database": "connected"
}
```

---

 ## 🛠️ Status

 ### Autenticação

 - [x] Supabase Auth
- [x] `auth.users → profiles`
- [x] Cadastro do proprietário
- [x] Login
- [ ] Validação do usuário autenticado
- [ ] Multi-tenancy
- [ ] RLS
- [ ] Convite de funcionários
- [ ] Controle de permissões

 ### CRM

 - [ ] Clientes
- [ ] Fornecedores
- [ ] Produtos
- [ ] Pedidos
- [ ] Financeiro
- [ ] Relatórios

---

 ## 🔒 Segurança

 - `.env` não deve ser versionado.
- `SUPABASE_SERVICE_ROLE_KEY` deve permanecer somente no backend.
- O frontend não define `organization_id` do usuário.
- O frontend não define privilégios administrativos.
- Dados entre organizações devem ser protegidos por RLS.

---

 ## 📌 Desenvolvimento

 Projeto em desenvolvimento.

 A arquitetura prioriza:

 **segurança → multi-tenancy → autenticação → regras de negócio → endpoints do CRM.**

---

 \<p align="center"\> 🧵 \<strong\>SECCO Têxtil\</strong\>\<br\> \<sub\>CRM para gestão do setor têxtil\</sub\> \</p\>

 Esse formato fica bem mais adequado como **README principal do repositório**: visual, curto e suficiente para alguém clonar o projeto e entender rapidamente o que ele é e como executar.

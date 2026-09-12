## Variáveis de ambiente

O backend utiliza as seguintes variáveis de ambiente:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

## Testar

Depois de configurar as variáveis reais **somente no `.env`**, suba a API.

Primeiro teste:

```bash
curl http://localhost:8000/health/database

Retorno esperado:
{
  "status": "ok",
  "database": "connected"
}

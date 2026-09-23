from app.services.supabase import supabase, supabase_auth

def register_user(
    email: str,
    password: str,
    full_name: str,
    organization_name: str,
):
    # 1. Criar a organização
    organization_response = (
        supabase
        .table("organizations")
        .insert({
            "name": organization_name,
        })
        .execute()
    )

    if not organization_response.data:
        raise Exception("Não foi possível criar a organização.")

    organization = organization_response.data[0]

    try:
        # 2. Criar usuário no Supabase Auth
        auth_response = supabase_auth.auth.sign_up({
            "email": email,
            "password": password,
        })

        if not auth_response.user:
            raise Exception("Não foi possível criar o usuário.")

        user = auth_response.user

        # 3. Criar profile
        profile_response = (
            supabase
            .table("profiles")
            .insert({
                "id": user.id,
                "organization_id": organization["id"],
                "full_name": full_name,
                "role": "owner",
            })
            .execute()
        )

        if not profile_response.data:
            raise Exception("Não foi possível criar o profile.")

        return {
            "user": user,
            "organization": organization,
            "profile": profile_response.data[0],
            "session": auth_response.session,
        }

    except Exception:
        # Se alguma etapa depois da organização falhar,
        # removemos a organização criada.
        supabase \
            .table("organizations") \
            .delete() \
            .eq("id", organization["id"]) \
            .execute()

        raise


def login_user(email: str, password: str):
    response = supabase_auth.auth.sign_in_with_password({
        "email": email,
        "password": password,
    })

    if not response.user or not response.session:
        raise Exception("Email ou senha inválidos.")

    return response

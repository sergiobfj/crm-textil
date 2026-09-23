from fastapi import HTTPException, status

from app.services.supabase import supabase


def get_user_profile(user_id: str):
    response = (
        supabase
        .table("profiles")
        .select(
            "id, organization_id, full_name, role, "
            "organizations(id, name)"
        )
        .eq("id", user_id)
        .single()
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Perfil do usuário não encontrado.",
        )

    return response.data

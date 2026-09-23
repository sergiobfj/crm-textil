from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.services.supabase import supabase
from app.services.current_user import get_user_profile

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    try:
        response = supabase.auth.get_user(token)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado.",
        ) from exc

    if not response.user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não autenticado.",
        )

    profile = get_user_profile(response.user.id)

    return {
        "id": response.user.id,
        "email": response.user.email,
        "organization_id": profile["organization_id"],
        "full_name": profile["full_name"],
        "role": profile["role"],
        "organization": profile["organizations"],
    }

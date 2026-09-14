from fastapi import APIRouter, Depends, HTTPException

from app.core.security import get_current_user
from app.schemas.auth import LoginRequest, RegisterRequest
from app.services.auth import login_user, register_user


router = APIRouter()


@router.post("/register")
def register(data: RegisterRequest):
    try:
        result = register_user(
            email=data.email,
            password=data.password,
            full_name=data.full_name,
            organization_name=data.organization_name,
        )

        session = result["session"]

        return {
            "message": "Usuário criado com sucesso.",
            "user": {
                "id": result["user"].id,
                "email": result["user"].email,
            },
            "organization": result["organization"],
            "profile": result["profile"],
            "session": {
                "access_token": session.access_token if session else None,
                "refresh_token": session.refresh_token if session else None,
            },
        }

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc


@router.post("/login")
def login(data: LoginRequest):
    try:
        response = login_user(
            email=data.email,
            password=data.password,
        )

        return {
            "message": "Login realizado com sucesso.",
            "user": {
                "id": response.user.id,
                "email": response.user.email,
            },
            "session": {
                "access_token": response.session.access_token,
                "refresh_token": response.session.refresh_token,
            },
        }

    except Exception as exc:
        raise HTTPException(
            status_code=401,
            detail=str(exc),
        ) from exc

@router.get("/me")
def me(current_user=Depends(get_current_user)):
    return current_user
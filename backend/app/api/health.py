from fastapi import APIRouter, HTTPException

from app.services.supabase import supabase

router = APIRouter()

@router.get("/health/database")
def database_health():
    try:
        result = (
            supabase
            .table("parties")
            .select("id")
            .limit(1)
            .execute()
        )

        return {
            "status": "ok",
            "database": "connected",
            "data": result.data,
        }

    except Exception as exc:
        print("====================================")
        print("ERRO SUPABASE:")
        print(type(exc).__name__)
        print(str(exc))
        print("====================================")

        raise HTTPException(
            status_code=503,
            detail=str(exc),
        ) from exc

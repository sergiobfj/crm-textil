from fastapi import APIRouter, HTTPException

from app.services.supabase import supabase

router = APIRouter()

@router.get("/health/database")
def database_health():
    try:
        supabase.table("customers").select("id").limit(1).execute()

        return {
            "status": "ok",
            "database": "connected",
        }
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable",
        ) from exc

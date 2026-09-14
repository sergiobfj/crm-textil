from fastapi import FastAPI
from app.api.health import router as health_router
from app.api.auth import router as auth_router

app = FastAPI(
    title="SECCO Têxtil API",
    version="1.0.0",
)

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Auth"],
)

app.include_router(
    health_router,
    tags=["Health"],
)

'''@app.get("/health")
def health():
    return {"status": "ok"}
'''

# DEBUG: listar todas as rotas registradas
print("\n===== ROTAS REGISTRADAS =====")
for route in app.routes:
    try:
        print(route.path)
    except:
        pass
print("=============================\n")
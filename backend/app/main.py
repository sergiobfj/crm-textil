from fastapi import FastAPI
from app.api.health import router as health_router

app = FastAPI(
    title="SECCO Têxtil API",
    version="1.0.0",
)

app.include_router(health_router)

@app.get("/health")
def health():
    return {"status": "ok"}


# DEBUG: listar todas as rotas registradas
print("\n===== ROTAS REGISTRADAS =====")
for route in app.routes:
    try:
        print(route.path)
    except:
        pass
print("=============================\n")
from fastapi import FastAPI
from fastapi.responses import JSONResponse

from app.api.chat import router as chat_router
from app.api.health import router as health_router
from app.api.prediction import router as prediction_router
from app.core.config import settings

app = FastAPI(title=settings.app_title)
app.include_router(health_router)
app.include_router(prediction_router)
app.include_router(chat_router)


@app.exception_handler(Exception)
async def unhandled_exception_handler(_request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=200,
        content={
            "answer": f"FastAPI aktif, tetapi terjadi error internal saat memproses request: {exc}",
            "provider": "fastapi-error",
        },
    )


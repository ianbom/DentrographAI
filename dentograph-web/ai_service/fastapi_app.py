import os
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="Dentalyze LLM Service")


class ChatRequest(BaseModel):
    role: str
    question: str
    context: dict[str, Any]


def _context_to_text(context: dict[str, Any]) -> str:
    max_chars = int(os.getenv("AI_LLM_CONTEXT_MAX_CHARS", "12000"))
    lines: list[str] = []
    viewer = context.get("viewer", {})
    lines.append(f"Role pengguna: {viewer.get('role', '-')}")
    lines.append(f"Nama pengguna: {viewer.get('name', '-')}")
    lines.append(f"Aturan akses: {context.get('scope_rule', '-')}")

    for radiograph in context.get("radiographs", []):
        lines.append(
            "Radiograf {id} pasien {patient} status {status}, dokter {doctor}, "
            "radiografer {radiographer}.".format(
                id=radiograph.get("id", "-"),
                patient=radiograph.get("patient_name")
                or radiograph.get("patient_nik", "-"),
                status=radiograph.get("status", "-"),
                doctor=radiograph.get("doctor") or "-",
                radiographer=radiograph.get("radiographer") or "-",
            )
        )
        for detection in radiograph.get("detections", []):
            lines.append(
                "- Gigi {fdi}: {abnormality}. Catatan: {analysis}".format(
                    fdi=detection.get("fdi", "-"),
                    abnormality=detection.get("abnormality", "-"),
                    analysis=detection.get("analysis") or "-",
                )
            )

    for snippet in context.get("knowledge", []):
        lines.append(f"Jurnal/pengetahuan: {snippet.get('content', '')}")

    text = "\n".join(lines)

    if len(text) <= max_chars:
        return text

    return text[:max_chars] + "\n\n[Konteks dipangkas agar tidak melebihi kuota token.]"


def _fallback_answer(payload: ChatRequest) -> str:
    radiographs = payload.context.get("radiographs", [])
    total = sum(len(item.get("detections", [])) for item in radiographs)
    return (
        "Gemini belum aktif di FastAPI. Saya sudah menerima konteks role "
        f"{payload.role} dengan {len(radiographs)} radiograf dan {total} "
        "baris deteksi. Isi GEMINI_API_KEY agar jawaban LLM aktif."
    )


def _model_candidates() -> list[str]:
    configured_model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash").strip()
    aliases = {
        "gemini-3.5-flash": "gemini-2.0-flash",
        "gemini-3-flash": "gemini-2.0-flash",
        "gemini-1.5-flash": "gemini-2.0-flash",
    }
    configured_model = aliases.get(configured_model, configured_model)

    candidates = [
        configured_model,
        "gemini-2.0-flash-lite",
        "gemini-2.5-flash-lite",
        "gemini-2.0-flash",
        "gemini-2.5-flash",
    ]

    unique_candidates: list[str] = []
    for model_name in candidates:
        if model_name and model_name not in unique_candidates:
            unique_candidates.append(model_name)

    return unique_candidates


def _is_retryable_model_error(exc: Exception) -> bool:
    message = str(exc).lower()

    return any(
        text in message
        for text in [
            "not_found",
            "not found",
            "404",
            "unsupported",
            "is not supported",
            "resource_exhausted",
            "quota",
            "429",
        ]
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "dentalyze-llm"}


@app.post("/chat")
async def chat(payload: ChatRequest) -> dict[str, str]:
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        return {"answer": _fallback_answer(payload), "provider": "fastapi-fallback"}

    try:
        from langchain_core.messages import HumanMessage, SystemMessage
        from langchain_google_genai import ChatGoogleGenerativeAI

        system = (
            "Anda adalah asisten Dentalyze AI untuk analisis radiografi gigi. "
            "Jawab dalam bahasa Indonesia yang ringkas, empatik, dan klinis. "
            "Gunakan hanya konteks yang diberikan. Jangan mengarang diagnosis. "
            "Jika data tidak cukup, katakan bahwa pemeriksaan dokter tetap "
            "dibutuhkan. Hormati aturan akses role."
        )
        context_text = _context_to_text(payload.context)

        errors: list[str] = []
        for model_name in _model_candidates():
            try:
                llm = ChatGoogleGenerativeAI(
                    model=model_name,
                    google_api_key=api_key,
                    temperature=0.2,
                )
                response = await llm.ainvoke(
                    [
                        SystemMessage(content=system),
                        HumanMessage(
                            content=(
                                f"Pertanyaan pengguna:\n{payload.question}\n\n"
                                f"Konteks database dan jurnal:\n{context_text}"
                            )
                        ),
                    ]
                )

                return {
                    "answer": str(response.content),
                    "provider": f"gemini:{model_name}",
                }
            except Exception as model_exc:
                errors.append(f"{model_name}: {model_exc}")

                if not _is_retryable_model_error(model_exc):
                    break

        return {
            "answer": (
                "FastAPI aktif dan GEMINI_API_KEY terbaca, tetapi semua model "
                "Gemini yang dicoba gagal. Detail: " + " | ".join(errors)
            ),
            "provider": "fastapi-error",
        }
    except Exception as exc:
        return {
            "answer": (
                "FastAPI menerima request, tetapi Gemini/LangChain gagal "
                f"dijalankan: {exc}"
            ),
            "provider": "fastapi-error",
        }


@app.exception_handler(Exception)
async def unhandled_exception_handler(_request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=200,
        content={
            "answer": (
                "FastAPI aktif, tetapi terjadi error internal saat memproses "
                f"chat: {exc}"
            ),
            "provider": "fastapi-error",
        },
    )

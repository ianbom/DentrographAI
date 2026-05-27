from typing import Any

from app.core.config import settings
from app.schemas.chat import ChatRequest
from app.services.knowledge_retrieval import knowledge_retrieval_service


class LlmChatService:
    async def chat(self, payload: ChatRequest) -> dict[str, str]:
        context = await self._context_with_rag(payload)

        if settings.llm_provider.strip().lower() == "ollama":
            return await self._chat_with_ollama(payload, context)

        if not settings.gemini_api_key:
            return {"answer": self._fallback_answer(payload, context), "provider": "fastapi-fallback"}

        try:
            from langchain_core.messages import HumanMessage, SystemMessage
            from langchain_google_genai import ChatGoogleGenerativeAI

            context_text = self._context_to_text(context)
            errors: list[str] = []

            for model_name in self._model_candidates():
                try:
                    llm = ChatGoogleGenerativeAI(model=model_name, google_api_key=settings.gemini_api_key, temperature=0.2)
                    response = await llm.ainvoke(
                        [
                            SystemMessage(content=self._system_prompt()),
                            HumanMessage(
                                content=f"Pertanyaan pengguna:\n{payload.question}\n\nKonteks database dan knowledge RAG:\n{context_text}"
                            ),
                        ]
                    )
                    return {"answer": str(response.content), "provider": f"gemini:{model_name}"}
                except Exception as model_exc:
                    errors.append(f"{model_name}: {model_exc}")

                    if not self._is_retryable_model_error(model_exc):
                        break

            return {
                "answer": "FastAPI aktif dan GEMINI_API_KEY terbaca, tetapi semua model Gemini yang dicoba gagal. Detail: "
                + " | ".join(errors),
                "provider": "fastapi-error",
            }
        except Exception as exc:
            return {
                "answer": f"FastAPI menerima request, tetapi Gemini/LangChain gagal dijalankan: {exc}",
                "provider": "fastapi-error",
            }

    async def _context_with_rag(self, payload: ChatRequest) -> dict[str, Any]:
        context = dict(payload.context)
        knowledge = list(context.get("knowledge", []))

        try:
            retrieved = await knowledge_retrieval_service.retrieve(payload.question)
            knowledge.extend(
                {
                    "title": item["title"],
                    "condition_name": item["condition_name"],
                    "content": item["content"],
                    "relevance_score": item["relevance_score"],
                    "source": "ai_knowledge_bases",
                }
                for item in retrieved
            )
        except Exception as exc:
            knowledge.append(
                {
                    "content": f"RAG ai_knowledge_bases gagal dijalankan: {exc}",
                    "source": "rag-error",
                }
            )

        context["knowledge"] = knowledge

        return context

    def _context_to_text(self, context: dict[str, Any]) -> str:
        lines: list[str] = []
        viewer = context.get("viewer", {})
        lines.append(f"Role pengguna: {viewer.get('role', '-')}")
        lines.append(f"Nama pengguna: {viewer.get('name', '-')}")
        lines.append(f"Aturan akses: {context.get('scope_rule', '-')}")

        for radiograph in context.get("radiographs", []):
            lines.append(
                "Radiograf {id} pasien {patient} status {status}, dokter {doctor}, radiografer {radiographer}.".format(
                    id=radiograph.get("id", "-"),
                    patient=radiograph.get("patient_name") or radiograph.get("patient_nik", "-"),
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
            label = snippet.get("title") or snippet.get("source") or "Knowledge"
            score = snippet.get("relevance_score")
            suffix = f" (relevance {score:.4f})" if isinstance(score, float) else ""
            lines.append(f"{label}{suffix}: {snippet.get('content', '')}")

        text = "\n".join(lines)

        if len(text) <= settings.llm_context_max_chars:
            return text

        return text[: settings.llm_context_max_chars] + "\n\n[Konteks dipangkas agar tidak melebihi kuota token.]"

    def _fallback_answer(self, payload: ChatRequest, context: dict[str, Any]) -> str:
        radiographs = context.get("radiographs", [])
        total = sum(len(item.get("detections", [])) for item in radiographs)
        knowledge_count = len(context.get("knowledge", []))

        return (
            "Gemini belum aktif di FastAPI. Saya sudah menerima konteks role "
            f"{payload.role} dengan {len(radiographs)} radiograf dan {total} "
            f"baris deteksi serta {knowledge_count} knowledge hasil RAG. "
            "Isi GEMINI_API_KEY agar jawaban LLM aktif."
        )

    def _model_candidates(self) -> list[str]:
        aliases = {
            "gemini-3.5-flash": "gemini-2.0-flash",
            "gemini-3-flash": "gemini-2.0-flash",
            "gemini-1.5-flash": "gemini-2.0-flash",
        }
        configured_model = aliases.get(settings.gemini_model.strip(), settings.gemini_model.strip())
        candidates = [
            configured_model,
            "gemini-2.0-flash-lite",
            "gemini-2.5-flash-lite",
            "gemini-2.0-flash",
            "gemini-2.5-flash",
        ]

        return list(dict.fromkeys(model_name for model_name in candidates if model_name))

    def _is_retryable_model_error(self, exc: Exception) -> bool:
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

    async def _chat_with_ollama(self, payload: ChatRequest, context: dict[str, Any]) -> dict[str, str]:
        try:
            from langchain_core.messages import HumanMessage, SystemMessage
            from langchain_ollama import ChatOllama

            llm = ChatOllama(
                model=settings.ollama_chat_model,
                base_url=settings.ollama_base_url,
                temperature=0.2,
            )
            response = await llm.ainvoke(
                [
                    SystemMessage(content=self._system_prompt()),
                    HumanMessage(
                        content=(
                            f"Pertanyaan pengguna:\n{payload.question}\n\n"
                            f"Konteks database dan knowledge RAG:\n{self._context_to_text(context)}"
                        )
                    ),
                ]
            )

            return {"answer": str(response.content), "provider": f"ollama:{settings.ollama_chat_model}"}
        except Exception as exc:
            return {
                "answer": f"FastAPI menerima request, tetapi Ollama/LangChain gagal dijalankan: {exc}",
                "provider": "fastapi-error",
            }

    def _system_prompt(self) -> str:
        return (
            "Anda adalah asisten Dentalyze AI untuk analisis radiografi gigi. "
            "Jawab dalam bahasa Indonesia yang ringkas, empatik, dan klinis. "
            "Gunakan hanya konteks yang diberikan. Jangan mengarang diagnosis. "
            "Jika data tidak cukup, katakan bahwa pemeriksaan dokter tetap dibutuhkan. "
            "Hormati aturan akses role."
        )


llm_chat_service = LlmChatService()

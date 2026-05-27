import asyncio

from app.schemas.chat import ChatRequest
from app.services import llm_chat


def test_llm_chat_adds_rag_knowledge_to_context(monkeypatch):
    async def fake_retrieve(_question):
        return [
            {
                "title": "Penjelasan Impaksi",
                "condition_name": "Impaksi",
                "content": "Impaksi adalah kondisi gigi tidak tumbuh normal.",
                "relevance_score": 0.91,
            }
        ]

    request = ChatRequest(role="pasien", question="Apa itu impaksi?", context={"radiographs": []})

    monkeypatch.setattr(llm_chat.knowledge_retrieval_service, "retrieve", fake_retrieve)
    context = asyncio.run(llm_chat.llm_chat_service._context_with_rag(request))

    assert len(context["knowledge"]) == 1
    assert context["knowledge"][0]["source"] == "ai_knowledge_bases"
    assert context["knowledge"][0]["content"] == "Impaksi adalah kondisi gigi tidak tumbuh normal."

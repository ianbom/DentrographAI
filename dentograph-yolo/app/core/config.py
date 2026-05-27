import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parents[2]


@dataclass(frozen=True)
class Settings:
    app_title: str = "Dentograph AI Service"
    service_name: str = "dentograph-ai"
    yolo_model_path: Path = Path(os.getenv("YOLO_MODEL_PATH") or BASE_DIR / "best22.pt")
    vit_model_path: Path = Path(os.getenv("VIT_MODEL_PATH") or BASE_DIR / "best_kelainangigi.pth")
    confidence_yolo: float = float(os.getenv("CONF_YOLO", "0.25"))
    nms_iou_threshold: float = float(os.getenv("NMS_IOU_THRESHOLD", "0.3"))
    llm_context_max_chars: int = int(os.getenv("AI_LLM_CONTEXT_MAX_CHARS", "12000"))
    llm_provider: str = os.getenv("AI_LLM_PROVIDER", "gemini")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    ollama_base_url: str = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11435")
    ollama_chat_model: str = os.getenv("OLLAMA_CHAT_MODEL", "llama3.1:8b-instruct-q8_0")
    embedding_model: str = os.getenv("EMBEDDING_MODEL", "bge-m3:567m")
    embedding_dimensions: int = int(os.getenv("EMBEDDING_DIMENSIONS", "1024"))
    db_host: str = os.getenv("DB_HOST", "127.0.0.1")
    db_port: int = int(os.getenv("DB_PORT", "3306"))
    db_database: str = os.getenv("DB_DATABASE", "dentograph-ai")
    db_username: str = os.getenv("DB_USERNAME", "root")
    db_password: str = os.getenv("DB_PASSWORD", "")
    rag_top_k: int = int(os.getenv("AI_RAG_TOP_K", "4"))


settings = Settings()
try:
    import torch

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
except Exception:
    device = "cpu"

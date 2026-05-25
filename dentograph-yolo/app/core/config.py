import os
from dataclasses import dataclass
from pathlib import Path

import torch
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
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")


settings = Settings()
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


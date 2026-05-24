from typing import Any

from fastapi import APIRouter

from app.schemas.prediction import PredictRequest
from app.services.image_detection import image_detection_service

router = APIRouter()


@router.post("/predict")
def predict(payload: PredictRequest) -> dict[str, Any]:
    return image_detection_service.predict(payload)


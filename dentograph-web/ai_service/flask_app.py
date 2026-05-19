import os
from pathlib import Path

import cv2
import numpy as np
import torch
import torchvision.transforms as transforms
from flask import Flask, jsonify, request
from PIL import Image
from transformers import ViTConfig, ViTForImageClassification
from ultralytics import YOLO

app = Flask(__name__)

YOLO_MODEL_PATH = os.getenv(
    "YOLO_MODEL_PATH",
    r"D:\LARAGON\laragon\www\DentrographAI\dentograph-yolo\best22.pt",
)
VIT_MODEL_PATH = os.getenv(
    "VIT_MODEL_PATH",
    r"D:\LARAGON\laragon\www\DentrographAI\dentograph-yolo\best_kelainangigi.pth",
)
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
CONF_YOLO = float(os.getenv("CONF_YOLO", "0.25"))
NMS_IOU_THRESHOLD = float(os.getenv("NMS_IOU_THRESHOLD", "0.3"))

FDI_LABELS = {
    0: "11",
    1: "12",
    2: "13",
    3: "14",
    4: "15",
    5: "16",
    6: "17",
    7: "18",
    8: "21",
    9: "22",
    10: "23",
    11: "24",
    12: "25",
    13: "26",
    14: "27",
    15: "28",
    16: "31",
    17: "32",
    18: "33",
    19: "34",
    20: "35",
    21: "36",
    22: "37",
    23: "38",
    24: "41",
    25: "42",
    26: "43",
    27: "44",
    28: "45",
    29: "46",
    30: "47",
    31: "48",
}
KELAINAN_LABELS = ["Impaksi", "Karies", "LesiPeriapikal", "Normal", "Resorpsi"]
COND_COLORS_BGR = {
    "LesiPeriapikal": (170, 0, 255),
    "Karies": (0, 23, 255),
    "Impaksi": (0, 109, 255),
    "Resorpsi": (205, 188, 0),
    "Normal": (60, 200, 60),
}
FONT = cv2.FONT_HERSHEY_SIMPLEX
FONT_BOLD = cv2.FONT_HERSHEY_DUPLEX

VIT_TRANSFORM = transforms.Compose(
    [
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]),
    ]
)

yolo_model = None
vit_model = None


def load_models():
    global yolo_model, vit_model

    if yolo_model is None:
        yolo_model = YOLO(YOLO_MODEL_PATH)
        yolo_model.overrides["conf"] = CONF_YOLO
        yolo_model.overrides["iou"] = NMS_IOU_THRESHOLD

    if vit_model is None:
        config = ViTConfig.from_pretrained("google/vit-large-patch16-224")
        config.num_labels = len(KELAINAN_LABELS)
        model = ViTForImageClassification(config)
        checkpoint = torch.load(VIT_MODEL_PATH, map_location=DEVICE)
        state_dict = checkpoint.get("model_state_dict", checkpoint)
        state_dict = {key.replace("module.", ""): value for key, value in state_dict.items()}
        model.load_state_dict(state_dict)
        model.to(DEVICE)
        model.eval()
        vit_model = model


def clean_double_detections(detections):
    if not detections:
        return []

    detections = sorted(detections, key=lambda item: item["conf"], reverse=True)
    keep = []

    while detections:
        best = detections.pop(0)
        keep.append(best)
        remaining = []

        for item in detections:
            b1, b2 = best["bbox"], item["bbox"]
            x_a = max(b1[0], b2[0])
            y_a = max(b1[1], b2[1])
            x_b = min(b1[2], b2[2])
            y_b = min(b1[3], b2[3])
            inter = max(0, x_b - x_a) * max(0, y_b - y_a)
            area1 = (b1[2] - b1[0]) * (b1[3] - b1[1])
            area2 = (b2[2] - b2[0]) * (b2[3] - b2[1])
            iou = inter / float(area1 + area2 - inter + 1e-6)

            if iou < NMS_IOU_THRESHOLD:
                remaining.append(item)

        detections = remaining

    return keep


def run_yolo_inference(image_bgr):
    img_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    results = yolo_model(img_rgb, verbose=False)[0]
    raw_list = []

    for box in results.boxes:
        x1, y1, x2, y2 = [int(value) for value in box.xyxy[0].tolist()]
        cls_id = int(box.cls[0].item())
        conf = float(box.conf[0].item())
        raw_list.append(
            {
                "bbox": [x1, y1, x2, y2],
                "cls": cls_id,
                "conf": conf,
                "cx": (x1 + x2) / 2,
                "cy": (y1 + y2) / 2,
            }
        )

    cleaned = clean_double_detections(raw_list)
    if cleaned:
        median_y = np.median([item["cy"] for item in cleaned])
        upper = sorted([item for item in cleaned if item["cy"] < median_y], key=lambda item: item["cx"])
        lower = sorted([item for item in cleaned if item["cy"] >= median_y], key=lambda item: item["cx"])
        cleaned = upper + lower

    return [
        {
            **item,
            "tooth_number": FDI_LABELS.get(item["cls"], str(item["cls"])),
        }
        for item in cleaned
    ]


def classify_tooth(img_pil, bbox):
    crop = img_pil.crop(tuple(bbox))
    tensor = VIT_TRANSFORM(crop).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        logits = vit_model(tensor).logits
        probs = torch.softmax(logits, dim=1)[0]
        index = torch.argmax(probs).item()

    return KELAINAN_LABELS[index], float(probs[index])


def dedupe_teeth_by_fdi(teeth):
    best_by_fdi = {}

    for tooth in teeth:
        fdi = tooth["tooth_number"]
        if fdi not in best_by_fdi or tooth["conf"] > best_by_fdi[fdi]["conf"]:
            best_by_fdi[fdi] = tooth

    fdi_order = {label: index for index, label in FDI_LABELS.items()}

    return sorted(
        best_by_fdi.values(),
        key=lambda tooth: fdi_order.get(tooth["tooth_number"], 999),
    )


def classify_teeth_batch(img_pil, teeth):
    if not teeth:
        return []

    tensors = [VIT_TRANSFORM(img_pil.crop(tuple(tooth["bbox"]))) for tooth in teeth]
    batch = torch.stack(tensors).to(DEVICE)

    with torch.no_grad():
        logits = vit_model(batch).logits
        probs = torch.softmax(logits, dim=1)
        scores, indexes = torch.max(probs, dim=1)

    return [
        (KELAINAN_LABELS[index.item()], float(score.item()))
        for index, score in zip(indexes, scores)
    ]


def draw_result(image_bgr, teeth_results, save_path):
    img = image_bgr.copy()

    for tooth in teeth_results:
        x1, y1, x2, y2 = tooth["bbox"]
        condition = tooth["abnormality"]
        color = COND_COLORS_BGR.get(condition, (180, 180, 180))
        label = f"{tooth['no_fdi']} {condition} {tooth['confidence']:.2f}"
        cv2.rectangle(img, (x1, y1), (x2, y2), color, 2)
        cv2.putText(img, label, (x1, max(18, y1 - 6)), FONT_BOLD, 0.45, color, 1, cv2.LINE_AA)

    cv2.imwrite(str(save_path), img)


@app.get("/health")
def health():
    return jsonify({"ok": True})


@app.post("/predict")
def predict():
    load_models()

    payload = request.get_json(force=True)
    image_path = Path(payload["image_path"])
    radiograph_id = payload.get("radiograph_id", image_path.stem)
    result_dir = Path(payload["result_dir"])
    crop_dir = Path(payload["crop_dir"])
    result_prefix = payload.get("result_prefix", "radiographs/results")
    crop_prefix = payload.get("crop_prefix", f"radiographs/crops/{radiograph_id}")

    result_dir.mkdir(parents=True, exist_ok=True)
    crop_dir.mkdir(parents=True, exist_ok=True)

    image_bgr = cv2.imread(str(image_path))
    if image_bgr is None:
        return jsonify({"message": f"Image not found: {image_path}"}), 422

    img_pil = Image.fromarray(cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB))
    teeth = dedupe_teeth_by_fdi(run_yolo_inference(image_bgr))
    classifications = classify_teeth_batch(img_pil, teeth)
    results = []

    for tooth, (condition, score) in zip(teeth, classifications):
        x1, y1, x2, y2 = tooth["bbox"]
        crop_name = f"{radiograph_id}_{tooth['tooth_number']}.jpg"
        crop_path = crop_dir / crop_name
        cv2.imwrite(str(crop_path), image_bgr[y1:y2, x1:x2])
        results.append(
            {
                "no_fdi": tooth["tooth_number"],
                "abnormality": condition,
                "analysis": None if condition == "Normal" else f"{condition} terdeteksi oleh AI.",
                "bbox": tooth["bbox"],
                "confidence": score,
                "crop_image": f"{crop_prefix}/{crop_name}",
                "source": "ai",
            }
        )

    result_name = f"{radiograph_id}_result.jpg"
    result_path = result_dir / result_name
    draw_result(image_bgr, results, result_path)

    return jsonify(
        {
            "results": results,
            "result_image": f"{result_prefix}/{result_name}",
        }
    )


if __name__ == "__main__":
    if os.getenv("AI_PRELOAD_MODELS", "true").lower() == "true":
        print("Loading AI models...")
        load_models()
        print("AI models ready.")

    app.run(host=os.getenv("AI_SERVICE_HOST", "127.0.0.1"), port=int(os.getenv("AI_SERVICE_PORT", "5000")))

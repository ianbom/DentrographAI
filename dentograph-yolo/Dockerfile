# syntax=docker/dockerfile:1.7

FROM python:3.11-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    AI_SERVICE_HOST=0.0.0.0 \
    AI_SERVICE_PORT=8001

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        libgl1 \
        libglib2.0-0 \
        libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY dentograph-yolo/requirements.txt ./requirements.txt
RUN pip install --upgrade pip \
    && pip install --index-url https://download.pytorch.org/whl/cpu torch torchvision \
    && pip install -r requirements.txt

COPY dentograph-yolo/app ./app

RUN useradd --create-home --shell /usr/sbin/nologin appuser \
    && mkdir -p /app/models \
    && chown -R appuser:appuser /app

USER appuser
EXPOSE 8001
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
    CMD curl -fsS http://127.0.0.1:8001/health || exit 1
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]

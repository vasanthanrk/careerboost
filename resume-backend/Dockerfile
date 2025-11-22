# =========================
# Backend Dockerfile
# =========================
FROM python:3.11-slim-bookworm AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    xfonts-base \
    xfonts-75dpi \
    fontconfig \
    libjpeg62-turbo \
    libxrender1 \
    libxext6 \
    libfreetype6 \
    libpng16-16 \
    libssl3 \
    default-mysql-client \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install --prefix=/packages -r requirements.txt


# ============================
# Stage 2 – Final Image
# ============================
FROM python:3.11-slim

WORKDIR /app

# install needed libs + mysql client + nc
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf-2.0-0 \
    default-mysql-client \
    netcat-traditional \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# copy python deps
COPY --from=builder /packages /usr/local

# copy app code
COPY . .

EXPOSE 8082

CMD alembic upgrade head && \
    gunicorn app.main:app \
    -k uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8082 \
    --timeout 120 \
    --workers 4

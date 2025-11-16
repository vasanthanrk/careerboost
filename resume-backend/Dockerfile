# =========================
# Backend Dockerfile (Clean fix without .deb files)
# =========================
FROM python:3.11-slim-bookworm

WORKDIR /app

# Install system dependencies and wkhtmltopdf from official apt repo
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
    netcat-traditional && \
    echo "deb http://deb.debian.org/debian bookworm-backports main contrib non-free" >> /etc/apt/sources.list && \
    apt-get update && apt-get install -y wkhtmltopdf && \
    rm -rf /var/lib/apt/lists/*

# Verify wkhtmltopdf installation
RUN which wkhtmltopdf && wkhtmltopdf --version

COPY requirements.txt .

# Install ALL dependencies into /packages
RUN pip install --upgrade pip && \
    pip install --prefix=/packages -r requirements.txt

# ============================
# Stage 2 – Final Production Image
# ============================
FROM python:3.11-slim

WORKDIR /app

# Copy runtime system libs needed by WeasyPrint
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf-2.0-0 \
    wkhtmltopdf \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy installed dependencies from builder stage
COPY --from=builder /packages /usr/local

# Copy backend source code
COPY . .

# Expose API port
EXPOSE 8082

# Run DB migrations automatically before starting backend
CMD alembic upgrade head && \
    gunicorn app.main:app \
      -k uvicorn.workers.UvicornWorker \
      --bind 0.0.0.0:8082 \
      --timeout 120 \
      --workers 4
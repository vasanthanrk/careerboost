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

# Copy dependency list
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all backend source
COPY . .

# Set wkhtmltopdf path
ENV WKHTMLTOPDF_CMD=/usr/bin/wkhtmltopdf

# Expose FastAPI port
EXPOSE 8082

# Run migrations + start API
CMD ["bash", "-c", "until nc -z db 3306; do echo waiting for db...; sleep 2; done; alembic stamp head && alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8082"]

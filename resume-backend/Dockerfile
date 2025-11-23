########################################
# STAGE 1: Builder
########################################
FROM python:3.11-slim-bookworm AS builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
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

# Install Python packages to /packages
RUN pip install --upgrade pip
RUN pip install --prefix=/packages -r requirements.txt
RUN cp -r /packages/* /usr/local/


########################################
# STAGE 2: Final Runtime Image
########################################
FROM python:3.11-slim AS final

WORKDIR /app

# Install runtime libs WeasyPrint needs
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf-2.0-0 \
    libjpeg62-turbo \
    fontconfig \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from builder
COPY --from=builder /usr/local /usr/local

# Copy backend source
COPY . .

EXPOSE 8082

CMD ["bash", "-c", "\
    until nc -z db 3306; do \
        echo 'waiting for db...'; sleep 2; \
    done; \
    alembic upgrade head && \
    uvicorn app.main:app --host 0.0.0.0 --port 8082 \
"]

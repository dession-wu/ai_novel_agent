FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies first (better layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run as non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser \
    && mkdir -p /data/chroma \
    && chown -R appuser:appuser /app /data/chroma
USER appuser

# Expose port
EXPOSE 8000

# Container health check: FastAPI root endpoint
HEALTHCHECK --interval=15s --timeout=5s --retries=5 --start-period=40s \
    CMD curl -fsS http://localhost:8000/ || exit 1

# Run command (compose overrides with init_db prefix)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
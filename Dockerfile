# ==============================================================================
# Stage 1: Build Modern Frontend Assets (Vite + React + TailwindCSS)
# ==============================================================================
FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci --prefer-offline --no-audit

COPY frontend/ ./
RUN npm run build

# ==============================================================================
# Stage 2: Production Python Runtime (FastAPI + DynamicMCP FastMCP Server)
# ==============================================================================
FROM python:3.12-slim AS runner

# Install essential system utilities for sandboxed testing and network health checks
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python package dependencies
COPY pyproject.toml .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -e . && \
    pip install --no-cache-dir rich pygments fastmcp pytest pytest-asyncio

# Copy application source code and policies
COPY policies/ ./policies/
COPY src/ ./src/

# Copy compiled frontend static bundle from frontend-builder stage
COPY --from=frontend-builder /app/src/dynamicmcp/static ./src/dynamicmcp/static

# Setup persistent storage directories for SQLite Skill Store and sandbox policies
RUN mkdir -p /data ~/.dynamicmcp ~/.hermes

# Environment configuration
ENV PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app/src \
    PORT=8000 \
    HOST=0.0.0.0 \
    DYNAMICMCP_DB_PATH=/data/skills.db \
    DYNAMICMCP_CACHE_DIR=/data/cache \
    NEMOCLAW_POLICY_DIR=/app/policies \
    DYNAMICMCP_OFFLINE_MODE=false

EXPOSE 8000

# Container healthcheck using the native system telemetry endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/api/system || exit 1

# Start DynamicMCP Web Application & REST API
CMD ["python3", "-m", "dynamicmcp.cli", "serve"]

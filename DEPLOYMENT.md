# DynamicMCP Cloud Deployment Guide

This guide walks you through deploying DynamicMCP to modern Cloud PaaS platforms (**Render**, **Railway**, **Fly.io**, or **Google Cloud Run**) or a self-hosted VPS using Docker.

---

## Architecture Overview

```
                      ┌────────────────────────────────┐
                      │    Internet / Web Browser      │
                      └───────────────┬────────────────┘
                                      │ HTTPS (:443)
                                      ▼
                      ┌────────────────────────────────┐
                      │       Cloud PaaS Ingress       │
                      │  (Render / Railway / Fly.io)   │
                      └───────────────┬────────────────┘
                                      │ Reverse Proxy ($PORT)
                                      ▼
                      ┌────────────────────────────────┐
                      │    DynamicMCP Docker App       │
                      │ ┌────────────────────────────┐ │
                      │ │ Vite React Studio (Static) │ │
                      │ ├────────────────────────────┤ │
                      │ │ FastAPI REST & JSON-RPC    │ │
                      │ ├────────────────────────────┤ │
                      │ │ NemoClaw & OpenShell Core  │ │
                      │ └────────────────────────────┘ │
                      └───────┬────────────────┬───────┘
                              │                │
            Persistent Volume │                │ HTTPS API
                              ▼                ▼
                     ┌────────────────┐  ┌───────────────────┐
                     │ SQLite Store   │  │ Nebius AI Cloud   │
                     │  /data/skills  │  │  Token Factory    │
                     └────────────────┘  └───────────────────┘
```

---

## 1. Deploying to Render (Recommended - Free Tier Available)

Render automatically detects the [`render.yaml`](./render.yaml) blueprint in the repository.

### Option A: One-Click Blueprint
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Blueprint**.
3. Connect your GitHub repository: `https://github.com/penguin643/dynamicmcp.git`.
4. Render will read `render.yaml` and provision a Free Tier Docker Web Service running the FastAPI app + Studio UI.
5. Set your environment variables in the Render dashboard:
   - `NEBIUS_API_KEY`: Your Nebius AI Studio API Key.
   - `DYNAMICMCP_OFFLINE_MODE`: Set to `false` (or `true` if evaluating without an API key).
6. Click **Apply**. Render will build and deploy the container with automatic SSL.

### Option B: Manual Web Service
1. Click **New +** > **Web Service**.
2. Select your repository.
3. Choose **Docker** as the Runtime and **Free** instance plan.
4. Set Health Check path to `/api/system`.
5. Click **Deploy Web Service**.

---

## 2. Deploying to Railway

Railway offers instantaneous deployment from GitHub with zero configuration.

1. Go to [Railway Dashboard](https://railway.app/new).
2. Click **Deploy from GitHub repo**.
3. Select `penguin643/dynamicmcp`.
4. Railway will automatically detect the root [`Dockerfile`](./Dockerfile) and build the image.
5. Add a Volume in Railway:
   - Mount path: `/data`
6. Add Environment Variables:
   - `PORT`: Railway sets this automatically.
   - `NEBIUS_API_KEY`: Your Nebius Studio API key.
   - `DYNAMICMCP_OFFLINE_MODE`: `false`.
7. Railway will generate a public HTTPS URL (e.g., `dynamicmcp.up.railway.app`).

---

## 3. Deploying to Fly.io

Fly.io runs applications as close to your users as possible using lightweight microVMs.

### Prerequisites
Install the Fly CLI:
```bash
brew install flyctl
```

### Deployment Steps
1. Authenticate with Fly:
   ```bash
   fly auth login
   ```
2. Create and launch the app using the included [`fly.toml`](./fly.toml):
   ```bash
   fly launch --no-deploy
   ```
3. Create the persistent volume for SQLite storage:
   ```bash
   fly volumes create dynamicmcp_data --region iad --size 1
   ```
4. Set production secrets:
   ```bash
   fly secrets set NEBIUS_API_KEY="your_api_key_here"
   ```
5. Deploy:
   ```bash
   fly deploy
   ```
6. Open your live app:
   ```bash
   fly open
   ```

---

## 4. Deploying to Google Cloud Run

Google Cloud Run provides fully managed serverless containers with automatic scaling.

```bash
# 1. Build and submit image to Google Artifact Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/dynamicmcp:latest

# 2. Deploy container to Cloud Run
gcloud run deploy dynamicmcp \
  --image gcr.io/PROJECT_ID/dynamicmcp:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8000 \
  --set-env-vars NEBIUS_API_KEY="your_key",DYNAMICMCP_OFFLINE_MODE="false"
```

---

## 5. Self-Hosting with Docker Compose (VPS / Cloud VM)

For Nebius AI Cloud compute instances, AWS EC2, or DigitalOcean Droplets:

1. Clone repository:
   ```bash
   git clone https://github.com/penguin643/dynamicmcp.git
   cd dynamicmcp
   ```
2. Create environment file:
   ```bash
   cp .env.example .env
   # Edit .env with your NEBIUS_API_KEY
   ```
3. Start container in detached mode:
   ```bash
   docker compose up -d
   ```
4. Access the web dashboard at `http://your-server-ip:8000`.

---

## Verification & Health Check

Once deployed, verify the system status by visiting:
```bash
curl https://<YOUR-DEPLOYED-URL>/api/system
```

Expected response:
```json
{
  "status": "HEALTHY",
  "nebius_token_factory": {
    "configured": true,
    "url": "https://api.studio.nebius.ai/v1",
    "nano_model": "nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B",
    "ultra_model": "nvidia/Nemotron-3-Ultra-550b-a55b"
  },
  "sandbox": {
    "openshell_available": true,
    "policy_dir": "/app/policies"
  },
  "metrics": {
    "total_tools": 2,
    "registered_tools_count": 2
  }
}
```

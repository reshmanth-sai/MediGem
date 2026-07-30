# MediGem Version 2 Deployment & Containerization Strategy

> **Docker Compose, Edge Offline Installer, and Kubernetes Compatibility Specification**

MediGem Version 2 supports two primary deployment topologies:
1. **Offline Edge Clinic Deployment**: Single-machine Docker Compose bundle running 100% offline in rural clinics.
2. **Hospital Network / Cloud Deployment**: Scalable multi-node Kubernetes cluster for regional health networks.

---

## 🐳 Docker Compose Offline Topology

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend_v2
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    environment:
      - OLLAMA_HOST=http://ollama:11434
      - GEMMA_MODEL=gemma3:4b
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    depends_on:
      - ollama

  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_storage:/root/.ollama

volumes:
  ollama_storage:
```

---

## 🚀 Single-Command Offline Installer Script

For rural clinic health workers, deployment requires zero technical configuration. A single installer script initializes the entire stack:

```bash
#!/bin/bash
# MediGem One-Click Offline Clinic Installer
echo "Starting MediGem Offline AI Co-Pilot..."
docker-compose up -d --build
echo "MediGem is ready! Access interface at http://localhost:3000"
```

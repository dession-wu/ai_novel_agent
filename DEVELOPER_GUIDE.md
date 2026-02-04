# Developer Guide

This document provides a comprehensive overview of the AI Novel Agent System's architecture, directory structure, and development guidelines.

## 1. Project Overview

The AI Novel Agent System is a full-stack application designed to assist authors in creating novels using AI. It features an automated outline generator, chapter writer with RAG (Retrieval-Augmented Generation) context management, and proofreading tools.

### Tech Stack

- **Backend**: Python 3.10+, FastAPI, SQLAlchemy, LangChain, ChromaDB
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **Infrastructure**: Docker, Docker Compose

## 2. Directory Structure

```
/
├── app/                        # Backend Application Code
│   ├── api/                    # API Endpoints
│   ├── core/                   # Core Config & Database
│   ├── models/                 # SQLAlchemy Models
│   ├── schemas/                # Pydantic Schemas
│   └── services/               # Business Logic (LLM, RAG, etc.)
├── frontend/                   # Frontend Application Code
│   ├── src/
│   │   ├── api/                # API Client (TypeScript)
│   │   ├── components/         # Reusable UI Components
│   │   ├── pages/              # Page Components
│   │   └── lib/                # Utilities
├── chroma_db/                  # Vector Database Persistence
├── tests/                      # Backend Tests
├── docker-compose.yml          # Container Orchestration
└── requirements.txt            # Python Dependencies
```

## 3. Backend Development

### Core Services

- **LLMService** (`app/services/llm_service.py`): Handles interactions with OpenAI/LangChain.
- **ContextManager** (`app/services/context_manager.py`): Manages vector embeddings in ChromaDB to maintain novel context.
- **NovelService** (`app/services/novel_service.py`): Orchestrates the novel creation workflow.

### API Design

All endpoints are versioned under `/api/v1`.
- **Novels**: `/api/v1/novels` (CRUD, Generate Outline)
- **Chapters**: `/api/v1/novels/{id}/chapters` (CRUD, Generate Content, Proofread)

## 4. Frontend Development

### Component Library

We use a custom component library built with Tailwind CSS, located in `src/components/ui`.
- **Button**: `src/components/ui/button.tsx`
- **Card**: `src/components/ui/card.tsx`

### API Integration

All API calls are centralized in `src/api/api.ts`.
- **ApiClient**: A wrapper around `fetch` with interceptors for Auth and Error handling.
- **novelApi**: Exported object containing methods for novel-related operations.

## 5. Running the Project

### Prerequisites
- Node.js 18+
- Python 3.10+
- Docker (Optional)

### Quick Start (Local)

1. **Backend**:
   ```bash
   # Install dependencies
   pip install -r requirements.txt
   
   # Initialize DB
   python -m app.init_db
   
   # Run Server
   python main.py
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Quick Start (Docker)

```bash
docker-compose up --build
```

## 6. Testing

- **Backend**: `pytest tests/`
- **Frontend**: `npm run test` (Pending implementation)

## 7. Future Roadmap

- **Auth**: Implement full JWT authentication flow.
- **Deployment**: Kubernetes manifests for production.
- **Mobile**: React Native mobile app reusing the API.

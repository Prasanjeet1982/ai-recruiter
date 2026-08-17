# InterviewIQ™ Platform (AI Recruiter)

> **Enterprise AI-Powered Interview Management System & Real-Time Copilot**

[![Python Version](https://img.shields.io/badge/Python-3.10%2B-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Uvicorn-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%206-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Local Engine](https://img.shields.io/badge/Architecture-100%25%20Local%20Rule--Based-success.svg)](https://github.com/Prasanjeet1982/ai-recruiter)
[![Tests](https://img.shields.io/badge/Tests-Pytest%20Passing-brightgreen.svg?logo=pytest&logoColor=white)](https://pytest.org/)

---

## 🌟 Overview

**InterviewIQ™** is an enterprise-grade, end-to-end technical interview intelligence and recruitment management platform. It streamlines the entire engineering hiring lifecycle—from candidate screening and live interview execution to automated multi-dimensional scoring, ATS synchronization, and hiring committee collaboration.

Built with a **100% Local Rule-Based Architecture**, InterviewIQ provides deterministic, privacy-compliant, zero-latency evaluation without relying on external cloud LLM APIs.

```
┌─────────────────┐     ┌──────────────────────┐     ┌───────────────────────┐
│ Recruiter Stage │ ──▶ │ Live Copilot Session │ ──▶ │ Multi-Competency Eval │
│ & Candidate View│     │ (Real-Time Probing)  │     │   (Radar & Scorecard) │
└─────────────────┘     └──────────────────────┘     └───────────────────────┘
                                                                 │
                                ┌────────────────────────────────┴───────────────────────────────┐
                                ▼                                                                ▼
                     ┌───────────────────────┐                                     ┌───────────────────────────┐
                     │  Workday ATS Sync     │                                     │  Slack Webhook & Alerts   │
                     │ (Scorecard & Reqs)    │                                     │ (1-Click Approvals)       │
                     └───────────────────────┘                                     └───────────────────────────┘
```

---

## ✨ Key Features & Modules

### 1. 👔 Recruiter Command Center
- **Pipeline Visibility**: Track candidates across stages (*Screening, Scheduled, Interview In Progress, Feedback Pending, Completed, Offer Extended, Rejected*).
- **Candidate Comparison Modal**: Side-by-side benchmarking of competencies, experience, expected salary, and fit scores.
- **Interview Scheduler**: Seamless 1-click scheduling with automatic interviewer assignment.

### 2. 🎙️ Live Interview Execution & AI Copilot
- **Live Copilot Sidebar**: Real-time interviewer assistance with automated evaluation rubric matching.
- **Dynamic Response Grading**: Evaluates MCQ, Subjective, and System Design Scenario responses instantly.
- **Probing Follow-Ups**: Automatically generates contextual follow-up questions based on identified candidate weaknesses.
- **Audio Waveform Visualizer**: Real-time feedback and microphone simulation.
- **Candidate Dossier**: Live access to candidate background, resume highlights, and skill tags during the call.

### 3. 📊 Automated Evaluation & Radar Scorecards
- **Multi-Competency Radar Engine**: Scores candidates across 5 key dimensions:
  - Technical Knowledge
  - Problem Solving
  - Architecture Skills
  - Coding Skills
  - Communication
- **Deterministic Recommendations**: Calculated ratings (*Strong Hire, Hire, Borderline, No Hire*).
- **Auto-Generated Summaries**: Executive summary, key strengths, weaknesses, and improvement areas.

### 4. 🏢 Workday ATS Integration
- Bi-directional candidate status updates.
- Automatic creation and submission of Workday evaluation scorecards.
- Job requisition mapping (`REQ-2026-XXXX`).

### 5. 💬 Slack Collaboration Portal
- Rich Slack **Block Kit** formatted messages.
- Automatic alerts posted to `#interview-updates` upon interview completion.
- Interactive 1-click **Approve Offer** / **Request Review** buttons for hiring managers.

### 6. 📚 100+ Question Technical Bank
- Filterable repository of technical questions across 5 engineering tracks:
  - **GenAI Engineer**
  - **AI Architect**
  - **Data Engineer**
  - **Full Stack Engineer**
  - **DevOps Engineer**
- Filter by difficulty (*Beginner, Intermediate, Advanced*) and competency area.

### 7. 🚀 Interactive 10-Step Executive Demo Stepper
- Guided tour walking stakeholders through the entire hiring lifecycle in seconds.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend UI** | React 18, TypeScript, Vite 6, Tailwind CSS v4, Lucide React, Recharts, Canvas Confetti |
| **Backend API** | Python 3.10+, FastAPI, Pydantic v2, Uvicorn, Jinja2 |
| **Testing** | Pytest, FastAPI TestClient, Vitest/TypeScript Compiler |
| **Data Engine** | Local JSON Store with Pydantic validation & deterministic scoring rules |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18.0 or higher) & `npm`
- **Python** (v3.10 or higher)

---

### Option 1: Run Full-Stack (React Vite + FastAPI)

#### 1. Backend Setup (FastAPI)
```bash
# Clone repository
git clone https://github.com/Prasanjeet1982/ai-recruiter.git
cd ai-recruiter

# Create and activate virtual environment
python -m venv venv

# Windows:
.\venv\Scripts\activate

# macOS / Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
python main.py
```
*Backend runs on: `http://localhost:8000` (Swagger UI: `http://localhost:8000/docs`)*

#### 2. Frontend Setup (React + Vite)
In a separate terminal:
```bash
# Install frontend dependencies
npm install

# Start Vite dev server
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

### Option 2: Run Frontend Only (Mock Mode)
The frontend contains a complete self-contained local state engine and mock data store. You can run and demo the entire platform without starting the backend:
```bash
npm install
npm run dev
```

---

## 🧪 Running Tests & Validation

### Python Backend Unit Tests
Execute the comprehensive Pytest suite covering scoring rules, session lifecycle, Workday sync, and Slack payloads:
```bash
pytest -v
```

### Frontend TypeScript & Build Verification
Verify type safety and compile production bundle:
```bash
npm run build
```

---

## 📁 Repository Structure

```
ai-recruiter/
├── app/                          # Python FastAPI Backend
│   ├── config.py                 # App configuration & paths
│   ├── main.py                   # FastAPI entrypoint & middleware
│   ├── data/                     # JSON data records (candidates, questions, etc.)
│   ├── models/                   # Pydantic domain models
│   │   ├── candidate.py
│   │   ├── interview.py
│   │   ├── question.py
│   │   ├── slack.py
│   │   └── workday.py
│   ├── routers/
│   │   └── api.py                # REST API endpoints
│   ├── services/
│   │   ├── data_store.py         # JSON storage engine
│   │   ├── interview_service.py  # Session orchestrator
│   │   ├── scoring_engine.py     # 5-dimension deterministic scoring algorithm
│   │   ├── slack_service.py      # Slack Block Kit message generator
│   │   └── workday_service.py    # ATS integration logic
│   └── static/                   # Static build assets
├── src/                          # React + TypeScript Frontend
│   ├── App.tsx                   # Main app router & layout
│   ├── main.tsx                  # React DOM root
│   ├── components/
│   │   ├── hiringManager/        # Hiring manager portal & analytics
│   │   ├── interview/            # Live interview screen, copilot, visualizer
│   │   ├── layout/               # Navbar & 10-step executive demo stepper
│   │   ├── modals/               # Candidate comparison, scheduling, Workday modals
│   │   ├── questions/            # Question bank explorer
│   │   ├── recruiter/            # Recruiter dashboard & pipeline
│   │   ├── scorecard/            # Evaluation summary & competency charts
│   │   ├── slack/                # Slack webhook viewer
│   │   └── workday/              # Workday portal
│   ├── context/
│   │   └── AppContext.tsx        # React global state provider
│   ├── data/                     # Frontend client datasets
│   ├── types/
│   │   └── index.ts              # TypeScript interface definitions
│   └── utils/
│       └── scoringEngine.ts      # Client-side scoring & radar calculations
├── tests/
│   └── test_scoring_engine.py    # Pytest backend test suite
├── package.json                  # Node.js dependencies & scripts
├── requirements.txt              # Python dependencies
├── vite.config.ts                # Vite build configuration
└── tailwind.config.js            # Tailwind CSS configuration
```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/candidates` | List all candidates with stage & profile data |
| `GET` | `/api/questions` | Query question bank by role & difficulty |
| `POST` | `/api/session/start` | Initialize live interview session for a candidate |
| `POST` | `/api/session/answer` | Record candidate response & retrieve copilot feedback |
| `POST` | `/api/session/complete` | Finalize interview & generate radar evaluation |
| `POST` | `/api/workday/sync` | Submit scorecard to mock Workday ATS |
| `GET` | `/api/workday/records` | Retrieve all synced Workday records |
| `POST` | `/api/slack/notify` | Dispatch Slack notification with action blocks |
| `GET` | `/api/slack/messages` | View Slack notification feed |
| `GET` | `/docs` | Interactive Swagger API documentation |

---

## 🔒 Privacy & Compliance

- **No Third-Party AI Data Transfer**: Candidate resumes, transcripts, and evaluation data remain entirely within your infrastructure.
- **Deterministic & Auditable**: Every score and recommendation is derived through transparent, explainable rubric algorithms.
- **Zero Latency**: Real-time copilot hints with no external API rate limits or network lag.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

# 🔮 AI-Native Custom Analytics Platform

![Status](https://img.shields.io/badge/Status-Prototype-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Python](https://img.shields.io/badge/Python-3.11+-yellow?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=flat-square&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=flat-square&logo=docker&logoColor=white)

> **"The analytics platform that adapts to you, not the other way around."**

Traditional analytics tools (Google Analytics, Mixpanel) force you to adapt your data to their schema. We invert the process. You describe your business, and our AI generates a **custom-tailored SDK** and **automatically builds a dashboard** relevant to your specific goals.

---

## ⚡ How It Works

1.  **Describe:** You tell us about your product (e.g., *"We are a Netflix for Cats"*).
2.  **Generate:** Our AI Architect builds a custom JavaScript SDK for you (e.g., `analytics.trackCatMeow()`).
3.  **Integrate:** You copy-paste the generated SDK into your app.
4.  **Visualize:** As data flows in, our AI Analyst writes custom SQL queries to generate insights instantly.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | Python, FastAPI | High-performance async API for real-time ingestion. |
| **Database** | PostgreSQL (JSONB) | "Schema-less" storage using `JSONB` for universal compatibility. |
| **Infrastructure** | Docker | Containerized database for easy setup. |
| **AI Engine** | OpenAI / LLMs | Generates SDK code and writes SQL queries on the fly. |
| **Frontend** | React / Next.js | Dynamic dashboard rendering engine. |

---

## 🏗️ Architecture

The system relies on a **"Generic Storage, Custom Interface"** design:

```mermaid
graph LR
    User[User Website] -->|Custom SDK| API[FastAPI Gateway]
    API -->|Raw JSON| DB[(Postgres JSONB)]
    AI[AI Engine] -->|SQL Queries| Config[Insights Config]
    DB -->|Execute SQL| Dashboard[User Dashboard]
    Config --> Dashboard

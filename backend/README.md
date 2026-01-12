# AI Analytics Backend

![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![Python](https://img.shields.io/badge/Python-3.9+-blue?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=flat-square&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=flat-square&logo=docker&logoColor=white)

The high-performance ingestion engine for the AI-Native Analytics Platform. Built to handle real-time event streams and dynamic SQL execution.

---

## Features

* **Universal Ingestion:** Accepts any JSON payload via a "Schema-less" design.
* **Real-Time Processing:** Built on `async` FastAPI for millisecond response times.
* **AI-Ready:** Structures data specifically for LLM-driven SQL generation.
* **Containerized:** Fully dockerized database setup.

---

## Tech Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Framework** | FastAPI | High-performance API server. |
| **Database** | PostgreSQL 16 | Storage engine using `JSONB` for flexibility. |
| **ORM** | SQLAlchemy | Database abstraction and modeling. |
| **Validation** | Pydantic | Data validation and serialization. |

---

## Quick Start

### 1. Prerequisites
Ensure you have **Python 3.9+** and **Docker** installed.

### 2. Environment Setup
Create a virtual environment and install dependencies:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt

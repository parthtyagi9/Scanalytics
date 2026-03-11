# Scanalytics Backend (Spring Boot)

Spring Boot 3.2 backend for the Scanalytics analytics platform. This is a 1:1 port of the original Python/FastAPI backend.

## Tech Stack

- **Java 17** + **Spring Boot 3.2**
- **Spring Data JPA** (Hibernate) — PostgreSQL with JSONB support
- **Spring AI** (OpenAI-compatible) — connects to OpenRouter for LLM inference
- **Maven** build system

## Prerequisites

- Java 17+
- Maven 3.8+
- PostgreSQL 14+
- OpenRouter API key

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | JDBC PostgreSQL connection string | `jdbc:postgresql://localhost:5432/postgres` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `DeltaHacks26` |
| `OPENROUTER_API_KEY` | OpenRouter API key for AI features | — |
| `AI_MODEL` | LLM model identifier | `google/gemini-2.0-flash-thinking-exp:free` |
| `PORT` | Server port | `8080` |

## Quick Start

```bash
# Build
cd backend-spring
mvn clean package -DskipTests

# Run
mvn spring-boot:run

# Run with seed data
mvn spring-boot:run -Dspring-boot.run.profiles=seed
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/chat-analyst` | None | AI business analyst chat |
| `POST` | `/api/onboarding` | None | Create project + generate demo data + AI analysis |
| `POST` | `/api/track` | `X-Api-Key` | Track an analytics event |
| `GET` | `/api/dashboard` | `X-Api-Key` | Get dashboard widgets |
| `POST` | `/api/generate-insights` | `X-Api-Key` | Regenerate AI insights |

## Deployment

The `Procfile` is configured for Heroku/Railway/Render:

```
web: java -jar target/scanalytics-backend-0.0.1-SNAPSHOT.jar --server.port=$PORT
```

Build the fat JAR first:
```bash
mvn clean package -DskipTests
```

## Project Structure

```
src/main/java/com/scanalytics/
├── ScanalyticsApplication.java    — Entry point
├── config/                        — CORS, DB init, web config
├── controller/                    — REST controllers (5 endpoints)
├── dto/request/                   — Request DTOs
├── dto/response/                  — Response DTOs
├── exception/                     — Global exception handler
├── model/                         — JPA entities (Project, AnalyticsEvent, InsightConfig)
├── repository/                    — Spring Data JPA repositories
├── security/                      — API key interceptor
├── seed/                          — Seed data runner (profile-activated)
└── service/                       — Business logic + AI engine
```

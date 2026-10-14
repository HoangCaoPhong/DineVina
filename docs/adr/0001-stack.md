# ADR 0001: Initial web stack

Status: Proposed (2026-10-14)

## Decision

Use a React/TypeScript web client, FastAPI Python backend, and PostgreSQL database in one repository. Use Docker Compose for local integration and GitHub Actions for checks and image publishing.

## Reason

The project needs a responsive customer/partner interface and a Python path for later AI experiments. A monorepo makes API contracts, reviews, and course evidence easier for this five-person team. The database service is provisioned but persistence is deliberately not claimed until implemented.

## Revisit when

The team has validated deployment constraints, real booking load, and data protection requirements.

# TODO - Startup Forge (AI Startup Co-Founder)

## Priority 1: Authentication (JWT) + Protected Routes
- [x] Add SQLAlchemy models for User and Analysis (and optional Document metadata).
- [x] Implement password hashing + JWT access tokens.
- [ ] Implement endpoints:
  - [ ] POST /auth/register
  - [ ] POST /auth/login
  - [ ] POST /auth/forgot-password (stub)
  - [ ] POST /auth/logout
- [ ] Add dependency/guard to extract current user from `Authorization: Bearer`.
- [ ] Protect analysis + document + download endpoints so users can only access their own data.
- [ ] Add protected route handling in frontend:
  - [ ] Store JWT (localStorage) and attach `Authorization` header to API calls.
  - [ ] Redirect unauthenticated users to /login.
  - [ ] Implement real login/register flows calling backend endpoints.

## Priority 2: Connect Frontend to Backend (live data)
- [ ] Replace placeholder results with backend responses.
- [ ] Update AppContext analyze() to call protected backend and store analysis + analysisId.
- [ ] Update download/report endpoints to use analysisId.

## Priority 3+: RAG pipeline, workflow visibility, charts, history, knowledge base, PDF/PPT generation, deployment
- [ ] Continue implementing remaining priorities after auth is complete.


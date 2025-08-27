# YaYa Wallet Transactions Dashboard

A secure full‑stack demo that proxies YaYa Wallet's REST API to display a responsive, searchable, paginated transactions dashboard.

## Highlights

- **Backend**: Node.js + Express (TypeScript), MVC architecture
- **ORM/DB**: Prisma + PostgreSQL, with a simple local cache table for transactions (optional use)
- **Validation**: Zod + a reusable validation middleware
- **Security**: Helmet, CORS, HPP, rate limiting, centralized error handling
- **Frontend**: React + Vite + TypeScript, Tailwind CSS, dark/light toggle, Framer Motion animations, Recharts graphs
- **Dockerized**: `docker-compose` runs DB, Backend, and Frontend together
- **Secrets**: API key/secret set in backend `.env` only; **never** exposed in frontend

## Environment

Create these files:

**backend/.env**

```
# Server
PORT=4000
NODE_ENV=production

# PostgreSQL
DATABASE_URL=postgresql://yaya:yaya_password@db:5432/yaya_db?schema=public

# YaYa API (keep safe, never put in frontend)
YAYA_BASE_URL=https://yayawallet.com/api/en
YAYA_API_KEY=YOUR_API_KEY
YAYA_API_SECRET=YOUR_API_SECRET

# Rate limit
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=60
```

**frontend/.env**

```
VITE_API_BASE=http://localhost:4000
```

## Run with Docker

```bash
docker compose build
docker compose up -d
# Frontend: http://localhost:5173
# Backend:  http://localhost:4000
```

On first run, the backend image runs prisma generate and will auto-create the schema as needed. To run migrations locally (outside Docker), you can:

```bash
cd backend
npm run prisma:push    # or npm run prisma:migrate:dev -- --name init
```

## Testing the Dashboard

- Search by sender, receiver, cause, or ID using the search box.
- Pagination uses `p` query param internally (1‑based index in UI), defaults to page 1.
- Incoming vs Outgoing rows are visually indicated (left color bar: green incoming, red outgoing). Top‑ups (same sender & receiver) are treated as **incoming**.

## Security Notes

- API credentials are **only** used server-side (backend) and never live in client code.
- Helmet + CORS + HPP + rate limiting on `/api/*` endpoints.
- Zod validation for query/body and centralized error handler without leaking internals.

## Directory Structure

```
yaya-wallet-dashboard/
  backend/
    src/
      config/
      controllers/
      middlewares/
      routes/
      services/
      app.ts
      server.ts
    prisma/
      schema.prisma
    Dockerfile
    package.json
    tsconfig.json
    .env (you add)
  frontend/
    src/
      components/
      pages/
      App.tsx
      main.tsx
      index.css
    Dockerfile
    index.html
    package.json
    tsconfig.json
    tailwind.config.ts
    postcss.config.js
    .env (you add)
  docker-compose.yml
  README.md
```

## Problem-Solving Approach

1. **Credentials safety**: Proxy requests via backend. Frontend never touches secrets.
2. **MVC**: Controller is thin; Service contains YaYa API calls; Types normalized in one place.
3. **Validation**: Zod middleware ensures clean inputs for `/api/transactions`.
4. **Security**: Helmet, CORS, HPP, rate limiter; consistent error responses.
5. **UX**: Responsive table, clear incoming/outgoing indicators, charts for recent volumes, dark/light toggle, simple motion.
6. **Extensibility**: Prisma layer can cache or persist analytics later (already scaffolded).

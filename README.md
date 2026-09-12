# LAS TRES FLAMITAS - Punto de Venta

Sistema POS completo con control de inventario, corte de caja y reportes.

## Stack
- **Backend:** Node.js + Express + TypeScript + Prisma
- **Frontend:** React + Vite + Tailwind CSS + Zustand
- **DB:** PostgreSQL (Render)
- **Deploy:** Render (Blueprint)

## Deploy en Render (Blueprint)

1. Sube el proyecto a GitHub.
2. En Render → **New → Blueprint** → selecciona el repo.
3. Render crea automáticamente:
   - PostgreSQL `flamitas-db`
   - Web Service `flamitas-api`
   - Static Site `flamitas-web`
4. Espera a que la BD esté lista. Copia la URL del backend (ej. `https://flamitas-api.onrender.com`).
5. En `flamitas-web` → Environment → `VITE_API_URL = https://flamitas-api.onrender.com/api` → **Manual Deploy**.
6. En `flamitas-api` → Environment → `CORS_ORIGIN = https://flamitas-web.onrender.com` → **Manual Deploy**.
7. Ejecuta el seed: en `flamitas-api` → **Shell** → `npm run prisma:seed`.

## URLs finales
- Frontend: https://flamitas-web.onrender.com
- Backend:  https://flamitas-api.onrender.com
- Health:   https://flamitas-api.onrender.com/health

## Desarrollo local
```bash
# Backend
cd server && npm install
cp .env.example .env       # Ajusta DATABASE_URL
npx prisma db push
npm run prisma:seed
npm run dev

# Frontend (otra terminal)
cd client && npm install
cp .env.example .env
npm run dev
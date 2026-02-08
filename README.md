# Recipes API

API REST para gestionar recetas con Node.js, Express y MongoDB.

## Enlaces

- Repo: [https://github.com/eKs-stack/recipes-backend](https://github.com/eKs-stack/recipes-backend)
- Deploy: [https://recipes-backend-gilt.vercel.app](https://recipes-backend-gilt.vercel.app)
- Postman: `recipes-backend.postman_collection.json`

## Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Bcrypt (`bcryptjs`)
- Helmet
- CORS
- Express Rate Limit
- Express Validator

## Qué hace

- Registro/login de usuarios.
- Sesion por cookie `httpOnly` con JWT (7 dias).
- Endpoint `GET /api/auth/me` para recuperar usuario autenticado.
- CRUD de recetas con control de permisos por `owner` y rol `admin`.
- Favoritos persistidos por usuario en base de datos.

## Seguridad aplicada

- `helmet` para cabeceras seguras.
- CORS con allowlist (`CORS_ORIGINS`) y `credentials: true`.
- Proteccion CSRF por validacion de `Origin/Referer` en metodos mutables cuando hay cookie de sesion.
- Rate limit solo en login/registro (`/api/auth/login` y `/api/auth/register`).
- Passwords hasheadas con `bcrypt`.

## Instalacion

```bash
git clone <URL_DEL_REPO>
cd recipes-backend
npm install
```

## Variables de entorno

Crea `/Users/aleks/Desktop/REPOS/PERSONALES/recipes-backend/.env`:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/recipes
JWT_SECRET=tu_secreto
CORS_ORIGINS=http://localhost:5173,https://guardatureceta.com,https://www.guardatureceta.com
# opcionales
NODE_ENV=development
COOKIE_SAME_SITE=lax
COOKIE_SECURE=false
```

Notas:

- En produccion cross-site, normalmente `COOKIE_SAME_SITE=none` y `COOKIE_SECURE=true`.
- Si `CORS_ORIGINS` no se define, se usa una lista por defecto del proyecto.

## Scripts

```bash
npm run dev
npm start
npm run seed:recipes
npm run lint
npm run format
```

## Endpoints

### Auth

- `POST /api/auth/register` (publico, validado, crea cookie de sesion)
- `POST /api/auth/login` (publico, validado, rate-limited, crea cookie de sesion)
- `GET /api/auth/me` (protegido, devuelve usuario actual)
- `POST /api/auth/logout` (limpia cookie de sesion)

### Recipes

- `GET /api/recipes` (publico)
- `GET /api/recipes/:id` (publico)
- `GET /api/recipes/mine` (protegido)
- `GET /api/recipes/favorites` (protegido)
- `POST /api/recipes/:id/favorite` (protegido)
- `POST /api/recipes` (protegido + validacion)
- `PUT /api/recipes/:id` (protegido + validacion + owner/admin)
- `DELETE /api/recipes/:id` (protegido + owner/admin)

## Sesion y autenticacion

- El backend firma JWT y lo envia en cookie `httpOnly`.
- El frontend envia credenciales con `withCredentials` / `credentials: 'include'`.
- El middleware `auth` valida token y adjunta `req.user`.
- Compatibilidad: tambien acepta `Authorization: Bearer <token>`.

## Seed local

`npm run seed:recipes` inserta recetas de ejemplo.

Proteccion incluida:

- Bloqueado si `NODE_ENV=production` o `VERCEL=1`.
- Solo se fuerza con `ALLOW_SEED_IN_PROD=true`.

Variables opcionales de seed:

```env
SEED_USER_EMAIL=demo@local.dev
SEED_USER_USERNAME=demo
SEED_USER_PASSWORD=demo1234
SEED_USER_ROLE=admin
SEED_COUNT=8
SEED_RESET=true
SEED_USER_ID=
ALLOW_SEED_IN_PROD=false
```

## Deploy en Vercel

1. Importa el repo en Vercel.
2. Define variables: `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGINS` y opcionalmente `COOKIE_SAME_SITE`, `COOKIE_SECURE`.
3. Vercel usa `api/index.js` como entrypoint serverless.

## Postman

- Puedes importar `recipes-backend.postman_collection.json`.
- En flujo cookie, Postman debe conservar cookies entre requests (`/login` -> `/me`).

## Autor

Aleks Dankov Hristov

# Recipes API

API REST para gestionar recetas con Node.js, Express y MongoDB. Incluye autenticacion con JWT y endpoints publicos/protegidos para recetas.

---

## Enlaces de entrega

- Repo: https://github.com/eKs-stack/recipes-backend
- Deploy (Vercel): https://recipes-backend-gilt.vercel.app
- Postman: [recipes-backend.postman_collection.json](recipes-backend.postman_collection.json)

---

## Funcionalidades

- Registro y login con JWT (expira en 7 dias)
- CRUD de recetas protegido por token
- Listado publico y detalle por ID
- Listado de recetas propias (`/api/recipes/mine`)
- Validaciones basicas via Mongoose
- Roles de usuario (`user`/`admin`) para operaciones administrativas

---

## Tecnologias utilizadas

- Node.js
- Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Bcrypt (`bcryptjs`)
- CORS
- Helmet
- Express Rate Limit
- Express Validator
- ESLint + Prettier

---

## Instalacion y ejecucion

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd recipes-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Variables de entorno

Crea un archivo `.env` en la raiz del proyecto con el siguiente contenido:

```env
PORT=3000
MONGO_URI=tu_uri_de_mongodb
JWT_SECRET=tu_secreto_jwt
CORS_ORIGINS=https://guardatureceta.com,https://www.guardatureceta.com
```

Notas:

- `JWT_SECRET` es obligatorio para login/registro.
- `PORT` es opcional en produccion (el proveedor puede inyectarlo).
- `CORS_ORIGINS` es opcional. Si no se define, se usan valores por defecto.

### 4. Ejecutar el servidor

Modo desarrollo:

```bash
npm run dev
```

Modo produccion:

```bash
npm start
```

El servidor se ejecuta en:

```text
http://localhost:3000
```

---

## Autenticacion

### Registro

```text
POST /api/auth/register
```

Body (JSON):

```json
{
  "username": "aleks",
  "email": "aleks@email.com",
  "password": "tu_password"
}
```

### Login

```text
POST /api/auth/login
```

Body (JSON):

```json
{
  "email": "aleks@email.com",
  "password": "tu_password"
}
```

Tambien se puede iniciar sesion con `username` en lugar de `email`.

### Uso del token

Incluye el token en el header:

```text
Authorization: Bearer <token>
```

---

## Endpoints de la API

### Salud

```text
GET /
```

### Auth

```text
POST /api/auth/register
POST /api/auth/login
```

### Recetas publicas

```text
GET /api/recipes
GET /api/recipes/:id
```

### Recetas protegidas (requieren token)

```text
GET /api/recipes/mine
POST /api/recipes
PUT /api/recipes/:id
DELETE /api/recipes/:id
```

Notas:

- `PUT` y `DELETE` solo permiten modificar/eliminar recetas del usuario autenticado.

---

## Modelo de receta

Campos requeridos:

- `title` (string)
- `description` (string)
- `ingredients` (array de strings)
- `steps` (string)
- `prepTime` (number)
- `category` (string)
- `difficulty` ("Fácil", "Media" o "Difícil")
- `servings` (number)

Ejemplo de body (JSON):

```json
{
  "title": "Pasta simple",
  "description": "Una receta rapida",
  "ingredients": ["pasta", "sal", "aceite"],
  "steps": "Hervir la pasta y servir",
  "prepTime": 15,
  "category": "Italiana",
  "difficulty": "Fácil",
  "servings": 2
}
```

El campo `owner` se asigna automaticamente desde el usuario autenticado.

---

## Roles

El modelo de usuario incluye el campo `role` con valores `user` o `admin`.

- Por defecto, los usuarios nuevos son `user`.
- Los `admin` pueden actualizar o eliminar cualquier receta.
- Para promover un usuario a `admin`, actualiza el campo `role` en la base de datos.

---

## Deploy (Vercel)

1. Crea un proyecto en Vercel e importa el repo.
2. Variables de entorno (Settings > Environment Variables):
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CORS_ORIGINS` (opcional, separado por comas)
3. Despliega el proyecto (Vercel detecta `api/index.js`).

---

## Postman

Se incluye una coleccion lista para importar:

- `recipes-backend.postman_collection.json`

Variables incluidas:

- `baseUrl` (por defecto `http://localhost:3000/api`)
- `token` (se setea al hacer login)
- `recipeId` (se setea al crear receta)

Importa la coleccion en Postman y ajusta `baseUrl` si es necesario.

---

## Scripts disponibles

```bash
npm run dev      # Servidor con nodemon
npm start        # Servidor en produccion
npm run seed:recipes # Inserta recetas de ejemplo en local
npm run lint     # Ejecuta ESLint
npm run format   # Formatea el codigo con Prettier
```

---

## Seed local de recetas

Para poblar recetas de ejemplo en una base local:

```bash
npm run seed:recipes
```

Variables opcionales:

```env
SEED_USER_EMAIL=demo@local.dev
SEED_USER_USERNAME=demo
SEED_USER_PASSWORD=demo1234
SEED_USER_ROLE=admin
SEED_COUNT=8
SEED_RESET=true
SEED_USER_ID=
```


---

## Estado del proyecto

- CRUD completo de recetas
- Autenticacion con JWT
- Conexión a MongoDB
- Patron MVC aplicado
- Codigo validado con ESLint y Prettier
- Backend listo para despliegue

---

## Autor

Aleks Dankov Hristov

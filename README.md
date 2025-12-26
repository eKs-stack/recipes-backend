# Recipes API

API REST para gestionar recetas desarrollada con Node.js, Express y MongoDB Atlas.

Este backend forma parte de un proyecto final Fullstack. Expone endpoints REST que serán consumidos por un frontend en React.

---

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- ESLint
- Prettier

---

## Instalación y ejecución

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

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
PORT=3000
MONGO_URI=tu_uri_de_mongodb_atlas
```

Ejemplo:

```env
PORT=3000
MONGO_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/recipes
```

### 4. Ejecutar el servidor

Modo desarrollo:

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

El servidor se ejecuta en:

```text
http://localhost:3000
```

---

## Endpoints de la API

### Obtener todas las recetas

```text
GET /api/recipes
```

### Obtener una receta por ID

```text
GET /api/recipes/:id
```

### Crear una receta

```text
POST /api/recipes
```

Body (JSON):

```json
{
  "title": "Pasta simple",
  "description": "Una receta rápida",
  "ingredients": ["pasta", "sal", "aceite"],
  "steps": "Hervir la pasta y servir",
  "prepTime": 15
}
```

### Actualizar una receta

```text
PUT /api/recipes/:id
```

Body de ejemplo:

```json
{
  "title": "Pasta mejorada",
  "prepTime": 20
}
```

### Eliminar una receta

```text
DELETE /api/recipes/:id
```

---

## Scripts disponibles

```bash
npm run dev      # Servidor con nodemon
npm start        # Servidor en producción
npm run lint     # Ejecuta ESLint
npm run format   # Formatea el código con Prettier
```

---

## Documentación con Postman

El repositorio incluye una colección de Postman con todos los endpoints documentados y probados.

Archivo incluido:

```text
postman_collection.json
```

---

## Estado del proyecto

* CRUD completo de recetas
* Conexión a MongoDB Atlas
* Patrón MVC aplicado
* API documentada con Postman
* Código validado con ESLint y Prettier
* Backend listo para despliegue en Render

---

## Autor

Aleks Dankov Hristov

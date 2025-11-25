# Tasks Backend - API de Gestión de Tareas

Backend para sistema de gestión de tareas con Express.js y PostgreSQL.

## Características

- ✅ CRUD completo de tareas
- 📸 Subida de imágenes con UUID
- 🔍 Búsqueda por texto, prioridad y fecha
- 🐳 Dockerizado con Docker Compose
- 📊 PostgreSQL como base de datos

## Estructura del Proyecto

```
sv-backend/
├── src/
│   ├── config/
│   │   └── database.js      # Configuración de PostgreSQL
│   ├── database/
│   │   └── init.sql         # Script de inicialización de BD
│   ├── middleware/
│   │   └── upload.js        # Configuración de Multer
│   ├── routes/
│   │   └── tasks.js         # Rutas de tareas
│   └── index.js             # Punto de entrada
├── public/
│   └── images/              # Imágenes subidas
├── .env                     # Variables de entorno
├── package.json
├── Dockerfile
└── docker-compose.yml
```

## Requisitos

- Node.js 20+
- Docker y Docker Compose
- PostgreSQL 16 (si se ejecuta sin Docker)

## Instalación

### Con Docker (Recomendado)

1. Iniciar servicios:

```bash
docker-compose up -d
```

2. Verificar que los servicios estén corriendo:

```bash
docker-compose ps
```

3. Ver logs:

```bash
docker-compose logs -f backend
```

### Sin Docker

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno en `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=mydb
PORT=3000
```

3. Inicializar la base de datos ejecutando `src/database/init.sql`

4. Iniciar servidor:

```bash
npm start
```

Para desarrollo con auto-reload:

```bash
npm run dev
```

## API Endpoints

### GET /tasks

Obtener todas las tareas (con filtros opcionales)

**Query Parameters:**

- `search`: Búsqueda por texto en descripción
- `priority`: Filtrar por prioridad (baja, media, alta)
- `dateFrom`: Fecha desde (formato ISO)
- `dateTo`: Fecha hasta (formato ISO)

**Ejemplo:**

```bash
curl "http://localhost:3000/tasks?priority=alta&search=proyecto"
```

### GET /tasks/:id

Obtener una tarea específica

**Ejemplo:**

```bash
curl http://localhost:3000/tasks/1
```

### POST /tasks

Crear una nueva tarea

**Body (multipart/form-data):**

- `description` (required): Descripción de la tarea
- `deadline` (required): Fecha límite (formato ISO)
- `priority` (optional): Prioridad (baja, media, alta) - default: media
- `image` (optional): Archivo de imagen

**Ejemplo:**

```bash
curl -X POST http://localhost:3000/tasks \
  -F "description=Completar proyecto" \
  -F "deadline=2025-12-31T23:59:59" \
  -F "priority=alta" \
  -F "image=@/path/to/image.jpg"
```

### PUT /tasks/:id

Actualizar una tarea

**Body (multipart/form-data):**

- `description` (optional): Nueva descripción
- `deadline` (optional): Nueva fecha límite
- `priority` (optional): Nueva prioridad
- `completed` (optional): Estado de completado (true/false)
- `image` (optional): Nueva imagen

**Ejemplo:**

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -F "completed=true" \
  -F "priority=baja"
```

### DELETE /tasks/:id

Eliminar una tarea (y su imagen asociada)

**Ejemplo:**

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

## Modelo de Datos

### Tabla: tasks

| Campo       | Tipo         | Descripción                   |
| ----------- | ------------ | ----------------------------- |
| id          | SERIAL       | Identificador único (PK)      |
| description | TEXT         | Descripción de la tarea       |
| created_at  | TIMESTAMP    | Fecha de creación             |
| deadline    | TIMESTAMP    | Fecha límite                  |
| priority    | VARCHAR(20)  | Prioridad (baja, media, alta) |
| completed   | BOOLEAN      | Estado de completado          |
| image_path  | VARCHAR(255) | Ruta de la imagen             |

## Respuestas de la API

### Éxito

```json
{
  "success": true,
  "data": {
    /* objeto o array de tareas */
  },
  "message": "Operación exitosa"
}
```

### Error

```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles técnicos"
}
```

## Gestión de Imágenes

- Las imágenes se guardan en `public/images/`
- Nombre: UUID + extensión original
- Tamaño máximo: 5MB
- Formatos permitidos: jpeg, jpg, png, gif, webp
- Al eliminar/actualizar una tarea, la imagen anterior se elimina automáticamente

## Scripts Disponibles

- `npm start`: Iniciar servidor en producción
- `npm run dev`: Iniciar servidor en desarrollo (con nodemon)

## Variables de Entorno

| Variable    | Descripción                | Default   |
| ----------- | -------------------------- | --------- |
| DB_HOST     | Host de PostgreSQL         | localhost |
| DB_PORT     | Puerto de PostgreSQL       | 5432      |
| DB_USER     | Usuario de PostgreSQL      | postgres  |
| DB_PASSWORD | Contraseña de PostgreSQL   | postgres  |
| DB_NAME     | Nombre de la base de datos | mydb      |
| PORT        | Puerto del servidor        | 3000      |

## Health Check

Verificar el estado del servidor y la base de datos:

```bash
curl http://localhost:3000/health
```

## Detener Servicios

```bash
docker-compose down
```

Para eliminar también los volúmenes (datos de la BD):

```bash
docker-compose down -v
```

## Licencia

ISC

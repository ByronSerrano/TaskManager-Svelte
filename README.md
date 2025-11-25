# Task Manager - Sistema de Gestión de Tareas

**Autor:** Byron Serrano

Sistema completo de gestión de tareas desarrollado con tecnologías web modernas. Este proyecto permite crear, editar, eliminar y organizar tareas de manera eficiente con una interfaz intuitiva y moderna.

## 📋 Descripción

Task Manager es una aplicación web full-stack que facilita la organización y seguimiento de tareas personales o de equipo. El sistema cuenta con características como priorización de tareas, fechas límite, adjuntos de imágenes, filtros de búsqueda y recordatorios visuales.

## 🏗️ Arquitectura del Proyecto

El proyecto está dividido en dos partes principales:

### 1. Frontend - Svelte (`svealte-front/`)

Interfaz de usuario desarrollada con **SvelteKit** y **Tailwind CSS** en modo oscuro estilo Vercel.

**Características principales:**

- ✨ Interfaz moderna y responsiva
- 🎨 Diseño en modo oscuro
- 📊 Estadísticas en tiempo real
- 🔍 Sistema de búsqueda y filtros avanzados
- 📸 Subida y visualización de imágenes
- 🎯 Indicadores visuales de estado y prioridad

### 2. Backend - Express.js (`sv-backend/`)

API RESTful desarrollada con **Node.js** y **Express.js**.

**Características principales:**

- 🔌 API RESTful completa
- 📦 Gestión de archivos con Multer
- 🐳 Dockerizado con Docker Compose
- 🗄️ Base de datos PostgreSQL
- ✅ Validación de datos

## 🗄️ Base de Datos

El sistema utiliza **PostgreSQL 16** como motor de base de datos.

El script SQL para la creación de la tabla `tasks` se encuentra en:

```
sv-backend/src/database/init.sql
```

Este script incluye:

- Definición de la tabla `tasks` con todos los campos necesarios
- Índices para optimizar las consultas
- Constraints para integridad de datos

## 🚀 Inicio Rápido

Cada parte del proyecto (frontend y backend) tiene su propio README con instrucciones detalladas:

- **Backend:** [`sv-backend/README.md`](sv-backend/README.md)
- **Frontend:** [`svealte-front/README.md`](svealte-front/README.md)

### Pasos generales:

1. **Iniciar el Backend:**

   ```bash
   cd sv-backend
   npm install
   docker-compose up -d
   npm run dev
   ```

2. **Iniciar el Frontend:**

   ```bash
   cd svealte-front
   pnpm install
   pnpm dev
   ```

3. **Acceder a la aplicación:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📁 Estructura del Proyecto

```
.
├── sv-backend/              # Backend con Express.js
│   ├── src/
│   │   ├── config/         # Configuración de BD
│   │   ├── database/       # Scripts SQL
│   │   ├── middleware/     # Middlewares (upload, etc.)
│   │   ├── routes/         # Rutas de la API
│   │   └── index.js        # Punto de entrada
│   ├── public/images/      # Imágenes subidas
│   ├── Dockerfile
│   ├── docker-compose.yml  # PostgreSQL + Backend
│   └── README.md          # Documentación del backend
│
└── svealte-front/          # Frontend con Svelte
    ├── src/
    │   ├── lib/
    │   │   ├── components/ # Componentes Svelte
    │   │   ├── api.js     # Cliente API
    │   │   └── utils.js   # Utilidades
    │   └── routes/        # Páginas de la aplicación
    └── README.md          # Documentación del frontend
```

## 🛠️ Tecnologías Utilizadas

### Frontend

- **SvelteKit 2.x** - Framework de aplicación
- **Svelte 5.x** - Librería UI con Runes
- **Tailwind CSS 4.x** - Estilos y diseño
- **Vite 7.x** - Build tool

### Backend

- **Node.js 20** - Runtime de JavaScript
- **Express.js 4.x** - Framework web
- **PostgreSQL 16** - Base de datos
- **Multer** - Manejo de archivos
- **Docker** - Contenedorización

## 📊 Funcionalidades

### Gestión de Tareas

- ✅ Crear tareas con descripción detallada
- ✅ Establecer fechas límite
- ✅ Asignar niveles de prioridad (Baja, Media, Alta)
- ✅ Adjuntar imágenes
- ✅ Marcar tareas como completadas
- ✅ Editar tareas existentes
- ✅ Eliminar tareas

### Búsqueda y Filtros

- 🔍 Búsqueda por texto en descripción
- 🎯 Filtro por prioridad
- 📅 Filtro por rango de fechas

### Indicadores Visuales

- 🔴 Tareas atrasadas (resaltadas en rojo)
- 🟢 Tareas completadas (marcadas en verde)
- ⏰ Contador de días restantes
- 📊 Estadísticas en tiempo real

## 🐳 Docker

El proyecto incluye configuración de Docker Compose para facilitar el despliegue:

```bash
cd sv-backend
docker-compose up -d
```

Esto levantará:

- Contenedor de PostgreSQL en el puerto 5432
- Contenedor del backend en el puerto 3000

## 📝 API Endpoints

- `GET /tasks` - Obtener todas las tareas (con filtros opcionales)
- `GET /tasks/:id` - Obtener una tarea específica
- `POST /tasks` - Crear una nueva tarea
- `PUT /tasks/:id` - Actualizar una tarea
- `DELETE /tasks/:id` - Eliminar una tarea

Ver documentación completa en [`sv-backend/README.md`](sv-backend/README.md)

## 👨‍💻 Autor

**Byron Serrano**

## 📄 Licencia

ISC

---

Para más detalles sobre cómo instalar y configurar cada parte del sistema, consulta los archivos README en las carpetas `sv-backend/` y `svealte-front/`.

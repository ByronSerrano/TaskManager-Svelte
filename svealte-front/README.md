# Gestor de Tareas - Frontend (Svelte)

Frontend del sistema de gestión de tareas construido con SvelteKit y Tailwind CSS.

## Características

- ✅ **CRUD completo de tareas** - Crear, leer, actualizar y eliminar
- 🔍 **Búsqueda y filtros** - Por texto, prioridad y rango de fechas
- 📸 **Subida de imágenes** - Adjuntar imágenes a las tareas
- 🎨 **Indicadores visuales**
  - Tareas atrasadas en rojo
  - Tareas completadas en verde
  - Badges de prioridad con colores
  - Contador de días restantes
- 📊 **Estadísticas en tiempo real** - Total, completadas, pendientes y atrasadas
- 🎯 **Interfaz moderna** - Diseño responsivo con Tailwind CSS

## Estructura del Proyecto

```
svealte-front/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── TaskCard.svelte      # Tarjeta de tarea individual
│   │   │   ├── TaskForm.svelte      # Formulario crear/editar
│   │   │   └── TaskFilters.svelte   # Componente de filtros
│   │   ├── api.js                   # Cliente API
│   │   └── utils.js                 # Utilidades y helpers
│   ├── routes/
│   │   ├── +layout.svelte           # Layout principal
│   │   ├── +page.svelte             # Página principal
│   │   └── layout.css               # Estilos globales
│   └── app.html                     # HTML base
├── package.json
└── vite.config.js
```

## Requisitos

- Node.js 18+
- pnpm (recomendado) o npm
- Backend ejecutándose en `http://localhost:3000`

## Instalación

1. Instalar dependencias:

```bash
pnpm install
```

## Desarrollo

Iniciar servidor de desarrollo:

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

## Construcción

Para crear una versión de producción:

```bash
pnpm build
```

Vista previa de la versión de producción:

```bash
pnpm preview
```

## Componentes Principales

### TaskCard

Muestra una tarea individual con:

- Checkbox para marcar como completada
- Descripción de la tarea
- Badge de prioridad (baja/media/alta)
- Fecha límite y días restantes
- Imagen adjunta (si existe)
- Botones de editar y eliminar
- Indicadores visuales según estado

### TaskForm

Modal para crear/editar tareas:

- Campo de descripción (textarea)
- Selector de fecha y hora límite
- Selector de prioridad
- Input de archivo para imagen
- Vista previa de imagen

### TaskFilters

Componente de búsqueda y filtros:

- Buscador por texto
- Filtro por prioridad
- Filtro por rango de fechas
- Indicador de filtros activos
- Botón de limpiar filtros

## API Client

Funciones disponibles en `src/lib/api.js`:

```javascript
// Obtener tareas con filtros
getTasks({ search, priority, dateFrom, dateTo });

// Crear tarea
createTask({ description, deadline, priority, image });

// Actualizar tarea
updateTask(id, { description, deadline, priority, completed, image });

// Eliminar tarea
deleteTask(id);

// Obtener URL de imagen
getImageUrl(imagePath);
```

## Integración con Backend

El frontend se comunica con el backend en `http://localhost:3000`:

- `GET /tasks?search=...&priority=...&dateFrom=...&dateTo=...`
- `POST /tasks` (multipart/form-data)
- `PUT /tasks/:id` (multipart/form-data)
- `DELETE /tasks/:id`

Las imágenes se sirven desde `http://localhost:3000/images/`

## Scripts Disponibles

- `pnpm dev` - Iniciar servidor de desarrollo
- `pnpm build` - Crear versión de producción
- `pnpm preview` - Vista previa de producción

## Tecnologías

- **SvelteKit** 2.x - Framework
- **Svelte** 5.x - Librería UI (con runes)
- **Tailwind CSS** 4.x - Estilos
- **Vite** 7.x - Build tool

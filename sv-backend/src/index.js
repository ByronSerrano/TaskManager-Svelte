const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const tasksRoutes = require("./routes/tasks");
const pool = require("./config/database");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes)
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// Rutas
app.use("/tasks", tasksRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API de Gestión de Tareas",
    version: "1.0.0",
    endpoints: {
      getTasks: "GET /tasks",
      getTask: "GET /tasks/:id",
      createTask: "POST /tasks",
      updateTask: "PUT /tasks/:id",
      deleteTask: "DELETE /tasks/:id",
    },
  });
});

// Ruta de health check
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT NOW()");
    res.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      database: "disconnected",
      error: error.message,
    });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});

module.exports = app;

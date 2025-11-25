const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const upload = require("../middleware/upload");
const fs = require("fs");
const path = require("path");

// GET /tasks - Obtener todas las tareas con filtros opcionales
router.get("/", async (req, res) => {
  try {
    const { search, priority, dateFrom, dateTo } = req.query;

    let query = "SELECT * FROM tasks WHERE 1=1";
    const params = [];
    let paramCount = 1;

    // Filtro por búsqueda de texto
    if (search) {
      query += ` AND description ILIKE $${paramCount}`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Filtro por prioridad
    if (priority) {
      query += ` AND priority = $${paramCount}`;
      params.push(priority);
      paramCount++;
    }

    // Filtro por fecha desde
    if (dateFrom) {
      query += ` AND deadline >= $${paramCount}`;
      params.push(dateFrom);
      paramCount++;
    }

    // Filtro por fecha hasta
    if (dateTo) {
      query += ` AND deadline <= $${paramCount}`;
      params.push(dateTo);
      paramCount++;
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las tareas",
      error: error.message,
    });
  }
});

// GET /tasks/:id - Obtener una tarea específica
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error al obtener tarea:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener la tarea",
      error: error.message,
    });
  }
});

// POST /tasks - Crear una nueva tarea
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { description, deadline, priority = "media" } = req.body;

    if (!description || !deadline) {
      // Si hay un archivo subido, eliminarlo
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "La descripción y la fecha límite son obligatorias",
      });
    }

    const imagePath = req.file ? `/images/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO tasks (description, deadline, priority, image_path) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [description, deadline, priority, imagePath]
    );

    res.status(201).json({
      success: true,
      message: "Tarea creada exitosamente",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error al crear tarea:", error);
    // Si hay un archivo subido, eliminarlo en caso de error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: "Error al crear la tarea",
      error: error.message,
    });
  }
});

// PUT /tasks/:id - Actualizar una tarea
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { description, deadline, priority, completed } = req.body;

    // Verificar que la tarea existe
    const taskResult = await pool.query("SELECT * FROM tasks WHERE id = $1", [
      id,
    ]);
    if (taskResult.rows.length === 0) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada",
      });
    }

    const currentTask = taskResult.rows[0];
    let imagePath = currentTask.image_path;

    // Si se subió una nueva imagen
    if (req.file) {
      // Eliminar imagen anterior si existe
      if (currentTask.image_path) {
        const oldImagePath = path.join(
          __dirname,
          "../../public",
          currentTask.image_path
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagePath = `/images/${req.file.filename}`;
    }

    // Construir query dinámica
    const updates = [];
    const params = [];
    let paramCount = 1;

    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      params.push(description);
      paramCount++;
    }

    if (deadline !== undefined) {
      updates.push(`deadline = $${paramCount}`);
      params.push(deadline);
      paramCount++;
    }

    if (priority !== undefined) {
      updates.push(`priority = $${paramCount}`);
      params.push(priority);
      paramCount++;
    }

    if (completed !== undefined) {
      updates.push(`completed = $${paramCount}`);
      params.push(completed === "true" || completed === true);
      paramCount++;
    }

    if (req.file) {
      updates.push(`image_path = $${paramCount}`);
      params.push(imagePath);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se proporcionaron campos para actualizar",
      });
    }

    params.push(id);
    const query = `UPDATE tasks SET ${updates.join(
      ", "
    )} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      message: "Tarea actualizada exitosamente",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: "Error al actualizar la tarea",
      error: error.message,
    });
  }
});

// DELETE /tasks/:id - Eliminar una tarea
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener la tarea para eliminar su imagen
    const taskResult = await pool.query("SELECT * FROM tasks WHERE id = $1", [
      id,
    ]);

    if (taskResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada",
      });
    }

    const task = taskResult.rows[0];

    // Eliminar imagen asociada si existe
    if (task.image_path) {
      const imagePath = path.join(__dirname, "../../public", task.image_path);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Eliminar tarea de la base de datos
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);

    res.json({
      success: true,
      message: "Tarea eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar la tarea",
      error: error.message,
    });
  }
});

module.exports = router;

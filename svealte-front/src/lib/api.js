const API_URL = "http://localhost:3000";

/**
 * Obtener todas las tareas con filtros opcionales
 */
export async function getTasks(filters = {}) {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.priority) params.append("priority", filters.priority);
  if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.append("dateTo", filters.dateTo);

  const queryString = params.toString();
  const url = `${API_URL}/tasks${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Error al obtener las tareas");
  }

  const data = await response.json();
  return data.data || [];
}

/**
 * Crear una nueva tarea
 */
export async function createTask(taskData) {
  const formData = new FormData();

  formData.append("description", taskData.description);
  formData.append("deadline", taskData.deadline);
  formData.append("priority", taskData.priority || "media");

  if (taskData.image) {
    formData.append("image", taskData.image);
  }

  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al crear la tarea");
  }

  const data = await response.json();
  return data.data;
}

/**
 * Actualizar una tarea
 */
export async function updateTask(id, taskData) {
  const formData = new FormData();

  if (taskData.description !== undefined) {
    formData.append("description", taskData.description);
  }
  if (taskData.deadline !== undefined) {
    formData.append("deadline", taskData.deadline);
  }
  if (taskData.priority !== undefined) {
    formData.append("priority", taskData.priority);
  }
  if (taskData.completed !== undefined) {
    formData.append("completed", taskData.completed.toString());
  }
  if (taskData.image) {
    formData.append("image", taskData.image);
  }

  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al actualizar la tarea");
  }

  const data = await response.json();
  return data.data;
}

/**
 * Eliminar una tarea
 */
export async function deleteTask(id) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al eliminar la tarea");
  }

  return true;
}

/**
 * Obtener URL completa de imagen
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return null;
  return `${API_URL}${imagePath}`;
}

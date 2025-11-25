/**
 * Formatear fecha a string legible
 */
export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formatear fecha para input datetime-local
 */
export function formatDateForInput(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Verificar si una tarea está atrasada
 */
export function isOverdue(deadline) {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

/**
 * Calcular días restantes
 */
export function getDaysRemaining(deadline) {
  if (!deadline) return null;
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Obtener color según prioridad
 */
export function getPriorityColor(priority) {
  const colors = {
    baja: "bg-green-950 text-green-400 border-green-900",
    media: "bg-yellow-950 text-yellow-400 border-yellow-900",
    alta: "bg-red-950 text-red-400 border-red-900",
  };
  return colors[priority] || colors.media;
}

/**
 * Obtener texto de días restantes
 */
export function getDaysRemainingText(deadline) {
  const days = getDaysRemaining(deadline);
  if (days === null) return "";

  if (days < 0) {
    return `Atrasada ${Math.abs(days)} día${Math.abs(days) !== 1 ? "s" : ""}`;
  } else if (days === 0) {
    return "Vence hoy";
  } else if (days === 1) {
    return "Vence mañana";
  } else {
    return `${days} días restantes`;
  }
}

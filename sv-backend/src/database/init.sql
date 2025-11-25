-- Crear tabla de tareas
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deadline TIMESTAMP NOT NULL,
  priority VARCHAR(20) CHECK (priority IN ('baja', 'media', 'alta')) DEFAULT 'media',
  completed BOOLEAN DEFAULT FALSE,
  image_path VARCHAR(255)
);

-- Índices para mejorar búsquedas
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_description ON tasks USING gin(to_tsvector('spanish', description));

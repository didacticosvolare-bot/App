-- Clientes table for loyalty and points system
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  puntos INTEGER DEFAULT 0,
  compras_totales DECIMAL(10, 2) DEFAULT 0,
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_clientes_nombre ON clientes(nombre);
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_clientes_estado ON clientes(estado);

-- Insert sample clients
INSERT INTO clientes (nombre, telefono, email, puntos, compras_totales, estado) VALUES
  ('Juan García López', '5551234567', 'juan@example.com', 1500, 250.00, 'activo'),
  ('María González Rodríguez', '5552345678', 'maria@example.com', 3200, 650.00, 'activo'),
  ('Carlos Sánchez Martínez', '5553456789', 'carlos@example.com', 800, 125.00, 'activo'),
  ('Ana Hernández García', '5554567890', 'ana@example.com', 5100, 1200.00, 'activo'),
  ('Roberto López Pérez', '5555678901', 'roberto@example.com', 2300, 450.00, 'activo'),
  ('Laura Flores Díaz', '5556789012', 'laura@example.com', 950, 175.00, 'activo'),
  ('Miguel Ramírez Torres', '5557890123', 'miguel@example.com', 1200, 200.00, 'activo'),
  ('Sofía Castro Mendoza', '5558901234', 'sofia@example.com', 4100, 850.00, 'activo'),
  ('Fernando Gutiérrez Silva', '5559012345', 'fernando@example.com', 600, 100.00, 'inactivo'),
  ('Alejandra Moreno Ruiz', '5550123456', 'alejandra@example.com', 2800, 550.00, 'activo');

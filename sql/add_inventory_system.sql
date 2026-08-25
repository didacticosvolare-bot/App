-- Add inventory management to ingredientes
ALTER TABLE ingredientes
ADD COLUMN stock_actual INTEGER DEFAULT 0,
ADD COLUMN stock_minimo INTEGER DEFAULT 10,
ADD COLUMN unidad_medida VARCHAR(50) DEFAULT 'Kilogramo',
ADD COLUMN precio_costo DECIMAL(10, 2) DEFAULT 0;

-- Create bitacora_inventario for tracking stock movements
CREATE TABLE bitacora_inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingrediente_id UUID NOT NULL REFERENCES ingredientes(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL, -- 'entrada', 'salida', 'ajuste'
  cantidad INTEGER NOT NULL,
  motivo VARCHAR(255),
  realizado_por VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bitacora_inventario_ingrediente ON bitacora_inventario(ingrediente_id);
CREATE INDEX idx_bitacora_inventario_tipo ON bitacora_inventario(tipo);

-- Create view for low stock alerts
CREATE OR REPLACE VIEW vw_ingredientes_bajos AS
SELECT
  id,
  nombre_ingrediente,
  categoria,
  stock_actual,
  stock_minimo,
  unidad_medida,
  (stock_minimo - stock_actual) as unidades_faltantes
FROM ingredientes
WHERE stock_actual <= stock_minimo AND stock_actual > 0
ORDER BY unidades_faltantes DESC;

-- Create view for out of stock
CREATE OR REPLACE VIEW vw_ingredientes_agotados AS
SELECT
  id,
  nombre_ingrediente,
  categoria,
  stock_actual,
  stock_minimo,
  unidad_medida
FROM ingredientes
WHERE stock_actual <= 0
ORDER BY nombre_ingrediente;

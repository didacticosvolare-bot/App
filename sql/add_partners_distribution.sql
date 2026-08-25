-- Create tabla para manejar distribución de ganancias entre socios
CREATE TABLE distribucion_ganancias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mes VARCHAR(7) NOT NULL, -- formato: 2024-01
  daniela_ganancia DECIMAL(12, 2) DEFAULT 0,
  carlos_ganancia DECIMAL(12, 2) DEFAULT 0,
  erick_ganancia DECIMAL(12, 2) DEFAULT 0,
  total_ganancia DECIMAL(12, 2) DEFAULT 0,
  total_ventas DECIMAL(12, 2) DEFAULT 0,
  total_costos DECIMAL(12, 2) DEFAULT 0,
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(mes)
);

CREATE INDEX idx_distribucion_mes ON distribucion_ganancias(mes);

-- Create tabla para auditar transacciones por empleado
ALTER TABLE nómina
ADD COLUMN porcentaje_ganancia DECIMAL(5, 2) DEFAULT 33.33;

-- Create view for monthly distribution
CREATE OR REPLACE VIEW vw_distribucion_mensual AS
SELECT
  mes,
  total_ventas,
  total_costos,
  total_ganancia,
  daniela_ganancia,
  carlos_ganancia,
  erick_ganancia,
  ROUND(daniela_ganancia::numeric, 2) as daniela_pago,
  ROUND(carlos_ganancia::numeric, 2) as carlos_pago,
  ROUND(erick_ganancia::numeric, 2) as erick_pago,
  created_at
FROM distribucion_ganancias
ORDER BY mes DESC;

-- Rewards and coupons system for customer engagement
CREATE TABLE cupones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(20) UNIQUE NOT NULL,
  descripcion VARCHAR(255),
  tipo VARCHAR(20), -- 'porcentaje', 'cantidad_fija'
  valor DECIMAL(10, 2) NOT NULL,
  minimo_compra DECIMAL(10, 2) DEFAULT 0,
  usos_maximos INTEGER,
  usos_actuales INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de canje de puntos
CREATE TABLE canje_puntos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  puntos_canjeados INTEGER NOT NULL,
  descuento_obtenido DECIMAL(10, 2) NOT NULL,
  fecha_canje TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de cumpleaños para promociones
CREATE TABLE promociones_especiales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  tipo VARCHAR(50), -- 'cumpleaños', 'aniversario', 'personalizado'
  descuento_porcentaje DECIMAL(5, 2),
  monto_fijo DECIMAL(10, 2),
  valido_hasta DATE,
  usado BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cupones_codigo ON cupones(codigo);
CREATE INDEX idx_cupones_activo ON cupones(activo);
CREATE INDEX idx_canje_cliente ON canje_puntos(cliente_id);
CREATE INDEX idx_promociones_cliente ON promociones_especiales(cliente_id);

-- Insert sample coupons
INSERT INTO cupones (codigo, descripcion, tipo, valor, minimo_compra, usos_maximos, activo, fecha_inicio, fecha_fin) VALUES
  ('BIENVENIDA10', 'Descuento de bienvenida', 'porcentaje', 10, 50, 100, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days'),
  ('VERANO2024', 'Promoción de verano', 'porcentaje', 15, 100, 50, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days'),
  ('FIESTA50', 'Cupón especial', 'cantidad_fija', 50, 200, 25, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days');

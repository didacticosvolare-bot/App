-- Add cliente_id column to bitacora_ventas_detalle to link sales to registered clients
ALTER TABLE bitacora_ventas_detalle
ADD COLUMN cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL;

-- Create index for faster queries
CREATE INDEX idx_bitacora_ventas_cliente_id ON bitacora_ventas_detalle(cliente_id);

-- Create a view for sales with client details
CREATE OR REPLACE VIEW vw_ventas_con_clientes AS
SELECT
  bv.id,
  bv.platillo_id,
  bv.cantidad,
  bv.precio_unitario,
  bv.cliente,
  bv.cliente_id,
  c.nombre as cliente_nombre,
  c.puntos,
  p.nombre_platillo,
  bv.created_at
FROM bitacora_ventas_detalle bv
LEFT JOIN clientes c ON bv.cliente_id = c.id
LEFT JOIN platillos p ON bv.platillo_id = p.id
ORDER BY bv.created_at DESC;

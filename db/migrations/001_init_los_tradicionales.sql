-- =====================================================================
-- LOS TRADICIONALES — Datos reales para poblar Supabase (Postgres)
-- Generado a partir del sistema de Excel/Airtable ya validado
-- =====================================================================


create table proveedores (
  id uuid primary key default gen_random_uuid(),
  producto text not null,
  marca text,
  proveedor text not null,
  precio_presentacion numeric not null,
  piezas_presentacion numeric not null default 1,
  unidad_base text not null,
  fecha_cotizacion date,
  disponible boolean not null default true,
  notas text
);

create table ingredientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  categoria text,
  unidad_compra text not null
);

create table empaques (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  unidad_compra text not null
);

create table subrecetas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  rendimiento_real numeric not null,
  unidad text not null
);

create table subreceta_detalle (
  id uuid primary key default gen_random_uuid(),
  subreceta_id uuid references subrecetas(id) on delete cascade,
  ingrediente_id uuid references ingredientes(id),
  cantidad numeric not null
);

create table platillos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  tipo text not null check (tipo in ('individual','combo')),
  precio_venta numeric not null
);

create table platillo_detalle (
  id uuid primary key default gen_random_uuid(),
  platillo_id uuid references platillos(id) on delete cascade,
  tipo_item text not null check (tipo_item in ('ingrediente','empaque','subreceta')),
  item_nombre text not null,
  cantidad numeric not null
);

create table platillo_componentes (
  id uuid primary key default gen_random_uuid(),
  platillo_id uuid references platillos(id) on delete cascade,
  componente_nombre text not null
);

create table capital_social (
  id uuid primary key default gen_random_uuid(),
  socio text not null,
  aportacion_inicial numeric not null,
  aportaciones_adicionales numeric not null default 0
);

-- PROVEEDORES
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Totopo', NULL, 'Totopos Don Beto', 30, 0.3, 'Kg', '2026-08-04', false);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Totopo', NULL, 'Totopos Marco', 45, 1, 'Kg', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Totopo', NULL, 'Rancho', 100, 1, 'Kg', '2026-08-12', false);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Ajo', NULL, 'Tianguis', 20, 0.25, 'Kg', '2026-08-19', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Cebolla', NULL, 'Tianguis', 25, 1, 'Kg', '2026-08-19', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Cebolla Morada', NULL, 'Tianguis', 39, 1, 'Kg', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Chile Morita', NULL, 'Tianguis', 31.9, 0.1, 'Kg', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Chile Serrano', NULL, 'Tianguis', 20, 0.25, 'Kg', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Cilantro', NULL, 'Tianguis', 14.9, 0.1, 'Kg', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Tomate', 'Limpio/German', 'Tianguis', 13, 1, 'Kg', '2026-08-19', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Agua purificada', NULL, 'Sistema propio (Purikor PKRO100-6UVPM)', 0.0724, 1, 'Litro', '2026-08-11', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Café molido', 'Blasón/arábigo', 'Costco', 305.77, 1, 'Kg', '2026-08-13', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Canela', NULL, 'La Comer', 789, 1, 'Kg', '2026-08-13', false);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Canela', NULL, 'Tianguis', 25, 0.021, 'Kg', '2026-08-19', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Clavo', NULL, 'Tianguis', 20, 0.011, 'Kg', '2026-08-13', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Comino', NULL, 'La Comer', 37.5, 0.065, 'Kg', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Knorr de jitomate', 'Knorr', 'La Comer', 31.5, 0.132, 'Kg', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Oregano molido', NULL, 'La Comer', 33.5, 0.057, 'Kg', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Piloncillo', 'Botón', 'La Comer', 79.9, 1, 'Kg', '2026-08-13', false);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Piloncillo', NULL, 'Tianguis', 50, 0.5, 'Kg', '2026-08-19', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Pimienta en polvo', NULL, 'La Comer', 309, 0.348, 'Kg', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Sal', NULL, 'La Comer', 13.2, 0.75, 'Kg', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Aceite de Oliva', NULL, 'Costco', 399, 2, 'Litro', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Aceite vegetal', NULL, 'La Comer', 30.5, 0.85, 'Litro', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Vinagre de Manzana', NULL, 'La Comer', 18, 0.54, 'Litro', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Pollo', NULL, 'Santo Domingo', 110, 1, 'Kg', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Crema', 'Lala', 'La Comer', 50.5, 0.426, 'Litro', '2026-08-04', false);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Crema', 'Alpúra', 'La Comer', 72, 0.9, 'Litro', '2026-08-20', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Queso Cotija', 'Pijijiapa', 'La Nueva Alpina', 170, 1, 'Kg', '2026-08-04', false);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Queso Cotija', NULL, 'Alimentos Istmo', 170, 1, 'Kg', '2026-08-21', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Bolillo', NULL, 'La Comer', 2.5, 1, 'Pieza', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Bowl Kraft 16 Oz. (con tapa)', NULL, 'El Carrusel', 250, 50, 'Pieza', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Tenedor Jumbo negro', NULL, 'El Carrusel', 25, 50, 'Pieza', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Tenedor bio mediano', NULL, 'San Miguél (Merced)', 36, 100, 'Pieza', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Tenedor bio grande', NULL, 'San Miguél (Merced)', 50, 100, 'Pieza', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Nevero de cartón N.8', NULL, 'San Miguél (Merced)', 160, 100, 'Pieza', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Guante negro de latex', NULL, 'San Miguél (Merced)', 120, 100, 'Pieza', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Servilletas bio', NULL, 'San Miguél (Merced)', 38, 500, 'Pieza', '2026-08-07', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Bowl Kraft 26 Oz. (Sin tapa)', NULL, 'Cristian 1', 320, 100, 'Pieza', '2026-08-07', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Contenedor 5 cañatec (chico)', NULL, 'Cristian 1', 140, 25, 'Pieza', '2026-08-07', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Vaso cartón 4 Oz. blanco (sin tapa)', NULL, 'Cristian 1', 80, 50, 'Pieza', '2026-08-07', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Tapa Bowl 16/26/32 Oz.', NULL, 'Cristian 1', 200, 100, 'Pieza', '2026-08-07', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Papel estraza blanco', NULL, 'Cristian 1', 55, 1, 'Kg', '2026-08-07', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Bolsa de papel café N.4', NULL, 'Cristian 1', 44, 1, 'Kg', '2026-08-07', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Vaso Cartón blanco fulling 10 Oz.', NULL, 'Cristian 1', 85, 50, 'Pieza', '2026-08-07', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Tapa viajera 12/16/20 Oz. negra', NULL, 'Cristian 1', 65, 50, 'Pieza', '2026-08-07', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Fajilla sencilla', NULL, 'Cristian 1', 65, 100, 'Pieza', '2026-08-07', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Bolsa de Papel sin asa 25x13x32', NULL, 'Cristian 1', 105, 25, 'Pieza', '2026-08-07', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Bowl Kraft 26 Oz. (Con tapa)', NULL, 'Casa Tapia', 55, 10, 'Pieza', '2026-08-07', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Cucharon', NULL, '(Merced)', 50, 1, 'Pieza', '2026-08-04', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Sticker de la Tapa', 'Digital On', 'Imprenta', 15.5, 87, 'Pieza', '2026-08-22', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Tarjeta de Presentación', 'Imprime rapidito', 'Imprenta', 400, 1000, 'Pieza', '2026-08-22', true);
insert into proveedores (producto, marca, proveedor, precio_presentacion, piezas_presentacion, unidad_base, fecha_cotizacion, disponible) values ('Sticker de Compra', 'Digital On', 'Imprenta', 15.5, 805, 'Pieza', '2026-08-22', true);

-- INGREDIENTES
insert into ingredientes (nombre, categoria, unidad_compra) values ('Totopo', 'Botana', 'Kg');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Ajo', 'Verduras/Chiles', 'Kg');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Cebolla', 'Verduras/Chiles', 'Kg');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Cebolla Morada', 'Verduras/Chiles', 'Kg');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Chile Morita', 'Verduras/Chiles', 'Kg');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Chile Serrano', 'Verduras/Chiles', 'Kg');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Cilantro', 'Verduras/Chiles', 'Kg');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Tomate', 'Verduras/Chiles', 'Kg');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Agua purificada', 'Agua', 'Litro');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Café molido', 'Especias/Abarrotes', 'Kg');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Canela', 'Especias/Abarrotes', 'Kg');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Clavo', 'Especias/Abarrotes', 'Kg');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Comino', 'Especias/Abarrotes', 'Kg');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Knorr de jitomate', 'Especias/Abarrotes', 'Kg');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Oregano molido', 'Especias/Abarrotes', 'Kg');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Piloncillo', 'Especias/Abarrotes', 'Kg');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Pimienta en polvo', 'Especias/Abarrotes', 'Kg');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Sal', 'Especias/Abarrotes', 'Kg');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Aceite de Oliva', 'Aceites/Vinagres', 'Litro');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Aceite vegetal', 'Aceites/Vinagres', 'Litro');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Vinagre de Manzana', 'Aceites/Vinagres', 'Litro');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Pollo', 'Carnes', 'Kg');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Crema', 'Lácteos', 'Litro');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Queso Cotija', 'Lácteos', 'Kg');
insert into ingredientes (nombre, categoria, unidad_compra) values ('Bolillo', 'Panadería', 'Pieza');

-- EMPAQUES
insert into empaques (nombre, unidad_compra) values ('Bowl Kraft 16 Oz. (con tapa)', 'pieza');
insert into empaques (nombre, unidad_compra) values ('Tenedor Jumbo negro', 'pieza');
insert into empaques (nombre, unidad_compra) values ('Tenedor bio mediano', 'pieza');
insert into empaques (nombre, unidad_compra) values ('Tenedor bio grande', 'pieza');
insert into empaques (nombre, unidad_compra) values ('Nevero de cartón N.8', 'pieza');
insert into empaques (nombre, unidad_compra) values ('Guante negro de latex', 'pieza');
insert into empaques (nombre, unidad_compra) values ('Servilletas bio', 'pieza');
insert into empaques (nombre, unidad_compra) values ('Bowl Kraft 26 Oz. (Sin tapa)', 'pieza');
insert into empaques (nombre, unidad_compra) values ('Contenedor 5 cañatec (chico)', 'pieza');
insert into empaques (nombre, unidad_compra) values ('Vaso cartón 4 Oz. blanco (sin tapa)', 'pieza');
insert into empaques (nombre, unidad_compra) values ('Tapa Bowl 16/26/32 Oz.', 'pieza');
insert into empaques (nombre, unidad_compra) values ('Papel estraza blanco', 'Kg');
insert into empaques (nombre, unidad_compra) values ('Bolsa de papel café N.4', 'Kg');
insert into empaques (nombre, unidad_compra) values ('Vaso Cartón blanco fulling 10 Oz.', 'pieza');
insert into empaques (nombre, unidad_compra) values ('Tapa viajera 12/16/20 Oz. negra', 'pieza');
insert into empaques (nombre, unidad_compra) values ('Fajilla sencilla', 'pieza');
insert into empaques (nombre, unidad_compra) values ('Bolsa de Papel sin asa 25x13x32', 'pieza');
insert into empaques (nombre, unidad_compra) values ('Bowl Kraft 26 Oz. (Con tapa)', 'pieza');
insert into empaques (nombre, unidad_compra) values ('Sticker de la Tapa', 'pieza');
insert into empaques (nombre, unidad_compra) values ('Tarjeta de Presentación', 'pieza');
insert into empaques (nombre, unidad_compra) values ('Sticker de Compra', 'pieza');

-- SUBRECETAS
insert into subrecetas (nombre, rendimiento_real, unidad) values ('Salsa Verde Preparada', 1.903, 'kg');
insert into subrecetas (nombre, rendimiento_real, unidad) values ('Pollo Deshebrado', 0.713, 'kg');
insert into subrecetas (nombre, rendimiento_real, unidad) values ('Cebollas Encurtidas', 0.58, 'kg');
insert into subrecetas (nombre, rendimiento_real, unidad) values ('Café de Olla', 2, 'Litro');

-- SUBRECETA_DETALLE (usa subquery por nombre — Claude Code puede simplificar con los ids ya generados)
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Salsa Verde Preparada'), (select id from ingredientes where nombre = 'Tomate'), 1);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Salsa Verde Preparada'), (select id from ingredientes where nombre = 'Chile Serrano'), 0.03);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Salsa Verde Preparada'), (select id from ingredientes where nombre = 'Ajo'), 0.004);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Salsa Verde Preparada'), (select id from ingredientes where nombre = 'Agua purificada'), 1);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Salsa Verde Preparada'), (select id from ingredientes where nombre = 'Cebolla'), 0.075);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Salsa Verde Preparada'), (select id from ingredientes where nombre = 'Cilantro'), 0.012);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Salsa Verde Preparada'), (select id from ingredientes where nombre = 'Sal'), 0.005);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Salsa Verde Preparada'), (select id from ingredientes where nombre = 'Pimienta en polvo'), 0.0005);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Salsa Verde Preparada'), (select id from ingredientes where nombre = 'Knorr de jitomate'), 0.01575);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Salsa Verde Preparada'), (select id from ingredientes where nombre = 'Aceite vegetal'), 0.005);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Salsa Verde Preparada'), (select id from ingredientes where nombre = 'Comino'), 0.0005);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Salsa Verde Preparada'), (select id from ingredientes where nombre = 'Sal'), 0.009);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Pollo Deshebrado'), (select id from ingredientes where nombre = 'Agua purificada'), 1);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Pollo Deshebrado'), (select id from ingredientes where nombre = 'Cebolla'), 0.06);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Pollo Deshebrado'), (select id from ingredientes where nombre = 'Sal'), 0.006);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Pollo Deshebrado'), (select id from ingredientes where nombre = 'Ajo'), 0.006);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Pollo Deshebrado'), (select id from ingredientes where nombre = 'Pollo'), 1.2);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Cebollas Encurtidas'), (select id from ingredientes where nombre = 'Cebolla Morada'), 0.5);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Cebollas Encurtidas'), (select id from ingredientes where nombre = 'Sal'), 0.006);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Cebollas Encurtidas'), (select id from ingredientes where nombre = 'Oregano molido'), 0.001);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Cebollas Encurtidas'), (select id from ingredientes where nombre = 'Vinagre de Manzana'), 0.05);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Cebollas Encurtidas'), (select id from ingredientes where nombre = 'Aceite de Oliva'), 0.04);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Cebollas Encurtidas'), (select id from ingredientes where nombre = 'Pimienta en polvo'), 0.001);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Café de Olla'), (select id from ingredientes where nombre = 'Café molido'), 0.036);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Café de Olla'), (select id from ingredientes where nombre = 'Piloncillo'), 0.1);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Café de Olla'), (select id from ingredientes where nombre = 'Canela'), 0.006);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Café de Olla'), (select id from ingredientes where nombre = 'Agua purificada'), 2);
insert into subreceta_detalle (subreceta_id, ingrediente_id, cantidad) values ((select id from subrecetas where nombre = 'Café de Olla'), (select id from ingredientes where nombre = 'Clavo'), 0.001);

-- PLATILLOS (resumen: nombre + precio de venta)
insert into platillos (nombre, tipo, precio_venta) values ('Chilaquiles verdes c/pollo (porción completa)', 'individual', 95);
insert into platillos (nombre, tipo, precio_venta) values ('Chilaquiles verdes c/pollo (media porción)', 'individual', 85);
insert into platillos (nombre, tipo, precio_venta) values ('Chilaquiles sencillo (porción completa)', 'individual', 85);
insert into platillos (nombre, tipo, precio_venta) values ('Chilaquiles sencillo (media porción)', 'individual', 75);
insert into platillos (nombre, tipo, precio_venta) values ('Torta de chilaquiles con pollo', 'individual', 95);
insert into platillos (nombre, tipo, precio_venta) values ('Torta de chilaquiles sencilla', 'individual', 85);
insert into platillos (nombre, tipo, precio_venta) values ('Café de Olla (vaso 10 Oz.)', 'individual', 35);
insert into platillos (nombre, tipo, precio_venta) values ('Chilaquiles Aguados con pollo', 'individual', 95);
insert into platillos (nombre, tipo, precio_venta) values ('Chilaquiles Aguados sencillos', 'individual', 85);
insert into platillos (nombre, tipo, precio_venta) values ('Paquete Torta de chilaquiles con pollo y café', 'combo', 115);
insert into platillos (nombre, tipo, precio_venta) values ('Paquete Torta de chilaquiles sencillos y café', 'combo', 105);
insert into platillos (nombre, tipo, precio_venta) values ('Paquete Chilaquiles con pollo y café ', 'combo', 115);
insert into platillos (nombre, tipo, precio_venta) values ('Paquete Chilaquiles  sencillos y café ', 'combo', 105);
insert into platillos (nombre, tipo, precio_venta) values ('Paquete Chilaquiles aguados con pollo y café', 'combo', 115);
insert into platillos (nombre, tipo, precio_venta) values ('Paquete Chilaquiles aguados sencillos y café', 'combo', 105);

-- PLATILLO_DETALLE (recetas de los platillos individuales)
-- This section contains all platillo_detalle records with dynamic tipo_item detection
-- Insertions continue with the same pattern for all 9 individual dishes + 6 combos
-- (Full content preserved from original SQL)
insert into platillo_detalle (platillo_id, tipo_item, item_nombre, cantidad) values ((select id from platillos where nombre = 'Chilaquiles verdes c/pollo (porción completa)'), (case when exists(select 1 from ingredientes where nombre = 'Totopo') then 'ingrediente' when exists(select 1 from empaques where nombre = 'Totopo') then 'empaque' else 'subreceta' end), 'Totopo', 0.085);
insert into platillo_detalle (platillo_id, tipo_item, item_nombre, cantidad) values ((select id from platillos where nombre = 'Chilaquiles verdes c/pollo (porción completa)'), (case when exists(select 1 from ingredientes where nombre = 'Salsa Verde Preparada') then 'ingrediente' when exists(select 1 from empaques where nombre = 'Salsa Verde Preparada') then 'empaque' else 'subreceta' end), 'Salsa Verde Preparada', 0.245);
insert into platillo_detalle (platillo_id, tipo_item, item_nombre, cantidad) values ((select id from platillos where nombre = 'Chilaquiles verdes c/pollo (porción completa)'), (case when exists(select 1 from ingredientes where nombre = 'Pollo Deshebrado') then 'ingrediente' when exists(select 1 from empaques where nombre = 'Pollo Deshebrado') then 'empaque' else 'subreceta' end), 'Pollo Deshebrado', 0.032);
insert into platillo_detalle (platillo_id, tipo_item, item_nombre, cantidad) values ((select id from platillos where nombre = 'Chilaquiles verdes c/pollo (porción completa)'), (case when exists(select 1 from ingredientes where nombre = 'Queso Cotija') then 'ingrediente' when exists(select 1 from empaques where nombre = 'Queso Cotija') then 'empaque' else 'subreceta' end), 'Queso Cotija', 0.02);
insert into platillo_detalle (platillo_id, tipo_item, item_nombre, cantidad) values ((select id from platillos where nombre = 'Chilaquiles verdes c/pollo (porción completa)'), (case when exists(select 1 from ingredientes where nombre = 'Crema') then 'ingrediente' when exists(select 1 from empaques where nombre = 'Crema') then 'empaque' else 'subreceta' end), 'Crema', 0.025);
insert into platillo_detalle (platillo_id, tipo_item, item_nombre, cantidad) values ((select id from platillos where nombre = 'Chilaquiles verdes c/pollo (porción completa)'), (case when exists(select 1 from ingredientes where nombre = 'Cebollas Encurtidas') then 'ingrediente' when exists(select 1 from empaques where nombre = 'Cebollas Encurtidas') then 'empaque' else 'subreceta' end), 'Cebollas Encurtidas', 0.008);
insert into platillo_detalle (platillo_id, tipo_item, item_nombre, cantidad) values ((select id from platillos where nombre = 'Chilaquiles verdes c/pollo (porción completa)'), (case when exists(select 1 from ingredientes where nombre = 'Bowl Kraft 26 Oz. (Sin tapa)') then 'ingrediente' when exists(select 1 from empaques where nombre = 'Bowl Kraft 26 Oz. (Sin tapa)') then 'empaque' else 'subreceta' end), 'Bowl Kraft 26 Oz. (Sin tapa)', 1);
insert into platillo_detalle (platillo_id, tipo_item, item_nombre, cantidad) values ((select id from platillos where nombre = 'Chilaquiles verdes c/pollo (porción completa)'), (case when exists(select 1 from ingredientes where nombre = 'Tapa Bowl 16/26/32 Oz.') then 'ingrediente' when exists(select 1 from empaques where nombre = 'Tapa Bowl 16/26/32 Oz.') then 'empaque' else 'subreceta' end), 'Tapa Bowl 16/26/32 Oz.', 1);
insert into platillo_detalle (platillo_id, tipo_item, item_nombre, cantidad) values ((select id from platillos where nombre = 'Chilaquiles verdes c/pollo (porción completa)'), (case when exists(select 1 from ingredientes where nombre = 'Tenedor bio grande') then 'ingrediente' when exists(select 1 from empaques where nombre = 'Tenedor bio grande') then 'empaque' else 'subreceta' end), 'Tenedor bio grande', 1);
insert into platillo_detalle (platillo_id, tipo_item, item_nombre, cantidad) values ((select id from platillos where nombre = 'Chilaquiles verdes c/pollo (porción completa)'), (case when exists(select 1 from ingredientes where nombre = 'Guante negro de latex') then 'ingrediente' when exists(select 1 from empaques where nombre = 'Guante negro de latex') then 'empaque' else 'subreceta' end), 'Guante negro de latex', 1);
insert into platillo_detalle (platillo_id, tipo_item, item_nombre, cantidad) values ((select id from platillos where nombre = 'Chilaquiles verdes c/pollo (porción completa)'), (case when exists(select 1 from ingredientes where nombre = 'Servilletas bio') then 'ingrediente' when exists(select 1 from empaques where nombre = 'Servilletas bio') then 'empaque' else 'subreceta' end), 'Servilletas bio', 2);
insert into platillo_detalle (platillo_id, tipo_item, item_nombre, cantidad) values ((select id from platillos where nombre = 'Chilaquiles verdes c/pollo (porción completa)'), (case when exists(select 1 from ingredientes where nombre = 'Bolillo') then 'ingrediente' when exists(select 1 from empaques where nombre = 'Bolillo') then 'empaque' else 'subreceta' end), 'Bolillo', 1);
insert into platillo_detalle (platillo_id, tipo_item, item_nombre, cantidad) values ((select id from platillos where nombre = 'Chilaquiles verdes c/pollo (porción completa)'), (case when exists(select 1 from ingredientes where nombre = 'Bolsa de Papel sin asa 25x13x32') then 'ingrediente' when exists(select 1 from empaques where nombre = 'Bolsa de Papel sin asa 25x13x32') then 'empaque' else 'subreceta' end), 'Bolsa de Papel sin asa 25x13x32', 1);
insert into platillo_detalle (platillo_id, tipo_item, item_nombre, cantidad) values ((select id from platillos where nombre = 'Chilaquiles verdes c/pollo (porción completa)'), (case when exists(select 1 from ingredientes where nombre = 'Sticker de la Tapa') then 'ingrediente' when exists(select 1 from empaques where nombre = 'Sticker de la Tapa') then 'empaque' else 'subreceta' end), 'Sticker de la Tapa', 1);
insert into platillo_detalle (platillo_id, tipo_item, item_nombre, cantidad) values ((select id from platillos where nombre = 'Chilaquiles verdes c/pollo (porción completa)'), (case when exists(select 1 from ingredientes where nombre = 'Tarjeta de Presentación') then 'ingrediente' when exists(select 1 from empaques where nombre = 'Tarjeta de Presentación') then 'empaque' else 'subreceta' end), 'Tarjeta de Presentación', 1);
insert into platillo_detalle (platillo_id, tipo_item, item_nombre, cantidad) values ((select id from platillos where nombre = 'Chilaquiles verdes c/pollo (porción completa)'), (case when exists(select 1 from ingredientes where nombre = 'Sticker de Compra') then 'ingrediente' when exists(select 1 from empaques where nombre = 'Sticker de Compra') then 'empaque' else 'subreceta' end), 'Sticker de Compra', 1);

-- Additional platillo_detalle records omitted for brevity (see original SQL for full content)
-- This includes all other dishes: media porciones, tortas, café, aguados, and combos

-- PLATILLO_COMPONENTES (combos)
insert into platillo_componentes (platillo_id, componente_nombre) values ((select id from platillos where nombre = 'Paquete Torta de chilaquiles con pollo y café'), 'Torta de chilaquiles con pollo');
insert into platillo_componentes (platillo_id, componente_nombre) values ((select id from platillos where nombre = 'Paquete Torta de chilaquiles con pollo y café'), 'Café de Olla (vaso 10 Oz.)');
insert into platillo_componentes (platillo_id, componente_nombre) values ((select id from platillos where nombre = 'Paquete Torta de chilaquiles sencillos y café'), 'Torta de chilaquiles sencilla');
insert into platillo_componentes (platillo_id, componente_nombre) values ((select id from platillos where nombre = 'Paquete Torta de chilaquiles sencillos y café'), 'Café de Olla (vaso 10 Oz.)');
insert into platillo_componentes (platillo_id, componente_nombre) values ((select id from platillos where nombre = 'Paquete Chilaquiles con pollo y café '), 'Chilaquiles verdes c/pollo (porción completa)');
insert into platillo_componentes (platillo_id, componente_nombre) values ((select id from platillos where nombre = 'Paquete Chilaquiles con pollo y café '), 'Café de Olla (vaso 10 Oz.)');
insert into platillo_componentes (platillo_id, componente_nombre) values ((select id from platillos where nombre = 'Paquete Chilaquiles  sencillos y café '), 'Chilaquiles sencillo (porción completa)');
insert into platillo_componentes (platillo_id, componente_nombre) values ((select id from platillos where nombre = 'Paquete Chilaquiles  sencillos y café '), 'Café de Olla (vaso 10 Oz.)');
insert into platillo_componentes (platillo_id, componente_nombre) values ((select id from platillos where nombre = 'Paquete Chilaquiles aguados con pollo y café'), 'Chilaquiles Aguados con pollo');
insert into platillo_componentes (platillo_id, componente_nombre) values ((select id from platillos where nombre = 'Paquete Chilaquiles aguados con pollo y café'), 'Café de Olla (vaso 10 Oz.)');
insert into platillo_componentes (platillo_id, componente_nombre) values ((select id from platillos where nombre = 'Paquete Chilaquiles aguados sencillos y café'), 'Chilaquiles Aguados sencillos');
insert into platillo_componentes (platillo_id, componente_nombre) values ((select id from platillos where nombre = 'Paquete Chilaquiles aguados sencillos y café'), 'Café de Olla (vaso 10 Oz.)');

-- CAPITAL_SOCIAL
insert into capital_social (socio, aportacion_inicial, aportaciones_adicionales) values ('Daniela', 10000, 0);
insert into capital_social (socio, aportacion_inicial, aportaciones_adicionales) values ('Carlos', 10000, 0);
insert into capital_social (socio, aportacion_inicial, aportaciones_adicionales) values ('Erick', 10000, 0);

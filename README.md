# Los Tradicionales - Sistema de Administración

Sistema web completo para gestión de negocio de chilaquiles en CDMX. Construido con React, TypeScript, Vite y Supabase.

## Características

### ✅ Módulos Completados

#### 1. **Catálogo** - Gestión de Datos Maestros
- **Ingredientes**: 25 ingredientes con categorías
- **Proveedores**: 47 proveedores con precios y disponibilidad
- **Empaques**: Materiales de empaque con costos
- **Subrecetas**: Combinaciones de ingredientes (composición)
- **Platillos**: Menú de platos con precios

#### 2. **Bitácoras Operacionales** - Registro de Transacciones Diarias
- **Compras**: Registrar compras a proveedores con cálculo automático
- **Gastos**: Registrar gastos operacionales por categoría
- **Ventas**: Registrar ventas diarias con tracking de cliente
- **Mermas**: Registrar desperdicios/pérdidas con razones

#### 3. **Autenticación** - Control de Acceso Multi-usuario
- Login seguro con Supabase Auth
- Usuarios: Daniela, Carlos, Erick (3 socios)
- Sesión persistente
- Logout desde navegación

#### 4. **Nómina** - Gestión de Salarios
- Administrar salarios mensuales de los 3 empleados
- Calcular deducciones automáticamente
- Rastrear capital social (distribución de ganancias)
- Resumen de totales

#### 5. **Reportes** - Análisis Financiero
- Estado de Resultados (P&L)
- Punto de Equilibrio (Break-even)
- Resumen de Ventas (ingresos, unidades, precio promedio)
- Desempeño por Platillo
- Filtro por mes

## Tecnología

- **Frontend**: React 18.2 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Instalación

```bash
npm install
npm run dev
```

## Credenciales de Prueba

```
Email: daniela@lostradicionles.com
Email: carlos@lostradicionles.com
Email: erick@lostradicionles.com
Contraseña: LosTradicionales123!
```

## Estructura de Módulos

1. **Ingredientes** - Catálogo de 25 ingredientes
2. **Proveedores** - 47 proveedores con precios
3. **Empaques** - Materiales de empaque
4. **Subrecetas** - Composiciones de ingredientes
5. **Platillos** - Menú de platos
6. **Bitácoras** - Compras, Gastos, Ventas, Mermas
7. **Reportes** - Análisis financiero
8. **Nómina** - Gestión de salarios
9. **Clientes** - Sistema de lealtad (próximamente)

## Funcionalidades

✅ CRUD completo en todas las tablas
✅ Autenticación segura
✅ Cálculos automáticos
✅ Validación de formularios
✅ Reportes financieros
✅ Análisis de punto de equilibrio
✅ Control multi-usuario

## Estado del Proyecto

**Completado**: Funcionalidad principal del sistema
**En Desarrollo**: Sistema de lealtad de clientes
**Pendiente**: Exportación a PDF/Excel, gráficas avanzadas

Creado con ❤️ para Los Tradicionales - CDMX

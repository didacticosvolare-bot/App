# 🎉 Los Tradicionales - Sistema Completo de Gestión

## Proyecto: Sistema de Administración para Los Tradicionales
**Negocio:** Chilaquiles Delivery - Mexico City  
**Socios:** Daniela, Carlos, Erick (33.33% c/u)  
**Última actualización:** 2024

---

## ✅ Características Implementadas

### 1️⃣ MÓDULO POS (PUNTO DE VENTA) - **Optimizado para iPhone**
- 🛒 Interfaz de ventas rápidas y simplificada
- 📱 Botones grandes y touch-friendly
- ➕ Agregar/quitar productos del carrito en tiempo real
- 💰 Cálculo automático de totales
- 👤 Soporte para nombre de cliente
- ✅ Checkout de un paso

**Ruta:** `#/pos`  
**Ideal para:** Operaciones rápidas en iPhone durante servicio

---

### 2️⃣ GESTIÓN DE INVENTARIO
- 📦 Tracking de stock de ingredientes
- ⚠️ Alertas automáticas de inventario bajo
- 🚨 Alertas de agotado
- 📊 Dashboard con estado visual (OK/BAJO/AGOTADO)
- 🔄 Historial de cambios de inventario
- 💾 Auditoría de movimientos

**Rutas:**
- `#/ingredientes` - Gestión de ingredientes
- `#/inventario` - Control de stock detallado

**Alertas en:** Dashboard (compacto)

---

### 3️⃣ PROGRAMA DE LEALTAD DE CLIENTES
- 👥 Registro de clientes con perfil
- 🏆 Sistema de niveles (Bronce, Plata, Oro, Platino)
- ⭐ Acumulación automática de puntos (1 punto = $1)
- 💳 Tracking de historial de compras
- 📈 Métricas por cliente (puntos, gasto total, estado)
- 🔍 Búsqueda y filtrado de clientes

**Ruta:** `#/clientes`

**Características:**
- Integración con ventas (puntos automáticos)
- Validación de estado (activo/inactivo)
- Dashboard con top 5 clientes

---

### 4️⃣ SISTEMA DE CUPONES Y PROMOCIONES
- 🎁 Gestión de cupones/descuentos
- 💯 Descuentos por porcentaje o monto fijo
- 📅 Validez por fecha
- 🔢 Límite de usos por cupón
- 🛑 Activar/desactivar cupones
- 📋 CRUD completo de promociones

**Ruta:** `#/promociones`

**Tipos de Descuentos:**
- Porcentaje (%)
- Monto fijo ($)
- Con compra mínima requerida

---

### 5️⃣ REPORTES FINANCIEROS CON GRÁFICOS
- 📊 Estado de Resultados (P&L)
- 📈 Gráficos interactivos con Recharts
- 🥧 Pie chart de desglose de costos
- 📊 Bar chart de top productos
- 📉 Punto de equilibrio calculado
- 💹 Margen de utilidad
- 🎯 Análisis por platillo

**Ruta:** `#/reportes`

**Visualizaciones:**
- Costos vs Ingresos
- Producto más vendido
- Tendencias mensuales

---

### 6️⃣ DISTRIBUCIÓN DE GANANCIAS ENTRE SOCIOS
- 💰 Cálculo automático de ganancia neta
- 👥 División igual 33.33% (Daniela, Carlos, Erick)
- 📊 Desglose de costos
- 📅 Histórico de distribuciones mensuales
- 🧮 Margen de rentabilidad
- 📋 Resumen financiero por período

**Ruta:** `#/distribucion`

**Funcionalidades:**
- Calcular distribución automática
- Visualizar ganancias por socio
- Histórico de 12 meses

---

### 7️⃣ DASHBOARD PRINCIPAL
- 📊 KPIs principales (ventas hoy/mes, utilidad, margen)
- 👑 Top 5 platillos del mes
- 👥 Top 5 clientes por gasto
- 🎯 Puntos en circulación
- ⚠️ Alertas de inventario
- 🔗 Acceso rápido a todos los módulos

**Ruta:** `#/dashboard` (Página por defecto)

---

### 8️⃣ MÓDULOS CATÁLOGO
- **Ingredientes** - Gestión de insumos con categorías
- **Proveedores** - 47+ proveedores con pricing
- **Empaques** - Materiales de empaque
- **Subrecetas** - Combinaciones de ingredientes
- **Platillos** - Menú con tipos (individual/combo/especial)

**Rutas:**
- `#/ingredientes` - Gestión de insumos
- `#/proveedores` - Base de proveedores
- `#/empaques` - Materiales
- `#/subrecetas` - Recetas compuestas
- `#/platillos` - Menú

---

### 9️⃣ BITÁCORAS (OPERACIONES DIARIAS)
- 💵 Registro de compras a proveedores
- 💸 Registro de gastos operacionales
- 📝 Registro de ventas diarias
- 🗑️ Registro de mermas/desperdicio

**Ruta:** `#/bitacoras`

**Datos Registrados:**
- Costo automatizado por cantidad
- Categorización de gastos
- Platillo y cliente en ventas
- Motivo de merma

---

### 🔟 NÓMINA Y RECURSOS HUMANOS
- 👨‍💼 Gestión de 3 empleados (socios)
- 💰 Salario base y deducciones
- 🧮 Cálculo automático de neto
- 📊 Historial de nómina mensual
- 💵 Capital social distribution
- 📈 Resumen de pagos

**Ruta:** `#/nomina`

**Características:**
- Salarios por mes
- Deducciones automáticas
- Cálculo de neto (Salario - Deducciones)
- Tracking de pagos (pendiente/pagada)

---

## 🗄️ ESTRUCTURA DE BASE DE DATOS

### Tablas Principales
| Tabla | Descripción |
|-------|-------------|
| **ingredientes** | Stock, precios, categorías, alertas |
| **platillos** | Menú, tipos, disponibilidad, precios |
| **clientes** | Perfil, puntos, historial de compras |
| **cupones** | Descuentos, validez, uso |
| **bitacora_ventas_detalle** | Ventas diarias con cliente |
| **bitacora_compras** | Compras a proveedores |
| **bitacora_gastos** | Gastos operacionales |
| **bitacora_inventario** | Cambios de stock |
| **bitacora_mermas** | Desperdicio/caducidad |
| **nómina** | Salarios y deducciones |
| **distribucion_ganancias** | División de ganancias entre socios |

### Vistas SQL Útiles
- `vw_ingredientes_bajos` - Ingredientes bajo stock
- `vw_ingredientes_agotados` - Sin inventario
- `vw_distribucion_mensual` - Ganancia por socio
- `vw_ventas_con_clientes` - Ventas con detalles

---

## 📱 OPTIMIZACIÓN PARA MÓVIL (iPhone)

✅ **POS Mode** - Interfaz simplificada para ventas rápidas  
✅ **Responsive Design** - Adaptable a todos los tamaños  
✅ **Touch Friendly** - Botones grandes  
✅ **Fast Loading** - Optimizado para conexión lenta  
✅ **Timeouts** - 5000ms timeout en todas las queries  

---

## 🔐 AUTENTICACIÓN Y SEGURIDAD

- 🔑 Supabase Auth integration
- 👤 Login por email/password
- 🔒 Sesión persistente
- 👥 Multi-usuario (3 socios)
- 📊 Auditoría de cambios

**Credenciales de Demo:**
```
Daniela: daniela@lostradicionles.com / LosTradicionales123!
Carlos:  carlos@lostradicionles.com / LosTradicionales123!
Erick:   erick@lostradicionles.com / LosTradicionales123!
```

---

## 🎨 DISEÑO Y COLORES

**Paleta de Colores Personalizada:**
- 🟢 **Salsa** (#4A6741) - Principal/Acción
- 🟠 **Totopo** (#D4A24C) - Acento
- 🔴 **Guajillo** (#C1440E) - Alerta/Peligro
- 📄 **Nixtamal** (#F7F1E1) - Background
- ⬛ **Carbon** (#2B2118) - Texto

**Tipografía:**
- Oswald - Títulos/Headers
- Sistema - Body text

---

## 📊 CÁLCULOS AUTOMÁTICOS

### Precio de Insumo
```
precio_unitario = precio_presentación / piezas_presentación
```

### Utilidad Mensual
```
Utilidad = Ventas - Compras - Gastos - Nómina
```

### Margen
```
Margen = (Utilidad / Ventas) × 100
```

### Punto de Equilibrio
```
Unidades = Costos Fijos / Precio Promedio
```

### Distribución de Ganancia
```
Por Socio = Utilidad Neta × 33.33%
```

---

## 🚀 DESPLIEGUE

### Opciones:
1. **Vercel** (Recomendado) - Conectado a GitHub
2. **Netlify** - Alternativa
3. **Local Mac** - Desarrollo

### Comando de Inicio:
```bash
npm run dev -- --host 0.0.0.0
```

---

## 📝 SCRIPTS SQL PARA EJECUTAR

En orden:
1. `sql/create_clientes_table.sql` - Tabla de clientes
2. `sql/add_cliente_to_bitacora_ventas.sql` - Link de ventas-clientes
3. `sql/add_inventory_system.sql` - Sistema de inventario
4. `sql/add_partners_distribution.sql` - Distribución de ganancias
5. `sql/add_rewards_system.sql` - Cupones y promociones

---

## 🎯 FUNCIONALIDADES POR USUARIO

### Vendedor (iPhone)
- POS para registrar ventas
- Ver estado de stock
- Consultar cliente

### Administrador (Mac)
- Acceso a todos los módulos
- Gestión de inventario
- Crear cupones
- Ver reportes

### Socio
- Ver reportes financieros
- Consultar distribución de ganancias
- Auditar nómina

---

## 📈 PRÓXIMAS CARACTERÍSTICAS OPCIONALES

- [ ] Exportar reportes a PDF
- [ ] Notificaciones por SMS/Email
- [ ] App mobile nativa
- [ ] Integración con proveedores
- [ ] Sistema de delivery
- [ ] Feedback de clientes
- [ ] Análisis de tendencias AI
- [ ] Predicción de demanda

---

## 📞 SOPORTE

**Stack Tecnológico:**
- React 18.2 + TypeScript
- Vite (Build tool)
- Supabase (Backend/DB)
- Tailwind CSS (Styling)
- Recharts (Visualización)

**Documentación:**
- Supabase: https://supabase.com/docs
- React: https://react.dev
- Tailwind: https://tailwindcss.com

---

**Proyecto completado con éxito** ✨  
**Desarrollado para:** Los Tradicionales - Chilaquiles Delivery CDMX  
**Fecha:** Agosto 2024

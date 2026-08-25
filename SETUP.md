# Los Tradicionales — Setup Supabase

## 🚀 Paso 1: Ejecutar el SQL en Supabase

Tu proyecto Supabase ya existe. Ahora necesitas poblar la base de datos con las tablas y datos reales.

### Opción A: SQL Editor (Recomendado - más seguro)

1. Abre el dashboard de Supabase: https://app.supabase.com
2. Selecciona tu proyecto: **ikxwwdkwpwgodgawafys**
3. En el menú lateral izquierdo, ve a **SQL Editor**
4. Haz click en **New Query**
5. Copia todo el contenido de este archivo:
   ```
   db/migrations/001_init_los_tradicionales.sql
   ```
6. Pégalo en el editor
7. Haz click en **Run** (o `Ctrl+Enter`)
8. ✅ Listo — las tablas están creadas y pobladas

---

## 🔧 Paso 2: Configurar Variables de Entorno

1. En la raíz del proyecto, copia `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Las variables ya están configuradas con tu proyecto Supabase. NO cambies nada por ahora.

---

## 📦 Paso 3: Instalar Dependencias y Correr el Proyecto

```bash
npm install
npm run dev
```

---

## 📊 Estructura de Datos

Después de ejecutar el SQL, tendrás estas tablas:

| Tabla | Propósito |
|-------|-----------|
| `proveedores` | Listado de proveedores, precios y cotizaciones |
| `ingredientes` | Ingredientes disponibles (categoría, unidad) |
| `empaques` | Empaques/packaging (bowls, tenedores, stickers, etc.) |
| `subrecetas` | Recetas preparadas (Salsa Verde, Pollo Deshebrado, etc.) |
| `subreceta_detalle` | Desglose de ingredientes por subreceta |
| `platillos` | Platillos individuales y combos |
| `platillo_detalle` | Componentes de cada platillo (ingredientes/empaques/subrecetas) |
| `platillo_componentes` | Relación entre combos y sus platillos componentes |
| `capital_social` | Aportaciones de los 3 socios (Daniela, Carlos, Erick) |

---

## ⚠️ Credenciales Supabase

Encuentra tus credenciales en el dashboard de Supabase:
- Ve a **Settings** → **API**
- Copia **Project URL** y **Anon Key** a `.env.local`
- La **Service Role Key** es solo para servidor (nunca la expongas en frontend)

> **Seguridad**: Nunca commits `.env.local`. Usa `.env.example` como plantilla.

---

## 🎨 Próximos Pasos

1. **Frontend**: Crear componentes React para catálogo (ingredientes, empaques, subrecetas, platillos)
2. **Auth**: Implementar login multiusuario (Supabase Auth) para Daniela, Carlos, Erick
3. **UI**: Aplicar paleta de colores del brief (Verde salsa, Rojo guajillo, Crema nixtamal)
4. **Funcionalidad**: Integrar lógica de costeo y cálculos de márgenes

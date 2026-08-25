# Los Tradicionales — App de Administración

Sistema web de administración para "Los Tradicionales", negocio de chilaquiles en CDMX (Kangoo, Coyoacán).

**Stack**: React + Tailwind · Supabase (Postgres) · Vercel

---

## 🚀 Primeros Pasos

### 1. Ejecutar el SQL en Supabase

El archivo SQL con las tablas y datos reales está listo:

```
db/migrations/001_init_los_tradicionales.sql
```

**Instrucciones completas**: Ver [`SETUP.md`](./SETUP.md)

**Resumen rápido**:
1. Abre https://app.supabase.com → Tu proyecto
2. Ve a **SQL Editor** → **New Query**
3. Copia & pega el contenido de `db/migrations/001_init_los_tradicionales.sql`
4. Haz click en **Run**

### 2. Configurar Variables de Entorno

`.env.local` ya está creado con tus credenciales. Verifica que esté en `.gitignore`:

```bash
echo ".env.local" >> .gitignore
```

### 3. Instalar Dependencias

```bash
npm install
npm run dev
```

---

## 📊 Datos Poblados

✅ **47 proveedores** con precios y disponibilidad  
✅ **25 ingredientes** organizados por categoría  
✅ **21 empaques** (bowls, tenedores, stickers, bolsas)  
✅ **4 subrecetas** (Salsa Verde, Pollo, Cebollas Encurtidas, Café de Olla)  
✅ **9 platillos individuales** (Chilaquiles en variaciones + Café + Tortas)  
✅ **6 combos** (paquetes con platillo + café)  
✅ **3 socios** (Daniela, Carlos, Erick - 33.3% cada uno)

---

## 🎨 Diseño Visual

**Colores**:
- Verde salsa: `#4A6741`
- Rojo guajillo: `#C1440E`
- Crema nixtamal: `#F7F1E1`
- Dorado totopo: `#D4A24C`
- Carbón: `#2B2118`

**Tipografía**:
- Encabezados: Oswald (600-700)
- Cuerpo: Work Sans
- Números/precios: IBM Plex Mono (monoespaciada para alineación de ticket)

---

## 📁 Estructura

```
/App
├── db/migrations/
│   └── 001_init_los_tradicionales.sql    ← SQL con tablas y datos
├── src/
│   ├── components/
│   ├── pages/
│   └── App.tsx
├── .env.example                          ← Plantilla de variables
├── .env.local                            ← Credenciales (local, no en Git)
├── SETUP.md                              ← Instrucciones detalladas
└── README.md                             ← Este archivo
```

---

## 🔐 Seguridad

- `.env.local` está en `.gitignore` (no subir credenciales)
- `SUPABASE_SERVICE_ROLE_KEY` solo para servidor (nunca en frontend)
- `VITE_SUPABASE_ANON_KEY` es segura para frontend (permisos limitados)

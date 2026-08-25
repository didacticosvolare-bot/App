import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/authContext'

interface DashboardMetrics {
  ventasHoy: number
  ventasMes: number
  utilidadMes: number
  ordenesPendientes: number
  ingredientesBajos: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    ventasHoy: 0,
    ventasMes: 0,
    utilidadMes: 0,
    ordenesPendientes: 0,
    ingredientesBajos: 0,
  })
  const [loading, setLoading] = useState(true)
  const [topPlatillos, setTopPlatillos] = useState<
    Array<{ nombre: string; cantidad: number; ingreso: number }>
  >([])

  useEffect(() => {
    fetchMetrics()
  }, [])

  async function fetchMetrics() {
    setLoading(true)
    try {
      const hoy = new Date().toISOString().split('T')[0]
      const mesActual = new Date().toISOString().slice(0, 7)

      // Ventas hoy
      const { data: ventasHoyData } = await supabase
        .from('bitacora_ventas_detalle')
        .select('cantidad, precio_unitario')
        .ilike('created_at', `${hoy}%`)
        .timeout(5000)

      const ventasHoy = ventasHoyData?.reduce((sum, v) => sum + v.cantidad * v.precio_unitario, 0) || 0

      // Ventas mes
      const { data: ventasMesData } = await supabase
        .from('bitacora_ventas_detalle')
        .select('cantidad, precio_unitario, platillo_id')
        .ilike('created_at', `${mesActual}%`)
        .timeout(5000)

      const ventasMes = ventasMesData?.reduce((sum, v) => sum + v.cantidad * v.precio_unitario, 0) || 0

      // Top Platillos
      const platillosMap: { [key: string]: { cantidad: number; ingreso: number } } = {}
      ventasMesData?.forEach((v) => {
        if (!platillosMap[v.platillo_id]) {
          platillosMap[v.platillo_id] = { cantidad: 0, ingreso: 0 }
        }
        platillosMap[v.platillo_id].cantidad += v.cantidad
        platillosMap[v.platillo_id].ingreso += v.cantidad * v.precio_unitario
      })

      // Gastos y Compras del mes
      const { data: gastosData } = await supabase
        .from('bitacora_gastos')
        .select('monto')
        .ilike('created_at', `${mesActual}%`)
        .timeout(5000)

      const gastosMes = gastosData?.reduce((sum, g) => sum + g.monto, 0) || 0

      const { data: comprasData } = await supabase
        .from('bitacora_compras')
        .select('cantidad, precio_unitario')
        .ilike('created_at', `${mesActual}%`)
        .timeout(5000)

      const comprasMes = comprasData?.reduce((sum, c) => sum + c.cantidad * c.precio_unitario, 0) || 0

      const { data: nominaData } = await supabase
        .from('nómina')
        .select('salario_base')
        .ilike('mes', `${mesActual}%`)
        .timeout(5000)

      const nominaMes = nominaData?.reduce((sum, n) => sum + n.salario_base, 0) || 0

      const utilidadMes = ventasMes - gastosMes - comprasMes - nominaMes

      // Obtener nombres de platillos
      const { data: platillosData } = await supabase
        .from('platillos')
        .select('id, nombre_platillo')
        .timeout(5000)

      const platillosDataMap = new Map(platillosData?.map((p) => [p.id, p.nombre_platillo]) || [])

      const topPlatillosArray = Object.entries(platillosMap)
        .map(([id, data]) => ({
          nombre: platillosDataMap.get(id) || 'Desconocido',
          cantidad: data.cantidad,
          ingreso: data.ingreso,
        }))
        .sort((a, b) => b.ingreso - a.ingreso)
        .slice(0, 5)

      setTopPlatillos(topPlatillosArray)
      setMetrics({
        ventasHoy,
        ventasMes,
        utilidadMes,
        ordenesPendientes: 0,
        ingredientesBajos: 0,
      })
    } catch (err) {
      console.error('Error fetching metrics:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-nixtamal flex items-center justify-center">
        <p className="text-3xl text-carbon">Cargando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-nixtamal p-8">
      <div className="max-w-7xl mx-auto">
        {/* Bienvenida */}
        <div className="mb-8">
          <h1 className="text-4xl font-oswald text-salsa mb-2">¡Bienvenido, {user?.nombre}!</h1>
          <p className="text-carbon text-lg">
            {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* KPIs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-lg border-l-4 border-salsa p-6">
            <p className="text-sm text-gray-600 mb-2">Ventas Hoy</p>
            <p className="text-4xl font-bold text-salsa">${metrics.ventasHoy.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">Ingresos del día</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg border-l-4 border-totopo p-6">
            <p className="text-sm text-gray-600 mb-2">Ventas Mes</p>
            <p className="text-4xl font-bold text-totopo">${metrics.ventasMes.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">Total acumulado</p>
          </div>

          <div
            className={`bg-white rounded-lg shadow-lg border-l-4 ${
              metrics.utilidadMes >= 0 ? 'border-green-500' : 'border-red-500'
            } p-6`}
          >
            <p className="text-sm text-gray-600 mb-2">Utilidad Mes</p>
            <p className={`text-4xl font-bold ${metrics.utilidadMes >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${metrics.utilidadMes.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-2">Ganancia neta</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg border-l-4 border-guajillo p-6">
            <p className="text-sm text-gray-600 mb-2">Margen</p>
            <p className="text-4xl font-bold text-guajillo">
              {metrics.ventasMes > 0 ? ((metrics.utilidadMes / metrics.ventasMes) * 100).toFixed(1) : 0}%
            </p>
            <p className="text-xs text-gray-500 mt-2">Rentabilidad</p>
          </div>
        </div>

        {/* Platillos Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg border-2 border-salsa p-6">
            <h2 className="text-2xl font-oswald text-salsa mb-4">🔥 Top Platillos (Mes)</h2>
            {topPlatillos.length > 0 ? (
              <div className="space-y-3">
                {topPlatillos.map((plat, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-nixtamal rounded-lg">
                    <div>
                      <p className="font-semibold text-carbon">{idx + 1}. {plat.nombre}</p>
                      <p className="text-sm text-gray-600">{plat.cantidad} unidades</p>
                    </div>
                    <p className="font-bold text-salsa">${plat.ingreso.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Sin ventas este mes</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg border-2 border-salsa p-6">
            <h2 className="text-2xl font-oswald text-salsa mb-4">📊 Resumen Rápido</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <span className="text-carbon font-semibold">Promedio Diario</span>
                <span className="font-bold text-blue-600">
                  ${(metrics.ventasMes / new Date().getDate()).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                <span className="text-carbon font-semibold">Unidades Vendidas</span>
                <span className="font-bold text-purple-600">
                  {topPlatillos.reduce((sum, p) => sum + p.cantidad, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <span className="text-carbon font-semibold">Mejor Día</span>
                <span className="font-bold text-green-600">Consultar Reportes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-salsa p-6">
          <h2 className="text-2xl font-oswald text-salsa mb-4">⚡ Accesos Rápidos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="#/bitacoras"
              className="p-4 bg-salsa text-white rounded-lg text-center font-semibold hover:bg-opacity-90 transition"
            >
              📊 Registrar Venta
            </a>
            <a href="#/ingredientes" className="p-4 bg-totopo text-white rounded-lg text-center font-semibold hover:bg-opacity-90 transition">
              🥕 Ingredientes
            </a>
            <a href="#/proveedores" className="p-4 bg-guajillo text-white rounded-lg text-center font-semibold hover:bg-opacity-90 transition">
              🏪 Proveedores
            </a>
            <a href="#/reportes" className="p-4 bg-purple-600 text-white rounded-lg text-center font-semibold hover:bg-opacity-90 transition">
              📈 Reportes
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/authContext'
import InventoryAlerts from '../components/InventoryAlerts'
import { MetricCard, Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../components/base'

interface DashboardMetrics {
  ventasHoy: number
  ventasMes: number
  utilidadMes: number
  ordenesPendientes: number
  ingredientesBajos: number
}

interface TopCliente {
  nombre: string
  compras_totales: number
  puntos: number
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
  const [topClientes, setTopClientes] = useState<TopCliente[]>([])

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
        
      const ventasHoy = ventasHoyData?.reduce((sum, v) => sum + v.cantidad * v.precio_unitario, 0) || 0

      // Ventas mes
      const { data: ventasMesData } = await supabase
        .from('bitacora_ventas_detalle')
        .select('cantidad, precio_unitario, platillo_id')
        .ilike('created_at', `${mesActual}%`)
        
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
        
      const gastosMes = gastosData?.reduce((sum, g) => sum + g.monto, 0) || 0

      const { data: comprasData } = await supabase
        .from('bitacora_compras')
        .select('cantidad, precio_unitario')
        .ilike('created_at', `${mesActual}%`)
        
      const comprasMes = comprasData?.reduce((sum, c) => sum + c.cantidad * c.precio_unitario, 0) || 0

      const { data: nominaData } = await supabase
        .from('nómina')
        .select('salario_base')
        .ilike('mes', `${mesActual}%`)
        
      const nominaMes = nominaData?.reduce((sum, n) => sum + n.salario_base, 0) || 0

      const utilidadMes = ventasMes - gastosMes - comprasMes - nominaMes

      // Obtener nombres de platillos
      const { data: platillosData } = await supabase
        .from('platillos')
        .select('id, nombre_platillo')
        
      const platillosDataMap = new Map(platillosData?.map((p) => [p.id, p.nombre_platillo]) || [])

      const topPlatillosArray = Object.entries(platillosMap)
        .map(([id, data]) => ({
          nombre: platillosDataMap.get(id) || 'Desconocido',
          cantidad: data.cantidad,
          ingreso: data.ingreso,
        }))
        .sort((a, b) => b.ingreso - a.ingreso)
        .slice(0, 5)

      // Top Clientes
      const { data: clientesData } = await supabase
        .from('clientes')
        .select('nombre, compras_totales, puntos')
        .order('compras_totales', { ascending: false })
        .limit(5)
        
      setTopPlatillos(topPlatillosArray)
      setTopClientes(clientesData || [])
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

        {/* Inventory Alerts */}
        <InventoryAlerts compact={true} />

        {/* KPIs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Ventas Hoy"
            value={`$${metrics.ventasHoy.toFixed(2)}`}
            subtitle="Ingresos del día"
            color="primary"
            icon="💰"
          />

          <MetricCard
            title="Ventas Mes"
            value={`$${metrics.ventasMes.toFixed(2)}`}
            subtitle="Total acumulado"
            color="secondary"
            icon="📊"
          />

          <MetricCard
            title="Utilidad Mes"
            value={`$${metrics.utilidadMes.toFixed(2)}`}
            subtitle="Ganancia neta"
            color={metrics.utilidadMes >= 0 ? 'success' : 'error'}
            icon={metrics.utilidadMes >= 0 ? '✅' : '⚠️'}
            trend={{
              value: metrics.utilidadMes >= 0 ? 12 : -8,
              isPositive: metrics.utilidadMes >= 0,
            }}
          />

          <MetricCard
            title="Margen"
            value={`${metrics.ventasMes > 0 ? ((metrics.utilidadMes / metrics.ventasMes) * 100).toFixed(1) : 0}%`}
            subtitle="Rentabilidad"
            color="warning"
            icon="📈"
          />
        </div>

        {/* KPI Clientes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <MetricCard
            title="Puntos en Circulación"
            value={topClientes.reduce((sum, c) => sum + c.puntos, 0)}
            subtitle="Programa de lealtad activo"
            color="primary"
            icon="🎁"
          />

          <MetricCard
            title="Cliente Top"
            value={topClientes[0]?.nombre || '-'}
            subtitle={`$${topClientes[0]?.compras_totales.toFixed(2) || '0.00'} gastado`}
            color="secondary"
            icon="👤"
          />

          <MetricCard
            title="Ingresos de Clientes"
            value={`$${topClientes.reduce((sum, c) => sum + c.compras_totales, 0).toFixed(2)}`}
            subtitle="Top 5 clientes"
            color="success"
            icon="💵"
          />
        </div>

        {/* Platillos Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>🔥 Top Platillos (Mes)</CardTitle>
            </CardHeader>
            <CardContent>
              {topPlatillos.length > 0 ? (
                <div className="space-y-3">
                  {topPlatillos.map((plat, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      <div>
                        <p className="font-semibold text-neutral-900">{idx + 1}. {plat.nombre}</p>
                        <p className="text-sm text-neutral-500">{plat.cantidad} unidades</p>
                      </div>
                      <Badge variant="primary" size="md">
                        ${plat.ingreso.toFixed(2)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500">Sin ventas este mes</p>
              )}
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>📊 Resumen Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg border-l-4 border-secondary-400">
                  <span className="font-semibold text-neutral-700">Promedio Diario</span>
                  <span className="font-bold text-secondary-600">
                    ${(metrics.ventasMes / new Date().getDate()).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg border-l-4 border-primary-400">
                  <span className="font-semibold text-neutral-700">Unidades Vendidas</span>
                  <span className="font-bold text-primary-600">
                    {topPlatillos.reduce((sum, p) => sum + p.cantidad, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-success-50 rounded-lg border-l-4 border-success-400">
                  <span className="font-semibold text-neutral-700">Mejor Día</span>
                  <a href="#/reportes" className="font-bold text-success-600 hover:underline">
                    Consultar Reportes
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="md:col-span-2">
            <CardHeader>
              <CardTitle>👥 Top Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              {topClientes.length > 0 ? (
                <div className="space-y-3">
                  {topClientes.map((cliente, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      <div>
                        <p className="font-semibold text-neutral-900">{idx + 1}. {cliente.nombre}</p>
                        <p className="text-sm text-neutral-500">{cliente.puntos} puntos</p>
                      </div>
                      <Badge variant="secondary" size="md">
                        ${cliente.compras_totales.toFixed(2)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500">Sin clientes registrados</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Accesos Rápidos */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>⚡ Accesos Rápidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <a href="#/bitacoras" className="no-underline">
                <Button variant="primary" fullWidth size="lg" className="text-center">
                  📊 Venta
                </Button>
              </a>
              <a href="#/ingredientes" className="no-underline">
                <Button variant="warning" fullWidth size="lg" className="text-center">
                  🥕 Ingredientes
                </Button>
              </a>
              <a href="#/proveedores" className="no-underline">
                <Button variant="secondary" fullWidth size="lg" className="text-center">
                  🏪 Proveedores
                </Button>
              </a>
              <a href="#/clientes" className="no-underline">
                <Button variant="success" fullWidth size="lg" className="text-center">
                  👥 Clientes
                </Button>
              </a>
              <a href="#/reportes" className="no-underline">
                <Button variant="error" fullWidth size="lg" className="text-center">
                  📈 Reportes
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

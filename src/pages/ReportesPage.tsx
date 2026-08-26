import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Button, Card, FormInput, MetricCard } from '../components/base'

interface MetricasVentas {
  totalVentas: number
  totalUnidades: number
  precioPromedio: number
  platilloMasVendido: string
  ingresosPorPlatillo: { [key: string]: number }
}

export default function ReportesPage() {
  const [metricas, setMetricas] = useState<MetricasVentas>({
    totalVentas: 0,
    totalUnidades: 0,
    precioPromedio: 0,
    platilloMasVendido: '-',
    ingresosPorPlatillo: {},
  })
  const [totalGastos, setTotalGastos] = useState(0)
  const [totalCompras, setTotalCompras] = useState(0)
  const [totalNomina, setTotalNomina] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filterMes, setFilterMes] = useState(new Date().toISOString().slice(0, 7))

  useEffect(() => {
    fetchDatos()
  }, [filterMes])

  async function fetchDatos() {
    setLoading(true)
    try {
      // Ventas del mes
      const { data: ventasData } = await supabase
        .from('bitacora_ventas_detalle')
        .select('cantidad, precio_unitario, platillo_id')
        .ilike('created_at', `${filterMes}%`)

      if (ventasData) {
        const totalVentas = ventasData.reduce((sum, v) => sum + v.cantidad * v.precio_unitario, 0)
        const totalUnidades = ventasData.reduce((sum, v) => sum + v.cantidad, 0)
        const precioPromedio = totalUnidades > 0 ? totalVentas / totalUnidades : 0

        const ingresosPorPlatillo: { [key: string]: number } = {}
        let platilloMasVendido = '-'
        let maxIngresos = 0

        ventasData.forEach((v) => {
          const ingreso = v.cantidad * v.precio_unitario
          if (!ingresosPorPlatillo[v.platillo_id]) {
            ingresosPorPlatillo[v.platillo_id] = 0
          }
          ingresosPorPlatillo[v.platillo_id] += ingreso
          if (ingresosPorPlatillo[v.platillo_id] > maxIngresos) {
            maxIngresos = ingresosPorPlatillo[v.platillo_id]
            platilloMasVendido = v.platillo_id
          }
        })

        setMetricas({
          totalVentas,
          totalUnidades,
          precioPromedio,
          platilloMasVendido,
          ingresosPorPlatillo,
        })
      }

      // Gastos del mes
      const { data: gastosData } = await supabase
        .from('bitacora_gastos')
        .select('monto')
        .ilike('created_at', `${filterMes}%`)

      if (gastosData) {
        const total = gastosData.reduce((sum, g) => sum + g.monto, 0)
        setTotalGastos(total)
      }

      // Compras del mes
      const { data: comprasData } = await supabase
        .from('bitacora_compras')
        .select('cantidad, precio_unitario')
        .ilike('created_at', `${filterMes}%`)

      if (comprasData) {
        const total = comprasData.reduce((sum, c) => sum + c.cantidad * c.precio_unitario, 0)
        setTotalCompras(total)
      }

      // Nómina del mes
      const { data: nominaData } = await supabase
        .from('nómina')
        .select('salario_base')
        .ilike('mes', `${filterMes}%`)

      if (nominaData) {
        const total = nominaData.reduce((sum, n) => sum + n.salario_base, 0)
        setTotalNomina(total)
      }
    } catch (err) {
      console.error('Error fetching datos:', err)
    } finally {
      setLoading(false)
    }
  }

  const utilidad = metricas.totalVentas - totalGastos - totalCompras - totalNomina
  const margenUtilidad = metricas.totalVentas > 0 ? ((utilidad / metricas.totalVentas) * 100).toFixed(2) : 0
  const puntosEquilibrio =
    metricas.precioPromedio > 0
      ? Math.ceil((totalGastos + totalCompras + totalNomina) / metricas.precioPromedio)
      : 0

  return (
    <div className="min-h-screen bg-nixtamal p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-salsa mb-2">Reportes Financieros</h1>
          <p className="text-carbon text-lg">Análisis de desempeño y rentabilidad</p>
        </div>

        {/* Filtro Mes */}
        <div className="mb-6 flex gap-4">
          <input
            type="month"
            value={filterMes}
            onChange={(e) => setFilterMes(e.target.value)}
            className="px-4 py-2 border-2 border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button
            onClick={() => setFilterMes(new Date().toISOString().slice(0, 7))}
            variant="secondary"
          >
            Mes Actual
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-carbon">Cargando reportes...</p>
          </div>
        ) : (
          <>
            {/* Estado de Resultados */}
            <Card variant="elevated" className="mb-8">
              <div className="p-8">
                <h2 className="text-3xl font-oswald text-primary-700 mb-6">Estado de Resultados - {filterMes}</h2>

                <div className="grid grid-cols-2 gap-8">
                  {/* Ingresos */}
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-4">INGRESOS</h3>
                    <div className="space-y-3 bg-success-50 p-6 rounded-lg border border-success-200">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-700">Ventas</span>
                        <span className="font-mono font-bold text-success-600">${metricas.totalVentas.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Costos */}
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-4">COSTOS Y GASTOS</h3>
                    <div className="space-y-3 bg-error-50 p-6 rounded-lg border border-error-200">
                      <div className="flex justify-between items-center border-b border-error-200 pb-2">
                        <span className="text-neutral-700">Compras de Insumos</span>
                        <span className="font-mono font-bold text-error-600">${totalCompras.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-error-200 pb-2">
                        <span className="text-neutral-700">Gastos Operacionales</span>
                        <span className="font-mono font-bold text-error-600">${totalGastos.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-error-200 pb-2">
                        <span className="text-neutral-700">Nómina</span>
                        <span className="font-mono font-bold text-error-600">${totalNomina.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 font-bold">
                        <span className="text-neutral-700">Total Costos</span>
                        <span className="font-mono text-error-600">${(totalCompras + totalGastos + totalNomina).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Utilidad */}
                <div className="mt-8 pt-8 border-t border-primary-200">
                  <div className={`rounded-lg p-6 border-2 ${utilidad >= 0 ? 'bg-success-50 border-success-300' : 'bg-error-50 border-error-300'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-2xl font-bold text-neutral-900">UTILIDAD NETA</span>
                      <span className={`text-4xl font-bold ${utilidad >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                        ${utilidad.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-right text-sm text-neutral-600">
                      Margen: <span className="font-bold text-neutral-900">{margenUtilidad}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Punto de Equilibrio */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <Card variant="elevated">
                <div className="p-8">
                  <h3 className="text-2xl font-oswald text-primary-700 mb-6">Punto de Equilibrio</h3>
                  <div className="bg-warning-50 border-2 border-warning-300 rounded-lg p-6">
                    <p className="text-center text-neutral-600 mb-4">
                      Unidades necesarias para cubrir costos
                    </p>
                    <div className="text-center">
                      <p className="text-5xl font-bold text-warning-600">{puntosEquilibrio}</p>
                      <p className="text-sm text-neutral-700 mt-2">
                        unidades a ${metricas.precioPromedio.toFixed(2)} c/u
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-warning-200">
                      <p className="text-sm text-neutral-700">
                        Precio promedio venta: <strong>${metricas.precioPromedio.toFixed(2)}</strong>
                      </p>
                      <p className="text-sm text-neutral-700">
                        Costo fijo mensual: <strong>${(totalGastos + totalCompras + totalNomina).toFixed(2)}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Resumen Ventas */}
              <Card variant="elevated">
                <div className="p-8">
                  <h3 className="text-2xl font-oswald text-primary-700 mb-6">Resumen de Ventas</h3>
                  <div className="space-y-4">
                    <MetricCard
                      title="Total Ingresos"
                      value={`$${metricas.totalVentas.toFixed(2)}`}
                      variant="success"
                    />
                    <MetricCard
                      title="Unidades Vendidas"
                      value={metricas.totalUnidades.toString()}
                      variant="primary"
                    />
                    <MetricCard
                      title="Precio Promedio"
                      value={`$${metricas.precioPromedio.toFixed(2)}`}
                      variant="secondary"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Pie Chart - Desglose de Costos */}
              <Card variant="elevated">
                <div className="p-8">
                  <h3 className="text-2xl font-oswald text-primary-700 mb-6">📊 Desglose de Costos</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Compras', value: totalCompras },
                          { name: 'Gastos', value: totalGastos },
                          { name: 'Nómina', value: totalNomina },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#059669" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#dc2626" />
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Bar Chart - Top Productos */}
              <Card variant="elevated">
                <div className="p-8">
                  <h3 className="text-2xl font-oswald text-primary-700 mb-6">🥘 Top Productos por Ingreso</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(metricas.ingresosPorPlatillo).slice(0, 5).map(([id, ingreso]) => ({
                      name: id,
                      ingreso,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                      <Bar dataKey="ingreso" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Platillo Más Vendido */}
            <Card variant="elevated">
              <div className="p-8">
                <h3 className="text-2xl font-oswald text-primary-700 mb-6">Desempeño por Platillo</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetricCard
                    title="Platillo Más Vendido"
                    value={metricas.platilloMasVendido}
                    variant="primary"
                  />
                  <MetricCard
                    title="Total de Platillos Únicos"
                    value={Object.keys(metricas.ingresosPorPlatillo).length.toString()}
                    variant="secondary"
                  />
                  <MetricCard
                    title="Período"
                    value={filterMes}
                    variant="warning"
                  />
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

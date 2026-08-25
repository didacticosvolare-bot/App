import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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
        .timeout(5000)

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
        .timeout(5000)

      if (gastosData) {
        const total = gastosData.reduce((sum, g) => sum + g.monto, 0)
        setTotalGastos(total)
      }

      // Compras del mes
      const { data: comprasData } = await supabase
        .from('bitacora_compras')
        .select('cantidad, precio_unitario')
        .ilike('created_at', `${filterMes}%`)
        .timeout(5000)

      if (comprasData) {
        const total = comprasData.reduce((sum, c) => sum + c.cantidad * c.precio_unitario, 0)
        setTotalCompras(total)
      }

      // Nómina del mes
      const { data: nominaData } = await supabase
        .from('nómina')
        .select('salario_base')
        .ilike('mes', `${filterMes}%`)
        .timeout(5000)

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
            className="px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
          />
          <button
            onClick={() => setFilterMes(new Date().toISOString().slice(0, 7))}
            className="px-4 py-2 bg-gray-300 text-carbon font-semibold rounded hover:bg-gray-400 transition"
          >
            Mes Actual
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-carbon">Cargando reportes...</p>
          </div>
        ) : (
          <>
            {/* Estado de Resultados */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-salsa p-8 mb-8">
              <h2 className="text-3xl font-oswald text-salsa mb-6">Estado de Resultados - {filterMes}</h2>

              <div className="grid grid-cols-2 gap-8">
                {/* Ingresos */}
                <div>
                  <h3 className="text-xl font-bold text-carbon mb-4">INGRESOS</h3>
                  <div className="space-y-3 bg-blue-50 p-6 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-carbon">Ventas</span>
                      <span className="font-mono font-bold text-blue-600">${metricas.totalVentas.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Costos */}
                <div>
                  <h3 className="text-xl font-bold text-carbon mb-4">COSTOS Y GASTOS</h3>
                  <div className="space-y-3 bg-red-50 p-6 rounded-lg">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-carbon">Compras de Insumos</span>
                      <span className="font-mono font-bold text-red-600">${totalCompras.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-carbon">Gastos Operacionales</span>
                      <span className="font-mono font-bold text-red-600">${totalGastos.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-carbon">Nómina</span>
                      <span className="font-mono font-bold text-red-600">${totalNomina.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 font-bold">
                      <span className="text-carbon">Total Costos</span>
                      <span className="font-mono text-red-600">${(totalCompras + totalGastos + totalNomina).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Utilidad */}
              <div className="mt-8 pt-8 border-t-2 border-salsa">
                <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-400 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-carbon">UTILIDAD NETA</span>
                    <span className={`text-4xl font-bold ${utilidad >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${utilidad.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    Margen: <span className="font-bold text-carbon">{margenUtilidad}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Punto de Equilibrio */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-lg border-2 border-salsa p-8">
                <h3 className="text-2xl font-oswald text-salsa mb-6">Punto de Equilibrio</h3>
                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                  <p className="text-center text-gray-600 mb-4">
                    Unidades necesarias para cubrir costos
                  </p>
                  <div className="text-center">
                    <p className="text-5xl font-bold text-yellow-600">{puntosEquilibrio}</p>
                    <p className="text-sm text-carbon mt-2">
                      unidades a ${metricas.precioPromedio.toFixed(2)} c/u
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-yellow-300">
                    <p className="text-sm text-carbon">
                      Precio promedio venta: <strong>${metricas.precioPromedio.toFixed(2)}</strong>
                    </p>
                    <p className="text-sm text-carbon">
                      Costo fijo mensual: <strong>${(totalGastos + totalCompras + totalNomina).toFixed(2)}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Resumen Ventas */}
              <div className="bg-white rounded-lg shadow-lg border-2 border-salsa p-8">
                <h3 className="text-2xl font-oswald text-salsa mb-6">Resumen de Ventas</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                    <p className="text-sm text-gray-600">Total Ingresos</p>
                    <p className="text-3xl font-bold text-green-600">${metricas.totalVentas.toFixed(2)}</p>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <p className="text-sm text-gray-600">Unidades Vendidas</p>
                    <p className="text-3xl font-bold text-blue-600">{metricas.totalUnidades}</p>
                  </div>
                  <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
                    <p className="text-sm text-gray-600">Precio Promedio</p>
                    <p className="text-3xl font-bold text-purple-600">${metricas.precioPromedio.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Platillo Más Vendido */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-salsa p-8">
              <h3 className="text-2xl font-oswald text-salsa mb-6">Desempeño por Platillo</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-salsa text-white rounded-lg p-6 text-center">
                  <p className="text-sm mb-2">Platillo Más Vendido</p>
                  <p className="text-2xl font-bold">{metricas.platilloMasVendido}</p>
                </div>
                <div className="bg-totopo text-white rounded-lg p-6 text-center">
                  <p className="text-sm mb-2">Total de Platillos Únicos</p>
                  <p className="text-2xl font-bold">{Object.keys(metricas.ingresosPorPlatillo).length}</p>
                </div>
                <div className="bg-guajillo text-white rounded-lg p-6 text-center">
                  <p className="text-sm mb-2">Período</p>
                  <p className="text-2xl font-bold">{filterMes}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

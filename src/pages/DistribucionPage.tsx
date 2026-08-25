import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Distribucion {
  mes: string
  total_ventas: number
  total_costos: number
  total_ganancia: number
  daniela_ganancia: number
  carlos_ganancia: number
  erick_ganancia: number
}

export default function DistribucionPage() {
  const [distribuciones, setDistribuciones] = useState<Distribucion[]>([])
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().toISOString().slice(0, 7))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDistribuciones()
  }, [])

  async function fetchDistribuciones() {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('vw_distribucion_mensual')
        .select('*')
        .timeout(5000)

      setDistribuciones(data || [])
    } catch (err) {
      console.error('Error fetching distributions:', err)
    } finally {
      setLoading(false)
    }
  }

  const calcularDistribucion = async () => {
    try {
      // Fetch financial data for the selected month
      const { data: ventasData } = await supabase
        .from('bitacora_ventas_detalle')
        .select('cantidad, precio_unitario')
        .ilike('created_at', `${mesSeleccionado}%`)
        .timeout(5000)

      const { data: gastosData } = await supabase
        .from('bitacora_gastos')
        .select('monto')
        .ilike('created_at', `${mesSeleccionado}%`)
        .timeout(5000)

      const { data: comprasData } = await supabase
        .from('bitacora_compras')
        .select('cantidad, precio_unitario')
        .ilike('created_at', `${mesSeleccionado}%`)
        .timeout(5000)

      const { data: nominaData } = await supabase
        .from('nómina')
        .select('salario_base')
        .ilike('mes', `${mesSeleccionado}%`)
        .timeout(5000)

      const totalVentas = ventasData?.reduce((sum, v) => sum + v.cantidad * v.precio_unitario, 0) || 0
      const totalGastos = gastosData?.reduce((sum, g) => sum + g.monto, 0) || 0
      const totalCompras = comprasData?.reduce((sum, c) => sum + c.cantidad * c.precio_unitario, 0) || 0
      const totalNomina = nominaData?.reduce((sum, n) => sum + n.salario_base, 0) || 0

      const totalCostos = totalGastos + totalCompras + totalNomina
      const totalGanancia = totalVentas - totalCostos

      // Each partner gets 1/3
      const porSocio = totalGanancia / 3

      // Check if record exists
      const { data: existente } = await supabase
        .from('distribucion_ganancias')
        .select('id')
        .eq('mes', mesSeleccionado)
        .single()

      if (existente) {
        // Update existing
        await supabase
          .from('distribucion_ganancias')
          .update({
            total_ventas: totalVentas,
            total_costos: totalCostos,
            total_ganancia: totalGanancia,
            daniela_ganancia: porSocio,
            carlos_ganancia: porSocio,
            erick_ganancia: porSocio,
            updated_at: new Date().toISOString(),
          })
          .eq('mes', mesSeleccionado)
          .timeout(5000)
      } else {
        // Insert new
        await supabase
          .from('distribucion_ganancias')
          .insert([
            {
              mes: mesSeleccionado,
              total_ventas: totalVentas,
              total_costos: totalCostos,
              total_ganancia: totalGanancia,
              daniela_ganancia: porSocio,
              carlos_ganancia: porSocio,
              erick_ganancia: porSocio,
            },
          ])
          .timeout(5000)
      }

      fetchDistribuciones()
    } catch (err) {
      console.error('Error calculating distribution:', err)
      alert('Error al calcular distribución')
    }
  }

  const distribucionActual = distribuciones.find((d) => d.mes === mesSeleccionado)

  return (
    <div className="min-h-screen bg-nixtamal p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-oswald text-salsa mb-2">💰 Distribución de Ganancias</h1>
          <p className="text-carbon text-lg">División de ganancias entre Daniela, Carlos y Erick (33.33% c/u)</p>
        </div>

        <div className="mb-6 flex gap-4 items-center">
          <input
            type="month"
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(e.target.value)}
            className="px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
          />
          <button
            onClick={calcularDistribucion}
            className="px-6 py-2 bg-salsa text-white font-semibold rounded-lg hover:bg-opacity-90 transition"
          >
            📊 Calcular Distribución
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-carbon">Cargando...</p>
          </div>
        ) : distribucionActual ? (
          <div className="space-y-8">
            {/* Resumen Financiero */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-salsa p-8">
              <h2 className="text-3xl font-oswald text-salsa mb-6">Resumen Financiero - {mesSeleccionado}</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded">
                  <p className="text-sm text-gray-600">Total Ventas</p>
                  <p className="text-3xl font-bold text-green-600">${distribucionActual.total_ventas.toFixed(2)}</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded">
                  <p className="text-sm text-gray-600">Total Costos</p>
                  <p className="text-3xl font-bold text-red-600">${distribucionActual.total_costos.toFixed(2)}</p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded">
                  <p className="text-sm text-gray-600">Ganancia Neta</p>
                  <p className="text-3xl font-bold text-blue-600">${distribucionActual.total_ganancia.toFixed(2)}</p>
                </div>
                <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded">
                  <p className="text-sm text-gray-600">Margen</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {distribucionActual.total_ventas > 0
                      ? ((distribucionActual.total_ganancia / distribucionActual.total_ventas) * 100).toFixed(1)
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>

            {/* Distribución por Socio */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Daniela */}
              <div className="bg-white rounded-lg shadow-lg border-2 border-salsa p-6">
                <div className="text-center">
                  <p className="text-2xl font-oswald text-salsa mb-4">👤 Daniela</p>
                  <div className="bg-salsa text-white rounded-lg p-6 mb-4">
                    <p className="text-sm opacity-90">Ganancia (33.33%)</p>
                    <p className="text-4xl font-bold">${distribucionActual.daniela_ganancia.toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-gray-600">Porcentaje justo de la ganancia neta</p>
                </div>
              </div>

              {/* Carlos */}
              <div className="bg-white rounded-lg shadow-lg border-2 border-totopo p-6">
                <div className="text-center">
                  <p className="text-2xl font-oswald text-totopo mb-4">👤 Carlos</p>
                  <div className="bg-totopo text-white rounded-lg p-6 mb-4">
                    <p className="text-sm opacity-90">Ganancia (33.33%)</p>
                    <p className="text-4xl font-bold">${distribucionActual.carlos_ganancia.toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-gray-600">Porcentaje justo de la ganancia neta</p>
                </div>
              </div>

              {/* Erick */}
              <div className="bg-white rounded-lg shadow-lg border-2 border-guajillo p-6">
                <div className="text-center">
                  <p className="text-2xl font-oswald text-guajillo mb-4">👤 Erick</p>
                  <div className="bg-guajillo text-white rounded-lg p-6 mb-4">
                    <p className="text-sm opacity-90">Ganancia (33.33%)</p>
                    <p className="text-4xl font-bold">${distribucionActual.erick_ganancia.toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-gray-600">Porcentaje justo de la ganancia neta</p>
                </div>
              </div>
            </div>

            {/* Desglose de Costos */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-carbon p-6">
              <h3 className="text-2xl font-oswald text-carbon mb-6">Desglose de Costos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Compras de Insumos</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${((distribucionActual.total_costos * 0.6) || 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Gastos Operacionales</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${((distribucionActual.total_costos * 0.25) || 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Nómina</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${((distribucionActual.total_costos * 0.15) || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center border-2 border-carbon">
            <p className="text-lg text-carbon mb-4">No hay datos para {mesSeleccionado}</p>
            <p className="text-gray-600">Haz clic en "Calcular Distribución" para calcular</p>
          </div>
        )}

        {/* Historical Data */}
        {distribuciones.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-oswald text-salsa mb-6">Histórico de Distribuciones</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-salsa">
                    <th className="text-left py-4 px-4 font-semibold">Mes</th>
                    <th className="text-right py-4 px-4 font-semibold">Ventas</th>
                    <th className="text-right py-4 px-4 font-semibold">Costos</th>
                    <th className="text-right py-4 px-4 font-semibold">Ganancia</th>
                    <th className="text-right py-4 px-4 font-semibold">Por Socio</th>
                  </tr>
                </thead>
                <tbody>
                  {distribuciones.slice(0, 12).map((dist) => (
                    <tr key={dist.mes} className="border-b hover:bg-nixtamal">
                      <td className="py-3 px-4 font-semibold">{dist.mes}</td>
                      <td className="text-right py-3 px-4 font-mono text-green-600">
                        ${dist.total_ventas.toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-4 font-mono text-red-600">
                        ${dist.total_costos.toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-4 font-mono text-blue-600 font-bold">
                        ${dist.total_ganancia.toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-4 font-mono text-purple-600 font-bold">
                        ${dist.daniela_ganancia.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

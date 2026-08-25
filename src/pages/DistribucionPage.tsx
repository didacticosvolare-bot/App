import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { MetricCard, Card, CardHeader, CardTitle, CardContent, Button, FormInput } from '../components/base'

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

        <div className="mb-6 flex gap-4 items-end">
          <FormInput
            label="Período"
            type="month"
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(e.target.value)}
          />
          <Button
            variant="primary"
            size="lg"
            onClick={calcularDistribucion}
          >
            📊 Calcular Distribución
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-carbon">Cargando...</p>
          </div>
        ) : distribucionActual ? (
          <div className="space-y-8">
            {/* Resumen Financiero */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Resumen Financiero - {mesSeleccionado}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <MetricCard
                    title="Total Ventas"
                    value={`$${distribucionActual.total_ventas.toFixed(2)}`}
                    color="success"
                    icon="💰"
                  />
                  <MetricCard
                    title="Total Costos"
                    value={`$${distribucionActual.total_costos.toFixed(2)}`}
                    color="error"
                    icon="💸"
                  />
                  <MetricCard
                    title="Ganancia Neta"
                    value={`$${distribucionActual.total_ganancia.toFixed(2)}`}
                    color="primary"
                    icon="💵"
                  />
                  <MetricCard
                    title="Margen"
                    value={`${distribucionActual.total_ventas > 0 ? ((distribucionActual.total_ganancia / distribucionActual.total_ventas) * 100).toFixed(1) : 0}%`}
                    color="warning"
                    icon="📊"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Distribución por Socio */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="elevated">
                <CardContent className="text-center">
                  <p className="text-2xl font-bold text-primary-600 mb-4">👤 Daniela</p>
                  <MetricCard
                    title="Ganancia (33.33%)"
                    value={`$${distribucionActual.daniela_ganancia.toFixed(2)}`}
                    color="primary"
                  />
                  <p className="text-sm text-neutral-600 mt-4">Porcentaje justo de la ganancia neta</p>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="text-center">
                  <p className="text-2xl font-bold text-totopo mb-4">👤 Carlos</p>
                  <MetricCard
                    title="Ganancia (33.33%)"
                    value={`$${distribucionActual.carlos_ganancia.toFixed(2)}`}
                    color="secondary"
                  />
                  <p className="text-sm text-neutral-600 mt-4">Porcentaje justo de la ganancia neta</p>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="text-center">
                  <p className="text-2xl font-bold text-guajillo mb-4">👤 Erick</p>
                  <MetricCard
                    title="Ganancia (33.33%)"
                    value={`$${distribucionActual.erick_ganancia.toFixed(2)}`}
                    color="warning"
                  />
                  <p className="text-sm text-neutral-600 mt-4">Porcentaje justo de la ganancia neta</p>
                </CardContent>
              </Card>
            </div>

            {/* Desglose de Costos */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Desglose de Costos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetricCard
                    title="Compras de Insumos"
                    value={`$${((distribucionActual.total_costos * 0.6) || 0).toFixed(2)}`}
                    subtitle="60% de costos"
                    color="error"
                  />
                  <MetricCard
                    title="Gastos Operacionales"
                    value={`$${((distribucionActual.total_costos * 0.25) || 0).toFixed(2)}`}
                    subtitle="25% de costos"
                    color="warning"
                  />
                  <MetricCard
                    title="Nómina"
                    value={`$${((distribucionActual.total_costos * 0.15) || 0).toFixed(2)}`}
                    subtitle="15% de costos"
                    color="secondary"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card variant="elevated">
            <CardContent className="text-center">
              <p className="text-lg text-neutral-900 mb-4">No hay datos para {mesSeleccionado}</p>
              <p className="text-neutral-600">Haz clic en "Calcular Distribución" para calcular</p>
            </CardContent>
          </Card>
        )}

        {/* Historical Data */}
        {distribuciones.length > 0 && (
          <Card variant="elevated" className="mt-12">
            <CardHeader>
              <CardTitle>Histórico de Distribuciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-primary-300">
                      <th className="text-left py-4 px-4 font-semibold text-neutral-700">Mes</th>
                      <th className="text-right py-4 px-4 font-semibold text-neutral-700">Ventas</th>
                      <th className="text-right py-4 px-4 font-semibold text-neutral-700">Costos</th>
                      <th className="text-right py-4 px-4 font-semibold text-neutral-700">Ganancia</th>
                      <th className="text-right py-4 px-4 font-semibold text-neutral-700">Por Socio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distribuciones.slice(0, 12).map((dist) => (
                      <tr key={dist.mes} className="border-b hover:bg-neutral-50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-neutral-900">{dist.mes}</td>
                        <td className="text-right py-3 px-4 font-mono text-success-600">
                          ${dist.total_ventas.toFixed(2)}
                        </td>
                        <td className="text-right py-3 px-4 font-mono text-error-600">
                          ${dist.total_costos.toFixed(2)}
                        </td>
                        <td className="text-right py-3 px-4 font-mono text-primary-600 font-bold">
                          ${dist.total_ganancia.toFixed(2)}
                        </td>
                        <td className="text-right py-3 px-4 font-mono text-secondary-600 font-bold">
                          ${dist.daniela_ganancia.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface AlertaInventario {
  id: string
  nombre_ingrediente: string
  stock_actual: number
  stock_minimo: number
  unidades_faltantes: number
}

interface Props {
  compact?: boolean
}

export default function InventoryAlerts({ compact = false }: Props) {
  const [alertas, setAlertas] = useState<AlertaInventario[]>([])
  const [agotados, setAgotados] = useState<AlertaInventario[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlertas()
  }, [])

  async function fetchAlertas() {
    setLoading(true)
    try {
      const { data: baja } = await supabase
        .from('vw_ingredientes_bajos')
        .select('*')
        
      const { data: agotados_data } = await supabase
        .from('vw_ingredientes_agotados')
        .select('*')
        
      setAlertas(baja || [])
      setAgotados(agotados_data || [])
    } catch (err) {
      console.error('Error fetching inventory alerts:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return null

  const totalAlertas = alertas.length + agotados.length

  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-4 mb-8">
        {agotados.length > 0 && (
          <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4">
            <p className="text-sm text-red-700 font-semibold">🚨 AGOTADOS</p>
            <p className="text-3xl font-bold text-red-600">{agotados.length}</p>
            <p className="text-xs text-red-600">Ingredientes sin stock</p>
          </div>
        )}
        {alertas.length > 0 && (
          <div className="bg-yellow-100 border-2 border-yellow-500 rounded-lg p-4">
            <p className="text-sm text-yellow-700 font-semibold">⚠️ BAJO STOCK</p>
            <p className="text-3xl font-bold text-yellow-600">{alertas.length}</p>
            <p className="text-xs text-yellow-600">Bajo mínimo</p>
          </div>
        )}
      </div>
    )
  }

  if (totalAlertas === 0) return null

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-guajillo p-6 mb-8">
      <h2 className="text-2xl font-oswald text-guajillo mb-6">🚨 Alertas de Inventario</h2>

      {agotados.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-red-600 mb-3">Ingredientes Agotados ({agotados.length})</h3>
          <div className="space-y-2">
            {agotados.map((item) => (
              <div key={item.id} className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                <p className="font-semibold text-red-700">{item.nombre_ingrediente}</p>
                <p className="text-sm text-red-600">Stock: {item.stock_actual} | Mínimo: {item.stock_minimo}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {alertas.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-yellow-600 mb-3">Bajo Mínimo ({alertas.length})</h3>
          <div className="space-y-2">
            {alertas.map((item) => (
              <div key={item.id} className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                <p className="font-semibold text-yellow-700">{item.nombre_ingrediente}</p>
                <p className="text-sm text-yellow-600">
                  Stock: {item.stock_actual} | Falta: {item.unidades_faltantes} para mínimo de {item.stock_minimo}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

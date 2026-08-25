import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import InventoryAlerts from '../components/InventoryAlerts'

interface Ingrediente {
  id: string
  nombre_ingrediente: string
  categoria: string
  stock_actual: number
  stock_minimo: number
  unidad_medida: string
  precio_costo: number
}

export default function InventoryPage() {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([])
  const [loading, setLoading] = useState(true)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [nuevoStock, setNuevoStock] = useState('')
  const [motivo, setMotivo] = useState('')

  useEffect(() => {
    fetchIngredientes()
  }, [])

  async function fetchIngredientes() {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('ingredientes')
        .select('*')
        .order('nombre_ingrediente')
        .timeout(5000)

      setIngredientes(data || [])
    } catch (err) {
      console.error('Error fetching ingredientes:', err)
    } finally {
      setLoading(false)
    }
  }

  async function actualizarStock(id: string, nuevoValor: number) {
    try {
      const { error } = await supabase
        .from('ingredientes')
        .update({ stock_actual: nuevoValor })
        .eq('id', id)
        .timeout(5000)

      if (error) throw error

      // Log the change
      await supabase
        .from('bitacora_inventario')
        .insert([
          {
            ingrediente_id: id,
            tipo: 'ajuste',
            cantidad: nuevoValor - (ingredientes.find((i) => i.id === id)?.stock_actual || 0),
            motivo: motivo || 'Ajuste manual',
            realizado_por: 'Admin',
          },
        ])
        .timeout(5000)

      fetchIngredientes()
      setEditandoId(null)
      setNuevoStock('')
      setMotivo('')
    } catch (err) {
      console.error('Error updating stock:', err)
      alert('Error al actualizar stock')
    }
  }

  const getColorStatus = (actual: number, minimo: number) => {
    if (actual <= 0) return 'bg-red-100 text-red-700'
    if (actual <= minimo) return 'bg-yellow-100 text-yellow-700'
    return 'bg-green-100 text-green-700'
  }

  return (
    <div className="min-h-screen bg-nixtamal p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-oswald text-salsa mb-2">📦 Gestión de Inventario</h1>
          <p className="text-carbon text-lg">Control de stock de ingredientes</p>
        </div>

        <InventoryAlerts compact={false} />

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-carbon">Cargando...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg border-2 border-salsa p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-salsa">
                    <th className="text-left py-4 px-4 font-semibold">Ingrediente</th>
                    <th className="text-center py-4 px-4 font-semibold">Categoría</th>
                    <th className="text-center py-4 px-4 font-semibold">Stock</th>
                    <th className="text-center py-4 px-4 font-semibold">Mínimo</th>
                    <th className="text-center py-4 px-4 font-semibold">Unidad</th>
                    <th className="text-right py-4 px-4 font-semibold">Costo Unit.</th>
                    <th className="text-center py-4 px-4 font-semibold">Estado</th>
                    <th className="text-center py-4 px-4 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredientes.map((ing) => (
                    <tr key={ing.id} className="border-b hover:bg-nixtamal transition">
                      <td className="py-4 px-4 font-semibold text-carbon">{ing.nombre_ingrediente}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                          {ing.categoria}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {editandoId === ing.id ? (
                          <input
                            type="number"
                            value={nuevoStock}
                            onChange={(e) => setNuevoStock(e.target.value)}
                            className="w-20 px-2 py-1 border border-carbon rounded text-center"
                            autoFocus
                          />
                        ) : (
                          <span className="font-bold text-lg">{ing.stock_actual}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">{ing.stock_minimo}</td>
                      <td className="py-4 px-4 text-center text-sm">{ing.unidad_medida}</td>
                      <td className="py-4 px-4 text-right font-mono">${ing.precio_costo.toFixed(2)}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getColorStatus(ing.stock_actual, ing.stock_minimo)}`}>
                          {ing.stock_actual <= 0
                            ? 'AGOTADO'
                            : ing.stock_actual <= ing.stock_minimo
                              ? 'BAJO'
                              : 'OK'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {editandoId === ing.id ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => actualizarStock(ing.id, parseInt(nuevoStock) || 0)}
                              className="px-3 py-1 bg-salsa text-white rounded hover:bg-opacity-90 transition text-sm font-semibold"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditandoId(null)}
                              className="px-3 py-1 bg-gray-400 text-white rounded text-sm font-semibold"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditandoId(ing.id)
                              setNuevoStock(ing.stock_actual.toString())
                            }}
                            className="px-3 py-1 bg-totopo text-white rounded hover:bg-opacity-90 transition text-sm font-semibold"
                          >
                            Editar
                          </button>
                        )}
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

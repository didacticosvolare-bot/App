import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import InventoryAlerts from '../components/InventoryAlerts'
import { Button, Card, FormInput } from '../components/base'

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
            <p className="text-xl text-neutral-600">Cargando ingredientes...</p>
          </div>
        ) : (
          <Card variant="elevated">
            <div className="p-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-4 px-4 font-semibold text-neutral-900">Ingrediente</th>
                    <th className="text-center py-4 px-4 font-semibold text-neutral-900">Categoría</th>
                    <th className="text-center py-4 px-4 font-semibold text-neutral-900">Stock</th>
                    <th className="text-center py-4 px-4 font-semibold text-neutral-900">Mínimo</th>
                    <th className="text-center py-4 px-4 font-semibold text-neutral-900">Unidad</th>
                    <th className="text-right py-4 px-4 font-semibold text-neutral-900">Costo Unit.</th>
                    <th className="text-center py-4 px-4 font-semibold text-neutral-900">Estado</th>
                    <th className="text-center py-4 px-4 font-semibold text-neutral-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredientes.map((ing) => (
                    <tr key={ing.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition">
                      <td className="py-4 px-4 font-semibold text-neutral-900">{ing.nombre_ingrediente}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="px-3 py-1 bg-neutral-200 text-neutral-700 rounded text-sm font-medium">
                          {ing.categoria}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {editandoId === ing.id ? (
                          <input
                            type="number"
                            value={nuevoStock}
                            onChange={(e) => setNuevoStock(e.target.value)}
                            className="w-20 px-2 py-1 border border-neutral-300 rounded text-center"
                            autoFocus
                          />
                        ) : (
                          <span className="font-bold text-lg text-neutral-900">{ing.stock_actual}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center text-neutral-700">{ing.stock_minimo}</td>
                      <td className="py-4 px-4 text-center text-sm text-neutral-700">{ing.unidad_medida}</td>
                      <td className="py-4 px-4 text-right font-mono text-neutral-900">${ing.precio_costo.toFixed(2)}</td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            ing.stock_actual <= 0
                              ? 'bg-error-100 text-error-700'
                              : ing.stock_actual <= ing.stock_minimo
                                ? 'bg-warning-100 text-warning-700'
                                : 'bg-success-100 text-success-700'
                          }`}
                        >
                          {ing.stock_actual <= 0 ? 'AGOTADO' : ing.stock_actual <= ing.stock_minimo ? 'BAJO' : 'OK'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {editandoId === ing.id ? (
                          <div className="flex gap-2 justify-center">
                            <Button
                              onClick={() => actualizarStock(ing.id, parseInt(nuevoStock) || 0)}
                              variant="success"
                              size="sm"
                            >
                              Guardar
                            </Button>
                            <Button onClick={() => setEditandoId(null)} variant="ghost" size="sm">
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => {
                              setEditandoId(ing.id)
                              setNuevoStock(ing.stock_actual.toString())
                            }}
                            variant="secondary"
                            size="sm"
                          >
                            Editar
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

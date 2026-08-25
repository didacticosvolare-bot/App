import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Ingrediente {
  id: string
  nombre: string
  unidad_compra: string
}

interface Props {
  onClose: () => void
}

export default function BitacoraMermasForm({ onClose }: Props) {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([])
  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [razon, setRazon] = useState('caducidad')
  const [descripcion, setDescripcion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const razones = ['Caducidad', 'Deterioro', 'Desperdicio', 'Otros']

  useEffect(() => {
    fetchIngredientes()
  }, [])

  async function fetchIngredientes() {
    const { data } = await supabase.from('ingredientes').select('id, nombre, unidad_compra').order('nombre')
    if (data) {
      setIngredientes(data)
    }
  }

  const ingredienteSeleccion = ingredientes.find((i) => i.id === ingredienteSeleccionado)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!ingredienteSeleccionado || !cantidad) {
      setError('Completa todos los campos requeridos')
      setLoading(false)
      return
    }

    try {
      const { error: insertError } = await supabase.from('bitacora_mermas').insert([
        {
          ingrediente_id: ingredienteSeleccionado,
          cantidad: parseFloat(cantidad),
          razon: razon.toLowerCase(),
          descripcion: descripcion.trim() || null,
          created_at: new Date().toISOString(),
        },
      ])

      if (insertError) throw insertError

      setSuccess(
        `✅ Merma registrada: ${cantidad} ${ingredienteSeleccion?.unidad_compra} de ${ingredienteSeleccion?.nombre}`
      )
      setCantidad('')
      setDescripcion('')
      setRazon('caducidad')
      setIngredienteSeleccionado('')

      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border-2 border-salsa rounded-lg p-6">
      <h2 className="text-2xl font-oswald text-salsa mb-6">Registrar Merma / Desperdicio</h2>

      {error && <div className="mb-4 p-4 bg-guajillo text-white rounded-lg">{error}</div>}
      {success && <div className="mb-4 p-4 bg-green-500 text-white rounded-lg">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold text-carbon mb-2">Ingrediente *</label>
          <select
            value={ingredienteSeleccionado}
            onChange={(e) => setIngredienteSeleccionado(e.target.value)}
            className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
          >
            <option value="">Seleccionar ingrediente</option>
            {ingredientes.map((ing) => (
              <option key={ing.id} value={ing.id}>
                {ing.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-carbon mb-2">Cantidad *</label>
            <input
              type="number"
              step="0.1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="Ej: 2.5"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>

          <div>
            <label className="block font-semibold text-carbon mb-2">Razón</label>
            <select
              value={razon}
              onChange={(e) => setRazon(e.target.value)}
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            >
              {razones.map((r) => (
                <option key={r} value={r.toLowerCase()}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-carbon mb-2">Descripción / Notas</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Información adicional sobre la merma..."
            rows={3}
            className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
          />
        </div>

        {cantidad && ingredienteSeleccion && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-sm text-carbon">
              <strong>Merma:</strong> {cantidad} {ingredienteSeleccion.unidad_compra} de {ingredienteSeleccion.nombre}
            </p>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Registrando...' : 'Registrar Merma'}
          </button>
        </div>
      </form>
    </div>
  )
}

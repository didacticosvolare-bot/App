import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Ingrediente {
  id: string
  nombre: string
  unidad_compra: string
}

interface DetalleLine {
  ingrediente: string
  cantidad: string
  unidad: string
}

interface Props {
  editingId: string | null
  onClose: () => void
}

export default function SubrecetaForm({ editingId, onClose }: Props) {
  const [nombreSubreceta, setNombreSubreceta] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([])
  const [detalles, setDetalles] = useState<DetalleLine[]>([
    { ingrediente: '', cantidad: '', unidad: 'Kg' },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchIngredientes()
    if (editingId) {
      fetchSubreceta()
    }
  }, [editingId])

  async function fetchIngredientes() {
    const { data } = await supabase.from('ingredientes').select('id, nombre, unidad_compra').order('nombre')
    if (data) {
      setIngredientes(data)
    }
  }

  async function fetchSubreceta() {
    const { data: subreceta } = await supabase
      .from('subrecetas')
      .select('*')
      .eq('id', editingId)
      .single()

    if (subreceta) {
      setNombreSubreceta(subreceta.nombre_subreceta)
      setDescripcion(subreceta.descripcion || '')
    }

    const { data: detallesData } = await supabase
      .from('subreceta_detalle')
      .select('ingrediente, cantidad, unidad')
      .eq('subreceta_id', editingId)

    if (detallesData && detallesData.length > 0) {
      setDetalles(
        detallesData.map((d) => ({
          ingrediente: d.ingrediente,
          cantidad: d.cantidad.toString(),
          unidad: d.unidad,
        }))
      )
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!nombreSubreceta.trim() || detalles.filter((d) => d.ingrediente).length === 0) {
      setError('Completa el nombre y al menos un ingrediente')
      setLoading(false)
      return
    }

    try {
      let subrecetaId = editingId

      if (editingId) {
        const { error: updateError } = await supabase
          .from('subrecetas')
          .update({
            nombre_subreceta: nombreSubreceta.trim(),
            descripcion: descripcion.trim() || null,
          })
          .eq('id', editingId)

        if (updateError) throw updateError

        await supabase.from('subreceta_detalle').delete().eq('subreceta_id', editingId)
      } else {
        const { data: newSubreceta, error: insertError } = await supabase
          .from('subrecetas')
          .insert([
            {
              nombre_subreceta: nombreSubreceta.trim(),
              descripcion: descripcion.trim() || null,
            },
          ])
          .select()

        if (insertError) throw insertError
        if (!newSubreceta || !newSubreceta[0]) throw new Error('No se pudo crear la subreceta')

        subrecetaId = newSubreceta[0].id
      }

      const detallesInsert = detalles
        .filter((d) => d.ingrediente && d.cantidad)
        .map((d) => ({
          subreceta_id: subrecetaId,
          ingrediente: d.ingrediente,
          cantidad: parseFloat(d.cantidad),
          unidad: d.unidad,
        }))

      if (detallesInsert.length > 0) {
        const { error: detalleError } = await supabase.from('subreceta_detalle').insert(detallesInsert)
        if (detalleError) throw detalleError
      }

      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border-2 border-salsa rounded-lg p-6">
      <h2 className="text-2xl font-oswald text-salsa mb-6">
        {editingId ? 'Editar Subreceta' : 'Nueva Subreceta'}
      </h2>

      {error && <div className="mb-4 p-4 bg-guajillo text-white rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-carbon mb-2">Nombre *</label>
            <input
              type="text"
              value={nombreSubreceta}
              onChange={(e) => setNombreSubreceta(e.target.value)}
              placeholder="Ej: Salsa roja base..."
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>

          <div>
            <label className="block font-semibold text-carbon mb-2">Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Opcional"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block font-semibold text-carbon">Ingredientes *</label>
            <button
              type="button"
              onClick={() => setDetalles([...detalles, { ingrediente: '', cantidad: '', unidad: 'Kg' }])}
              className="text-sm px-3 py-1 bg-salsa text-white rounded hover:bg-opacity-90"
            >
              + Agregar
            </button>
          </div>

          <div className="space-y-3">
            {detalles.map((detalle, idx) => (
              <div key={idx} className="flex gap-3 items-end">
                <div className="flex-1">
                  <select
                    value={detalle.ingrediente}
                    onChange={(e) => {
                      const newDetalles = [...detalles]
                      newDetalles[idx].ingrediente = e.target.value
                      setDetalles(newDetalles)
                    }}
                    className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
                  >
                    <option value="">Seleccionar ingrediente</option>
                    {ingredientes.map((ing) => (
                      <option key={ing.id} value={ing.nombre}>
                        {ing.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-32">
                  <input
                    type="number"
                    step="0.1"
                    value={detalle.cantidad}
                    onChange={(e) => {
                      const newDetalles = [...detalles]
                      newDetalles[idx].cantidad = e.target.value
                      setDetalles(newDetalles)
                    }}
                    placeholder="Cantidad"
                    className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
                  />
                </div>

                <div className="w-32">
                  <select
                    value={detalle.unidad}
                    onChange={(e) => {
                      const newDetalles = [...detalles]
                      newDetalles[idx].unidad = e.target.value
                      setDetalles(newDetalles)
                    }}
                    className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
                  >
                    {['Kg', 'Litro', 'Pieza', 'Gramo', 'Ml'].map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                {detalles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setDetalles(detalles.filter((_, i) => i !== idx))}
                    className="px-3 py-2 bg-guajillo text-white rounded hover:bg-opacity-90"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Subreceta'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-carbon font-semibold rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

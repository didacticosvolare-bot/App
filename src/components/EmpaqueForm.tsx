import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Props {
  editingId: string | null
  onClose: () => void
}

export default function EmpaqueForm({ editingId, onClose }: Props) {
  const [tipoEmpaque, setTipoEmpaque] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [unidadCompra, setUnidadCompra] = useState('Pieza')
  const [costoUnitario, setCostoUnitario] = useState('')
  const [disponible, setDisponible] = useState(true)
  const [notas, setNotas] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingId) {
      fetchEmpaque()
    }
  }, [editingId])

  async function fetchEmpaque() {
    const { data, error } = await supabase
      .from('empaques')
      .select('*')
      .eq('id', editingId)
      .single()

    if (error) {
      console.error('Error:', error)
    } else if (data) {
      setTipoEmpaque(data.tipo_empaque)
      setDescripcion(data.descripcion || '')
      setUnidadCompra(data.unidad_compra)
      setCostoUnitario(data.costo_unitario.toString())
      setDisponible(data.disponible)
      setNotas(data.notas || '')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!tipoEmpaque.trim() || !costoUnitario) {
      setError('Completa todos los campos requeridos')
      setLoading(false)
      return
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('empaques')
          .update({
            tipo_empaque: tipoEmpaque.trim(),
            descripcion: descripcion.trim() || null,
            unidad_compra: unidadCompra,
            costo_unitario: parseFloat(costoUnitario),
            disponible,
            notas: notas.trim() || null,
          })
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase.from('empaques').insert([
          {
            tipo_empaque: tipoEmpaque.trim(),
            descripcion: descripcion.trim() || null,
            unidad_compra: unidadCompra,
            costo_unitario: parseFloat(costoUnitario),
            disponible,
            notas: notas.trim() || null,
          },
        ])

        if (error) throw error
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
        {editingId ? 'Editar Empaque' : 'Nuevo Empaque'}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-guajillo text-white rounded-lg">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-carbon mb-2">
              Tipo de Empaque *
            </label>
            <input
              type="text"
              value={tipoEmpaque}
              onChange={(e) => setTipoEmpaque(e.target.value)}
              placeholder="Ej: Bolsa de plástico, Caja de cartón..."
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>

          <div>
            <label className="block font-semibold text-carbon mb-2">
              Descripción
            </label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Opcional - Detalles adicionales"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-carbon mb-2">
              Unidad de Compra
            </label>
            <select
              value={unidadCompra}
              onChange={(e) => setUnidadCompra(e.target.value)}
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            >
              {['Pieza', 'Paquete', 'Rollo', 'Caja', 'Bolsa', 'Metro'].map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-carbon mb-2">
              Costo Unitario *
            </label>
            <input
              type="number"
              step="0.01"
              value={costoUnitario}
              onChange={(e) => setCostoUnitario(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={disponible}
              onChange={(e) => setDisponible(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="font-semibold text-carbon">Disponible</span>
          </label>
        </div>

        <div>
          <label className="block font-semibold text-carbon mb-2">
            Notas
          </label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Información adicional sobre el empaque..."
            rows={3}
            className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Empaque'}
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

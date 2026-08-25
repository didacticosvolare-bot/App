import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Props {
  editingId: string | null
  onClose: () => void
}

export default function PlatilloForm({ editingId, onClose }: Props) {
  const [nombrePlatillo, setNombrePlatillo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [tipoPlatillo, setTipoPlatillo] = useState('individual')
  const [precioVenta, setPrecioVenta] = useState('')
  const [disponible, setDisponible] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingId) {
      fetchPlatillo()
    }
  }, [editingId])

  async function fetchPlatillo() {
    const { data, error: fetchError } = await supabase
      .from('platillos')
      .select('*')
      .eq('id', editingId)
      .single()

    if (fetchError) {
      console.error('Error:', fetchError)
    } else if (data) {
      setNombrePlatillo(data.nombre_platillo)
      setDescripcion(data.descripcion || '')
      setTipoPlatillo(data.tipo_platillo)
      setPrecioVenta(data.precio_venta.toString())
      setDisponible(data.disponible)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!nombrePlatillo.trim() || !precioVenta) {
      setError('Completa todos los campos requeridos')
      setLoading(false)
      return
    }

    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from('platillos')
          .update({
            nombre_platillo: nombrePlatillo.trim(),
            descripcion: descripcion.trim() || null,
            tipo_platillo: tipoPlatillo,
            precio_venta: parseFloat(precioVenta),
            disponible,
          })
          .eq('id', editingId)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from('platillos').insert([
          {
            nombre_platillo: nombrePlatillo.trim(),
            descripcion: descripcion.trim() || null,
            tipo_platillo: tipoPlatillo,
            precio_venta: parseFloat(precioVenta),
            disponible,
          },
        ])

        if (insertError) throw insertError
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
        {editingId ? 'Editar Platillo' : 'Nuevo Platillo'}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-guajillo text-white rounded-lg">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-carbon mb-2">
              Nombre del Platillo *
            </label>
            <input
              type="text"
              value={nombrePlatillo}
              onChange={(e) => setNombrePlatillo(e.target.value)}
              placeholder="Ej: Chilaquiles Verdes..."
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>

          <div>
            <label className="block font-semibold text-carbon mb-2">
              Tipo de Platillo
            </label>
            <select
              value={tipoPlatillo}
              onChange={(e) => setTipoPlatillo(e.target.value)}
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            >
              <option value="individual">Individual</option>
              <option value="combo">Combo</option>
              <option value="especial">Especial</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-carbon mb-2">
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe los ingredientes principales..."
            rows={3}
            className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-carbon mb-2">
              Precio de Venta *
            </label>
            <input
              type="number"
              step="0.01"
              value={precioVenta}
              onChange={(e) => setPrecioVenta(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>

          <div className="flex items-end">
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
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <p className="text-sm text-carbon">
            <strong>Nota:</strong> La composición del platillo (subrecetas e ingredientes) se configura desde el menú de administración de recetas.
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Platillo'}
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

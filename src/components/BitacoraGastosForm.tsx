import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface Props {
  onClose: () => void
}

export default function BitacoraGastosForm({ onClose }: Props) {
  const [categoria, setCategoria] = useState('operativo')
  const [descripcion, setDescripcion] = useState('')
  const [monto, setMonto] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const categorias = ['Operativo', 'Mantenimiento', 'Servicios', 'Otros']

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!descripcion.trim() || !monto) {
      setError('Completa todos los campos requeridos')
      setLoading(false)
      return
    }

    try {
      const { error: insertError } = await supabase.from('bitacora_gastos').insert([
        {
          categoria: categoria.toLowerCase(),
          descripcion: descripcion.trim(),
          monto: parseFloat(monto),
          created_at: new Date().toISOString(),
        },
      ])

      if (insertError) throw insertError

      setSuccess(`✅ Gasto registrado: $${parseFloat(monto).toFixed(2)}`)
      setDescripcion('')
      setMonto('')
      setCategoria('operativo')

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
      <h2 className="text-2xl font-oswald text-salsa mb-6">Registrar Gasto</h2>

      {error && <div className="mb-4 p-4 bg-guajillo text-white rounded-lg">{error}</div>}
      {success && <div className="mb-4 p-4 bg-green-500 text-white rounded-lg">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold text-carbon mb-2">Categoría</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat.toLowerCase()}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-carbon mb-2">Descripción *</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe el gasto (Ej: Reparación de horno, Servicio de agua, etc.)"
            rows={3}
            className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
          />
        </div>

        <div>
          <label className="block font-semibold text-carbon mb-2">Monto *</label>
          <input
            type="number"
            step="0.01"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
          />
        </div>

        {monto && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <p className="text-sm text-carbon">
              <strong>Gasto:</strong> ${parseFloat(monto).toFixed(2)}
            </p>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Registrando...' : 'Registrar Gasto'}
          </button>
        </div>
      </form>
    </div>
  )
}

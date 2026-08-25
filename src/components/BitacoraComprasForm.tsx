import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Proveedor {
  id: string
  proveedor: string
  producto: string
}

interface Props {
  onClose: () => void
}

export default function BitacoraComprasForm({ onClose }: Props) {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [precio, setPrecio] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchProveedores()
  }, [])

  async function fetchProveedores() {
    const { data } = await supabase.from('proveedores').select('id, proveedor, producto').order('proveedor')
    if (data) {
      setProveedores(data)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!proveedorSeleccionado || !cantidad || !precio) {
      setError('Completa todos los campos requeridos')
      setLoading(false)
      return
    }

    try {
      const proveedor = proveedores.find((p) => p.id === proveedorSeleccionado)
      const { error: insertError } = await supabase.from('bitacora_compras').insert([
        {
          proveedor_id: proveedorSeleccionado,
          cantidad: parseFloat(cantidad),
          precio_unitario: parseFloat(precio),
          descripcion: descripcion.trim() || null,
          created_at: new Date().toISOString(),
        },
      ])

      if (insertError) throw insertError

      setSuccess(`✅ Compra registrada: ${proveedor?.producto}`)
      setCantidad('')
      setPrecio('')
      setDescripcion('')
      setProveedorSeleccionado('')

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
      <h2 className="text-2xl font-oswald text-salsa mb-6">Registrar Compra</h2>

      {error && <div className="mb-4 p-4 bg-guajillo text-white rounded-lg">{error}</div>}
      {success && <div className="mb-4 p-4 bg-green-500 text-white rounded-lg">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold text-carbon mb-2">Proveedor *</label>
          <select
            value={proveedorSeleccionado}
            onChange={(e) => setProveedorSeleccionado(e.target.value)}
            className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
          >
            <option value="">Seleccionar proveedor</option>
            {proveedores.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.proveedor} - {prov.producto}
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
              placeholder="Ej: 10"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>

          <div>
            <label className="block font-semibold text-carbon mb-2">Precio Unitario *</label>
            <input
              type="number"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-carbon mb-2">Descripción / Notas</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Información adicional sobre la compra..."
            rows={3}
            className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
          />
        </div>

        {cantidad && precio && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p className="text-sm text-carbon">
              <strong>Total:</strong> ${(parseFloat(cantidad) * parseFloat(precio)).toFixed(2)}
            </p>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Registrando...' : 'Registrar Compra'}
          </button>
        </div>
      </form>
    </div>
  )
}

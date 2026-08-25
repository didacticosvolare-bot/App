import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Props {
  editingId: string | null
  onClose: () => void
}

export default function ProveedorForm({ editingId, onClose }: Props) {
  const [producto, setProducto] = useState('')
  const [marca, setMarca] = useState('')
  const [proveedor, setProveedor] = useState('')
  const [precio, setPrecio] = useState('')
  const [piezas, setPiezas] = useState('')
  const [unidad, setUnidad] = useState('Kg')
  const [disponible, setDisponible] = useState(true)
  const [notas, setNotas] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingId) {
      fetchProveedor()
    }
  }, [editingId])

  async function fetchProveedor() {
    const { data, error } = await supabase
      .from('proveedores')
      .select('*')
      .eq('id', editingId)
      .single()

    if (error) {
      console.error('Error:', error)
    } else if (data) {
      setProducto(data.producto)
      setMarca(data.marca || '')
      setProveedor(data.proveedor)
      setPrecio(data.precio_presentacion.toString())
      setPiezas(data.piezas_presentacion.toString())
      setUnidad(data.unidad_base)
      setDisponible(data.disponible)
      setNotas(data.notas || '')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!producto.trim() || !proveedor.trim() || !precio || !piezas) {
      setError('Completa todos los campos requeridos')
      setLoading(false)
      return
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('proveedores')
          .update({
            producto: producto.trim(),
            marca: marca.trim() || null,
            proveedor: proveedor.trim(),
            precio_presentacion: parseFloat(precio),
            piezas_presentacion: parseFloat(piezas),
            unidad_base: unidad,
            disponible,
            notas: notas.trim() || null,
            fecha_cotizacion: new Date().toISOString().split('T')[0],
          })
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase.from('proveedores').insert([
          {
            producto: producto.trim(),
            marca: marca.trim() || null,
            proveedor: proveedor.trim(),
            precio_presentacion: parseFloat(precio),
            piezas_presentacion: parseFloat(piezas),
            unidad_base: unidad,
            disponible,
            notas: notas.trim() || null,
            fecha_cotizacion: new Date().toISOString().split('T')[0],
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
        {editingId ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-guajillo text-white rounded-lg">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-carbon mb-2">
              Producto *
            </label>
            <input
              type="text"
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
              placeholder="Ej: Tomate, Pollo..."
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>

          <div>
            <label className="block font-semibold text-carbon mb-2">
              Marca
            </label>
            <input
              type="text"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              placeholder="Opcional"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-carbon mb-2">
            Proveedor *
          </label>
          <input
            type="text"
            value={proveedor}
            onChange={(e) => setProveedor(e.target.value)}
            placeholder="Ej: Tianguis, La Comer, Costco..."
            className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-carbon mb-2">
              Precio *
            </label>
            <input
              type="number"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>

          <div>
            <label className="block font-semibold text-carbon mb-2">
              Piezas *
            </label>
            <input
              type="number"
              step="0.1"
              value={piezas}
              onChange={(e) => setPiezas(e.target.value)}
              placeholder="1"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>

          <div>
            <label className="block font-semibold text-carbon mb-2">
              Unidad
            </label>
            <select
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            >
              {['Kg', 'Litro', 'Pieza', 'Gramo', 'Ml'].map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
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
            placeholder="Información adicional..."
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
            {loading ? 'Guardando...' : 'Guardar Proveedor'}
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

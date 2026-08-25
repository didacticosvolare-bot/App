import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const CATEGORIAS = [
  'Verduras/Chiles',
  'Especias/Abarrotes',
  'Aceites/Vinagres',
  'Carnes',
  'Lácteos',
  'Agua',
  'Panadería',
  'Botana',
]

const UNIDADES = ['Kg', 'Litro', 'Pieza', 'Gramo', 'Ml', 'Taza']

interface Props {
  editingId: string | null
  onClose: () => void
}

export default function IngredientForm({ editingId, onClose }: Props) {
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState(CATEGORIAS[0])
  const [unidad, setUnidad] = useState(UNIDADES[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingId) {
      fetchIngredient()
    }
  }, [editingId])

  async function fetchIngredient() {
    const { data, error } = await supabase
      .from('ingredientes')
      .select('*')
      .eq('id', editingId)
      .single()

    if (error) {
      console.error('Error:', error)
    } else if (data) {
      setNombre(data.nombre)
      setCategoria(data.categoria)
      setUnidad(data.unidad_compra)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!nombre.trim()) {
      setError('El nombre del ingrediente es requerido')
      setLoading(false)
      return
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('ingredientes')
          .update({
            nombre: nombre.trim(),
            categoria,
            unidad_compra: unidad,
          })
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase.from('ingredientes').insert([
          {
            nombre: nombre.trim(),
            categoria,
            unidad_compra: unidad,
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
        {editingId ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-guajillo text-white rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold text-carbon mb-2">
            Nombre *
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Tomate, Cebolla, Pollo..."
            className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-carbon mb-2">
              Categoría *
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-carbon mb-2">
              Unidad de Compra *
            </label>
            <select
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            >
              {UNIDADES.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Ingrediente'}
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

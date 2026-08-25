import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import PlatilloTable from '../components/PlatilloTable'
import PlatilloForm from '../components/PlatilloForm'

interface Platillo {
  id: string
  nombre_platillo: string
  descripcion: string | null
  tipo_platillo: string
  precio_venta: number
  disponible: boolean
}

export default function PlatillosPage() {
  const [platillos, setPlatillos] = useState<Platillo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterNombre, setFilterNombre] = useState('')

  useEffect(() => {
    fetchPlatillos()
  }, [])

  async function fetchPlatillos() {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('platillos')
        .select('*')
        .order('nombre_platillo')

      if (filterNombre) {
        query = query.ilike('nombre_platillo', `%${filterNombre}%`)
      }

      const { data, error: dbError } = await query.timeout(5000)

      if (dbError) {
        console.error('Error:', dbError)
        setError(`Error: ${dbError.message}`)
      } else {
        setPlatillos(data || [])
      }
    } catch (err) {
      console.error('Error de conexión:', err)
      setError('No se pudo conectar a la base de datos')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este platillo?')) return

    const { error } = await supabase
      .from('platillos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error:', error)
    } else {
      fetchPlatillos()
    }
  }

  function handleEdit(id: string) {
    setEditingId(id)
    setShowForm(true)
  }

  function handleFormClose() {
    setShowForm(false)
    setEditingId(null)
    fetchPlatillos()
  }

  return (
    <div className="min-h-screen bg-nixtamal p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-salsa mb-2">Platillos</h1>
            <p className="text-carbon text-lg">Gestiona menú de platos y combos</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null)
              setShowForm(!showForm)
            }}
            className="btn-primary text-lg"
          >
            {showForm ? '✕ Cancelar' : '+ Nuevo Platillo'}
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="mb-8">
            <PlatilloForm editingId={editingId} onClose={handleFormClose} />
          </div>
        )}

        {/* Filtro */}
        {!showForm && (
          <div className="mb-6 flex gap-4">
            <input
              type="text"
              placeholder="Filtrar por nombre..."
              value={filterNombre}
              onChange={(e) => setFilterNombre(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
            <button
              onClick={() => setFilterNombre('')}
              className="px-4 py-2 bg-gray-300 text-carbon font-semibold rounded hover:bg-gray-400 transition"
            >
              Limpiar
            </button>
          </div>
        )}

        {/* Errores */}
        {error && (
          <div className="mb-8 p-4 bg-guajillo text-white rounded-lg text-lg">
            <p className="font-semibold">⚠️ {error}</p>
            <button
              onClick={fetchPlatillos}
              className="mt-2 px-4 py-2 bg-white text-guajillo font-semibold rounded hover:bg-gray-100"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Tabla */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-carbon">Cargando platillos...</p>
          </div>
        ) : (
          <PlatilloTable
            platillos={platillos}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}

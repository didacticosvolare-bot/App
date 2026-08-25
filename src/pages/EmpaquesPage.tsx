import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import EmpaqueTable from '../components/EmpaqueTable'
import EmpaqueForm from '../components/EmpaqueForm'

interface Empaque {
  id: string
  tipo_empaque: string
  descripcion: string | null
  unidad_compra: string
  costo_unitario: number
  disponible: boolean
  notas: string | null
}

export default function EmpaquesPage() {
  const [empaques, setEmpaques] = useState<Empaque[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterTipo, setFilterTipo] = useState('')

  useEffect(() => {
    fetchEmpaques()
  }, [])

  async function fetchEmpaques() {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('empaques')
        .select('*')
        .order('tipo_empaque')

      if (filterTipo) {
        query = query.ilike('tipo_empaque', `%${filterTipo}%`)
      }

      const { data, error: dbError } = await query.timeout(5000)

      if (dbError) {
        console.error('Error:', dbError)
        setError(`Error: ${dbError.message}`)
      } else {
        setEmpaques(data || [])
      }
    } catch (err) {
      console.error('Error de conexión:', err)
      setError('No se pudo conectar a la base de datos')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este empaque?')) return

    const { error } = await supabase
      .from('empaques')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error:', error)
    } else {
      fetchEmpaques()
    }
  }

  function handleEdit(id: string) {
    setEditingId(id)
    setShowForm(true)
  }

  function handleFormClose() {
    setShowForm(false)
    setEditingId(null)
    fetchEmpaques()
  }

  return (
    <div className="min-h-screen bg-nixtamal p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-salsa mb-2">Empaques</h1>
            <p className="text-carbon text-lg">Gestiona materiales de empaque y presentación</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null)
              setShowForm(!showForm)
            }}
            className="btn-primary text-lg"
          >
            {showForm ? '✕ Cancelar' : '+ Nuevo Empaque'}
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="mb-8">
            <EmpaqueForm editingId={editingId} onClose={handleFormClose} />
          </div>
        )}

        {/* Filtro */}
        {!showForm && (
          <div className="mb-6 flex gap-4">
            <input
              type="text"
              placeholder="Filtrar por tipo de empaque..."
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
            <button
              onClick={() => setFilterTipo('')}
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
              onClick={fetchEmpaques}
              className="mt-2 px-4 py-2 bg-white text-guajillo font-semibold rounded hover:bg-gray-100"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Tabla */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-carbon">Cargando empaques...</p>
          </div>
        ) : (
          <EmpaqueTable
            empaques={empaques}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}

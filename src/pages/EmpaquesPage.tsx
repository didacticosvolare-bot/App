import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import EmpaqueTable from '../components/EmpaqueTable'
import EmpaqueForm from '../components/EmpaqueForm'
import { Button, FormInput, Alert } from '../components/base'

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
            <h1 className="text-4xl font-bold text-primary-700 mb-2">📦 Empaques</h1>
            <p className="text-neutral-600 text-lg">Gestiona materiales de empaque y presentación</p>
          </div>
          <Button
            onClick={() => {
              setEditingId(null)
              setShowForm(!showForm)
            }}
            variant={showForm ? 'ghost' : 'primary'}
            size="lg"
          >
            {showForm ? '✕ Cancelar' : '+ Nuevo Empaque'}
          </Button>
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
            <FormInput
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              placeholder="Filtrar por tipo de empaque..."
              className="flex-1"
            />
            <Button onClick={() => setFilterTipo('')} variant="ghost">
              Limpiar
            </Button>
          </div>
        )}

        {/* Errores */}
        {error && (
          <Alert variant="error" title="Error" className="mb-8">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <Button onClick={fetchEmpaques} variant="ghost" size="sm">
                Reintentar
              </Button>
            </div>
          </Alert>
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

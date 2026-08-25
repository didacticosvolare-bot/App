import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import SubrecetaTable from '../components/SubrecetaTable'
import SubrecetaForm from '../components/SubrecetaForm'
import { Button, FormInput, Alert } from '../components/base'

interface Subreceta {
  id: string
  nombre_subreceta: string
  descripcion: string | null
}

export default function SubrecetasPage() {
  const [subrecetas, setSubrecetas] = useState<Subreceta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterNombre, setFilterNombre] = useState('')

  useEffect(() => {
    fetchSubrecetas()
  }, [])

  async function fetchSubrecetas() {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('subrecetas')
        .select('*')
        .order('nombre_subreceta')

      if (filterNombre) {
        query = query.ilike('nombre_subreceta', `%${filterNombre}%`)
      }

      const { data, error: dbError } = await query.timeout(5000)

      if (dbError) {
        console.error('Error:', dbError)
        setError(`Error: ${dbError.message}`)
      } else {
        setSubrecetas(data || [])
      }
    } catch (err) {
      console.error('Error de conexión:', err)
      setError('No se pudo conectar a la base de datos')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta subreceta?')) return

    const { error } = await supabase
      .from('subrecetas')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error:', error)
    } else {
      fetchSubrecetas()
    }
  }

  function handleEdit(id: string) {
    setEditingId(id)
    setShowForm(true)
  }

  function handleFormClose() {
    setShowForm(false)
    setEditingId(null)
    fetchSubrecetas()
  }

  return (
    <div className="min-h-screen bg-nixtamal p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary-700 mb-2">🧩 Subrecetas</h1>
            <p className="text-neutral-600 text-lg">Gestiona combinaciones de ingredientes</p>
          </div>
          <Button
            onClick={() => {
              setEditingId(null)
              setShowForm(!showForm)
            }}
            variant={showForm ? 'ghost' : 'primary'}
            size="lg"
          >
            {showForm ? '✕ Cancelar' : '+ Nueva Subreceta'}
          </Button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="mb-8">
            <SubrecetaForm editingId={editingId} onClose={handleFormClose} />
          </div>
        )}

        {/* Filtro */}
        {!showForm && (
          <div className="mb-6 flex gap-4">
            <FormInput
              value={filterNombre}
              onChange={(e) => setFilterNombre(e.target.value)}
              placeholder="Filtrar por nombre..."
              className="flex-1"
            />
            <Button onClick={() => setFilterNombre('')} variant="ghost">
              Limpiar
            </Button>
          </div>
        )}

        {/* Errores */}
        {error && (
          <Alert variant="error" title="Error" className="mb-8">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <Button onClick={fetchSubrecetas} variant="ghost" size="sm">
                Reintentar
              </Button>
            </div>
          </Alert>
        )}

        {/* Tabla */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-carbon">Cargando subrecetas...</p>
          </div>
        ) : (
          <SubrecetaTable
            subrecetas={subrecetas}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import IngredientesTable from '../components/IngredientesTable'
import IngredientForm from '../components/IngredientForm'
import { Button, Alert } from '../components/base'

interface Ingrediente {
  id: string
  nombre: string
  categoria: string
  unidad_compra: string
}

export default function IngredientesPage() {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchIngredientes()
  }, [])

  async function fetchIngredientes() {
    setLoading(true)
    setError(null)
    try {
      const { data, error: dbError } = await supabase
        .from('ingredientes')
        .select('*')
        .order('nombre')
        .timeout(5000)

      if (dbError) {
        console.error('Error al cargar ingredientes:', dbError)
        setError(`Error: ${dbError.message}`)
      } else {
        setIngredientes(data || [])
      }
    } catch (err) {
      console.error('Error de conexión:', err)
      setError('No se pudo conectar a la base de datos. Verifica tu conexión.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar este ingrediente?')) return

    const { error } = await supabase
      .from('ingredientes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error al eliminar:', error)
    } else {
      fetchIngredientes()
    }
  }

  function handleEdit(id: string) {
    setEditingId(id)
    setShowForm(true)
  }

  function handleFormClose() {
    setShowForm(false)
    setEditingId(null)
    fetchIngredientes()
  }

  return (
    <div className="min-h-screen bg-nixtamal p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary-700 mb-2">🧂 Ingredientes</h1>
            <p className="text-neutral-600 text-lg">Gestiona el catálogo de ingredientes y sus categorías</p>
          </div>
          <Button
            onClick={() => {
              setEditingId(null)
              setShowForm(!showForm)
            }}
            variant={showForm ? 'ghost' : 'primary'}
            size="lg"
          >
            {showForm ? '✕ Cancelar' : '+ Nuevo Ingrediente'}
          </Button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="mb-8">
            <IngredientForm editingId={editingId} onClose={handleFormClose} />
          </div>
        )}

        {/* Errores */}
        {error && (
          <Alert variant="error" title="Error" className="mb-8">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <Button onClick={fetchIngredientes} variant="ghost" size="sm">
                Reintentar
              </Button>
            </div>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-carbon">Cargando ingredientes...</p>
          </div>
        ) : (
          <IngredientesTable
            ingredientes={ingredientes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}

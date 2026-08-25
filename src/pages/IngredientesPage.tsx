import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import IngredientesTable from '../components/IngredientesTable'
import IngredientForm from '../components/IngredientForm'

interface Ingrediente {
  id: string
  nombre: string
  categoria: string
  unidad_compra: string
}

export default function IngredientesPage() {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchIngredientes()
  }, [])

  async function fetchIngredientes() {
    setLoading(true)
    const { data, error } = await supabase
      .from('ingredientes')
      .select('*')
      .order('nombre')

    if (error) {
      console.error('Error al cargar ingredientes:', error)
    } else {
      setIngredientes(data || [])
    }
    setLoading(false)
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
            <h1 className="text-4xl font-bold text-salsa mb-2">Ingredientes</h1>
            <p className="text-carbon text-lg">Gestiona el catálogo de ingredientes y sus categorías</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null)
              setShowForm(!showForm)
            }}
            className="btn-primary text-lg"
          >
            {showForm ? '✕ Cancelar' : '+ Nuevo Ingrediente'}
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="mb-8">
            <IngredientForm editingId={editingId} onClose={handleFormClose} />
          </div>
        )}

        {/* Tabla */}
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

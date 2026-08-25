import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ProveedoresTable from '../components/ProveedoresTable'
import ProveedorForm from '../components/ProveedorForm'
import { Button, FormInput, Alert } from '../components/base'

interface Proveedor {
  id: string
  producto: string
  marca: string | null
  proveedor: string
  precio_presentacion: number
  piezas_presentacion: number
  unidad_base: string
  fecha_cotizacion: string | null
  disponible: boolean
  notas: string | null
}

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterProducto, setFilterProducto] = useState('')

  useEffect(() => {
    fetchProveedores()
  }, [])

  async function fetchProveedores() {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('proveedores')
        .select('*')
        .order('producto')
        .order('precio_presentacion')

      if (filterProducto) {
        query = query.ilike('producto', `%${filterProducto}%`)
      }

      const { data, error: dbError } = await query.timeout(5000)

      if (dbError) {
        console.error('Error:', dbError)
        setError(`Error: ${dbError.message}`)
      } else {
        setProveedores(data || [])
      }
    } catch (err) {
      console.error('Error de conexión:', err)
      setError('No se pudo conectar a la base de datos')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este proveedor?')) return

    const { error } = await supabase
      .from('proveedores')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error:', error)
    } else {
      fetchProveedores()
    }
  }

  function handleEdit(id: string) {
    setEditingId(id)
    setShowForm(true)
  }

  function handleFormClose() {
    setShowForm(false)
    setEditingId(null)
    fetchProveedores()
  }

  return (
    <div className="min-h-screen bg-nixtamal p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary-700 mb-2">🤝 Proveedores</h1>
            <p className="text-neutral-600 text-lg">Gestiona precios y disponibilidad de proveedores</p>
          </div>
          <Button
            onClick={() => {
              setEditingId(null)
              setShowForm(!showForm)
            }}
            variant={showForm ? 'ghost' : 'primary'}
            size="lg"
          >
            {showForm ? '✕ Cancelar' : '+ Nuevo Proveedor'}
          </Button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="mb-8">
            <ProveedorForm editingId={editingId} onClose={handleFormClose} />
          </div>
        )}

        {/* Filtro */}
        {!showForm && (
          <div className="mb-6 flex gap-4">
            <FormInput
              value={filterProducto}
              onChange={(e) => setFilterProducto(e.target.value)}
              placeholder="Filtrar por producto..."
              className="flex-1"
            />
            <Button onClick={() => setFilterProducto('')} variant="ghost">
              Limpiar
            </Button>
          </div>
        )}

        {/* Errores */}
        {error && (
          <Alert variant="error" title="Error" className="mb-8">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <Button onClick={fetchProveedores} variant="ghost" size="sm">
                Reintentar
              </Button>
            </div>
          </Alert>
        )}

        {/* Tabla */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-carbon">Cargando proveedores...</p>
          </div>
        ) : (
          <ProveedoresTable
            proveedores={proveedores}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ClientesTable from '../components/ClientesTable'
import ClienteForm from '../components/ClienteForm'

interface Cliente {
  id: string
  nombre: string
  telefono: string
  email: string
  puntos: number
  compras_totales: number
  estado: 'activo' | 'inactivo'
  created_at: string
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchClientes()
  }, [])

  async function fetchClientes() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false })
        .timeout(5000)

      if (error) throw error
      setClientes(data || [])
    } catch (err) {
      console.error('Error fetching clientes:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('¿Eliminar este cliente?')) return

    try {
      const { error } = await supabase.from('clientes').delete().eq('id', id).timeout(5000)
      if (error) throw error
      setClientes(clientes.filter((c) => c.id !== id))
    } catch (err) {
      console.error('Error deleting cliente:', err)
      alert('Error al eliminar cliente')
    }
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setEditingId(null)
    setShowForm(false)
    fetchClientes()
  }

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefono.includes(searchTerm) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-nixtamal p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-oswald text-salsa mb-2">Programa de Clientes</h1>
          <p className="text-carbon text-lg">Gestión de lealtad y puntos de recompensa</p>
        </div>

        {!showForm ? (
          <>
            <div className="mb-6 flex gap-4 flex-wrap items-center">
              <input
                type="text"
                placeholder="Buscar por nombre, teléfono o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa flex-1 min-w-64"
              />
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-salsa text-white font-semibold rounded-lg hover:bg-opacity-90 transition"
              >
                + Nuevo Cliente
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-xl text-carbon">Cargando clientes...</p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-salsa text-white rounded-lg p-4 text-center">
                      <p className="text-sm mb-2">Total Clientes</p>
                      <p className="text-4xl font-bold">{filteredClientes.length}</p>
                    </div>
                    <div className="bg-totopo text-white rounded-lg p-4 text-center">
                      <p className="text-sm mb-2">Clientes Activos</p>
                      <p className="text-4xl font-bold">
                        {filteredClientes.filter((c) => c.estado === 'activo').length}
                      </p>
                    </div>
                    <div className="bg-guajillo text-white rounded-lg p-4 text-center">
                      <p className="text-sm mb-2">Puntos Totales</p>
                      <p className="text-4xl font-bold">
                        {filteredClientes.reduce((sum, c) => sum + c.puntos, 0)}
                      </p>
                    </div>
                    <div className="bg-purple-600 text-white rounded-lg p-4 text-center">
                      <p className="text-sm mb-2">Ventas Totales</p>
                      <p className="text-3xl font-bold">
                        ${filteredClientes.reduce((sum, c) => sum + c.compras_totales, 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <ClientesTable clientes={filteredClientes} onEdit={handleEdit} onDelete={handleDelete} />
                </div>
              </>
            )}
          </>
        ) : (
          <ClienteForm editingId={editingId} onClose={handleCloseForm} />
        )}
      </div>
    </div>
  )
}

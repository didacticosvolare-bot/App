import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ClientesTable from '../components/ClientesTable'
import ClienteForm from '../components/ClienteForm'
import { MetricCard, Card, CardHeader, CardTitle, CardContent, FormInput, Button } from '../components/base'

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
              <div className="flex-1 min-w-64">
                <FormInput
                  placeholder="Buscar por nombre, teléfono o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowForm(true)}
              >
                + Nuevo Cliente
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-xl text-neutral-700">Cargando clientes...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <MetricCard
                    title="Total Clientes"
                    value={filteredClientes.length}
                    color="primary"
                    icon="👥"
                  />
                  <MetricCard
                    title="Clientes Activos"
                    value={filteredClientes.filter((c) => c.estado === 'activo').length}
                    color="success"
                    icon="✅"
                  />
                  <MetricCard
                    title="Puntos Totales"
                    value={filteredClientes.reduce((sum, c) => sum + c.puntos, 0)}
                    color="warning"
                    icon="🎁"
                  />
                  <MetricCard
                    title="Ventas Totales"
                    value={`$${filteredClientes.reduce((sum, c) => sum + c.compras_totales, 0).toFixed(2)}`}
                    color="secondary"
                    icon="💵"
                  />
                </div>

                <Card variant="elevated">
                  <CardContent>
                    <ClientesTable clientes={filteredClientes} onEdit={handleEdit} onDelete={handleDelete} />
                  </CardContent>
                </Card>
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

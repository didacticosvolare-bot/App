import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import NominaTable from '../components/NominaTable'
import NominaForm from '../components/NominaForm'

interface Nomina {
  id: string
  empleado: string
  mes: string
  salario_base: number
  deducciones: number
  neto: number
  capital_social_porcentaje: number
  fecha_pago: string | null
  estado: string
}

export default function NominaPage() {
  const [nominas, setNominas] = useState<Nomina[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterMes, setFilterMes] = useState(new Date().toISOString().slice(0, 7))

  useEffect(() => {
    fetchNominas()
  }, [])

  async function fetchNominas() {
    setLoading(true)
    setError(null)
    try {
      let query = supabase.from('nómina').select('*').order('mes', { ascending: false })

      if (filterMes) {
        query = query.ilike('mes', `${filterMes}%`)
      }

      const { data, error: dbError } = await query.timeout(5000)

      if (dbError) {
        console.error('Error:', dbError)
        setError(`Error: ${dbError.message}`)
      } else {
        setNominas(data || [])
      }
    } catch (err) {
      console.error('Error de conexión:', err)
      setError('No se pudo conectar a la base de datos')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este registro de nómina?')) return

    const { error } = await supabase.from('nómina').delete().eq('id', id)

    if (error) {
      console.error('Error:', error)
    } else {
      fetchNominas()
    }
  }

  function handleEdit(id: string) {
    setEditingId(id)
    setShowForm(true)
  }

  function handleFormClose() {
    setShowForm(false)
    setEditingId(null)
    fetchNominas()
  }

  const totalSalarios = nominas.reduce((sum, n) => sum + n.salario_base, 0)
  const totalNeto = nominas.reduce((sum, n) => sum + n.neto, 0)
  const totalDeducciones = nominas.reduce((sum, n) => sum + n.deducciones, 0)

  return (
    <div className="min-h-screen bg-nixtamal p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-salsa mb-2">Nómina de Empleados</h1>
            <p className="text-carbon text-lg">Gestión de salarios y capital social</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null)
              setShowForm(!showForm)
            }}
            className="btn-primary text-lg"
          >
            {showForm ? '✕ Cancelar' : '+ Nueva Nómina'}
          </button>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-salsa">
            <p className="text-sm text-gray-600 mb-2">Total Salarios Base</p>
            <p className="text-3xl font-bold text-salsa">${totalSalarios.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-totopo">
            <p className="text-sm text-gray-600 mb-2">Total Neto a Pagar</p>
            <p className="text-3xl font-bold text-totopo">${totalNeto.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-guajillo">
            <p className="text-sm text-gray-600 mb-2">Total Deducciones</p>
            <p className="text-3xl font-bold text-guajillo">${totalDeducciones.toFixed(2)}</p>
          </div>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="mb-8">
            <NominaForm editingId={editingId} onClose={handleFormClose} />
          </div>
        )}

        {/* Filtro */}
        {!showForm && (
          <div className="mb-6 flex gap-4">
            <input
              type="month"
              value={filterMes}
              onChange={(e) => setFilterMes(e.target.value)}
              className="px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
            <button
              onClick={() => {
                setFilterMes(new Date().toISOString().slice(0, 7))
                fetchNominas()
              }}
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
              onClick={fetchNominas}
              className="mt-2 px-4 py-2 bg-white text-guajillo font-semibold rounded hover:bg-gray-100"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Tabla */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-carbon">Cargando nómina...</p>
          </div>
        ) : (
          <NominaTable nominas={nominas} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </div>
  )
}

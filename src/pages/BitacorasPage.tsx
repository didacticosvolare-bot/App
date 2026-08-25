import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import BitacoraTable from '../components/BitacoraTable'
import { Button, FormSelect, Alert } from '../components/base'

interface Bitacora {
  id: string
  tipo: string
  descripcion: string | null
  monto: number
  fecha: string
  usuario: string | null
}

export default function BitacorasPage() {
  const [bitacoras, setBitacoras] = useState<Bitacora[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterTipo, setFilterTipo] = useState('todos')
  const [filterFecha, setFilterFecha] = useState('')

  useEffect(() => {
    fetchBitacoras()
  }, [])

  async function fetchBitacoras() {
    setLoading(true)
    setError(null)
    try {
      let compras = supabase.from('bitacora_compras').select('id, "tipo":created_at, descripcion, "monto":cantidad, "fecha":created_at, usuario:created_by')
      let gastos = supabase.from('bitacora_gastos').select('id, "tipo":created_at, descripcion, "monto":monto, "fecha":created_at, usuario:created_by')
      let ventas = supabase.from('bitacora_ventas_detalle').select('id, "tipo":created_at, descripcion, "monto":precio_unitario, "fecha":created_at, usuario:created_by')
      let mermas = supabase.from('bitacora_mermas').select('id, "tipo":created_at, descripcion, "monto":cantidad, "fecha":created_at, usuario:created_by')

      const { data, error: dbError } = await supabase
        .from('bitacora_compras')
        .select('*')
        .order('created_at', { ascending: false })
        .timeout(5000)

      if (dbError) {
        console.error('Error:', dbError)
        setError(`Error: ${dbError.message}`)
      } else {
        setBitacoras(data || [])
      }
    } catch (err) {
      console.error('Error de conexión:', err)
      setError('No se pudo conectar a la base de datos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-nixtamal p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary-700 mb-2">📋 Bitácoras</h1>
            <p className="text-neutral-600 text-lg">Registro de transacciones y movimientos</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex gap-4">
          <FormSelect
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            options={[
              { value: 'todos', label: 'Todos los tipos' },
              { value: 'compra', label: 'Compras' },
              { value: 'gasto', label: 'Gastos' },
              { value: 'venta', label: 'Ventas' },
              { value: 'merma', label: 'Mermas' },
            ]}
          />

          <input
            type="date"
            value={filterFecha}
            onChange={(e) => setFilterFecha(e.target.value)}
            className="px-4 py-2 border-2 border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          <Button
            onClick={() => {
              setFilterTipo('todos')
              setFilterFecha('')
              fetchBitacoras()
            }}
            variant="ghost"
          >
            Limpiar
          </Button>
        </div>

        {/* Errores */}
        {error && (
          <Alert variant="error" title="Error" className="mb-8">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <Button onClick={fetchBitacoras} variant="ghost" size="sm">
                Reintentar
              </Button>
            </div>
          </Alert>
        )}

        {/* Tabla */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-carbon">Cargando bitácoras...</p>
          </div>
        ) : (
          <BitacoraTable bitacoras={bitacoras} />
        )}
      </div>
    </div>
  )
}

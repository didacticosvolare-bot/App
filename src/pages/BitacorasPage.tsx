import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import BitacoraTable from '../components/BitacoraTable'

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
            <h1 className="text-4xl font-bold text-salsa mb-2">Bitácoras</h1>
            <p className="text-carbon text-lg">Registro de transacciones y movimientos</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex gap-4">
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa bg-white text-carbon"
          >
            <option value="todos">Todos los tipos</option>
            <option value="compra">Compras</option>
            <option value="gasto">Gastos</option>
            <option value="venta">Ventas</option>
            <option value="merma">Mermas</option>
          </select>

          <input
            type="date"
            value={filterFecha}
            onChange={(e) => setFilterFecha(e.target.value)}
            className="px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
          />

          <button
            onClick={() => {
              setFilterTipo('todos')
              setFilterFecha('')
              fetchBitacoras()
            }}
            className="px-4 py-2 bg-gray-300 text-carbon font-semibold rounded hover:bg-gray-400 transition"
          >
            Limpiar
          </button>
        </div>

        {/* Errores */}
        {error && (
          <div className="mb-8 p-4 bg-guajillo text-white rounded-lg text-lg">
            <p className="font-semibold">⚠️ {error}</p>
            <button
              onClick={fetchBitacoras}
              className="mt-2 px-4 py-2 bg-white text-guajillo font-semibold rounded hover:bg-gray-100"
            >
              Reintentar
            </button>
          </div>
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

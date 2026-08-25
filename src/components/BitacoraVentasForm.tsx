import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Platillo {
  id: string
  nombre_platillo: string
  precio_venta: number
}

interface Cliente {
  id: string
  nombre: string
  puntos: number
}

interface Props {
  onClose: () => void
}

export default function BitacoraVentasForm({ onClose }: Props) {
  const [platillos, setPlatillos] = useState<Platillo[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [platilloSeleccionado, setPlatilloSeleccionado] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [precioVenta, setPrecioVenta] = useState('')
  const [clienteSeleccionado, setClienteSeleccionado] = useState('')
  const [clienteTexto, setClienteTexto] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchPlatillos()
    fetchClientes()
  }, [])

  async function fetchPlatillos() {
    const { data } = await supabase
      .from('platillos')
      .select('id, nombre_platillo, precio_venta')
      .eq('disponible', true)
      .order('nombre_platillo')
      .timeout(5000)
    if (data) {
      setPlatillos(data)
    }
  }

  async function fetchClientes() {
    const { data } = await supabase
      .from('clientes')
      .select('id, nombre, puntos')
      .eq('estado', 'activo')
      .order('nombre')
      .timeout(5000)
    if (data) {
      setClientes(data)
    }
  }

  const platilloSeleccion = platillos.find((p) => p.id === platilloSeleccionado)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!platilloSeleccionado || !cantidad || !precioVenta) {
      setError('Completa todos los campos requeridos')
      setLoading(false)
      return
    }

    const total = parseInt(cantidad) * parseFloat(precioVenta)
    const puntos = Math.floor(total)

    try {
      const ventaData = {
        platillo_id: platilloSeleccionado,
        cantidad: parseInt(cantidad),
        precio_unitario: parseFloat(precioVenta),
        cliente: clienteTexto.trim() || null,
        cliente_id: clienteSeleccionado || null,
        created_at: new Date().toISOString(),
      }

      const { error: insertError } = await supabase
        .from('bitacora_ventas_detalle')
        .insert([ventaData])
        .timeout(5000)

      if (insertError) throw insertError

      if (clienteSeleccionado) {
        const { data: clienteData } = await supabase
          .from('clientes')
          .select('puntos, compras_totales')
          .eq('id', clienteSeleccionado)
          .single()
          .timeout(5000)

        if (clienteData) {
          const { error: updateError } = await supabase
            .from('clientes')
            .update({
              puntos: clienteData.puntos + puntos,
              compras_totales: clienteData.compras_totales + total,
            })
            .eq('id', clienteSeleccionado)
            .timeout(5000)

          if (updateError) {
            console.error('Error updating client points:', updateError)
          }
        }
      }

      setSuccess(
        `✅ Venta registrada: ${cantidad}x ${platilloSeleccion?.nombre_platillo} = $${total.toFixed(2)}${
          clienteSeleccionado ? ` (+${puntos} puntos)` : ''
        }`
      )
      setCantidad('')
      setPrecioVenta('')
      setClienteTexto('')
      setClienteSeleccionado('')
      setPlatilloSeleccionado('')

      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border-2 border-salsa rounded-lg p-6">
      <h2 className="text-2xl font-oswald text-salsa mb-6">Registrar Venta</h2>

      {error && <div className="mb-4 p-4 bg-guajillo text-white rounded-lg">{error}</div>}
      {success && <div className="mb-4 p-4 bg-green-500 text-white rounded-lg">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold text-carbon mb-2">Platillo *</label>
          <select
            value={platilloSeleccionado}
            onChange={(e) => {
              setPlatilloSeleccionado(e.target.value)
              const plat = platillos.find((p) => p.id === e.target.value)
              if (plat) {
                setPrecioVenta(plat.precio_venta.toString())
              }
            }}
            className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
          >
            <option value="">Seleccionar platillo</option>
            {platillos.map((plat) => (
              <option key={plat.id} value={plat.id}>
                {plat.nombre_platillo} - ${plat.precio_venta.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-carbon mb-2">Cantidad *</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="1"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>

          <div>
            <label className="block font-semibold text-carbon mb-2">Precio Venta *</label>
            <input
              type="number"
              step="0.01"
              value={precioVenta}
              onChange={(e) => setPrecioVenta(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-carbon mb-2">Cliente Registrado (Opcional - Acumula Puntos)</label>
          <select
            value={clienteSeleccionado}
            onChange={(e) => setClienteSeleccionado(e.target.value)}
            className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
          >
            <option value="">Seleccionar cliente registrado...</option>
            {clientes.map((cli) => (
              <option key={cli.id} value={cli.id}>
                {cli.nombre} ({cli.puntos} pts)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-carbon mb-2">Nombre para Venta Rápida (sin registro)</label>
          <input
            type="text"
            value={clienteTexto}
            onChange={(e) => setClienteTexto(e.target.value)}
            placeholder="Nombre del cliente (opcional)"
            className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
          />
        </div>

        {cantidad && precioVenta && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <p className="text-sm text-carbon">
              <strong>Total Venta:</strong> ${(parseInt(cantidad) * parseFloat(precioVenta)).toFixed(2)}
            </p>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Registrando...' : 'Registrar Venta'}
          </button>
        </div>
      </form>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Button, Card, FormInput } from '../components/base'

interface Platillo {
  id: string
  nombre_platillo: string
  precio_venta: number
}

interface CarritoItem {
  platillo_id: string
  nombre: string
  precio: number
  cantidad: number
}

export default function POSPage() {
  const [platillos, setPlatillos] = useState<Platillo[]>([])
  const [carrito, setCarrito] = useState<CarritoItem[]>([])
  const [cliente, setCliente] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [procesando, setProcesando] = useState(false)
  const [categoriaFiltro, setCategoriaFiltro] = useState('todo')

  useEffect(() => {
    fetchPlatillos()
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
    setLoading(false)
  }

  const agregarAlCarrito = (platillo: Platillo) => {
    const existe = carrito.find((item) => item.platillo_id === platillo.id)
    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item.platillo_id === platillo.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      )
    } else {
      setCarrito([
        ...carrito,
        {
          platillo_id: platillo.id,
          nombre: platillo.nombre_platillo,
          precio: platillo.precio_venta,
          cantidad: 1,
        },
      ])
    }
  }

  const quitarDelCarrito = (platillo_id: string) => {
    setCarrito(carrito.filter((item) => item.platillo_id !== platillo_id))
  }

  const actualizarCantidad = (platillo_id: string, cantidad: number) => {
    if (cantidad <= 0) {
      quitarDelCarrito(platillo_id)
    } else {
      setCarrito(
        carrito.map((item) => (item.platillo_id === platillo_id ? { ...item, cantidad } : item))
      )
    }
  }

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

  const registrarVenta = async () => {
    if (carrito.length === 0) {
      alert('Agrega items al carrito')
      return
    }

    setProcesando(true)
    try {
      const ventasData = carrito.map((item) => ({
        platillo_id: item.platillo_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        cliente: cliente.trim() || null,
        created_at: new Date().toISOString(),
      }))

      const { error } = await supabase
        .from('bitacora_ventas_detalle')
        .insert(ventasData)
        .timeout(5000)

      if (error) throw error

      alert(`✅ Venta registrada: ${carrito.length} producto(s) = $${total.toFixed(2)}`)
      setCarrito([])
      setCliente('')
    } catch (err) {
      console.error('Error:', err)
      alert('Error al registrar venta')
    } finally {
      setProcesando(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-nixtamal flex items-center justify-center">
        <p className="text-2xl text-carbon">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-nixtamal p-4 pb-32">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-oswald text-salsa">🛒 Punto de Venta</h1>
          <p className="text-carbon">Modo optimizado para ventas rápidas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Productos */}
          <div className="lg:col-span-2">
            <FormInput
              label="Buscar platillo"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre..."
              className="mb-4"
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {platillos
                .filter((p) => p.nombre_platillo.toLowerCase().includes(busqueda.toLowerCase()))
                .map((platillo) => (
                  <div key={platillo.id} className="bg-white rounded-lg shadow-md border border-primary-200 p-4 hover:shadow-lg transition">
                    <p className="font-semibold text-sm text-neutral-900 mb-2">{platillo.nombre_platillo}</p>
                    <p className="text-lg font-bold text-primary-600 mb-3">${platillo.precio_venta.toFixed(2)}</p>
                    <Button
                      onClick={() => agregarAlCarrito(platillo)}
                      variant="primary"
                      size="sm"
                      fullWidth
                    >
                      Agregar
                    </Button>
                  </div>
                ))}
            </div>
          </div>

          {/* Carrito y Checkout */}
          <div className="lg:col-span-1">
            <Card variant="elevated" className="sticky top-4">
              <div className="p-6">
                <h2 className="text-2xl font-oswald text-primary-700 mb-4">🛒 Carrito</h2>

                {carrito.length === 0 ? (
                  <p className="text-center text-neutral-500 py-8">Sin items</p>
                ) : (
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {carrito.map((item) => (
                      <div key={item.platillo_id} className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold text-neutral-900 text-sm">{item.nombre}</p>
                          <button
                            onClick={() => quitarDelCarrito(item.platillo_id)}
                            className="text-error-600 font-bold hover:text-error-700"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Button
                            onClick={() => actualizarCantidad(item.platillo_id, item.cantidad - 1)}
                            variant="secondary"
                            size="sm"
                          >
                            −
                          </Button>
                          <input
                            type="number"
                            value={item.cantidad}
                            onChange={(e) => actualizarCantidad(item.platillo_id, parseInt(e.target.value) || 1)}
                            className="w-12 text-center border border-neutral-300 rounded px-2 py-1"
                          />
                          <Button
                            onClick={() => actualizarCantidad(item.platillo_id, item.cantidad + 1)}
                            variant="primary"
                            size="sm"
                          >
                            +
                          </Button>
                          <span className="ml-auto font-bold text-primary-600 text-sm">
                            ${(item.precio * item.cantidad).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total */}
                <div className="border-t border-neutral-200 py-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-neutral-700">Subtotal:</p>
                    <p className="text-xl font-bold text-primary-700">${total.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center text-sm text-neutral-600">
                    <p>{carrito.reduce((sum, item) => sum + item.cantidad, 0)} items</p>
                    <p>IVA incl.</p>
                  </div>
                </div>

                {/* Cliente */}
                <FormInput
                  label="Cliente (opcional)"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  placeholder="Nombre del cliente"
                  className="mb-4"
                />

                {/* Botón Pagar */}
                <Button
                  onClick={registrarVenta}
                  disabled={procesando || carrito.length === 0}
                  variant="success"
                  fullWidth
                  className="mb-2"
                >
                  {procesando ? '⏳ Procesando...' : `💳 COBRAR $${total.toFixed(2)}`}
                </Button>

                {/* Botón Limpiar */}
                <Button
                  onClick={() => {
                    setCarrito([])
                    setCliente('')
                  }}
                  variant="ghost"
                  fullWidth
                >
                  Limpiar
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

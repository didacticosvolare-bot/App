import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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
            <div className="mb-4">
              <input
                type="text"
                placeholder="🔍 Buscar platillo..."
                className="w-full px-4 py-3 border-2 border-carbon rounded-lg text-lg focus:outline-none focus:border-salsa"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {platillos.map((platillo) => (
                <button
                  key={platillo.id}
                  onClick={() => agregarAlCarrito(platillo)}
                  className="p-4 bg-white rounded-lg shadow border-2 border-salsa hover:bg-nixtamal transition active:scale-95 transform"
                >
                  <p className="font-bold text-carbon text-sm">{platillo.nombre_platillo}</p>
                  <p className="text-lg font-bold text-salsa mt-2">${platillo.precio_venta.toFixed(2)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Carrito y Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border-2 border-salsa p-4 sticky top-4">
              <h2 className="text-2xl font-oswald text-salsa mb-4">Carrito</h2>

              {carrito.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Sin items</p>
              ) : (
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {carrito.map((item) => (
                    <div key={item.platillo_id} className="bg-nixtamal p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-carbon text-sm">{item.nombre}</p>
                        <button
                          onClick={() => quitarDelCarrito(item.platillo_id)}
                          className="text-guajillo font-bold"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => actualizarCantidad(item.platillo_id, item.cantidad - 1)}
                          className="bg-guajillo text-white px-2 py-1 rounded text-sm font-bold"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={item.cantidad}
                          onChange={(e) => actualizarCantidad(item.platillo_id, parseInt(e.target.value) || 1)}
                          className="w-12 text-center border border-carbon rounded px-2 py-1"
                        />
                        <button
                          onClick={() => actualizarCantidad(item.platillo_id, item.cantidad + 1)}
                          className="bg-salsa text-white px-2 py-1 rounded text-sm font-bold"
                        >
                          +
                        </button>
                        <span className="ml-auto font-bold text-salsa text-sm">
                          ${(item.precio * item.cantidad).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              <div className="border-t-2 border-salsa py-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-carbon">Subtotal:</p>
                  <p className="text-xl font-bold text-salsa">${total.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <p>{carrito.reduce((sum, item) => sum + item.cantidad, 0)} items</p>
                  <p>IVA incl.</p>
                </div>
              </div>

              {/* Cliente */}
              <input
                type="text"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Cliente (opcional)"
                className="w-full px-3 py-2 border-2 border-carbon rounded-lg mb-4 text-sm focus:outline-none focus:border-salsa"
              />

              {/* Botón Pagar */}
              <button
                onClick={registrarVenta}
                disabled={procesando || carrito.length === 0}
                className="w-full py-4 bg-salsa text-white font-bold text-lg rounded-lg hover:bg-opacity-90 disabled:opacity-50 transition active:scale-95"
              >
                {procesando ? '⏳ Procesando...' : `💳 COBRAR $${total.toFixed(2)}`}
              </button>

              {/* Botón Limpiar */}
              <button
                onClick={() => {
                  setCarrito([])
                  setCliente('')
                }}
                className="w-full mt-2 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition text-sm"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

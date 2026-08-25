import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Props {
  editingId: string | null
  onClose: () => void
}

export default function ClienteForm({ editingId, onClose }: Props) {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [puntos, setPuntos] = useState('0')
  const [comprasTotales, setComprasTotales] = useState('0')
  const [estado, setEstado] = useState('activo')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingId) {
      fetchCliente()
    }
  }, [editingId])

  async function fetchCliente() {
    const { data, error: fetchError } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', editingId)
      .single()
      .timeout(5000)

    if (fetchError) {
      console.error('Error:', fetchError)
    } else if (data) {
      setNombre(data.nombre)
      setTelefono(data.telefono)
      setEmail(data.email)
      setPuntos(data.puntos.toString())
      setComprasTotales(data.compras_totales.toString())
      setEstado(data.estado)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!nombre || !telefono || !email) {
      setError('Completa todos los campos requeridos')
      setLoading(false)
      return
    }

    const clienteData = {
      nombre,
      telefono,
      email,
      puntos: parseInt(puntos) || 0,
      compras_totales: parseFloat(comprasTotales) || 0,
      estado,
    }

    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from('clientes')
          .update(clienteData)
          .eq('id', editingId)
          .timeout(5000)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('clientes')
          .insert([clienteData])
          .timeout(5000)

        if (insertError) throw insertError
      }

      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border-2 border-salsa rounded-lg p-6">
      <h2 className="text-2xl font-oswald text-salsa mb-6">
        {editingId ? 'Editar Cliente' : 'Nuevo Cliente'}
      </h2>

      {error && <div className="mb-4 p-4 bg-guajillo text-white rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-carbon mb-2">Nombre *</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre completo"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>

          <div>
            <label className="block font-semibold text-carbon mb-2">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-carbon mb-2">Teléfono *</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="5551234567"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>

          <div>
            <label className="block font-semibold text-carbon mb-2">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-carbon mb-2">Puntos Acumulados</label>
            <input
              type="number"
              value={puntos}
              onChange={(e) => setPuntos(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>

          <div>
            <label className="block font-semibold text-carbon mb-2">Compras Totales ($)</label>
            <input
              type="number"
              step="0.01"
              value={comprasTotales}
              onChange={(e) => setComprasTotales(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded space-y-2">
          <p className="text-sm text-carbon">
            <strong>Nivel de Membresía:</strong>{' '}
            {parseInt(puntos) >= 5000
              ? 'Platino'
              : parseInt(puntos) >= 3000
                ? 'Oro'
                : parseInt(puntos) >= 1000
                  ? 'Plata'
                  : 'Bronce'}
          </p>
          <p className="text-sm text-carbon">
            <strong>Total en Compras:</strong> ${parseFloat(comprasTotales).toFixed(2)}
          </p>
          <p className="text-sm text-carbon">
            <strong>Puntos Disponibles:</strong> {parseInt(puntos)} pts
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Guardando...' : editingId ? 'Actualizar Cliente' : 'Crear Cliente'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-carbon font-semibold rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

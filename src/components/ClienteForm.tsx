import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { FormInput, FormSelect, Button, Card, CardHeader, CardTitle, CardContent, Alert } from './base'

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

  const membershipLevel = parseInt(puntos) >= 5000
    ? 'Platino'
    : parseInt(puntos) >= 3000
      ? 'Oro'
      : parseInt(puntos) >= 1000
        ? 'Plata'
        : 'Bronce'

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>
          {editingId ? 'Editar Cliente' : 'Nuevo Cliente'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre completo"
              required
            />

            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Teléfono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="5551234567"
              required
            />

            <FormSelect
              label="Estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              options={[
                { value: 'activo', label: 'Activo' },
                { value: 'inactivo', label: 'Inactivo' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Puntos Acumulados"
              type="number"
              value={puntos}
              onChange={(e) => setPuntos(e.target.value)}
              placeholder="0"
            />

            <FormInput
              label="Compras Totales ($)"
              type="number"
              step="0.01"
              value={comprasTotales}
              onChange={(e) => setComprasTotales(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <Alert variant="info" title="Resumen de Membresía" className="space-y-2">
            <div>
              <strong>Nivel:</strong> {membershipLevel}
            </div>
            <div>
              <strong>Total en Compras:</strong> ${parseFloat(comprasTotales).toFixed(2)}
            </div>
            <div>
              <strong>Puntos Disponibles:</strong> {parseInt(puntos)} pts
            </div>
          </Alert>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              isLoading={loading}
            >
              {editingId ? 'Actualizar Cliente' : 'Crear Cliente'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={onClose}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

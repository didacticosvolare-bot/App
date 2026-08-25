import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Props {
  editingId: string | null
  onClose: () => void
}

export default function NominaForm({ editingId, onClose }: Props) {
  const [empleado, setEmpleado] = useState('')
  const [mes, setMes] = useState(new Date().toISOString().slice(0, 7))
  const [salarioBase, setSalarioBase] = useState('')
  const [deducciones, setDeducciones] = useState('')
  const [capitalSocial, setCapitalSocial] = useState('33.33')
  const [estado, setEstado] = useState('pendiente')
  const [fechaPago, setFechaPago] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const empleados = ['Daniela', 'Carlos', 'Erick']

  useEffect(() => {
    if (editingId) {
      fetchNomina()
    }
  }, [editingId])

  async function fetchNomina() {
    const { data, error: fetchError } = await supabase
      .from('nómina')
      .select('*')
      .eq('id', editingId)
      .single()

    if (fetchError) {
      console.error('Error:', fetchError)
    } else if (data) {
      setEmpleado(data.empleado)
      setMes(data.mes)
      setSalarioBase(data.salario_base.toString())
      setDeducciones(data.deducciones.toString())
      setCapitalSocial(data.capital_social_porcentaje.toString())
      setEstado(data.estado)
      setFechaPago(data.fecha_pago || '')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!empleado || !mes || !salarioBase) {
      setError('Completa todos los campos requeridos')
      setLoading(false)
      return
    }

    const neto = parseFloat(salarioBase) - parseFloat(deducciones || '0')

    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from('nómina')
          .update({
            empleado,
            mes,
            salario_base: parseFloat(salarioBase),
            deducciones: parseFloat(deducciones || '0'),
            neto,
            capital_social_porcentaje: parseFloat(capitalSocial),
            estado,
            fecha_pago: fechaPago || null,
          })
          .eq('id', editingId)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from('nómina').insert([
          {
            empleado,
            mes,
            salario_base: parseFloat(salarioBase),
            deducciones: parseFloat(deducciones || '0'),
            neto,
            capital_social_porcentaje: parseFloat(capitalSocial),
            estado,
            fecha_pago: fechaPago || null,
          },
        ])

        if (insertError) throw insertError
      }

      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const neto = parseFloat(salarioBase || '0') - parseFloat(deducciones || '0')

  return (
    <div className="bg-white border-2 border-salsa rounded-lg p-6">
      <h2 className="text-2xl font-oswald text-salsa mb-6">
        {editingId ? 'Editar Nómina' : 'Nueva Nómina'}
      </h2>

      {error && <div className="mb-4 p-4 bg-guajillo text-white rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-carbon mb-2">Empleado *</label>
            <select
              value={empleado}
              onChange={(e) => setEmpleado(e.target.value)}
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            >
              <option value="">Seleccionar empleado</option>
              {empleados.map((emp) => (
                <option key={emp} value={emp}>
                  {emp}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-carbon mb-2">Mes *</label>
            <input
              type="month"
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-carbon mb-2">Salario Base *</label>
            <input
              type="number"
              step="0.01"
              value={salarioBase}
              onChange={(e) => setSalarioBase(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>

          <div>
            <label className="block font-semibold text-carbon mb-2">Deducciones</label>
            <input
              type="number"
              step="0.01"
              value={deducciones}
              onChange={(e) => setDeducciones(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>

          <div>
            <label className="block font-semibold text-carbon mb-2">Capital Social %</label>
            <input
              type="number"
              step="0.01"
              value={capitalSocial}
              onChange={(e) => setCapitalSocial(e.target.value)}
              placeholder="33.33"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-carbon mb-2">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            >
              <option value="pendiente">Pendiente</option>
              <option value="pagada">Pagada</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-carbon mb-2">Fecha de Pago</label>
            <input
              type="date"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
            />
          </div>
        </div>

        {salarioBase && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded space-y-2">
            <p className="text-sm text-carbon">
              <strong>Salario Base:</strong> ${parseFloat(salarioBase).toFixed(2)}
            </p>
            {deducciones && (
              <p className="text-sm text-carbon">
                <strong>Deducciones:</strong> ${parseFloat(deducciones).toFixed(2)}
              </p>
            )}
            <p className="text-sm text-carbon font-bold border-t pt-2">
              <strong>NETO A PAGAR:</strong> ${neto.toFixed(2)}
            </p>
            {capitalSocial && (
              <p className="text-sm text-carbon">
                <strong>Capital Social ({capitalSocial}%):</strong> ${((neto * parseFloat(capitalSocial)) / 100).toFixed(2)}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar Nómina'}
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

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Cupon {
  id: string
  codigo: string
  descripcion: string
  tipo: string
  valor: number
  minimo_compra: number
  usos_maximos: number
  usos_actuales: number
  activo: boolean
  fecha_inicio: string
  fecha_fin: string
}

export default function PromocionesPage() {
  const [cupones, setCupones] = useState<Cupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    codigo: '',
    descripcion: '',
    tipo: 'porcentaje',
    valor: '',
    minimo_compra: '0',
    usos_maximos: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchCupones()
  }, [])

  async function fetchCupones() {
    setLoading(true)
    try {
      const { data } = await supabase.from('cupones').select('*').order('created_at', { ascending: false }).timeout(5000)

      setCupones(data || [])
    } catch (err) {
      console.error('Error fetching cupones:', err)
    } finally {
      setLoading(false)
    }
  }

  async function guardarCupon() {
    if (!formData.codigo || !formData.valor) {
      alert('Completa los campos requeridos')
      return
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('cupones')
          .update({
            codigo: formData.codigo,
            descripcion: formData.descripcion,
            tipo: formData.tipo,
            valor: parseFloat(formData.valor),
            minimo_compra: parseFloat(formData.minimo_compra),
            usos_maximos: formData.usos_maximos ? parseInt(formData.usos_maximos) : null,
            fecha_inicio: formData.fecha_inicio,
            fecha_fin: formData.fecha_fin,
          })
          .eq('id', editingId)
          .timeout(5000)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('cupones')
          .insert([
            {
              codigo: formData.codigo,
              descripcion: formData.descripcion,
              tipo: formData.tipo,
              valor: parseFloat(formData.valor),
              minimo_compra: parseFloat(formData.minimo_compra),
              usos_maximos: formData.usos_maximos ? parseInt(formData.usos_maximos) : null,
              fecha_inicio: formData.fecha_inicio,
              fecha_fin: formData.fecha_fin,
              activo: true,
            },
          ])
          .timeout(5000)

        if (error) throw error
      }

      setShowForm(false)
      setEditingId(null)
      setFormData({
        codigo: '',
        descripcion: '',
        tipo: 'porcentaje',
        valor: '',
        minimo_compra: '0',
        usos_maximos: '',
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })
      fetchCupones()
    } catch (err) {
      console.error('Error saving cupon:', err)
      alert('Error al guardar cupón')
    }
  }

  async function toggleActivo(id: string, activo: boolean) {
    try {
      const { error } = await supabase
        .from('cupones')
        .update({ activo: !activo })
        .eq('id', id)
        .timeout(5000)

      if (error) throw error
      fetchCupones()
    } catch (err) {
      console.error('Error toggling cupón:', err)
    }
  }

  async function deleteCupon(id: string) {
    if (!window.confirm('¿Eliminar este cupón?')) return

    try {
      const { error } = await supabase.from('cupones').delete().eq('id', id).timeout(5000)

      if (error) throw error
      fetchCupones()
    } catch (err) {
      console.error('Error deleting cupón:', err)
    }
  }

  return (
    <div className="min-h-screen bg-nixtamal p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-oswald text-salsa mb-2">🎁 Promociones y Cupones</h1>
          <p className="text-carbon text-lg">Gestión de descuentos y ofertas para clientes</p>
        </div>

        {!showForm ? (
          <>
            <div className="mb-6">
              <button
                onClick={() => {
                  setShowForm(true)
                  setEditingId(null)
                }}
                className="px-6 py-2 bg-salsa text-white font-semibold rounded-lg hover:bg-opacity-90 transition"
              >
                + Nuevo Cupón
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-xl text-carbon">Cargando...</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg border-2 border-salsa p-6">
                {cupones.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No hay cupones registrados</p>
                ) : (
                  <div className="space-y-4">
                    {cupones.map((cupon) => (
                      <div
                        key={cupon.id}
                        className={`border-2 rounded-lg p-6 ${
                          cupon.activo ? 'border-salsa bg-white' : 'border-gray-300 bg-gray-50'
                        }`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                          <div>
                            <p className="text-sm text-gray-600">Código</p>
                            <p className="text-xl font-bold text-salsa font-mono">{cupon.codigo}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Descuento</p>
                            <p className="text-xl font-bold text-totopo">
                              {cupon.tipo === 'porcentaje' ? `${cupon.valor}%` : `$${cupon.valor.toFixed(2)}`}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Usos</p>
                            <p className="text-lg font-bold">
                              {cupon.usos_actuales}/{cupon.usos_maximos || '∞'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Válido</p>
                            <p className="text-sm font-semibold text-carbon">
                              {cupon.fecha_inicio} a {cupon.fecha_fin}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Estado</p>
                            <p
                              className={`text-sm font-bold ${
                                cupon.activo ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {cupon.activo ? '✓ Activo' : 'Inactivo'}
                            </p>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => toggleActivo(cupon.id, cupon.activo)}
                              className={`px-3 py-1 rounded text-white font-semibold text-sm ${
                                cupon.activo ? 'bg-gray-400' : 'bg-green-600'
                              }`}
                            >
                              {cupon.activo ? 'Desactivar' : 'Activar'}
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(cupon.id)
                                setFormData({
                                  codigo: cupon.codigo,
                                  descripcion: cupon.descripcion,
                                  tipo: cupon.tipo,
                                  valor: cupon.valor.toString(),
                                  minimo_compra: cupon.minimo_compra.toString(),
                                  usos_maximos: cupon.usos_maximos?.toString() || '',
                                  fecha_inicio: cupon.fecha_inicio,
                                  fecha_fin: cupon.fecha_fin,
                                })
                                setShowForm(true)
                              }}
                              className="px-3 py-1 bg-totopo text-white rounded font-semibold text-sm"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => deleteCupon(cupon.id)}
                              className="px-3 py-1 bg-guajillo text-white rounded font-semibold text-sm"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-lg border-2 border-salsa p-6">
            <h2 className="text-2xl font-oswald text-salsa mb-6">
              {editingId ? 'Editar Cupón' : 'Nuevo Cupón'}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-carbon mb-2">Código *</label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                    placeholder="VERANO2024"
                    className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-carbon mb-2">Descripción</label>
                  <input
                    type="text"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Promoción de verano"
                    className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-carbon mb-2">Tipo</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
                  >
                    <option value="porcentaje">Porcentaje (%)</option>
                    <option value="cantidad_fija">Monto Fijo ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-carbon mb-2">Valor *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    placeholder="15"
                    className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-carbon mb-2">Compra Mínima ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minimo_compra}
                    onChange={(e) => setFormData({ ...formData, minimo_compra: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-carbon mb-2">Usos Máximos</label>
                  <input
                    type="number"
                    value={formData.usos_maximos}
                    onChange={(e) => setFormData({ ...formData, usos_maximos: e.target.value })}
                    placeholder="Sin límite"
                    className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-carbon mb-2">Fecha Inicio</label>
                  <input
                    type="date"
                    value={formData.fecha_inicio}
                    onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-carbon mb-2">Fecha Fin</label>
                  <input
                    type="date"
                    value={formData.fecha_fin}
                    onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={guardarCupon}
                  className="px-6 py-2 bg-salsa text-white font-semibold rounded-lg hover:bg-opacity-90 transition"
                >
                  Guardar Cupón
                </button>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                  className="px-4 py-2 bg-gray-300 text-carbon font-semibold rounded hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

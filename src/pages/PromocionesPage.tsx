import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Button, Card, FormInput, FormSelect, Badge } from '../components/base'

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
      const { data } = await supabase.from('cupones').select('*').order('created_at', { ascending: false })

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
        
      if (error) throw error
      fetchCupones()
    } catch (err) {
      console.error('Error toggling cupón:', err)
    }
  }

  async function deleteCupon(id: string) {
    if (!window.confirm('¿Eliminar este cupón?')) return

    try {
      const { error } = await supabase.from('cupones').delete().eq('id', id)
      if (error) throw error
      fetchCupones()
    } catch (err) {
      console.error('Error deleting cupón:', err)
    }
  }

  return (
    <div className="min-h-screen bg-nixtamal p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-oswald text-primary-700 mb-2">🎁 Promociones y Cupones</h1>
            <p className="text-neutral-600 text-lg">Gestión de descuentos y ofertas para clientes</p>
          </div>
          {!showForm && (
            <Button
              onClick={() => {
                setShowForm(true)
                setEditingId(null)
              }}
              variant="primary"
              size="lg"
            >
              + Nuevo Cupón
            </Button>
          )}
        </div>

        {!showForm ? (
          <>
            <div />

            {loading ? (
              <div className="text-center py-12">
                <p className="text-xl text-neutral-600">Cargando cupones...</p>
              </div>
            ) : (
              <Card variant="elevated">
                <div className="p-6">
                  {cupones.length === 0 ? (
                    <p className="text-center text-neutral-600 py-8">No hay cupones registrados</p>
                  ) : (
                    <div className="space-y-4">
                      {cupones.map((cupon) => (
                        <div
                          key={cupon.id}
                          className={`border-2 rounded-lg p-6 ${
                            cupon.activo ? 'border-primary-200 bg-white' : 'border-neutral-200 bg-neutral-50'
                          }`}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                            <div>
                              <p className="text-sm text-neutral-600">Código</p>
                              <p className="text-xl font-bold text-primary-600 font-mono">{cupon.codigo}</p>
                            </div>
                            <div>
                              <p className="text-sm text-neutral-600">Descuento</p>
                              <p className="text-xl font-bold text-secondary-600">
                                {cupon.tipo === 'porcentaje' ? `${cupon.valor}%` : `$${cupon.valor.toFixed(2)}`}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-neutral-600">Usos</p>
                              <p className="text-lg font-bold text-neutral-900">
                                {cupon.usos_actuales}/{cupon.usos_maximos || '∞'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-neutral-600">Válido</p>
                              <p className="text-sm font-semibold text-neutral-700">
                                {cupon.fecha_inicio} a {cupon.fecha_fin}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-neutral-600">Estado</p>
                              <Badge variant={cupon.activo ? 'success' : 'neutral'}>
                                {cupon.activo ? '✓ Activo' : 'Inactivo'}
                              </Badge>
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button
                                onClick={() => toggleActivo(cupon.id, cupon.activo)}
                                variant={cupon.activo ? 'ghost' : 'success'}
                                size="sm"
                              >
                                {cupon.activo ? 'Desactivar' : 'Activar'}
                              </Button>
                              <Button
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
                                variant="secondary"
                                size="sm"
                              >
                                Editar
                              </Button>
                              <Button
                                onClick={() => deleteCupon(cupon.id)}
                                variant="error"
                                size="sm"
                              >
                                Eliminar
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            )}
          </>
        ) : (
          <Card variant="elevated">
            <div className="p-6">
              <h2 className="text-2xl font-oswald text-primary-700 mb-6">
                {editingId ? '✏️ Editar Cupón' : '➕ Nuevo Cupón'}
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Código *"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                    placeholder="VERANO2024"
                  />
                  <FormInput
                    label="Descripción"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Promoción de verano"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormSelect
                    label="Tipo"
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    options={[
                      { value: 'porcentaje', label: 'Porcentaje (%)' },
                      { value: 'cantidad_fija', label: 'Monto Fijo ($)' },
                    ]}
                  />
                  <FormInput
                    label="Valor *"
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    placeholder="15"
                  />
                  <FormInput
                    label="Compra Mínima ($)"
                    type="number"
                    step="0.01"
                    value={formData.minimo_compra}
                    onChange={(e) => setFormData({ ...formData, minimo_compra: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput
                    label="Usos Máximos"
                    type="number"
                    value={formData.usos_maximos}
                    onChange={(e) => setFormData({ ...formData, usos_maximos: e.target.value })}
                    placeholder="Sin límite"
                  />
                  <FormInput
                    label="Fecha Inicio"
                    type="date"
                    value={formData.fecha_inicio}
                    onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                  />
                  <FormInput
                    label="Fecha Fin"
                    type="date"
                    value={formData.fecha_fin}
                    onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button onClick={guardarCupon} variant="success">
                    💾 Guardar Cupón
                  </Button>
                  <Button
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(null)
                    }}
                    variant="ghost"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

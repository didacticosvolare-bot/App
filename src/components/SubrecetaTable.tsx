import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Subreceta {
  id: string
  nombre_subreceta: string
  descripcion: string | null
}

interface SubrecetaDetalle {
  ingrediente: string
  cantidad: number
  unidad: string
}

interface Props {
  subrecetas: Subreceta[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function SubrecetaTable({ subrecetas, onEdit, onDelete }: Props) {
  const [detalles, setDetalles] = useState<{ [key: string]: SubrecetaDetalle[] }>({})
  const [loadingDetalles, setLoadingDetalles] = useState(true)

  useEffect(() => {
    fetchDetalles()
  }, [subrecetas])

  async function fetchDetalles() {
    setLoadingDetalles(true)
    try {
      const { data, error } = await supabase
        .from('subreceta_detalle')
        .select('subreceta_id, ingrediente, cantidad, unidad')
        
      if (!error && data) {
        const grouped: { [key: string]: SubrecetaDetalle[] } = {}
        data.forEach((detail) => {
          if (!grouped[detail.subreceta_id]) {
            grouped[detail.subreceta_id] = []
          }
          grouped[detail.subreceta_id].push({
            ingrediente: detail.ingrediente,
            cantidad: detail.cantidad,
            unidad: detail.unidad,
          })
        })
        setDetalles(grouped)
      }
    } catch (err) {
      console.error('Error fetching detalles:', err)
    } finally {
      setLoadingDetalles(false)
    }
  }

  if (loadingDetalles) {
    return <div className="text-center py-12"><p className="text-carbon">Cargando detalles...</p></div>
  }

  return (
    <div className="space-y-4">
      {subrecetas.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg border-2 border-salsa p-8 text-center">
          <p className="text-xl text-carbon">No hay subrecetas</p>
          <p className="text-gray-600">Comienza agregando una nueva subreceta</p>
        </div>
      ) : (
        subrecetas.map((subreceta) => (
          <div key={subreceta.id} className="bg-white rounded-lg shadow-lg border-2 border-salsa p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-oswald text-salsa">{subreceta.nombre_subreceta}</h3>
                {subreceta.descripcion && (
                  <p className="text-gray-600 mt-1">{subreceta.descripcion}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(subreceta.id)}
                  className="btn-small bg-totopo text-white hover:bg-opacity-90"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(subreceta.id)}
                  className="btn-small bg-guajillo text-white hover:bg-opacity-90"
                >
                  Eliminar
                </button>
              </div>
            </div>

            {detalles[subreceta.id] && detalles[subreceta.id].length > 0 ? (
              <div className="bg-nixtamal rounded p-4">
                <p className="font-semibold text-carbon mb-3">Ingredientes:</p>
                <ul className="space-y-2">
                  {detalles[subreceta.id].map((detalle, idx) => (
                    <li key={idx} className="text-carbon flex justify-between">
                      <span>{detalle.ingrediente}</span>
                      <span className="font-mono font-semibold text-salsa">
                        {detalle.cantidad} {detalle.unidad}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-600 italic">Sin ingredientes</p>
            )}
          </div>
        ))
      )}
    </div>
  )
}

interface Empaque {
  id: string
  tipo_empaque: string
  descripcion: string | null
  unidad_compra: string
  costo_unitario: number
  disponible: boolean
  notas: string | null
}

interface Props {
  empaques: Empaque[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function EmpaqueTable({ empaques, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-salsa overflow-x-auto">
      <table className="w-full">
        <thead className="bg-salsa text-white">
          <tr>
            <th className="px-4 py-3 text-left font-oswald">Tipo de Empaque</th>
            <th className="px-4 py-3 text-left font-oswald">Descripción</th>
            <th className="px-4 py-3 text-left font-oswald">Unidad</th>
            <th className="px-4 py-3 text-right font-oswald">Costo Unitario</th>
            <th className="px-4 py-3 text-center font-oswald">Estado</th>
            <th className="px-4 py-3 text-center font-oswald">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {empaques.map((emp) => (
            <tr key={emp.id} className={`hover:bg-nixtamal transition ${!emp.disponible ? 'bg-gray-100' : ''}`}>
              <td className="px-4 py-3 font-semibold text-carbon">{emp.tipo_empaque}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{emp.descripcion || '-'}</td>
              <td className="px-4 py-3 text-sm text-carbon">{emp.unidad_compra}</td>
              <td className="px-4 py-3 font-mono text-right text-carbon">
                ${emp.costo_unitario.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    emp.disponible
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {emp.disponible ? '✓ Disponible' : '✗ No disponible'}
                </span>
              </td>
              <td className="px-4 py-3 text-center space-x-2">
                <button
                  onClick={() => onEdit(emp.id)}
                  className="btn-small bg-totopo text-white hover:bg-opacity-90"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(emp.id)}
                  className="btn-small bg-guajillo text-white hover:bg-opacity-90"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {empaques.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-carbon">No hay empaques</p>
          <p className="text-gray-600">Comienza agregando un nuevo empaque</p>
        </div>
      )}
    </div>
  )
}

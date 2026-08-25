interface Platillo {
  id: string
  nombre_platillo: string
  descripcion: string | null
  tipo_platillo: string
  precio_venta: number
  disponible: boolean
}

interface Props {
  platillos: Platillo[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const tipoColors: { [key: string]: string } = {
  individual: 'bg-blue-100 text-blue-800',
  combo: 'bg-purple-100 text-purple-800',
  especial: 'bg-pink-100 text-pink-800',
}

export default function PlatilloTable({ platillos, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-salsa overflow-x-auto">
      <table className="w-full">
        <thead className="bg-salsa text-white">
          <tr>
            <th className="px-4 py-3 text-left font-oswald">Platillo</th>
            <th className="px-4 py-3 text-left font-oswald">Tipo</th>
            <th className="px-4 py-3 text-left font-oswald">Descripción</th>
            <th className="px-4 py-3 text-right font-oswald">Precio Venta</th>
            <th className="px-4 py-3 text-center font-oswald">Estado</th>
            <th className="px-4 py-3 text-center font-oswald">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {platillos.map((plat) => (
            <tr key={plat.id} className={`hover:bg-nixtamal transition ${!plat.disponible ? 'bg-gray-100' : ''}`}>
              <td className="px-4 py-3 font-semibold text-carbon">{plat.nombre_platillo}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    tipoColors[plat.tipo_platillo] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {plat.tipo_platillo.charAt(0).toUpperCase() + plat.tipo_platillo.slice(1)}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{plat.descripcion || '-'}</td>
              <td className="px-4 py-3 font-mono text-right font-semibold text-salsa">
                ${plat.precio_venta.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    plat.disponible
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {plat.disponible ? '✓ Disponible' : '✗ No disponible'}
                </span>
              </td>
              <td className="px-4 py-3 text-center space-x-2">
                <button
                  onClick={() => onEdit(plat.id)}
                  className="btn-small bg-totopo text-white hover:bg-opacity-90"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(plat.id)}
                  className="btn-small bg-guajillo text-white hover:bg-opacity-90"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {platillos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-carbon">No hay platillos</p>
          <p className="text-gray-600">Comienza agregando un nuevo platillo</p>
        </div>
      )}
    </div>
  )
}

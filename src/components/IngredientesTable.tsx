interface Ingrediente {
  id: string
  nombre: string
  categoria: string
  unidad_compra: string
}

interface Props {
  ingredientes: Ingrediente[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const categoryColors: Record<string, string> = {
  'Verduras/Chiles': 'bg-green-100 text-green-800',
  'Especias/Abarrotes': 'bg-yellow-100 text-yellow-800',
  'Aceites/Vinagres': 'bg-orange-100 text-orange-800',
  'Carnes': 'bg-red-100 text-red-800',
  'Lácteos': 'bg-blue-100 text-blue-800',
  'Agua': 'bg-cyan-100 text-cyan-800',
  'Panadería': 'bg-amber-100 text-amber-800',
  'Botana': 'bg-purple-100 text-purple-800',
}

export default function IngredientesTable({ ingredientes, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-salsa overflow-hidden">
      <table className="w-full">
        <thead className="bg-salsa text-white">
          <tr>
            <th className="px-6 py-4 text-left font-oswald text-lg">Ingrediente</th>
            <th className="px-6 py-4 text-left font-oswald text-lg">Categoría</th>
            <th className="px-6 py-4 text-left font-oswald text-lg">Unidad de Compra</th>
            <th className="px-6 py-4 text-center font-oswald text-lg">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {ingredientes.map((ingrediente) => (
            <tr key={ingrediente.id} className="hover:bg-nixtamal transition">
              <td className="px-6 py-4 font-semibold text-carbon">
                {ingrediente.nombre}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    categoryColors[ingrediente.categoria] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {ingrediente.categoria}
                </span>
              </td>
              <td className="px-6 py-4 font-mono text-carbon">
                {ingrediente.unidad_compra}
              </td>
              <td className="px-6 py-4 text-center space-x-2">
                <button
                  onClick={() => onEdit(ingrediente.id)}
                  className="btn-small bg-totopo text-white hover:bg-opacity-90"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(ingrediente.id)}
                  className="btn-small bg-guajillo text-white hover:bg-opacity-90"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {ingredientes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-carbon">No hay ingredientes cargados</p>
          <p className="text-gray-600">Comienza agregando un nuevo ingrediente</p>
        </div>
      )}
    </div>
  )
}

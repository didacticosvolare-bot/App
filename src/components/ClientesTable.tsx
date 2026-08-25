interface Cliente {
  id: string
  nombre: string
  telefono: string
  email: string
  puntos: number
  compras_totales: number
  estado: 'activo' | 'inactivo'
  created_at: string
}

interface Props {
  clientes: Cliente[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function ClientesTable({ clientes, onEdit, onDelete }: Props) {
  const getPuntosLevel = (puntos: number) => {
    if (puntos >= 5000) return { label: 'Platino', color: 'text-gray-400', bg: 'bg-gray-50' }
    if (puntos >= 3000) return { label: 'Oro', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    if (puntos >= 1000) return { label: 'Plata', color: 'text-gray-500', bg: 'bg-gray-100' }
    return { label: 'Bronce', color: 'text-orange-600', bg: 'bg-orange-50' }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-salsa">
            <th className="text-left py-4 px-4 font-semibold text-carbon">Nombre</th>
            <th className="text-left py-4 px-4 font-semibold text-carbon">Teléfono</th>
            <th className="text-left py-4 px-4 font-semibold text-carbon">Email</th>
            <th className="text-center py-4 px-4 font-semibold text-carbon">Nivel</th>
            <th className="text-right py-4 px-4 font-semibold text-carbon">Puntos</th>
            <th className="text-right py-4 px-4 font-semibold text-carbon">Compras</th>
            <th className="text-center py-4 px-4 font-semibold text-carbon">Estado</th>
            <th className="text-center py-4 px-4 font-semibold text-carbon">Miembro</th>
            <th className="text-center py-4 px-4 font-semibold text-carbon">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => {
            const level = getPuntosLevel(cliente.puntos)
            return (
              <tr key={cliente.id} className="border-b border-gray-200 hover:bg-nixtamal transition">
                <td className="py-4 px-4 font-semibold text-carbon">{cliente.nombre}</td>
                <td className="py-4 px-4 text-gray-600">{cliente.telefono}</td>
                <td className="py-4 px-4 text-gray-600 text-sm">{cliente.email}</td>
                <td className="py-4 px-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${level.color}`}>
                    {level.label}
                  </span>
                </td>
                <td className="py-4 px-4 text-right font-mono font-bold text-salsa">{cliente.puntos}</td>
                <td className="py-4 px-4 text-right font-mono text-green-600 font-bold">
                  ${cliente.compras_totales.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      cliente.estado === 'activo'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {cliente.estado === 'activo' ? '✓ Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="py-4 px-4 text-center text-sm text-gray-600">{formatDate(cliente.created_at)}</td>
                <td className="py-4 px-4 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => onEdit(cliente.id)}
                      className="px-3 py-1 bg-totopo text-white rounded hover:bg-opacity-90 transition text-sm font-semibold"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(cliente.id)}
                      className="px-3 py-1 bg-guajillo text-white rounded hover:bg-opacity-90 transition text-sm font-semibold"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {clientes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No hay clientes registrados</p>
        </div>
      )}
    </div>
  )
}

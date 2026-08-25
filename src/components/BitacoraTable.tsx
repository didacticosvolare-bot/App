interface Bitacora {
  id: string
  tipo: string
  descripcion: string | null
  monto: number
  fecha: string
  usuario: string | null
}

interface Props {
  bitacoras: Bitacora[]
}

const tipoColors: { [key: string]: string } = {
  compra: 'bg-blue-100 text-blue-800',
  gasto: 'bg-red-100 text-red-800',
  venta: 'bg-green-100 text-green-800',
  merma: 'bg-yellow-100 text-yellow-800',
}

export default function BitacoraTable({ bitacoras }: Props) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-MX')
    } catch {
      return dateString
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-salsa overflow-x-auto">
      <table className="w-full">
        <thead className="bg-salsa text-white">
          <tr>
            <th className="px-4 py-3 text-left font-oswald">Fecha</th>
            <th className="px-4 py-3 text-left font-oswald">Tipo</th>
            <th className="px-4 py-3 text-left font-oswald">Descripción</th>
            <th className="px-4 py-3 text-right font-oswald">Monto</th>
            <th className="px-4 py-3 text-left font-oswald">Usuario</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {bitacoras.map((bit) => (
            <tr key={bit.id} className="hover:bg-nixtamal transition">
              <td className="px-4 py-3 text-sm text-carbon font-mono">
                {formatDate(bit.fecha)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    tipoColors[bit.tipo] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {bit.tipo.charAt(0).toUpperCase() + bit.tipo.slice(1)}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-carbon">{bit.descripcion || '-'}</td>
              <td className="px-4 py-3 font-mono text-right font-semibold text-salsa">
                ${bit.monto.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{bit.usuario || 'Sistema'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {bitacoras.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-carbon">No hay registros</p>
          <p className="text-gray-600">Los movimientos aparecerán aquí</p>
        </div>
      )}
    </div>
  )
}

interface Proveedor {
  id: string
  producto: string
  marca: string | null
  proveedor: string
  precio_presentacion: number
  piezas_presentacion: number
  unidad_base: string
  disponible: boolean
  fecha_cotizacion: string | null
}

interface Props {
  proveedores: Proveedor[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function ProveedoresTable({ proveedores, onEdit, onDelete }: Props) {
  const calcularPrecioUnitario = (precio: number, piezas: number) => {
    return (precio / piezas).toFixed(2)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-salsa overflow-x-auto">
      <table className="w-full">
        <thead className="bg-salsa text-white">
          <tr>
            <th className="px-4 py-3 text-left font-oswald">Producto</th>
            <th className="px-4 py-3 text-left font-oswald">Marca</th>
            <th className="px-4 py-3 text-left font-oswald">Proveedor</th>
            <th className="px-4 py-3 text-right font-oswald">Precio</th>
            <th className="px-4 py-3 text-right font-oswald">Piezas</th>
            <th className="px-4 py-3 text-right font-oswald">Precio/Unit</th>
            <th className="px-4 py-3 text-center font-oswald">Estado</th>
            <th className="px-4 py-3 text-center font-oswald">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {proveedores.map((prov) => (
            <tr key={prov.id} className={`hover:bg-nixtamal transition ${!prov.disponible ? 'bg-gray-100' : ''}`}>
              <td className="px-4 py-3 font-semibold text-carbon">{prov.producto}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{prov.marca || '-'}</td>
              <td className="px-4 py-3 text-sm text-carbon">{prov.proveedor}</td>
              <td className="px-4 py-3 font-mono text-right text-carbon">
                ${prov.precio_presentacion.toFixed(2)}
              </td>
              <td className="px-4 py-3 font-mono text-right text-carbon">
                {prov.piezas_presentacion} {prov.unidad_base}
              </td>
              <td className="px-4 py-3 font-mono text-right font-semibold text-salsa">
                ${calcularPrecioUnitario(prov.precio_presentacion, prov.piezas_presentacion)}
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    prov.disponible
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {prov.disponible ? '✓ Disponible' : '✗ No disponible'}
                </span>
              </td>
              <td className="px-4 py-3 text-center space-x-2">
                <button
                  onClick={() => onEdit(prov.id)}
                  className="btn-small bg-totopo text-white hover:bg-opacity-90"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(prov.id)}
                  className="btn-small bg-guajillo text-white hover:bg-opacity-90"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {proveedores.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-carbon">No hay proveedores</p>
          <p className="text-gray-600">Comienza agregando un nuevo proveedor</p>
        </div>
      )}
    </div>
  )
}

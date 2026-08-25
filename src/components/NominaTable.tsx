interface Nomina {
  id: string
  empleado: string
  mes: string
  salario_base: number
  deducciones: number
  neto: number
  capital_social_porcentaje: number
  fecha_pago: string | null
  estado: string
}

interface Props {
  nominas: Nomina[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function NominaTable({ nominas, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-salsa overflow-x-auto">
      <table className="w-full">
        <thead className="bg-salsa text-white">
          <tr>
            <th className="px-4 py-3 text-left font-oswald">Empleado</th>
            <th className="px-4 py-3 text-left font-oswald">Mes</th>
            <th className="px-4 py-3 text-right font-oswald">Salario Base</th>
            <th className="px-4 py-3 text-right font-oswald">Deducciones</th>
            <th className="px-4 py-3 text-right font-oswald">Neto</th>
            <th className="px-4 py-3 text-center font-oswald">Capital Social</th>
            <th className="px-4 py-3 text-center font-oswald">Estado</th>
            <th className="px-4 py-3 text-center font-oswald">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {nominas.map((nom) => (
            <tr key={nom.id} className="hover:bg-nixtamal transition">
              <td className="px-4 py-3 font-semibold text-carbon">{nom.empleado}</td>
              <td className="px-4 py-3 text-sm text-carbon font-mono">{nom.mes}</td>
              <td className="px-4 py-3 font-mono text-right text-carbon">
                ${nom.salario_base.toFixed(2)}
              </td>
              <td className="px-4 py-3 font-mono text-right text-guajillo">
                -${nom.deducciones.toFixed(2)}
              </td>
              <td className="px-4 py-3 font-mono text-right font-semibold text-salsa">
                ${nom.neto.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-center text-carbon">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {nom.capital_social_porcentaje}%
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    nom.estado === 'pagada'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {nom.estado === 'pagada' ? '✓ Pagada' : 'Pendiente'}
                </span>
              </td>
              <td className="px-4 py-3 text-center space-x-2">
                <button
                  onClick={() => onEdit(nom.id)}
                  className="btn-small bg-totopo text-white hover:bg-opacity-90"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(nom.id)}
                  className="btn-small bg-guajillo text-white hover:bg-opacity-90"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {nominas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-carbon">No hay registros de nómina</p>
          <p className="text-gray-600">Comienza agregando un nuevo registro</p>
        </div>
      )}
    </div>
  )
}

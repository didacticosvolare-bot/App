import { useState } from 'react'

export default function EquipoPage() {
  const [activeTab, setActiveTab] = useState<'nomina' | 'clientes'>('nomina')

  return (
    <div className="min-h-screen bg-nixtamal p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-4xl font-bold text-salsa mb-2">Equipo</h1>
            <p className="text-carbon text-lg">Gestiona personal y clientes</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b-2 border-carbon">
          <button
            onClick={() => setActiveTab('nomina')}
            className={`px-6 py-3 font-semibold text-lg transition ${
              activeTab === 'nomina'
                ? 'text-salsa border-b-4 border-salsa'
                : 'text-carbon hover:text-salsa'
            }`}
          >
            💼 Nómina
          </button>
          <button
            onClick={() => setActiveTab('clientes')}
            className={`px-6 py-3 font-semibold text-lg transition ${
              activeTab === 'clientes'
                ? 'text-salsa border-b-4 border-salsa'
                : 'text-carbon hover:text-salsa'
            }`}
          >
            👥 Clientes
          </button>
        </div>

        {/* Nomina Tab */}
        {activeTab === 'nomina' && (
          <div className="bg-white rounded-lg shadow-lg border-2 border-salsa p-8">
            <h2 className="text-3xl font-oswald text-salsa mb-6">Gestión de Nómina</h2>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                <p className="text-sm text-gray-600 mb-2">Total Empleados</p>
                <p className="text-4xl font-bold text-blue-600">3</p>
                <p className="text-xs text-gray-500 mt-2">Daniela, Carlos, Erick</p>
              </div>
              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                <p className="text-sm text-gray-600 mb-2">Nómina Mes Actual</p>
                <p className="text-4xl font-bold text-green-600">-</p>
                <p className="text-xs text-gray-500 mt-2">Módulo en desarrollo</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
                <p className="text-sm text-gray-600 mb-2">Capital Social</p>
                <p className="text-4xl font-bold text-purple-600">-</p>
                <p className="text-xs text-gray-500 mt-2">Distribución de ganancias</p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-carbon">
                <strong>En desarrollo:</strong> Gestión de salarios, beneficios y distribución de capital social entre los 3 socios.
              </p>
            </div>
          </div>
        )}

        {/* Clientes Tab */}
        {activeTab === 'clientes' && (
          <div className="bg-white rounded-lg shadow-lg border-2 border-salsa p-8">
            <h2 className="text-3xl font-oswald text-salsa mb-6">Programa de Clientes</h2>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-200">
                <p className="text-sm text-gray-600 mb-2">Clientes Registrados</p>
                <p className="text-4xl font-bold text-orange-600">0</p>
                <p className="text-xs text-gray-500 mt-2">Sin datos</p>
              </div>
              <div className="bg-pink-50 rounded-lg p-6 border-2 border-pink-200">
                <p className="text-sm text-gray-600 mb-2">Puntos Totales</p>
                <p className="text-4xl font-bold text-pink-600">0</p>
                <p className="text-xs text-gray-500 mt-2">Acumulados</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-6 border-2 border-indigo-200">
                <p className="text-sm text-gray-600 mb-2">Compras Promedio</p>
                <p className="text-4xl font-bold text-indigo-600">-</p>
                <p className="text-xs text-gray-500 mt-2">Por cliente</p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-carbon">
                <strong>En desarrollo:</strong> Programa de lealtad con puntos, descuentos y seguimiento de clientes frecuentes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

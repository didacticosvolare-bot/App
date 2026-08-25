import { useState } from 'react'
import { Card, MetricCard, Alert } from '../components/base'

export default function EquipoPage() {
  const [activeTab, setActiveTab] = useState<'nomina' | 'clientes'>('nomina')

  return (
    <div className="min-h-screen bg-nixtamal p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary-700 mb-2">👥 Equipo</h1>
            <p className="text-neutral-600 text-lg">Gestiona personal y clientes</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b-2 border-neutral-200">
          <button
            onClick={() => setActiveTab('nomina')}
            className={`px-6 py-3 font-semibold text-lg transition ${
              activeTab === 'nomina'
                ? 'text-primary-600 border-b-4 border-primary-600'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
          >
            💼 Nómina
          </button>
          <button
            onClick={() => setActiveTab('clientes')}
            className={`px-6 py-3 font-semibold text-lg transition ${
              activeTab === 'clientes'
                ? 'text-primary-600 border-b-4 border-primary-600'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
          >
            👥 Clientes
          </button>
        </div>

        {/* Nomina Tab */}
        {activeTab === 'nomina' && (
          <Card variant="elevated">
            <div className="p-8">
              <h2 className="text-3xl font-oswald text-primary-700 mb-6">Gestión de Nómina</h2>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <MetricCard
                  title="Total Empleados"
                  value="3"
                  subtitle="Daniela, Carlos, Erick"
                  variant="primary"
                />
                <MetricCard
                  title="Nómina Mes Actual"
                  value="-"
                  subtitle="Módulo en desarrollo"
                  variant="secondary"
                />
                <MetricCard
                  title="Capital Social"
                  value="-"
                  subtitle="Distribución de ganancias"
                  variant="success"
                />
              </div>

              <Alert variant="warning">
                <p className="text-neutral-900">
                  <strong>En desarrollo:</strong> Gestión de salarios, beneficios y distribución de capital social entre los 3 socios.
                </p>
              </Alert>
            </div>
          </Card>
        )}

        {/* Clientes Tab */}
        {activeTab === 'clientes' && (
          <Card variant="elevated">
            <div className="p-8">
              <h2 className="text-3xl font-oswald text-primary-700 mb-6">Programa de Clientes</h2>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <MetricCard
                  title="Clientes Registrados"
                  value="0"
                  subtitle="Sin datos"
                  variant="primary"
                />
                <MetricCard
                  title="Puntos Totales"
                  value="0"
                  subtitle="Acumulados"
                  variant="secondary"
                />
                <MetricCard
                  title="Compras Promedio"
                  value="-"
                  subtitle="Por cliente"
                  variant="success"
                />
              </div>

              <Alert variant="warning">
                <p className="text-neutral-900">
                  <strong>En desarrollo:</strong> Programa de lealtad con puntos, descuentos y seguimiento de clientes frecuentes.
                </p>
              </Alert>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

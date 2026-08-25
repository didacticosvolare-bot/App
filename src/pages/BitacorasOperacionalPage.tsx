import { useState } from 'react'
import BitacoraComprasForm from '../components/BitacoraComprasForm'
import BitacoraGastosForm from '../components/BitacoraGastosForm'
import BitacoraVentasForm from '../components/BitacoraVentasForm'
import BitacoraMermasForm from '../components/BitacoraMermasForm'

export default function BitacorasOperacionalPage() {
  const [activeTab, setActiveTab] = useState<'compras' | 'gastos' | 'ventas' | 'mermas'>('compras')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleFormClose = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-nixtamal p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary-700 mb-2">📊 Bitácoras Operacionales</h1>
          <p className="text-neutral-600 text-lg">Registra compras, gastos, ventas y mermas diarias</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b-2 border-neutral-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('compras')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition ${
              activeTab === 'compras'
                ? 'text-primary-600 border-b-4 border-primary-600'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
          >
            📦 Compras
          </button>
          <button
            onClick={() => setActiveTab('gastos')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition ${
              activeTab === 'gastos'
                ? 'text-primary-600 border-b-4 border-primary-600'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
          >
            💰 Gastos
          </button>
          <button
            onClick={() => setActiveTab('ventas')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition ${
              activeTab === 'ventas'
                ? 'text-primary-600 border-b-4 border-primary-600'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
          >
            🛒 Ventas
          </button>
          <button
            onClick={() => setActiveTab('mermas')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition ${
              activeTab === 'mermas'
                ? 'text-primary-600 border-b-4 border-primary-600'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
          >
            ⚠️ Mermas
          </button>
        </div>

        {/* Forms */}
        {activeTab === 'compras' && <BitacoraComprasForm key={refreshTrigger} onClose={handleFormClose} />}
        {activeTab === 'gastos' && <BitacoraGastosForm key={refreshTrigger} onClose={handleFormClose} />}
        {activeTab === 'ventas' && <BitacoraVentasForm key={refreshTrigger} onClose={handleFormClose} />}
        {activeTab === 'mermas' && <BitacoraMermasForm key={refreshTrigger} onClose={handleFormClose} />}
      </div>
    </div>
  )
}

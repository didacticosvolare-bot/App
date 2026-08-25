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
          <h1 className="text-4xl font-bold text-salsa mb-2">Bitácoras Operacionales</h1>
          <p className="text-carbon text-lg">Registra compras, gastos, ventas y mermas diarias</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b-2 border-carbon overflow-x-auto">
          <button
            onClick={() => setActiveTab('compras')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition ${
              activeTab === 'compras'
                ? 'text-salsa border-b-4 border-salsa'
                : 'text-carbon hover:text-salsa'
            }`}
          >
            📦 Compras
          </button>
          <button
            onClick={() => setActiveTab('gastos')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition ${
              activeTab === 'gastos'
                ? 'text-salsa border-b-4 border-salsa'
                : 'text-carbon hover:text-salsa'
            }`}
          >
            💰 Gastos
          </button>
          <button
            onClick={() => setActiveTab('ventas')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition ${
              activeTab === 'ventas'
                ? 'text-salsa border-b-4 border-salsa'
                : 'text-carbon hover:text-salsa'
            }`}
          >
            🛒 Ventas
          </button>
          <button
            onClick={() => setActiveTab('mermas')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition ${
              activeTab === 'mermas'
                ? 'text-salsa border-b-4 border-salsa'
                : 'text-carbon hover:text-salsa'
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

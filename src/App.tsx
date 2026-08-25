import { useState } from 'react'
import Navigation from './components/Navigation'
import DashboardPage from './pages/DashboardPage'
import IngredientesPage from './pages/IngredientesPage'
import ProveedoresPage from './pages/ProveedoresPage'
import EmpaquesPage from './pages/EmpaquesPage'
import SubrecetasPage from './pages/SubrecetasPage'
import PlatillosPage from './pages/PlatillosPage'
import BitacorasOperacionalPage from './pages/BitacorasOperacionalPage'
import ReportesPage from './pages/ReportesPage'
import NominaPage from './pages/NominaPage'
import ClientesPage from './pages/ClientesPage'
import DistribucionPage from './pages/DistribucionPage'
import POSPage from './pages/POSPage'
import InventoryPage from './pages/InventoryPage'
import PromocionesPage from './pages/PromocionesPage'
import LoginPage from './pages/LoginPage'
import { useAuth } from './lib/authContext'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-nixtamal flex items-center justify-center">
        <p className="text-3xl text-carbon">Cargando...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />
      case 'ingredientes':
        return <IngredientesPage />
      case 'proveedores':
        return <ProveedoresPage />
      case 'empaques':
        return <EmpaquesPage />
      case 'subrecetas':
        return <SubrecetasPage />
      case 'platillos':
        return <PlatillosPage />
      case 'bitacoras':
        return <BitacorasOperacionalPage />
      case 'reportes':
        return <ReportesPage />
      case 'nomina':
        return <NominaPage />
      case 'clientes':
        return <ClientesPage />
      case 'distribucion':
        return <DistribucionPage />
      case 'pos':
        return <POSPage />
      case 'inventario':
        return <InventoryPage />
      case 'promociones':
        return <PromocionesPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <div className="min-h-screen bg-nixtamal">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  )
}

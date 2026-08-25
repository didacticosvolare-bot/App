import { useState } from 'react'
import Navigation from './components/Navigation'
import IngredientesPage from './pages/IngredientesPage'
import ProveedoresPage from './pages/ProveedoresPage'
import EmpaquesPage from './pages/EmpaquesPage'
import SubrecetasPage from './pages/SubrecetasPage'
import PlatillosPage from './pages/PlatillosPage'
import BitacorasOperacionalPage from './pages/BitacorasOperacionalPage'
import ReportesPage from './pages/ReportesPage'
import NominaPage from './pages/NominaPage'
import LoginPage from './pages/LoginPage'
import { useAuth } from './lib/authContext'

export default function App() {
  const [currentPage, setCurrentPage] = useState('ingredientes')
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
        return (
          <div className="min-h-screen bg-nixtamal p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8 text-center border-2 border-salsa">
                <h2 className="text-3xl font-oswald text-salsa mb-4">Programa de Clientes</h2>
                <p className="text-carbon text-lg">Módulo en desarrollo</p>
                <p className="text-gray-600 mt-4">Sistema de lealtad y puntos próximamente</p>
              </div>
            </div>
          </div>
        )
      default:
        return <IngredientesPage />
    }
  }

  return (
    <div className="min-h-screen bg-nixtamal">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  )
}

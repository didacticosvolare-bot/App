import { useState } from 'react'
import Navigation from './components/Navigation'
import IngredientesPage from './pages/IngredientesPage'
import ProveedoresPage from './pages/ProveedoresPage'
import EmpaquesPage from './pages/EmpaquesPage'
import SubrecetasPage from './pages/SubrecetasPage'
import PlatillosPage from './pages/PlatillosPage'
import BitacorasOperacionalPage from './pages/BitacorasOperacionalPage'
import EquipoPage from './pages/EquipoPage'
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
      case 'equipo':
        return <EquipoPage />
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

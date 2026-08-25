import { useState } from 'react'
import Navigation from './components/Navigation'
import IngredientesPage from './pages/IngredientesPage'
import ProveedoresPage from './pages/ProveedoresPage'
import EmpaquesPage from './pages/EmpaquesPage'
import SubrecetasPage from './pages/SubrecetasPage'

export default function App() {
  const [currentPage, setCurrentPage] = useState('ingredientes')

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
      case 'bitacoras':
      case 'equipo':
        return (
          <div className="min-h-screen bg-nixtamal p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg p-8 text-center">
                <h2 className="text-3xl font-oswald text-salsa mb-4">
                  {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
                </h2>
                <p className="text-carbon text-lg">Módulo en desarrollo</p>
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

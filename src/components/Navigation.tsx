import { useAuth } from '../lib/authContext'

interface Props {
  currentPage: string
  onNavigate: (page: string) => void
}

export default function Navigation({ currentPage, onNavigate }: Props) {
  const { user, logout } = useAuth()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📱' },
    { id: 'ingredientes', label: 'Ingredientes', icon: '🥕' },
    { id: 'proveedores', label: 'Proveedores', icon: '🏪' },
    { id: 'empaques', label: 'Empaques', icon: '📦' },
    { id: 'subrecetas', label: 'Subrecetas', icon: '🔗' },
    { id: 'platillos', label: 'Platillos', icon: '🍽️' },
    { id: 'bitacoras', label: 'Bitácoras', icon: '📊' },
    { id: 'reportes', label: 'Reportes', icon: '📈' },
    { id: 'nomina', label: 'Nómina', icon: '💼' },
    { id: 'clientes', label: 'Clientes', icon: '👥' },
  ]

  const handleLogout = async () => {
    if (window.confirm('¿Cerrar sesión?')) {
      await logout()
    }
  }

  return (
    <nav className="bg-salsa text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-oswald">Los Tradicionales</h1>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 bg-white text-salsa font-semibold rounded hover:bg-gray-100 transition"
          >
            👤 {user?.nombre} (Salir)
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                currentPage === item.id
                  ? 'bg-white text-salsa'
                  : 'bg-salsa-dark hover:bg-opacity-80'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

import { useState } from 'react'
import { useAuth } from '../lib/authContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-nixtamal flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl border-4 border-salsa p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-oswald text-salsa mb-2">Los Tradicionales</h1>
          <p className="text-carbon">Sistema de Administración</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-guajillo text-white rounded-lg text-sm">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-semibold text-carbon mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-semibold text-carbon mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border-2 border-carbon rounded-lg focus:outline-none focus:border-salsa"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 py-3 text-lg"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            <strong>Usuarios de prueba:</strong>
          </p>
          <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-3 rounded">
            <p>📧 daniela@lostradicionles.com</p>
            <p>📧 carlos@lostradicionles.com</p>
            <p>📧 erick@lostradicionles.com</p>
            <p className="mt-3">🔑 Contraseña: LosTradicionales123!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

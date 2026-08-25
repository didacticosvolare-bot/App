import { useEffect, useState } from 'react'

export default function App() {
  const [message, setMessage] = useState('Cargando...')
  const [supabaseStatus, setSupabaseStatus] = useState('Verificando conexión...')

  useEffect(() => {
    // Test básico
    setMessage('✅ React está funcionando')

    // Test de variables de entorno
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (url && key) {
      setSupabaseStatus('✅ Variables de entorno cargadas')
    } else {
      setSupabaseStatus('❌ Faltan variables de entorno')
    }
  }, [])

  return (
    <div className="min-h-screen bg-nixtamal flex items-center justify-center p-8">
      <div className="bg-white border-4 border-salsa rounded-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-oswald text-salsa mb-6">Los Tradicionales</h1>

        <div className="mb-6 p-4 bg-green-100 rounded-lg">
          <p className="text-lg font-semibold text-carbon">{message}</p>
        </div>

        <div className="mb-6 p-4 bg-blue-100 rounded-lg">
          <p className="text-sm font-mono text-carbon">{supabaseStatus}</p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-salsa text-white font-oswald text-lg rounded-lg hover:bg-opacity-90 transition"
        >
          Recargar Página
        </button>

        <p className="text-gray-600 text-sm mt-4">
          Si ves este mensaje, React está funcionando correctamente
        </p>
      </div>
    </div>
  )
}

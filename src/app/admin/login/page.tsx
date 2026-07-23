'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Lock } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('Credenciales incorrectas. Revisa tu correo y contraseña.')
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand px-6">
      <div className="w-full max-w-sm">
        <div className="bg-cream rounded-2xl p-8 border border-ink/5">
          <div className="w-12 h-12 rounded-xl bg-sage/15 flex items-center justify-center mb-6">
            <Lock size={22} className="text-sage-dark" />
          </div>
          <h1 className="font-display text-2xl text-ink mb-1">
            Panel de administración
          </h1>
          <p className="text-sm text-clay mb-6">
            Ingresa para gestionar servicios y agenda.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-clay mb-1.5">
                Correo
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-ink/10 bg-sand focus:outline-none focus:border-sage"
                placeholder="tu@correo.cl"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-clay mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-ink/10 bg-sand focus:outline-none focus:border-sage"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-cream py-3 rounded-lg font-500 hover:bg-ink/90 transition-colors disabled:opacity-60"
            >
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

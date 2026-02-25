import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Truck, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn({ email, password })

    if (error) {
      setError('Onjuist e-mailadres of wachtwoord')
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Welkom terug</h1>
          <p className="text-sm text-gray-500 mt-1">Log in om verder te gaan</p>
        </div>

        {/* Formulier */}
        <div className="bg-card rounded-xl border border-gray-100 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-danger-50 text-danger-500 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mailadres</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="naam@bedrijf.nl"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Wachtwoord</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Je wachtwoord"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Bezig met inloggen...' : 'Inloggen'}
            </button>
          </form>
        </div>

        {/* Link naar registratie */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Nog geen account?{' '}
          <Link to="/registreren" className="text-primary-500 hover:text-primary-700 font-medium">
            Registreer je bedrijf
          </Link>
        </p>
      </div>
    </div>
  )
}

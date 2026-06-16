import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Loader2, Check, Trophy, Users, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn({ email, password })
      toast.success('Bem-vindo de volta!')
      navigate('/feed')
    } catch (error) {
      toast.error(error.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Lado Esquerdo - Hero */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-[#012169] flex items-center justify-center shadow-lg">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">CopaCards</span>
        </div>

        {/* Hero Content */}
        <div className="space-y-8 relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
            <Sparkles className="h-3 w-3" />
            Sua coleção, em um só lugar.
          </div>

          <h1 className="text-5xl font-bold tracking-tight leading-tight">
            Tudo o que você <span className="text-primary">coleciona</span>, em um só lugar.
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed">
            Registre figurinhas, monte sua coleção, conecte-se com outros colecionadores e acompanhe tudo pelo gênero ou avaliação.
          </p>

          <div className="space-y-3 pt-2">
            <FeatureItem icon={<Trophy className="h-4 w-4" />} text="Catálogo personalizado por seleção" />
            <FeatureItem icon={<Sparkles className="h-4 w-4" />} text="Compartilhe figurinhas raras com a comunidade" />
            <FeatureItem icon={<Users className="h-4 w-4" />} text="Siga colecionadores e troque figurinhas" />
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-muted-foreground relative z-10">
          © 2026 CopaCards · Feito com 💚 Verde, Amarelo, Azul e Paixão
        </div>
      </div>

      {/* Lado Direito - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
        {/* Theme toggle (top) */}
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleTheme}
            className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors"
            title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-[#012169] flex items-center justify-center shadow-lg">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">CopaCards</span>
        </div>

        {/* Card de Login */}
        <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-1">Entrar</h2>
            <p className="text-sm text-muted-foreground">Acesse sua conta para gerenciar suas figurinhas.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-semibold bg-gradient-to-r from-primary to-[#012169] hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Entrar'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>

        {/* Footer mobile */}
        <div className="lg:hidden text-xs text-muted-foreground mt-8 text-center">
          © 2026 CopaCards
        </div>
      </div>
    </div>
  )
}

function FeatureItem({ icon, text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
        {icon}
      </div>
      <span className="text-sm">{text}</span>
    </div>
  )
}

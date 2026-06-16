import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Loader2, ArrowLeft, CheckCircle, Trophy } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { resetPassword } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
      toast.success('E-mail enviado!')
    } catch (error) {
      toast.error(error.message || 'Erro ao enviar e-mail')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6 relative">
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleTheme}
          className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors"
          title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-[#012169] flex items-center justify-center shadow-lg">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">CopaCards</span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <div className="mb-6 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
              {sent ? <CheckCircle className="h-6 w-6 text-primary" /> : <Mail className="h-6 w-6 text-primary" />}
            </div>
            <h2 className="text-2xl font-semibold mb-1">
              {sent ? 'E-mail enviado!' : 'Recuperar senha'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {sent
                ? 'Verifique sua caixa de entrada.'
                : 'Informe seu e-mail para receber o link de recuperação.'}
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="voce@exemplo.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="h-11" required />
              </div>
              <Button type="submit" className="w-full h-11 font-semibold bg-gradient-to-r from-primary to-[#012169] hover:opacity-90"
                disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar link'}
              </Button>
            </form>
          ) : (
            <Button onClick={() => setSent(false)} variant="outline" className="w-full h-11">
              Enviar novamente
            </Button>
          )}

          <Link to="/login" className="flex items-center justify-center gap-2 mt-6 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  )
}

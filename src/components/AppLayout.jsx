import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { Home, Search, Images, MessageCircle, User, Plus, LogOut, Sun, Moon, Trophy } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export default function AppLayout() {
  const { profile, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { icon: Home, label: 'Feed', path: '/feed' },
    { icon: Search, label: 'Explorar', path: '/explore' },
    { icon: Images, label: 'Coleção', path: '/collection' },
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
  ]

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center px-4 max-w-5xl">
          <Link to="/feed" className="flex items-center gap-2.5 mr-6">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-[#012169] flex items-center justify-center shadow-md">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold hidden sm:inline">CopaCards</span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          <div className="flex-1 md:hidden" />

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Link to="/sticker/new" className="hidden sm:block">
              <Button size="sm" className="bg-gradient-to-r from-primary to-[#012169] hover:opacity-90">
                <Plus className="h-4 w-4 mr-1" />
                Nova
              </Button>
            </Link>

            {profile && (
              <Link to={`/profile/${profile.username}`}>
                <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-primary/30 hover:ring-primary transition-all">
                  <AvatarImage src={profile.avatar_url} alt={profile.username} />
                  <AvatarFallback>
                    {profile.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}

            <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sair">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 container mx-auto px-4 py-6 pb-24 md:pb-6 max-w-3xl">
        <Outlet />
      </main>

      {/* Bottom nav mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/90 backdrop-blur-md md:hidden">
        <div className="grid grid-cols-5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center py-2.5 text-xs transition-colors',
                  isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span>{item.label}</span>
              </Link>
            )
          })}
          <Link
            to="/sticker/new"
            className="flex flex-col items-center justify-center py-2.5 text-xs text-primary font-semibold"
          >
            <Plus className="h-5 w-5 mb-1" />
            <span>Nova</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

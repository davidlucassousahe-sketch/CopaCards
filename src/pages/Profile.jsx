import { Outlet } from 'react-router-dom'
import { Trophy } from 'lucide-react'

export default function Profile() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Trophy className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">Página de perfil em desenvolvimento</p>
        </div>
      </div>
    </div>
  )
}

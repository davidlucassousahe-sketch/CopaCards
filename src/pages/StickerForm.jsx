import { Plus } from 'lucide-react'

export default function StickerForm() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Plus className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Criar Novo Sticker</h1>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">Formulário de criação de sticker em desenvolvimento</p>
        </div>
      </div>
    </div>
  )
}

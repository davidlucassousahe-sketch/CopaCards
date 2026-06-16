import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, PlusCircle, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StickerMiniCard from '@/components/StickerMiniCard'
import { toast } from 'sonner'

export default function Collection() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stickers, setStickers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (user) fetchStickers()
  }, [user])

  const fetchStickers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('stickers').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (!error) setStickers(data || [])
    setLoading(false)
  }

  const deleteSticker = async (sticker) => {
    if (!confirm(`Excluir figurinha de ${sticker.athlete_name}?`)) return
    await supabase.from('stickers').delete().eq('id', sticker.id)
    setStickers(stickers.filter(s => s.id !== sticker.id))
    toast.success('Figurinha excluída')
  }

  const filtered = filter === 'all' ? stickers : stickers.filter(s => s.status === filter)

  const stats = {
    total: stickers.length,
    tenho: stickers.filter(s => s.status === 'tenho').length,
    quero: stickers.filter(s => s.status === 'quero').length,
    repetida: stickers.filter(s => s.status === 'repetida').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minha Coleção</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas figurinhas com facilidade.
          </p>
        </div>
        <Link to="/sticker/new">
          <Button className="bg-gradient-to-r from-primary to-[#012169] hover:opacity-90">
            <PlusCircle className="h-4 w-4 mr-2" />
            Nova figurinha
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total</p>
            <p className="text-3xl font-bold mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Tenho</p>
            <p className="text-3xl font-bold mt-1 text-green-600 dark:text-green-400">{stats.tenho}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Quero</p>
            <p className="text-3xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">{stats.quero}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Repetidas</p>
            <p className="text-3xl font-bold mt-1 text-blue-600 dark:text-blue-400">{stats.repetida}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtro */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="tenho">Tenho</TabsTrigger>
          <TabsTrigger value="quero">Quero</TabsTrigger>
          <TabsTrigger value="repetida">Repetidas</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <Package className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="font-semibold">Coleção vazia</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Adicione sua primeira figurinha para começar.
              </p>
            </div>
            <Link to="/sticker/new">
              <Button className="bg-gradient-to-r from-primary to-[#012169] hover:opacity-90">
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar figurinha
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map(s => (
            <StickerMiniCard key={s.id} sticker={s}
              onEdit={() => navigate(`/sticker/${s.id}/edit`)}
              onDelete={deleteSticker} />
          ))}
        </div>
      )}
    </div>
  )
}
